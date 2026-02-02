"use client";
import React, { useEffect, useRef, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export default function VoiceToText() {
  const [recognizer, setrecognizer] = useState<sdk.SpeechRecognizer | null>(null);
  const [ws, setws] = useState<WebSocket | null>(null);
  const [assistantResponse, setAssistantResponse] = useState("")
  const [userresponse, setuserresponse] = useState("")

  useEffect(()=>{
    const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || '');
    socket.onopen= ()=>{
      console.log("WebSocket connected");
    }
    setws(socket);
    socket.onmessage = (msg) =>{
      setAssistantResponse(msg.data);
      console.log("WebSocket message received:", msg.data);
    }
    socket.onerror = (err) => console.error(err);
    socket.onclose = () => console.log("WS closed");

    return () => socket.close();
  },[])

  const startRecognition = async () => {
    const speechconfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_SPEECH_KEY || '',
      process.env.NEXT_PUBLIC_SPEECH_REGION || '',
    );
    speechconfig.speechRecognitionLanguage = "en-US";

    const audioconfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const sr = new sdk.SpeechRecognizer(speechconfig, audioconfig);
    setrecognizer(sr);
    // sr.recognizing = (s, e) => {
    //   console.log("Partial:", e.result.text);
    // }
    sr.recognized = (s, e) => {
      console.log("complete:", e.result.text);
      setuserresponse(e.result.text);
      ws?.send(
        JSON.stringify({
          answer_text: e.result.text
        })
      );
    }
sr.startContinuousRecognitionAsync();
    sr.canceled = (s, event) => {
      console.error("Canceled:", event);
    };
    sr.sessionStopped = (s, event) => {
      console.log("Session stopped:", event);
    };
    sr.startContinuousRecognitionAsync();
  }

  const stopRecognition = () => {
    if (!recognizer) return;
    recognizer.stopContinuousRecognitionAsync(() => {
      console.log("Recognition stopped");
    });
  };

  return (
    <div>
      <button onClick={startRecognition}>Start Listening</button>
      <br />
      <button onClick={stopRecognition}>Stop</button>
      <h3>assistant - {assistantResponse}</h3>
      <h3>user - {userresponse}</h3>
    </div>
  );
}
