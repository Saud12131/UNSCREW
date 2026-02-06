"use client";
import React, { useEffect, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export default function VoiceToText() {
  const [recognizer, setRecognizer] = useState<sdk.SpeechRecognizer | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const [assistantResponse, setAssistantResponse] = useState("");
  const [assistantAudioUrl, setAssistantAudioUrl] = useState("");
  const [userResponse, setUserResponse] = useState("");

  useEffect(() => {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || "");

    socket.onopen = () => console.log("WebSocket connected");

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      setAssistantResponse(data.question || "");
      setAssistantAudioUrl(data.audio_url || "");
    };

    socket.onerror = console.error;
    socket.onclose = () => console.log("WS closed");

    setWs(socket);
    return () => socket.close();
  }, []);

  // 🔊 Auto-play assistant voice
  useEffect(() => {
    if (assistantAudioUrl) {
      const audio = new Audio(assistantAudioUrl);
      audio.play();
    }
  }, [assistantAudioUrl]);

  const startRecognition = () => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_SPEECH_KEY || "",
      process.env.NEXT_PUBLIC_SPEECH_REGION || ""
    );
    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const sr = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    setRecognizer(sr);

    sr.recognized = (_, e) => {
      if (e.result.text) {
        setUserResponse(e.result.text);
        ws?.send(JSON.stringify({ answer_text: e.result.text }));
      }
    };

    sr.startContinuousRecognitionAsync();
  };

  const stopRecognition = () => {
    recognizer?.stopContinuousRecognitionAsync();
  };

  return (
    <div>
      <button onClick={startRecognition}>Start Listening</button> <br />
      
      <button onClick={stopRecognition}>Stop</button>

      <h3>assistant: {assistantResponse}</h3>

      {/* optional controls for debugging */}
      {assistantAudioUrl && (
        <audio src={assistantAudioUrl} controls />
      )}

      <h3>user: {userResponse}</h3>
    </div>
  );
}
