"use client";

import React from "react";

interface LogoProps {
  showWordmark?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({
  showWordmark = true,
  className = "",
  size = "md",
}: LogoProps) {
  const emblemSizes = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  return (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Dynamic Emblem */}
      <div
        className={`relative ${emblemSizes[size]} rounded-xl bg-gradient-to-b from-[#12141e] to-[#0a0b12] border border-white/15 p-1.5 flex items-center justify-center transition-all duration-300 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_-3px_rgba(0,223,216,0.4)] group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00dfd8" />
              <stop offset="100%" stopColor="#007cf0" />
            </linearGradient>
            <linearGradient id="logoViolet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7928ca" />
              <stop offset="100%" stopColor="#ff0080" />
            </linearGradient>
          </defs>

          {/* Letter A */}
          <path
            d="M20 7L11 28H15.5L17.5 23H22.5L24.5 28H29L20 7Z"
            fill="url(#logoCyan)"
          />
          <polygon points="20,13.5 18,18.5 22,18.5" fill="#0d0e16" />

          {/* Letter S swoosh */}
          <path
            d="M14 24C14 24 17.5 19.5 23 19.5C26.5 19.5 28 21.5 28 24C28 27.5 23.5 28.5 20.5 30C16.5 32 13.5 33.5 13.5 37C13.5 40 17 41.5 21.5 41.5C26.5 41.5 29 38 29 38"
            stroke="url(#logoViolet)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Active status pulse point */}
          <circle cx="31" cy="9" r="2" fill="#00dfd8" />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center text-sm sm:text-base font-extrabold tracking-tight text-white transition-colors group-hover:text-cyan-300">
            <span>ANSH</span>
            <span className="text-cyan-400">.</span>
            <span>SHARMA</span>
          </div>
          <span className="text-[9px] font-mono tracking-widest text-neutral-400 font-semibold uppercase mt-0.5">
            Full Stack Developer
          </span>
        </div>
      )}
    </div>
  );
}
