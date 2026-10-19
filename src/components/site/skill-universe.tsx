"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { LightTrails } from "@/components/ui/light-trails";
import { skillCategories, skillElements } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { EASE } from "./motion";
import { brandColors, skillIcons } from "./skills-lab";

type Tile = {
  name: string;
  /** Position of the tile's centre, in % of the stage. */
  x: number;
  y: number;
  size: "lg" | "md" | "sm";
  /** 1 = near (bigger parallax, sharp), 0.4 = far (dim, soft). */
  depth: number;
  /** Hidden on small screens to keep the stage readable. */
  desktopOnly?: boolean;
  /** Which tile set this belongs to: the hand-placed phone set or the full large-screen set. */
  screen?: "mobile" | "desktop";
};

// Below 1280px: a hand-placed handful of key skills.
const KEY_TILES: Tile[] = [
  // Left of the figure
  { name: "Next.js", x: 12, y: 20, size: "lg", depth: 1 },
  { name: "TypeScript", x: 27, y: 9, size: "sm", depth: 0.6 },
  { name: "Tailwind CSS", x: 25, y: 33, size: "sm", depth: 0.7, desktopOnly: true },
  { name: "React.js", x: 12, y: 48, size: "lg", depth: 0.9 },
  { name: "Redux Toolkit", x: 30, y: 52, size: "sm", depth: 0.5, desktopOnly: true },
  { name: "Node.js", x: 16, y: 72, size: "md", depth: 1 },
  { name: "MongoDB", x: 31, y: 74, size: "sm", depth: 0.6, desktopOnly: true },
  { name: "JavaScript", x: 36, y: 22, size: "sm", depth: 0.45, desktopOnly: true },
  // Right of the figure
  { name: "AWS EC2", x: 87, y: 16, size: "lg", depth: 1 },
  { name: "Git", x: 68, y: 10, size: "sm", depth: 0.55 },
  { name: "WebRTC", x: 72, y: 32, size: "md", depth: 0.7, desktopOnly: true },
  { name: "Docker", x: 88, y: 45, size: "lg", depth: 0.9 },
  { name: "MySQL", x: 69, y: 55, size: "sm", depth: 0.5, desktopOnly: true },
  { name: "Express.js", x: 82, y: 70, size: "md", depth: 1 },
  { name: "Redis", x: 67, y: 76, size: "sm", depth: 0.6, desktopOnly: true },
  { name: "Nginx", x: 64, y: 24, size: "sm", depth: 0.45, desktopOnly: true },
];
const MOBILE_TILES: Tile[] = KEY_TILES.filter((t) => !t.desktopOnly).map((t) => ({ ...t, screen: "mobile" }));


