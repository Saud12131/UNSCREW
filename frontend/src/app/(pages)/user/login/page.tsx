"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SparklesCore } from "@/components/ui/sparkles";
import { motion } from "framer-motion";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden px-4 selection:bg-white selection:text-black">
      {/* Visual Identity: Sparkles */}
      <div className="w-full absolute inset-0 h-full pointer-events-none">
        <SparklesCore
          id="login-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={500}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">
              RE-ENTER <span className="opacity-50 underline decoration-white/20 italic">SESSION</span>
            </h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 mt-2">
              Authentication Required // UnScrew v1.0
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-mono uppercase text-center rounded">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-neutral-500 ml-1">Email_Address</label>
              <input
                type="email"
                placeholder="identity@student.edu"
                className="w-full bg-black/50 text-white px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:border-white transition-all font-mono text-sm"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-neutral-500 ml-1">Access_Key</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-black/50 text-white px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:border-white transition-all font-mono text-sm"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="group relative w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50"
            >
              <span className="relative z-10">{loading ? "Decrypting..." : "Initialize Session"}</span>
              <div className="absolute inset-0 rounded-xl bg-white blur-md opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">
              New Recruit? <span onClick={() => router.push("/user/signup")} className="text-white cursor-pointer hover:underline">Create Profile</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}