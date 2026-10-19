"use client";

// From Aceternity UI (https://ui.aceternity.com/registry/wavy-background.json), adapted:
// the canvas sizes to its container instead of the window, resize is observed per instance
// (no global window.onresize), drawing pauses off-screen, and reduced motion freezes the waves.

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  waveCount = 5,
  /** Vertical centre of the waves, as a fraction of the container height. */
  waveCenter = 0.5,
  /** Spread the waves over the whole height, each drifting up and down on its own random path. */
  wander = false,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  waveCount?: number;
  waveCenter?: number;
  wander?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Safari ignores ctx.filter, so the blur goes on the element instead.
    setIsSafari(navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome"));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    const noise = createNoise3D();
    const waveColors = colors ?? ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"];
    const step = speed === "slow" ? 0.001 : 0.002;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let nt = 0;
    let frame = 0;
    let visible = true;

    const resize = () => {
      w = canvas.width = container.clientWidth;
      h = canvas.height = container.clientHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    const draw = () => {
      ctx.globalAlpha = 1;
      ctx.fillStyle = backgroundFill || "black";
      ctx.globalAlpha = waveOpacity;
      ctx.fillRect(0, 0, w, h);
      nt += step;
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        // Wandering waves get their own slowly drifting centre line and a taller swing.
        const center = wander ? h * (0.5 + 0.42 * noise(i * 7.3, 100, nt * 0.35)) : h * waveCenter;
        const amp = wander ? 160 : 100;
        for (let x = 0; x < w; x += 5) {
          const y = noise(x / 800, 0.3 * i, nt) * amp;
          ctx.lineTo(x, y + center);
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    const loop = () => {
      draw();
      if (!still && visible) frame = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (still) draw();
    });
    ro.observe(container);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible && !still) frame = requestAnimationFrame(loop);
    });
    io.observe(container);

    resize();
    loop();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, [colors, waveWidth, backgroundFill, blur, speed, waveOpacity, waveCount, waveCenter, wander]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex h-screen flex-col items-center justify-center overflow-hidden", containerClassName)}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={isSafari ? { filter: `blur(${blur}px)` } : undefined}
        aria-hidden
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
