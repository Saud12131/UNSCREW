"use client";

import React, { useEffect, useRef, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

type Message = {
  role: "assistant" | "user";
  text: string;
  audioUrl?: string;
};

export default function VoiceToText() {
  const [recognizer, setRecognizer] =
    useState<sdk.SpeechRecognizer | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ----------------------------
  // WebSocket Connection
  // ----------------------------
  useEffect(() => {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || "");

    socket.onopen = () => console.log("WebSocket connected");

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.question) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.question,
            audioUrl: data.audio_url,
          },
        ]);
      }
    };

    socket.onerror = (err) => console.error("WS Error:", err);
    socket.onclose = () => console.log("WebSocket closed");

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  // ----------------------------
  // Auto Play Assistant Audio
  // ----------------------------
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role === "assistant" && lastMessage.audioUrl) {
      const audio = new Audio(lastMessage.audioUrl);
      audio.play().catch((err) => console.log("Autoplay blocked:", err));
    }
  }, [messages]);

  // ----------------------------
  // Auto Scroll To Bottom
  // ----------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ----------------------------
  // Start Speech Recognition
  // ----------------------------
  const startRecognition = () => {
    if (!ws) return;

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_SPEECH_KEY || "",
      process.env.NEXT_PUBLIC_SPEECH_REGION || ""
    );

    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const sr = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    sr.recognized = (_, e) => {
      if (e.result.text) {
        const userText = e.result.text;

        // Add user message to chat
        setMessages((prev) => [
          ...prev,
          { role: "user", text: userText },
        ]);

        // Send to backend
        ws.send(JSON.stringify({ answer_text: userText }));
      }
    };

    sr.startContinuousRecognitionAsync();
    setRecognizer(sr);
  };

  // ----------------------------
  // Stop Recognition
  // ----------------------------
  const stopRecognition = () => {
    recognizer?.stopContinuousRecognitionAsync(() => {
      recognizer.close();
      setRecognizer(null);
    });
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>🎤 AI Voice Interview</h2>

      <div style={{ marginBottom: 20 }}>
        <button onClick={startRecognition} style={{ marginRight: 10 }}>
          Start Listening
        </button>

        <button onClick={stopRecognition}>
          Stop
        </button>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 20,
          height: 400,
          overflowY: "auto",
          borderRadius: 10,
          background: "#f9f9f9",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: 15,
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: 12,
                background:
                  msg.role === "user" ? "#007bff" : "#e5e5ea",
                color: msg.role === "user" ? "white" : "black",
                maxWidth: "80%",
              }}
            >
              {msg.text}
            </div>

            {msg.audioUrl && (
              <div style={{ marginTop: 5 }}>
                <audio src={msg.audioUrl} controls />
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
