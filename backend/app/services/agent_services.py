import os
from openai import AzureOpenAI
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk
import uuid
load_dotenv()

# Azure OpenAI config
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT") 
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")

speech_key = os.getenv("SPEECH_KEY")
speech_region = os.getenv("SPEECH_REGION")


client = AzureOpenAI(
    api_version=AZURE_OPENAI_API_VERSION,
    azure_endpoint=AZURE_OPENAI_ENDPOINT or "no endpoint dwag",
    api_key=AZURE_OPENAI_API_KEY,
)

def generate_question(history):
    ques = client.chat.completions.create(
        messages=history,
        max_tokens=100,
        model=AZURE_OPENAI_DEPLOYMENT or 'gpt-35-turbo'
    )
    return ques.choices[0].message.content

def tts(text:str):
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region='centralindia')
    filename = f"output_{uuid.uuid4().hex}.wav"
    audio_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), "audio")
    os.makedirs(audio_folder, exist_ok=True)
    filepath = os.path.join(audio_folder, filename)
    audio_config = speechsdk.audio.AudioOutputConfig(filename=filepath)
    synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
    result = synthesizer.speak_text_async(text).get()
    if result is not None and result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        print(f"Speech synthesized to {filepath}")
        return result.audio_data
    else:
        print(f"Speech synthesis failed: {getattr(result, 'reason', 'No result returned')}")
        return None

