"use client"
import React, { useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export default function VoiceToText() {
  const [recognizedText, setRecognizedText] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  let recognizer: sdk.SpeechRecognizer | undefined;

  interface VoiceToTextState {
    recognizedText: string;
    isListening: boolean;
  }

  const startRecognition = () => {
    console.log('Speech Key:', process.env.NEXT_PUBLIC_SPEECH_KEY);
    console.log('Speech Region:', process.env.NEXT_PUBLIC_SPEECH_REGION);
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_SPEECH_KEY || '',
      process.env.NEXT_PUBLIC_SPEECH_REGION || '');
    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    setIsListening(true);

    recognizer.recognizing = (s, e) => {
      console.log(`Intermediate: ${e.result.text}`);
    };

    recognizer.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        console.log(`Final: ${e.result.text}`);
        setRecognizedText(e.result.text);

        // TODO: Send this text to WebSocket backend
        // ws.send(JSON.stringify({ type: "answer", text: e.result.text }));
      }
    };

    recognizer.startContinuousRecognitionAsync();
  };

  const stopRecognition = () => {
    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync();
    }
    setIsListening(false);
  };

  return (
    <div>
      <button onClick={isListening ? stopRecognition : startRecognition}>
        {isListening ? "Stop" : "Start"} Listening
      </button>
      <p>Recognized Text: {recognizedText}</p>
    </div>
  );
}
