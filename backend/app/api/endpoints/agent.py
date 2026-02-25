from fastapi import APIRouter, WebSocket
from sqlalchemy import select
from dotenv import load_dotenv
from app.services.agent_services import generate_question, tts
from app.services.blob_storage import upload_audio_to_blob
from app.database import AsyncSessionLocal
from app.models.MessageModel import Message
from app.models.InterviewSession import InterviewSession
from app.utils.prompt import build_prompt

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

        # 🔥 FETCH SESSION
        result = await db.execute(
            select(InterviewSession).where(
                InterviewSession.id == session_id
            )
        )
        session = result.scalar_one_or_none()

        if not session:
            await websocket.close()
            return

        role_applied = session.role_applied

        # 🔥 BUILD DYNAMIC PROMPT
        system_prompt = build_prompt(role_applied)

        history = [{"role": "system", "content": system_prompt}]

        # 🔹 FIRST QUESTION
        first_question = generate_question(history)

        history.append({
            "role": "assistant",
            "content": first_question
        })

        # SAVE FIRST QUESTION
        ai_message = Message(
            session_id=session_id,
            sender="assistant",
            content=first_question
        )
        db.add(ai_message)
        await db.commit()

        audio_url = None
        if first_question:
            audio = tts(first_question)
            audio_url = upload_audio_to_blob(audio)

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

                # SAVE USER MESSAGE
                user_message = Message(
                    session_id=session_id,
                    sender="user",
                    content=user_answer
                )
                db.add(user_message)
                await db.commit()

                history.append({
                    "role": "user",
                    "content": user_answer
                })

                next_q = generate_question(history)

                history.append({
                    "role": "assistant",
                    "content": next_q
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