"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

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
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-semibold">AI Interview Practice</h1>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hi, {user.name}</span>
            <Link
              href="/"
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Dashboard
            </Link>
          </div>
        ) : (
          <Link
            href="/user/login"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Login
          </Link>
        )}
      </nav>

      {/* Hero Section */}
      <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Practice Interviews with AI
        </h2>

        <p className="text-gray-600 max-w-xl mb-8">
          Improve your confidence and prepare for real-world technical interviews.
          Get realistic questions and sharpen your communication skills.
        </p>

        {user ? (
          <Link
            href="/interview"
            className="bg-black text-white text-lg px-8 py-4 rounded-xl hover:bg-gray-800 transition"
          >
            Start Interview
          </Link>
        ) : (
          <Link
            href="/user/login"
            className="bg-black text-white text-lg px-8 py-4 rounded-xl hover:bg-gray-800 transition"
          >
            Login to Start
          </Link>
        )}
      </div>
    </div>
  );
}
