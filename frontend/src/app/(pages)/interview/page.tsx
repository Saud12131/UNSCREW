"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useAuth } from "@/Hooks/UseAuth";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function VoiceInterview() {
  const { user, loading } = useAuth();

  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-widest animate-pulse">Loading...</div>}>
      <InterviewContent user={user} loading={loading} />
    </Suspense>
  );
}

function InterviewContent({ user, loading }: { user: { name: string; email: string } | null; loading: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const domainParam = searchParams.get("domain") || "Software Engineer";
  const yoeParam = searchParams.get("yoe") || "0";

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

  // AI AUDIO PLAYBACK
  useEffect(() => {
    if (!currentQuestion) return;
    setIsAISpeaking(true);
    
    const audio = new Audio((window as unknown as { latestAudioUrl?: string }).latestAudioUrl || "");
    audioRef.current = audio;
    audio.play().catch(() => {});
    
    audio.onended = () => {
      setIsAISpeaking(false);
      startRecognition(); 
    };
    return () => audio.pause();
  }, [currentQuestion]);

  const startInterview = async () => {
    const token = localStorage.getItem("access_token");
    const combinedRole = `${domainParam} (${yoeParam} YOE)`;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/interview/start?role_applied=${encodeURIComponent(combinedRole)}`,
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

  const connectWebSocket = (session_id: string) => {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || "");
    socket.onopen = () => socket.send(JSON.stringify({ session_id }));
    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.question) {
        setIsProcessing(false);
        setCurrentQuestion(data.question);
        (window as unknown as { latestAudioUrl?: string }).latestAudioUrl = data.audio_url;
      }
    };
    socket.onclose = () => stopRecognition();
    setWs(socket);
  };

  const startRecognition = () => {
    if (!ws || isProcessing) return;
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_SPEECH_KEY || "",
      process.env.NEXT_PUBLIC_SPEECH_REGION || ""
    );
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    recognizerRef.current = recognizer;
    setIsListening(true);
    recognizer.recognized = (_, e) => { if (e.result.text) { transcriptRef.current = e.result.text; lastSpeechTimeRef.current = Date.now(); } };
    recognizer.startContinuousRecognitionAsync();
    silenceIntervalRef.current = setInterval(() => {
      if (transcriptRef.current && (Date.now() - lastSpeechTimeRef.current) > 3000) finalizeAnswer();
    }, 500);
  };

  const finalizeAnswer = () => {
    setIsProcessing(true);
    stopRecognition();
    ws?.send(JSON.stringify({ session_id: sessionId, answer_text: transcriptRef.current }));
    transcriptRef.current = "";
  };

  const stopRecognition = () => {
    recognizerRef.current?.stopContinuousRecognitionAsync(() => { recognizerRef.current?.close(); });
    if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
    setIsListening(false);
  };

  const endInterview = () => {
    ws?.close(); stopRecognition();
    setInterviewStarted(false); setCurrentQuestion("");
    router.push("/home");
   
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-widest animate-pulse">Initializing...</div>;

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-between p-8 overflow-hidden">
      
      {/* HUD Header */}
      <header className="w-full max-w-6xl flex justify-between items-end border-b border-white/5 pb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Candidate</p>
          <h2 className="text-sm font-bold uppercase italic tracking-tighter">{user?.name || "SAUDSAYYED"}</h2>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Protocol</p>
          <h2 className="text-sm font-bold uppercase italic tracking-tighter">{domainParam}</h2>
        </div>
      </header>

      {/* Main Agent UI */}
      <main className="relative flex-1 w-full flex flex-col items-center justify-center">
        {!interviewStarted ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-10">
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase">
              LET&apos;S START <br /> <span className="text-neutral-500 underline decoration-white/20">INTERVIEW</span>
            </h1>
            <button 
              onClick={startInterview} 
              className="px-12 py-5 bg-white text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-full hover:scale-105 transition-all shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)]"
            >
              Start Session
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-24">
            
            {/* The Audio-Active Neural Core */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
              {/* Outer Pulse Rings - Only visible when AI speaks */}
              <AnimatePresence>
                {isAISpeaking && (
                  <>
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border border-white/20"
                    />
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="absolute inset-0 rounded-full border border-white/10"
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Core Visualizer */}
              <motion.div 
                animate={isAISpeaking ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, 90, 180, 270, 360] 
                } : { scale: 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-2 flex items-center justify-center ${isAISpeaking ? 'border-white' : 'border-white/20'}`}
              >
                {/* Internal Voice Waves */}
                <div className="flex items-center gap-1">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={isAISpeaking ? { height: [10, 40, 10] } : { height: 4 }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-[3px] bg-white rounded-full opacity-80"
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Status Indicator */}
            <div className="h-6">
               {isAISpeaking && (
                 <p className="text-[10px] font-mono tracking-[0.5em] text-white uppercase animate-pulse">
                   AI Speaking...
                 </p>
               )}
               {isProcessing && (
                 <p className="text-[10px] font-mono tracking-[0.5em] text-yellow-500 uppercase animate-pulse">
                   Processing...
                 </p>
               )}
               {isListening && (
                 <p className="text-[10px] font-mono tracking-[0.5em] text-neutral-500 uppercase animate-pulse">
                   Listening...
                 </p>
               )}
            </div>
          </div>
        )}
      </main>

      {/* Simplified Controls */}
      <footer className="w-full max-w-xl py-12 flex justify-center items-center gap-12 border-t border-white/5">
        {interviewStarted && (
          <>
            <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${isListening ? 'border-white' : 'border-white/10 opacity-30'}`}>
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-white animate-pulse' : 'bg-neutral-600'}`} />
            </div>
            
            <button 
              onClick={endInterview}
              className="group w-14 h-14 rounded-full border border-red-500/30 flex items-center justify-center hover:bg-red-600 transition-all"
            >
              <div className="w-3 h-3 bg-red-500 group-hover:bg-white rotate-45" />
            </button>
          </>
        )}
      </footer>
    </div>
  );
}