"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden relative">
      <div className="w-full absolute inset-0 h-screen pointer-events-none">
        <SparklesCore
          id="tsparticleshero"
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
        {/* Adjusted Radial Mask: This now covers the full center area and fades toward the edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="md:text-7xl text-5xl lg:text-[10rem] font-black text-white tracking-tighter italic relative z-20"
      >
        UN<span className="text-white">SCREW</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-6 text-lg md:text-xl text-neutral-400 text-center relative z-20 max-w-xl font-light"
      >
        The interview prep is broken. <br />
        <span className="text-white font-medium">We just unscrewed it.</span>
      </motion.p>

      {/* Get Started Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-20 mt-8"
      >
        <a
          href="/home"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-semibold text-base hover:bg-neutral-200 transition-all duration-300 group"
        >
          Get Started
          <svg 
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5-5m5 5H6" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}