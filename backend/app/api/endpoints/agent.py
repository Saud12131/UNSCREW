from fastapi import APIRouter, Response
from pydantic import BaseModel
import os
from openai import AzureOpenAI
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk
from uuid import uuid4
from fastapi.responses import FileResponse

load_dotenv()
router = APIRouter()

# Azure OpenAI config
AZURE_OPENAI_ENDPOINT = "https://sauds-mdyyjow3-eastus2.cognitiveservices.azure.com/"
AZURE_OPENAI_DEPLOYMENT = "gpt-35-turbo"
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_API_VERSION = "2024-12-01-preview"

client = AzureOpenAI(
    api_version=AZURE_OPENAI_API_VERSION,
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_key=AZURE_OPENAI_API_KEY,
)

# Azure Speech config
AZURE_SPEECH_KEY = os.getenv("SPEECH_KEY")
AZURE_SPEECH_REGION = "centralindia"

# Where to store audio
AUDIO_FOLDER = "audio_outputs"
os.makedirs(AUDIO_FOLDER, exist_ok=True)

class agentRequest(BaseModel):
    question: str

@router.post("/")
async def agent_test(request: agentRequest):
    user_question = request.question

    # Step 1: Get LLM answer
    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_question}
        ],
        model=AZURE_OPENAI_DEPLOYMENT,
        max_tokens=1000,
        temperature=0.7
    )

    assistant_answer = response.choices[0].message.content or "Sorry, I couldn't understand that."

    # Step 2: Synthesize voice and save to file
    speech_config = speechsdk.SpeechConfig(
        subscription=AZURE_SPEECH_KEY,
        region=AZURE_SPEECH_REGION
    )
    speech_config.speech_synthesis_voice_name = "en-US-AriaNeural"

    # 🔥 Save to local file
    audio_filename = f"{uuid4().hex}.wav"
    audio_path = os.path.join(AUDIO_FOLDER, audio_filename)

    audio_config = speechsdk.audio.AudioOutputConfig(filename=audio_path)

    synthesizer = speechsdk.SpeechSynthesizer(
        speech_config=speech_config,
        audio_config=audio_config
    )

    result = synthesizer.speak_text_async(assistant_answer).get()

    if result is None or result.reason != speechsdk.ResultReason.SynthesizingAudioCompleted:
        return Response(content="Audio synthesis failed", status_code=500)

    # ✅ Return message and downloadable audio link
    return {
        "message": assistant_answer,
        "audio_url": f"/audio/{audio_filename}"
    }, 200


# Route to serve audio files
@router.get("/audio/{filename}")
async def get_audio_file(filename: str):
    file_path = os.path.join(AUDIO_FOLDER, filename)
    if not os.path.exists(file_path):
        return Response(content="File not found", status_code=404)
    return FileResponse(file_path, media_type="audio/wav", status_code=200)