// 1280px and up: every skill, scattered at random (seeded, so server and client agree) across the
// whole stage, keeping a minimum gap so tiles never stack. Tiles that land in the middle sit behind
// the figure; the big featured ones always land clear of it.
const FEATURED = ["Next.js", "React.js", "TypeScript", "Node.js", "AWS EC2", "Docker"];
const ALL_SKILLS = skillElements.map((e) => e.name);
const DESKTOP_TILES: Tile[] = (() => {
  const names = [...FEATURED.filter((n) => ALL_SKILLS.includes(n)), ...ALL_SKILLS.filter((n) => !FEATURED.includes(n))];
  const placed: { x: number; y: number }[] = [];
  const round = (v: number) => Math.round(v * 100) / 100; // server and client must print identical styles
  let seed = 1;
  const next = () => {
    const x = Math.sin(seed++ * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return names.map((name, i) => {
    let best = { x: 20, y: 50 };
    let bestGap = -1;
    const featured = FEATURED.includes(name);
    for (let attempt = 0; attempt < 400; attempt++) {
      const x = 3 + next() * 94; // edge panels may bleed slightly off-screen, like the reference
      const y = 8 + next() * 84;
      if (featured && Math.abs(x - 50) < 14) continue;
      // Stage is ~1.7× wider than tall, so scale x before measuring distance.
      const gap = Math.min(Infinity, ...placed.map((p) => Math.hypot((p.x - x) * 1.7, p.y - y)));
      if (gap > bestGap) {
        best = { x, y };
        bestGap = gap;
      }
      if (gap >= 15) break;
    }
    placed.push(best);
    const behind = Math.abs(best.x - 50) < 12;
    const depth = featured ? 1 : behind ? 0.5 : 0.5 + next() * 0.4;
    return {
      name,
      x: round(best.x),
      // Squeeze into 11–83% so edge tiles stay whole on a full-screen (shorter) stage.
      y: round(4 + best.y * 0.86),
      size: featured ? "lg" : depth > 0.75 ? "md" : "sm",
      depth: round(depth),
      screen: "desktop",
    };
  });
})();

// Fixed pseudo-random sequence, so each tile's drift path is the same on server and client.
const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** A looping random wander for one tile, as CSS variables for the `tile-drift` keyframes. */
function driftVars(index: number, depth: number): React.CSSProperties {
  const r = (k: number) => rand(index * 17 + k) * 2 - 1; // −1 … 1
  const reach = 10 + 14 * depth;
  const px = (v: number) => `${Math.round(v * reach)}px`;
  const deg = (v: number) => `${Math.round(v * 40) / 10}deg`;
  return {
    "--dx1": px(r(1)), "--dy1": px(r(4)), "--dr1": deg(r(7)),
    "--dx2": px(r(2)), "--dy2": px(r(5)), "--dr2": deg(r(8)),
    "--dx3": px(r(3)), "--dy3": px(r(6)), "--dr3": deg(r(9)),
    "--drift-dur": `${Math.round(12 + rand(index * 17 + 10) * 10)}s`,
    "--drift-delay": `${-Math.round(rand(index * 17 + 11) * 20)}s`,
  } as React.CSSProperties;
}

/**
 * "Walls" of panels around the figure: tiles turn to face the middle, and grow bigger and closer
 * the further they are from it (small and far near the figure, large at the screen edges).
 */
function wallTransform(tile: Tile): React.CSSProperties {
  const off = (tile.x - 50) / 50; // −1 left edge … 1 right edge
  const reach = Math.abs(off);
  const rotate = Math.round(-off * 32);
  const scale = Math.round((0.72 + reach * 0.6) * 100) / 100;
  return { transform: `perspective(900px) rotateY(${rotate}deg) scale(${scale})` };
}

// Faint empty glass panels in the background, like the screens behind the person in the reference.
const GHOST_PANELS = Array.from({ length: 16 }, (_, i) => {
  const r = (k: number) => rand(i * 31 + k + 500);
  const x = 4 + r(1) * 92;
  return {
    x: Math.round(x * 100) / 100,
    y: Math.round((10 + r(2) * 75) * 100) / 100,
    w: Math.round(50 + r(3) * 70),
    h: Math.round(36 + r(4) * 50),
    rotate: Math.round(-((x - 50) / 50) * 38),
    code: r(5) > 0.5,
  };
});

// Gold light in the site palette (module-level so the canvas effect isn't re-run every render).
const TRAIL_COLORS = ["#c9a227", "#e6cf85", "#f0c75e", "#d4ae35"];

// Brand colours that are black/near-black would vanish on the dark stage.
const tileColor = (name: string) => {
  const c = brandColors[name];
  return !c || c.startsWith("var(") || c === "#000000" || c === "#333333" ? "#ffffff" : c;
};

function SkillTile({ tile, index }: { tile: Tile; index: number }) {
  const Icon = skillIcons[tile.name];

  return (
    <motion.div
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2",
        tile.screen === "mobile" && "xl:hidden",
        tile.screen === "desktop" && "hidden xl:block",
      )}
      style={{ left: `${tile.x}%`, top: `${tile.y}%`, zIndex: Math.round(tile.depth * 10) }}
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: tile.depth < 0.6 ? 0.55 : 1, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.2 + index * 0.05 }}
    >
      <div className="tile-drift" style={driftVars(index, tile.depth)}>
        <div
          className={cn(
            "group flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-[rgba(34,40,43,0.82)] text-center shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] transition-[border-color,box-shadow] duration-500 hover:border-accent hover:shadow-[0_0_30px_-6px_var(--accent)] sm:gap-2",
            tile.size === "lg" && "w-[4.75rem] px-2 py-3 sm:w-32 sm:py-4",
            tile.size === "md" && "w-[4.5rem] px-2 py-2.5 sm:w-28 sm:py-3.5",
            tile.size === "sm" && "w-16 px-1.5 py-2 sm:w-24 sm:py-3",
          )}
          style={wallTransform(tile)}
          title={tile.name}
        >
          {Icon && (
            <Icon
              aria-hidden
              className={cn(tile.size === "lg" ? "h-7 w-7 sm:h-10 sm:w-10" : tile.size === "md" ? "h-6 w-6 sm:h-8 sm:w-8" : "h-5 w-5 sm:h-7 sm:w-7")}
              style={{ color: tileColor(tile.name) }}
            />
          )}
          <span
            className={cn(
              "w-full truncate font-semibold leading-tight text-white",
              tile.size === "lg" ? "text-[10px] sm:text-sm" : "text-[9px] text-white/80 sm:text-xs",
            )}
          >
            {tile.name}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

const LAYERS = [{ depth: 0.55 }, { depth: 0.75 }, { depth: 1 }];
const layerOf = (t: Tile) => (t.depth >= 0.9 ? 1 : t.depth >= 0.68 ? 0.75 : 0.55);

