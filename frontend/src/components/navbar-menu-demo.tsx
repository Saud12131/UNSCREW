"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";

export default function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Interview">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/interview" className="text-white hover:text-gray-300">Start Interview</HoveredLink>
            <HoveredLink href="/interview" className="text-white hover:text-gray-300">Practice Mode</HoveredLink>
            <HoveredLink href="/interview" className="text-white hover:text-gray-300">Mock Interviews</HoveredLink>
            <HoveredLink href="/interview" className="text-white hover:text-gray-300">Role Selection</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Features">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="AI Interviewer"
              href="/interview"
              src="https://assets.aceternity.com/demos/algochurn.webp"
              description="Realistic AI-powered interview conversations"
            />
            <ProductItem
              title="Role Specific"
              href="/interview"
              src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
              description="Tailored questions for your specific job role"
            />
            <ProductItem
              title="Instant Feedback"
              href="/interview"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
              description="Get detailed performance evaluation and tips"
            />
            <ProductItem
              title="Voice Recognition"
              href="/interview"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Natural voice interaction with AI interviewer"
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Account">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/user/login" className="text-white hover:text-gray-300">Login</HoveredLink>
            <HoveredLink href="/user/signup" className="text-white hover:text-gray-300">Sign Up</HoveredLink>
            <HoveredLink href="/dashboard" className="text-white hover:text-gray-300">Dashboard</HoveredLink>
            <HoveredLink href="/profile" className="text-white hover:text-gray-300">Profile</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
