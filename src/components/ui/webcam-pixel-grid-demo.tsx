"use client";

import React from "react";
import { WebcamPixelGrid } from "@/components/ui/webcam-pixel-grid";

export function WebcamPixelGridDemo() {
  return (
    <div className="relative h-[650px] w-full rounded-3xl bg-black overflow-hidden border border-white/10 shadow-2xl">
      {/* Webcam pixel grid background */}
      <div className="absolute inset-0">
        <WebcamPixelGrid
          gridCols={60}
          gridRows={40}
          maxElevation={50}
          motionSensitivity={0.25}
          elevationSmoothing={0.2}
          colorMode="webcam"
          backgroundColor="#030303"
          mirror={true}
          gapRatio={0.05}
          invertColors={false}
          darken={0.6}
          borderColor="#ffffff"
          borderOpacity={0.06}
          className="w-full h-full"
          onWebcamReady={() => console.log("Webcam ready!")}
          onWebcamError={(err) => console.error("Webcam error:", err)}
        />
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs sm:text-sm text-white/70 backdrop-blur-sm">
            Interactive Vision Matrix &rarr;
          </div>

          {/* Title */}
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Live Monochrome Pixel Grid
          </h2>

          {/* Description */}
          <p className="mx-auto mb-8 max-w-2xl text-xs sm:text-base text-white/70">
            Real-time elevation smoothing and motion tracking matrix. Pure monochrome grayscale with zero artificial colors.
          </p>

          {/* Buttons */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contact"
              className="group relative inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-7 text-xs sm:text-sm font-semibold text-black transition-all hover:bg-neutral-200"
            >
              Contact Ansh
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="#projects"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 text-xs sm:text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
            >
              Explore Projects
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebcamPixelGridDemo;
