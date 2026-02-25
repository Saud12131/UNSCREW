from email import message
from fastapi import APIRouter, WebSocket
from dotenv import load_dotenv
from app.services.agent_services import generate_question, tts
from app.utils.prompt import prompt
from app.services.blob_storage import upload_audio_to_blob
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models.MessageModel import Message
load_dotenv()
router = APIRouter()


@router.websocket("/respond")
async def agent_res(websocket: WebSocket):
    await websocket.accept()
    async with AsyncSessionLocal() as db:
        
        init_data = await websocket.receive_json()
        session_id = init_data["session_id"]
        if not session_id:
            await websocket.close()
            return
        
    history = [{"role": "system", "content": prompt}]

    # 🔹 FIRST QUESTION
    first_question = generate_question(history)
    history.append({
        "role": "assistant",
        "content": first_question or "unable to extract the question."
    })

    # Save FIRST QUESTION
    ai_message = Message(
        session_id=session_id,
        sender="assistant",
        content=first_question
    )
    db.add(ai_message)
    await db.commit()
    audio_url = None
    if first_question:
        audio = tts(first_question)         # bytes
        audio_url = upload_audio_to_blob(audio)  # blob URL

    await websocket.send_json({
        "question": first_question,
        "audio_url": audio_url
    })

    # 🔁 INTERVIEW LOOP
    while True:
        try:
            data = await websocket.receive_json()

            if "answer_text" not in data or not data["answer_text"].strip():
                continue

            user_answer = data["answer_text"]
            # ✅ SAVE USER MESSAGE
            user_message = Message(
                session_id=session_id,
                sender="user",
                content=user_answer
            )
            db.add(user_message)
            await db.commit()
            history.append({"role": "user", "content": user_answer})
            
            next_q = generate_question(history)
            history.append({
                "role": "assistant",
                "content": next_q or "unable to extract the question."
            })
            ai_message = Message(
                session_id=session_id,
                sender="assistant",
                content=next_q
            )
            db.add(ai_message)
            await db.commit()

            audio_url = None
            if next_q:
                audio_bytes = tts(next_q)
                audio_url = upload_audio_to_blob(audio_bytes)

            await websocket.send_json({
                "question": next_q,
                "audio_url": audio_url
            })

        except Exception as e:
            print("WebSocket closed:", e)
            await websocket.close()
            break
