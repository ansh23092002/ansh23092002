"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Logo from "@/components/Logo";

const Globe3DDemoThird = dynamic(
  () => import("@/components/ui/3d-globe-demo").then((m) => m.Globe3DDemoThird),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] rounded-xl bg-neutral-950 border border-white/10 flex items-center justify-center font-mono text-xs text-blue-400 animate-pulse">
        Initializing 3D Globe with global markers...
      </div>
    ),
  }
);



export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-[#f4f4f5] selection:bg-white selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#050507]/80 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size="md" />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-1.5 rounded-full text-xs font-medium border border-white/15 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.06] text-white transition-all flex items-center gap-1.5"
            >
              <span>← Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-16 flex flex-col gap-16">
        {/* Globe 3D Demo Third as requested */}
        <section className="w-full">
          <Globe3DDemoThird />
        </section>

        {/* About Profile & Overview */}
        <section className="flex flex-col gap-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-medium self-start">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Full Stack Developer • WebRTC Architect • Open for Roles
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Engineering robust digital experiences & real-time architectures.
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            I am <strong className="text-white">Ansh Sharma</strong>, a software developer specializing in React.js, Next.js, Node.js, and WebRTC streaming technologies. With production experience delivering state-level medical distribution platforms (CGMSC EMSA) and low-latency video conferencing engines (Ailifebot Loop-in), I build software that performs reliably at scale.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="/resume.pdf"
              download="Ansh_Sharma_Resume.pdf"
              className="px-6 py-3 rounded-full text-sm font-semibold bg-white text-black hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg"
            >
              Download Verified Resume
            </a>
            <Link
              href="/#contact"
              className="px-6 py-3 rounded-full text-sm font-medium border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/30 text-white transition-all"
            >
              Contact Ansh
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