function ParallaxLayer({
  depth,
  mx,
  my,
  children,
}: {
  depth: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  children: React.ReactNode;
}) {
  const x = useTransform(mx, (v) => v * 28 * depth);
  const y = useTransform(my, (v) => v * 18 * depth);
  return (
    // The far layer sits behind the figure (z 6); the others in front.
    <motion.div className="pointer-events-none absolute inset-0 [&>*]:pointer-events-auto" style={{ x, y, zIndex: depth < 0.6 ? 5 : 7 + depth * 2 }}>
      {children}
    </motion.div>
  );
}

/** "Creative universe" stage: the figure from behind, streaks of gold light and floating skill tiles. */
export function SkillUniverse({ index }: { index: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#101415] text-white xl:h-dvh xl:min-h-[760px]">
      {/* Streaks of light: random start, random curve, anywhere on the stage */}
      <LightTrails count={8} colors={TRAIL_COLORS} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_55%,transparent_0%,rgba(16,20,21,0.55)_100%)]" />
      {/* Heading */}
      <div className="relative z-20 mx-auto max-w-4xl shrink-0 px-5 pt-16 text-center sm:pt-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/60 sm:text-[11px]"
        >
          {index} · Welcome to
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="mt-4 font-display text-[clamp(2.6rem,8vw,6.5rem)] uppercase leading-[0.9]"
        >
          The skill <span className="text-accent drop-shadow-[0_0_24px_rgba(201,162,39,0.45)]">universe</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/50 sm:text-xs"
        >
          {skillCategories.join("  |  ")}
        </motion.p>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        onPointerMove={onMove}
        onPointerLeave={() => {
          rawX.set(0);
          rawY.set(0);
        }}
        className="relative mx-auto -mt-4 h-[620px] w-full max-w-[1600px] sm:h-[760px] xl:h-auto xl:min-h-0 xl:flex-1"
      >
        {/* Floor: glow and rings under the feet */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[34%]">
          
          <div className="absolute -bottom-[12%] left-1/2 h-[50%] w-[70%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(201,162,39,0.35),transparent)]" />
          {[92, 66, 42].map((w, i) => (
            <div
              key={w}
              className="absolute left-1/2 -translate-x-1/2 rounded-[50%] border border-accent/30 shadow-[0_0_14px_-4px_var(--accent)]"
              style={{ width: `${w}%`, height: `${18 + i * -3}%`, bottom: `${-4 + i * 2}%`, opacity: 0.4 + i * 0.2 }}
            />
          ))}
        </div>

        {/* Background glass panels (desktop) */}
        <div aria-hidden className="absolute inset-0 z-[4] hidden xl:block">
          {GHOST_PANELS.map((g, i) => (
            <div
              key={i}
              className="tile-drift absolute"
              style={{ left: `${g.x}%`, top: `${g.y}%`, ...driftVars(i + 100, 0.4) }}
            >
              <div
                className="-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-accent/20 bg-[rgba(201,162,39,0.05)] p-2 shadow-[0_0_24px_-10px_var(--accent)]"
                style={{ width: g.w, height: g.h, transform: `translate(-50%, -50%) perspective(700px) rotateY(${g.rotate}deg)`, opacity: 0.55 }}
              >
                {g.code &&
                  [70, 45, 85, 55, 30].map((w, k) => (
                    <span key={k} className="mb-1 block h-[2px] rounded-full bg-accent/40" style={{ width: `${w}%` }} />
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* The figure — taller, a touch darker, legs running to the bottom edge */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.2, ease: EASE }}
          className="absolute bottom-0 left-1/2 z-[6] h-[90%] -translate-x-1/2 sm:h-[94%]"
          style={{ aspectRatio: "499 / 1400" }}
        >
          {/* Contact shadow where the shoes meet the floor */}
          <span
            aria-hidden
            className="absolute bottom-[-1.5%] left-1/2 h-[6%] w-[150%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.85),rgba(0,0,0,0.45)_55%,transparent)] blur-[2px]"
          />
          <Image
            src="/me-back.webp"
            alt="Ansh, seen from behind, facing his skills"
            fill
            sizes="360px"
            className="object-contain object-bottom brightness-[0.78] contrast-[1.05]"
          />
        </motion.div>

        {/* Floating skill tiles, in three parallax layers (one transform each, not one per tile) */}
        {LAYERS.map((layer) => (
          <ParallaxLayer key={layer.depth} depth={layer.depth} mx={mx} my={my}>
            {MOBILE_TILES.map((t, i) =>
              layerOf(t) === layer.depth ? <SkillTile key={`m-${t.name}`} tile={t} index={i} /> : null,
            )}
            {DESKTOP_TILES.map((t, i) =>
              layerOf(t) === layer.depth ? <SkillTile key={`d-${t.name}`} tile={t} index={i} /> : null,
            )}
          </ParallaxLayer>
        ))}

        {/* Bottom shadow: fade the stage's lower edge into the dark */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[7] h-[14%] bg-[linear-gradient(to_bottom,transparent,rgba(8,10,11,0.7))]" />
      </div>
    </div>
  );
}
