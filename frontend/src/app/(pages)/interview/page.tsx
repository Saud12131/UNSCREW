"use client";

import React, { useEffect, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useAuth } from "@/Hooks/UseAuth";

export default function VoiceInterview() {
  const { user, loading } = useAuth();

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [recognizer, setRecognizer] =
    useState<sdk.SpeechRecognizer | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  // ----------------------------------------
  // Auto Play AI Voice
  // ----------------------------------------
  useEffect(() => {
    if (!currentQuestion) return;

    setIsAISpeaking(true);

    const audio = new Audio(
      (window as any).latestAudioUrl || ""
    );

    audio.play().catch(() => {});

    audio.onended = () => {
      setIsAISpeaking(false);
      startRecognition(); // Auto start listening after AI finishes
    };
  }, [currentQuestion]);

  // ----------------------------------------
  // Start Interview (Create Session)
  // ----------------------------------------
  const startInterview = async () => {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/interview/start?role_applied=FullStack`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    setSessionId(data.session_id);
    setInterviewStarted(true);
    connectWebSocket(data.session_id);
  };

  // ----------------------------------------
  // WebSocket
  // ----------------------------------------
  const connectWebSocket = (session_id: string) => {
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || ""
    );

    socket.onopen = () => {
      socket.send(JSON.stringify({ session_id }));
    };

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.question) {
        setCurrentQuestion(data.question);
        (window as any).latestAudioUrl = data.audio_url;
      }
    };

    setWs(socket);
  };

  // ----------------------------------------
  // Speech Recognition
  // ----------------------------------------
  const startRecognition = () => {
    if (!ws) return;

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_SPEECH_KEY || "",
      process.env.NEXT_PUBLIC_SPEECH_REGION || ""
    );

    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig =
      sdk.AudioConfig.fromDefaultMicrophoneInput();

    const sr = new sdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    setIsListening(true);

    sr.recognized = (_, e) => {
      if (e.result.text) {
        stopRecognition();

        ws.send(
          JSON.stringify({
            session_id: sessionId,
            answer_text: e.result.text,
          })
        );
      }
    };

    sr.startContinuousRecognitionAsync();
    setRecognizer(sr);
  };

  const stopRecognition = () => {
    recognizer?.stopContinuousRecognitionAsync(() => {
      recognizer.close();
      setRecognizer(null);
      setIsListening(false);
    });
  };

  const endInterview = () => {
    ws?.close();
    stopRecognition();
    setInterviewStarted(false);
    setCurrentQuestion("");
  };

  // ----------------------------------------
  // Guard
  // ----------------------------------------
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login first</div>;

  // ----------------------------------------
  // UI
  // ----------------------------------------
  return (
    <div className="h-screen flex flex-col items-center justify-between bg-gradient-to-b from-black via-slate-900 to-blue-900 text-white">

      {/* Header */}
      <div className="mt-10 text-xl font-semibold">
        AI Interview
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center text-center px-6">
        {!interviewStarted ? (
          <button
            onClick={startInterview}
            className="bg-white text-black px-6 py-3 rounded-full font-medium"
          >
            Start Interview
          </button>
        ) : (
          <>
            <div className="text-lg max-w-xl">
              {currentQuestion || "Preparing first question..."}
            </div>

            <div className="mt-6 text-sm opacity-70">
              {isAISpeaking && "AI is speaking..."}
              {isListening && "Listening..."}
            </div>
          </>
        )}
      </div>

      {/* Bottom Controls */}
      {interviewStarted && (
        <div className="mb-12 flex gap-6">
          <button
            onClick={isListening ? stopRecognition : startRecognition}
            className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-xl"
          >
            ⏸
          </button>

          <button
            onClick={endInterview}
            className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-xl"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}