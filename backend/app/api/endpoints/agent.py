from fastapi import APIRouter
from dotenv import load_dotenv
from app.services.agent_services import generate_question, tts
from fastapi import WebSocket

load_dotenv()
router = APIRouter()

@router.websocket("/respond")
async def agent_res(websocket:WebSocket):
    await websocket.accept()
    history = [{"role": "system", "content": "Generate a question for an backend devloper interview, keep it like an interaction act as a human you are getting the whole chats so respond according to that context. fastapi"}]
    first_question = generate_question(history)
    history.append({"role": "assistant", "content": first_question or "unable to extract the question."})
    question_audio = tts(first_question) if first_question is not None else None
    await websocket.send_json({
        "question": first_question,
        "audio": question_audio
    })
    while True:
        try:
            data = await websocket.receive_json()
            if "answer_text" not in data or not data["answer_text"].strip():
                continue
            user_answer = data["answer_text"]
            history.append({"role": "user", "content": user_answer})
            next_q = generate_question(history)
            history.append({"role": "assistant", "content": next_q or "unable to extract the question."})
            audio_url = tts(next_q) if next_q is not None else None
            await websocket.send_json({
                "question": next_q,
                "audio": audio_url  
            })
        except Exception as e:
            await websocket.close()
            break
