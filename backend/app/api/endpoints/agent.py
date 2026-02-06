from fastapi import APIRouter, WebSocket
from dotenv import load_dotenv

from app.services.agent_services import generate_question, tts
from app.utils.prompt import prompt
from app.services.blob_storage import upload_audio_to_blob

load_dotenv()
router = APIRouter()


@router.websocket("/respond")
async def agent_res(websocket: WebSocket):
    await websocket.accept()

    history = [{"role": "system", "content": prompt}]

    # 🔹 FIRST QUESTION
    first_question = generate_question(history)
    history.append({
        "role": "assistant",
        "content": first_question or "unable to extract the question."
    })

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
            history.append({"role": "user", "content": user_answer})

            next_q = generate_question(history)
            history.append({
                "role": "assistant",
                "content": next_q or "unable to extract the question."
            })

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
