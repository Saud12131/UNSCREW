"use client";
import { motion } from "framer-motion";

export default function HowItWorksSection() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      
      {/* LEFT: The "Voice Session" Visual Mockup */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative aspect-video rounded-2xl border border-white/10 bg-neutral-950 p-4 shadow-[0_0_50px_-12px_rgba(255,255,255,0.15)] overflow-hidden"
      >
        {/* Top Header: Session Interface */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <span className="text-[10px] font-mono text-neutral-500 tracking-[0.2em] uppercase">Session_Active // ID_77X</span>
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="w-1 h-1 rounded-full bg-white/40" />
          </div>
        </div>

        {/* The Audio Visualization Area */}
        <div className="relative h-40 w-full bg-black/50 rounded-lg border border-white/5 flex flex-col items-center justify-center">
          {/* Animated Voice Waves */}
          <div className="flex items-center gap-1 h-16">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: [4, Math.random() * 32 + 8, 4],
                  opacity: [0.2, 0.5, 0.2] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5, 
                  delay: i * 0.1 
                }}
                className="w-[4px] bg-white rounded-full"
              />
            ))}
          </div>
          <span className="mt-4 text-[9px] font-mono text-neutral-500 tracking-[0.3em] uppercase italic">
            Processing Speech Input...
          </span>
        </div>

        {/* Real-time Intel Tags */}
        <div className="mt-6 flex gap-3 overflow-hidden">
          <div className="px-3 py-2 border border-white/5 bg-white/[0.02] rounded flex-1">
            <span className="block text-[8px] text-neutral-600 uppercase font-mono mb-1">Current Focus</span>
            <p className="text-[10px] text-neutral-400 font-mono truncate">Technical Proficiency // Web Architecture</p>
          </div>
          <div className="px-3 py-2 border border-white/5 bg-white/[0.02] rounded flex-1">
            <span className="block text-[8px] text-neutral-600 uppercase font-mono mb-1">AI Persona</span>
            <p className="text-[10px] text-neutral-400 font-mono">Senior Technical Lead</p>
          </div>
        </div>
      </motion.div>

      {/* RIGHT: The Explanation */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="space-y-10"
      >
        <div className="space-y-4">
          <h2 className="text-5xl md:text-7xl font-black italic text-white tracking-tighter">
            LIVE <span className="text-neutral-500 italic">SESSIONS.</span>
          </h2>
          <p className="text-neutral-400 text-lg font-light leading-relaxed max-w-md">
            UnScrew isn’t a list of questions. It’s an AI agent that listens, thinks, and speaks.
          </p>
        </div>
        
        <div className="space-y-8">
          <Step 
            num="01" 
            title="Voice Interaction" 
            text="Practice your verbal delivery. Move beyond text and simulate the pressure of a real 1-on-1 interview."
          />
          <Step 
            num="02" 
            title="Dynamic Logic" 
            text="Our LLM analyzes your answers in real-time to generate unique follow-up questions tailored to your logic." 
          />
          <Step 
            num="03" 
            title="Post-Interview Review" 
            text="Get a detailed breakdown of your technical accuracy, communication style, and areas for improvement." 
          />
        </div>
      </motion.div>

    </section>
  );
}

function Step({ num, title, text }: { num: string; title: string; text: string }) {
  return (
    <div className="group border-l border-white/10 pl-6 hover:border-white transition-colors duration-500">
      <span className="text-white/20 font-mono text-xs group-hover:text-white transition-colors">{num} {"/"}/</span>
      <h4 className="text-white font-bold uppercase text-md tracking-widest mt-1 italic">{title}</h4>
      <p className="text-neutral-500 text-sm mt-2 leading-relaxed">{text}</p>
    </div>
  );
}