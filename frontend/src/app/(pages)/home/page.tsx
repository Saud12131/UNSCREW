"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [domain, setDomain] = useState("");
  const [yoe, setYoe] = useState("");
  const [showBriefing, setShowBriefing] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    if (domain && yoe) {
      // Show the rules before redirecting
      setShowBriefing(true);
    }
  };

  const confirmAndRedirect = () => {
    // Final redirect with the preserved values
    router.push(`/interview?domain=${encodeURIComponent(domain)}&yoe=${yoe}`);
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden px-4">
      
      {/* Main Configuration Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase">
            Start <span className="text-neutral-500 underline decoration-white/20">Training</span>
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 mt-4">
            Configure your AI Interviewer // Session v1.0
          </p>
        </div>

        <div className="space-y-8">
          {/* Domain Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono uppercase text-neutral-400 ml-1 tracking-widest">
              Select_Domain
            </label>
            <select 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full bg-black/50 text-white px-5 py-4 border border-white/10 rounded-2xl focus:outline-none focus:border-white transition-all font-mono text-sm appearance-none cursor-pointer"
            >
              <option value="" disabled className="text-neutral-500">Choose your stack...</option>
              <option value="Frontend Developer" className="text-white bg-black">Frontend Developer (React/Next.js)</option>
              <option value="Backend Developer" className="text-white bg-black">Backend Developer (FastAPI/Node.js)</option>
              <option value="Fullstack Developer" className="text-white bg-black">Fullstack Developer</option>
              <option value="Data Scientist" className="text-white bg-black">Data Scientist</option>
              <option value="DevOps Engineer" className="text-white bg-black">DevOps Engineer</option>
            </select>
          </div>

          {/* Years of Experience */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono uppercase text-neutral-400 ml-1 tracking-widest">
              Experience_Level (Years)
            </label>
            <input 
              type="number"
              min="0"
              max="20"
              placeholder="e.g. 0 for Freshers"
              value={yoe}
              onChange={(e) => setYoe(e.target.value)}
              className="w-full bg-black/50 text-white px-5 py-4 border border-white/10 rounded-2xl focus:outline-none focus:border-white transition-all font-mono text-sm"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            disabled={!domain || !yoe}
            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]"
          >
            Initialize Mock Interview
          </motion.button>
        </div>

        <p className="text-center mt-8 text-[9px] font-mono text-neutral-600 uppercase tracking-widest leading-loose">
          Warning: AI Persona will be generated based on these parameters. <br />
          Prepare for technical scrutiny.
        </p>
      </motion.div>

      {/* POPUP: MISSION BRIEFING */}
      <AnimatePresence>
        {showBriefing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowBriefing(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-neutral-900 border border-white/10 p-8 rounded-3xl shadow-2xl"
            >
              <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-6">
                Rules of <span className="text-neutral-500">Engagement</span>
              </h3>

              <div className="space-y-6 font-mono text-[11px] leading-loose tracking-widest text-neutral-400">
                <p className="flex gap-4">
                  <span className="text-white">01//</span> 
                  REMAIN SILENT WHILE THE AGENT IS SPEAKING TO PREVENT VOICE OVERLAP.
                </p>
                <p className="flex gap-4">
                  <span className="text-white">02//</span> 
                  TO FINALIZE THE SESSION, VERBALLY INSTRUCT THE AGENT TO "END THE INTERVIEW".
                </p>
                <p className="flex gap-4 border-t border-white/5 pt-4">
                  <span className="text-red-500">03//</span> 
                  THE RED ICON IN THE CONTROL BAR WILL FORCE-CLOSE THE NEURAL LINK IMMEDIATELY.
                </p>
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  onClick={confirmAndRedirect}
                  className="flex-1 bg-white text-black py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:invert transition-all"
                >
                  Confirm & Initialize
                </button>
                <button 
                  onClick={() => setShowBriefing(false)}
                  className="px-8 py-4 border border-white/10 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all text-neutral-500"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}