"use client";

import React, { useEffect, useRef, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useAuth } from "@/Hooks/UseAuth";

export default function VoiceInterview() {
  const { user, loading } = useAuth();

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);
  const transcriptRef = useRef<string>("");
  const lastSpeechTimeRef = useRef<number>(0);
  const silenceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ------------------------------------------------
  // AI AUDIO PLAYBACK (No overlap guaranteed)
  // ------------------------------------------------
  useEffect(() => {
    if (!currentQuestion) return;

    setIsAISpeaking(true);

    // Stop any previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio((window as any).latestAudioUrl || "");
    audioRef.current = audio;

    audio.play().catch(() => {});

    audio.onended = () => {
      setIsAISpeaking(false);
      startRecognition(); // Start listening AFTER AI finishes
    };

    return () => {
      audio.pause();
    };
  }, [currentQuestion]);

  // ------------------------------------------------
  // START INTERVIEW
  // ------------------------------------------------
  const startInterview = async () => {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/interview/start?role_applied=FullStack`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    setSessionId(data.session_id);
    setInterviewStarted(true);
    connectWebSocket(data.session_id);
  };

  // ------------------------------------------------
  // WEBSOCKET
  // ------------------------------------------------
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
        setIsProcessing(false); // Unlock turn
        setCurrentQuestion(data.question);
        (window as any).latestAudioUrl = data.audio_url;
      }
    };

    socket.onclose = () => {
      stopRecognition();
    };

    setWs(socket);
  };

  // ------------------------------------------------
  // START RECOGNITION (True silence detection)
  // ------------------------------------------------
  const startRecognition = () => {
    if (!ws || isProcessing) return;

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_SPEECH_KEY || "",
      process.env.NEXT_PUBLIC_SPEECH_REGION || ""
    );

    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig =
      sdk.AudioConfig.fromDefaultMicrophoneInput();

    const recognizer = new sdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    recognizerRef.current = recognizer;
    transcriptRef.current = "";
    lastSpeechTimeRef.current = Date.now();

    setIsListening(true);

    recognizer.recognizing = (_, e) => {
      if (e.result.text) {
        transcriptRef.current = e.result.text;
        lastSpeechTimeRef.current = Date.now();
      }
    };

    recognizer.recognized = (_, e) => {
      if (e.result.text) {
        transcriptRef.current = e.result.text;
        lastSpeechTimeRef.current = Date.now();
      }
    };

    recognizer.startContinuousRecognitionAsync();

    // 🔥 Real Silence Watcher (3 seconds)
    silenceIntervalRef.current = setInterval(() => {
      const silenceDuration =
        Date.now() - lastSpeechTimeRef.current;

      if (
        transcriptRef.current &&
        silenceDuration > 3000 &&
        !isProcessing
      ) {
        finalizeAnswer();
      }
    }, 500);
  };

  // ------------------------------------------------
  // FINALIZE ANSWER
  // ------------------------------------------------
  const finalizeAnswer = () => {
    if (!transcriptRef.current || isProcessing) return;

    setIsProcessing(true);
    stopRecognition();

    ws?.send(
      JSON.stringify({
        session_id: sessionId,
        answer_text: transcriptRef.current,
      })
    );

    transcriptRef.current = "";
  };

  // ------------------------------------------------
  // STOP RECOGNITION
  // ------------------------------------------------
  const stopRecognition = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(() => {
        recognizerRef.current?.close();
        recognizerRef.current = null;
      });
    }

    if (silenceIntervalRef.current) {
      clearInterval(silenceIntervalRef.current);
      silenceIntervalRef.current = null;
    }

    setIsListening(false);
  };

  // ------------------------------------------------
  // END INTERVIEW
  // ------------------------------------------------
  const endInterview = () => {
    ws?.close();
    stopRecognition();

    if (audioRef.current) {
      audioRef.current.pause();
    }

    setInterviewStarted(false);
    setCurrentQuestion("");
    setIsProcessing(false);
  };

  // ------------------------------------------------
  // AUTH GUARD
  // ------------------------------------------------
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login first</div>;

  // ------------------------------------------------
  // UI
  // ------------------------------------------------
  return (
    <div className="h-screen flex flex-col items-center justify-between bg-gradient-to-b from-black via-slate-900 to-blue-900 text-white">

      <div className="mt-10 text-xl font-semibold">
        AI Interview
      </div>

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
              {isProcessing && "Processing..."}
            </div>
          </>
        )}
      </div>

      {interviewStarted && (
        <div className="mb-12 flex gap-6">
          <button
            onClick={isListening ? stopRecognition : startRecognition}
            className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-xl"
          >
            🎤
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