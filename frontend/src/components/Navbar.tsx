"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Verify token by fetching user data
      fetch(`http://localhost:8000/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem("access_token");
          setUser(null);
        });
    }
  }, []);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-fit px-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="
          flex items-center gap-10
          px-6 py-2.5
          rounded-full
          bg-black/40
          backdrop-blur-md
          border border-white/10
          shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]
        "
      >
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-sm font-black tracking-tighter italic uppercase text-white">
            UN<span className="opacity-50">SCREW</span>
          </span>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-white/10 hidden md:block" />

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/home">Interview</NavLink>
        </nav>

        {/* Action Button */}
        {user ? (
          <a
            href="/home"
            className="
              relative group
              px-5 py-1.5
              rounded-full
              bg-white
              text-black text-[11px] font-bold uppercase tracking-widest
              hover:scale-105 active:scale-95
              transition-all duration-300
            "
          >
            <span className="relative z-10">Dashboard</span>
            {/* Subtle Glow behind button on hover */}
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-40 blur-md transition-opacity" />
          </a>
        ) : (
          <a
            href="/user/login"
            className="
              relative group
              px-5 py-1.5
              rounded-full
              bg-white
              text-black text-[11px] font-bold uppercase tracking-widest
              hover:scale-105 active:scale-95
              transition-all duration-300
            "
          >
            <span className="relative z-10">Login</span>
            {/* Subtle Glow behind button on hover */}
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-40 blur-md transition-opacity" />
          </a>
        )}
      </motion.div>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors duration-300 font-medium"
    >
      {children}
    </a>
  );
}