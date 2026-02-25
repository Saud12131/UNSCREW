"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { motion } from "framer-motion";

export default function UnScrewLanding() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center selection:bg-white selection:text-black overflow-hidden">
      {/* Background Sparkles - Fixed to cover the top half */}
      <div className="w-full absolute inset-0 h-screen pointer-events-none">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={40}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center pt-32 px-4"
      >
        {/* Sub-heading Badge */}
        <motion.div 
          variants={itemVariants}
          className="px-3 py-1 border border-white/20 rounded-full text-xs uppercase tracking-widest text-neutral-400 mb-8"
        >
          AI-Powered Precision
        </motion.div>

        {/* Main Title Section */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic">
            UN<span className="text-white">SCREW</span>
          </h1>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mt-2" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="mt-8 text-xl md:text-2xl font-light text-neutral-400 max-w-2xl text-center leading-relaxed"
        >
          The interview process is broken. 
          <span className="text-white font-medium"> We just unscrewed it.</span>
        </motion.p>

        {/* Minimal Feature Grid - No Boxes, just clean typography */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32 max-w-5xl w-full border-t border-white/10 pt-16"
        >
          <div className="flex flex-col gap-2">
            <span className="text-white font-bold text-lg">01. Real-time Feedback</span>
            <p className="text-neutral-500 text-sm">Instant analysis of your responses, tone, and technical accuracy.</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white font-bold text-lg">02. Persona Engine</span>
            <p className="text-neutral-500 text-sm">Practice against aggressive, friendly, or technical interviewers.</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white font-bold text-lg">03. Adaptive Difficulty</span>
            <p className="text-neutral-500 text-sm">The AI evolves based on your performance in real-time.</p>
          </div>
        </motion.div>

        {/* Decorative Radial Fade (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent z-20" />
      </motion.main>

      {/* NEW SECTION: AI Interview Overview */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-10 w-full max-w-6xl mx-auto px-4 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border-t border-white/10"
      >
        {/* Left Column: Image */}
        <motion.div variants={itemVariants} className="relative aspect-video w-full h-auto rounded-lg overflow-hidden border border-white/20 shadow-2xl bg-gradient-to-br from-neutral-900 to-black p-1">
          <div className="w-full h-full flex items-center justify-center bg-neutral-950 rounded-md">
            {/* Replace with your image component, or a simple img tag */}
            {/* For now, a placeholder that suggests an AI interview */}
            <div className="text-center text-neutral-600 font-mono text-sm">
              <p>AI Interview Session in Progress...</p>
              <p className="mt-2 text-white/50">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1"></span>
                LIVE
              </p>
            </div>
            {/* This is where your image will go */}
            {/* Example: <img src="/path/to/ai-interview.jpg" alt="AI Interview" className="w-full h-full object-cover" /> */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none rounded-lg" />
          </div>
        </motion.div>

        {/* Right Column: Explanation */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter italic">
            How It <span className="text-white">Works</span>
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            UnScrew simulates real-world interview scenarios using advanced AI. Our platform provides a dynamic and interactive experience, adapting to your responses and challenging you just like a human interviewer would.
          </p>
          <ul className="list-disc list-inside text-neutral-400 space-y-3 pl-4">
            <li>
              <span className="text-white font-semibold">Adaptive Questioning:</span> Questions are tailored based on your answers, pushing you to think critically.
            </li>
            <li>
              <span className="text-white font-semibold">Contextual Understanding:</span> The AI comprehends nuances in your speech and provides relevant follow-ups.
            </li>
            <li>
              <span className="text-white font-semibold">Performance Metrics:</span> Detailed reports on your communication, technical depth, and problem-solving approach.
            </li>
            <li>
              <span className="text-white font-semibold">Customizable Roles:</span> Choose from various interviewer personalities and company types to prepare for anything.
            </li>
          </ul>
          <p className="text-neutral-500 text-sm mt-4 italic">
            "Stop practicing with mirrors. Start with a mind that adapts."
          </p>
        </motion.div>
      </motion.section>


      {/* Footer Branding (Static) */}
      <footer className="mt-auto py-10 opacity-20 hover:opacity-100 transition-opacity duration-500">
        <p className="text-[10px] tracking-[0.5em] uppercase">Built for the next generation of talent</p>
      </footer>
    </div>
  );
}