"use client";
import { useEffect } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorks";

export default function LandingPage() {
  useEffect(() => {
    // Wake up the backend server
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/`, {
      method: 'GET',
      mode: 'no-cors' // Avoid CORS issues for the wake-up call
    }).catch(() => {
      // Silently ignore errors - this is just for waking up the backend
    });
  }, []);

  return (
    <div className="bg-black min-h-screen selection:bg-white selection:text-black">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      
            {/* Optional Minimal Footer */}
      <footer className="py-20 border-t border-white/5 flex justify-center opacity-20">
        <p className="text-[10px] tracking-[0.5em] uppercase text-white font-mono">
          System.Unscrew // 2026
        </p>
      </footer>
    </div>
  );
}