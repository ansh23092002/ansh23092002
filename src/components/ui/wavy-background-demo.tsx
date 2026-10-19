"use client";
import React from "react";
import { WavyBackground } from "@/components/ui/wavy-background";

export default function WavyBackgroundDemo() {
  return (
    <WavyBackground className="mx-auto max-w-4xl pb-40">
      <p className="text-center text-2xl font-bold text-white md:text-4xl lg:text-7xl">Hero waves are cool</p>
      <p className="mt-4 text-center text-base font-normal text-white md:text-lg">
        Leverage the power of canvas to create a beautiful hero section
      </p>
    </WavyBackground>
  );
}
