"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Pt = { x: number; y: number };

type Trail = {
  pts: Pt[];
  /** Head position along the path, 0 → 1 (+ tail so it fully leaves). */
  head: number;
  speed: number;
  tail: number;
  width: number;
  color: string;
  /** Frames to wait before starting. */
  delay: number;
};

const SAMPLES = 160;

/** Cubic bezier between two random points anywhere on the canvas, with random bends. */
function randomPath(w: number, h: number): Pt[] {
  const r = (a: number, b: number) => a + Math.random() * (b - a);
  const p0 = { x: r(-0.1, 1.1) * w, y: r(-0.1, 1.1) * h };
  const p3 = { x: r(-0.1, 1.1) * w, y: r(-0.1, 1.1) * h };
  const c1 = { x: r(-0.2, 1.2) * w, y: r(-0.2, 1.2) * h };
  const c2 = { x: r(-0.2, 1.2) * w, y: r(-0.2, 1.2) * h };
  const pts: Pt[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const u = 1 - t;
    pts.push({
      x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p3.x,
      y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p3.y,
    });
  }
  return pts;
}

/**
 * Glowing streaks of light: each starts at a random point, sweeps along a random curve to
 * another random point with a fading tail, leaves a faint arc behind, then respawns elsewhere.
 */
export function LightTrails({
  count = 7,
  colors = ["#c9a227", "#e6cf85", "#f0c75e"],
  className,
}: {
  count?: number;
  colors?: string[];
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const parent = canvas?.parentElement;
    if (!canvas || !ctx || !parent) return;

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let frame = 0;
    let visible = true;

    const spawn = (initial = false): Trail => ({
      pts: randomPath(w, h),
      head: initial ? Math.random() : 0,
      speed: 0.0025 + Math.random() * 0.0035,
      tail: 0.3 + Math.random() * 0.3,
      width: 2 + Math.random() * 2.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: initial ? 0 : Math.floor(Math.random() * 90),
    });

    let trails: Trail[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      trails = Array.from({ length: count }, () => spawn(true));
    };

    const drawTrail = (t: Trail) => {
      const end = Math.min(1, t.head);
      const start = Math.max(0, t.head - t.tail);
      if (end <= start) return;
      const i0 = Math.floor(start * SAMPLES);
      const i1 = Math.floor(end * SAMPLES);

      // Faint ghost of the whole arc, brightest while the streak is mid-flight.
      const life = Math.sin(Math.min(1, t.head / (1 + t.tail)) * Math.PI);
      ctx.globalAlpha = 0.22 * life;
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = t.color;
      ctx.beginPath();
      t.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();

      // The streak, drawn in a few overlapping bands from faint/thin (tail) to bright/thick (head),
      // each a single continuous path. A wide faint stroke under each band is the glow — far cheaper
      // than canvas shadowBlur, which was the main source of jank.
      const bands = 5;
      for (let b = 0; b < bands; b++) {
        const from = i0 + Math.floor(((i1 - i0) * b) / bands);
        const k = (b + 1) / bands;
        ctx.beginPath();
        ctx.moveTo(t.pts[from].x, t.pts[from].y);
        for (let i = from + 1; i <= i1; i++) ctx.lineTo(t.pts[i].x, t.pts[i].y);
        ctx.globalAlpha = 0.08 * k;
        ctx.lineWidth = t.width * (0.4 + k) * 5;
        ctx.stroke();
        ctx.globalAlpha = 0.35 * k * k;
        ctx.lineWidth = t.width * (0.4 + k);
        ctx.stroke();
      }
      // Bright head
      if (t.head <= 1) {
        const p = t.pts[i1];
        ctx.fillStyle = t.color;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, t.width * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff8e0";
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, t.width * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (let n = 0; n < trails.length; n++) {
        const t = trails[n];
        if (t.delay > 0) {
          t.delay--;
          continue;
        }
        drawTrail(t);
        if (!still) {
          t.head += t.speed;
          if (t.head > 1 + t.tail) trails[n] = spawn();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      draw();
      if (!still && visible) frame = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (still) draw();
    });
    ro.observe(parent);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible && !still) frame = requestAnimationFrame(loop);
    });
    io.observe(parent);

    resize();
    loop();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, [count, colors]);

  return <canvas ref={canvasRef} aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
