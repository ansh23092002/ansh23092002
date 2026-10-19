"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { education, experiences, profile, projects, stats } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { AnimatedTitle, CountUp, EASE, Eyebrow, Magnetic, Reveal, ScrollText, SectionHeading, Tilt } from "./motion";
import { scrollToId, useLenis } from "./providers";
import { GalleryHeading } from "@/components/threeui/gallery-heading";
import { SkillUniverse } from "./skill-universe";

const toneClasses = {
  accent: "bg-accent text-ink",
  ink: "bg-ink text-white",
  soft: "bg-bg text-fg border border-line",
  plain: "bg-surface-2 text-fg",
} as const;

const shots = projects.filter((p) => p.image).map((p) => ({ src: p.image as string, title: p.title }));

/* ------------------------------------------------------------------ */
/* About                                                                */
/* ------------------------------------------------------------------ */

function ExpandingMosaic() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.75],
    ["inset(24% 26% 24% 26% round 28px)", "inset(0% 0% 0% 0% round 0px)"],
  );
  const scale = useTransform(scrollYProgress, [0, 0.75], [1.25, 1]);
  const captionOpacity = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);

  return (
    <div ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <motion.div style={{ clipPath }} className="absolute inset-0 bg-ink">
          <motion.div style={{ scale }} className="grid h-full w-full grid-cols-2 gap-1.5 p-1.5 md:grid-cols-3">
            {shots.slice(0, 6).map((s) => (
              <div key={s.title} className="relative overflow-hidden rounded-lg">
                <Image src={s.src} alt={s.title} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover object-top" />
              </div>
            ))}
          </motion.div>
          <div className="absolute inset-0 bg-ink/45" />
          <motion.div
            style={{ opacity: captionOpacity }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.75)]"
          >
            <p className="font-display text-[clamp(2.75rem,8vw,6rem)] uppercase leading-[0.9]">
              Projects I&apos;ve <span className="text-accent">built</span>
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
              {projects.map((p) => p.title).join("  ·  ")}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="pt-20 md:pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <Eyebrow>01 · About Ansh</Eyebrow>
          </Reveal>
          <h2 className="mt-6 text-fg">
            <AnimatedTitle
              text="Building software | *governments* can | trust"
              className="text-[clamp(3rem,10vw,8.5rem)] [&>span]:justify-center"
            />
          </h2>
          <Reveal delay={0.2} className="mt-8 max-w-md">
            <p className="text-sm text-muted sm:text-base">
              Full stack developer · {education.degree} · {education.grade}
            </p>
          </Reveal>
        </div>
      </div>

      <ExpandingMosaic />

      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-8">
            <ScrollText
              className="text-2xl font-medium leading-snug tracking-tight text-fg sm:text-3xl md:text-[2.4rem] md:leading-[1.2]"
              text="I build dependable software for government and enterprise — from Chhattisgarh's state medical equipment platform to payment backends and data-heavy dashboards. I care about speed, security and details that make complex systems feel simple."
            />
          </div>
          <Reveal delay={0.1} className="md:col-span-4">
            <dl className="flex flex-col divide-y divide-line border-y border-line text-sm">
              {[
                ["Currently", "Full Stack Developer, Ailifebot"],
                ["Focus", "GovTech & enterprise platforms"],
                ["Education", `${education.school} — ${education.year}`],
                ["Location", profile.location],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1 py-4">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.25em] text-subtle">{k}</dt>
                  <dd className="text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-4 md:gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="h-full">
              <Tilt className={cn("flex h-full flex-col justify-between gap-8 rounded-3xl p-5 sm:p-7", toneClasses[s.tone])}>
                <span className="font-display text-6xl uppercase md:text-7xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </span>
                <span className="text-xs font-medium uppercase leading-snug tracking-[0.15em] opacity-75">{s.label}</span>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Experience — timeline                                                */
/* ------------------------------------------------------------------ */

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

type Milestone = {
  year: string;
  title: string;
  org?: string;
  text: string;
  tags?: readonly string[];
  badge: string;
  /** Header image: a project from that year, or a portrait for what's next. */
  image?: string;
  current?: boolean;
  next?: boolean;
};

const chronological = [...experiences].reverse();

// Card images for specific roles (company → image in /public).
const ROLE_IMAGES: Record<string, string> = {
  "Xtention Crew Technologies": "/projects/leadcrm.webp", // LeadCRM — leadcrm-six.vercel.app
};

// Oldest first: each role, then what's next.
const MILESTONES: Milestone[] = [
  ...chronological.map((e) => {
    const year = e.period.match(/\d{4}/)?.[0] ?? "";
    return {
      year,
      title: e.role,
      org: e.company,
      text: e.summary,
      tags: e.tags,
      badge: initials(e.company),
      // Screenshot of work from that role, else a project shipped the year it started.
      image: ROLE_IMAGES[e.company] ?? projects.find((p) => p.image && p.year === year)?.image,
      current: e.current,
    };
  }),
  {
    year: "Next",
    title: "Next chapter",
    text: "Building bigger products and creating greater impact.",
    badge: "→",
    image: "/me-back.webp",
    next: true,
  },
];

// The arc the pins sit on: a quadratic curve across a 1000 × ARC_H box (x stretches with the row).
const ARC_H = 170;
const ARC = { y0: 34, c: 190, y1: 70 };
const arcY = (t: number) => (1 - t) ** 2 * ARC.y0 + 2 * (1 - t) * t * ARC.c + t ** 2 * ARC.y1;
// Tilt each card a little along the curve's slope.
const arcTilt = (t: number) => {
  const dy = 2 * (1 - t) * (ARC.c - ARC.y0) + 2 * t * (ARC.y1 - ARC.c);
  return ((Math.atan2(dy, 1250) * 180) / Math.PI) * 0.45;
};
const arcD = (dy = 0) => `M0 ${ARC.y0 + dy} Q500 ${ARC.c + dy} 1000 ${ARC.y1 + dy}`;

type Stage = "past" | "active" | "future";

function Pin({ m, stage = "past" }: { m: Milestone; stage?: Stage }) {
  return (
    <span
      className={cn(
        "relative flex h-7 w-7 items-center justify-center transition-[opacity,transform] duration-500",
        stage === "future" && "opacity-40",
        stage === "active" && "scale-125",
      )}
    >
      {stage === "active" && <span className="absolute inset-0 animate-ping rounded-full bg-accent/40" />}
      <span
        className={cn(
          "flex h-6 w-6 rotate-45 items-center justify-center rounded-full rounded-br-none",
          m.next ? "border-2 border-accent bg-ink" : "bg-accent",
          stage !== "future" && "shadow-[0_0_18px_var(--accent)]",
        )}
      >
        <span className={cn("h-2 w-2 rounded-full", m.next ? "bg-accent" : "bg-white")} />
      </span>
    </span>
  );
}

function MilestoneCard({ m, stage = "past", compact = false }: { m: Milestone; stage?: Stage; compact?: boolean }) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border bg-[linear-gradient(to_bottom,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] backdrop-blur-sm transition-[transform,border-color,box-shadow,opacity,filter] duration-500 ease-out-expo hover:-translate-y-2",
        stage === "active"
          ? "border-accent shadow-[0_0_0_1px_var(--accent),0_0_40px_-6px_var(--accent)]"
          : m.next
            ? "border-dashed border-white/25"
            : "border-white/10",
        stage === "future" && "opacity-40 grayscale",
      )}
    >
      {/* Visual: warm-graded image (or glow + oversized year) behind the badge */}
      <div
        className={cn(
          "relative overflow-hidden border-b border-white/10 bg-[radial-gradient(120%_90%_at_30%_100%,rgba(201,162,39,0.35),transparent_60%)]",
          compact ? "h-32 lg:h-36" : "h-32 sm:h-36",
        )}
      >
        {m.image ? (
          <>
            <Image
              src={m.image}
              alt=""
              fill
              sizes="280px"
              className="object-cover object-top brightness-[0.7] sepia-[0.45] transition-transform duration-700 ease-out-expo group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(27,34,37,0.92),transparent_65%),radial-gradient(120%_90%_at_30%_100%,rgba(201,162,39,0.3),transparent_60%)]" />
          </>
        ) : (
          <span
            aria-hidden
            className="absolute -right-2 -bottom-5 font-display text-[5.5rem] leading-none text-white/[0.06]"
          >
            {m.year}
          </span>
        )}
        {!m.image && (
          <span
            className={cn(
              "absolute left-4 flex items-center justify-center rounded-xl font-display",
              compact ? "bottom-3 h-10 w-10 text-lg" : "bottom-4 h-12 w-12 text-xl",
              m.current ? "bg-accent text-ink" : "bg-white/10 text-accent",
            )}
          >
            {m.badge}
          </span>
        )}
        {m.current && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
            Now
          </span>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col gap-1.5", compact ? "p-4" : "p-4 sm:p-5")}>
        <span className="font-display text-2xl leading-none text-accent">{m.year}</span>
        <h3 className="text-base font-semibold leading-snug text-white">{m.title}</h3>
        {m.org && <p className="text-sm font-medium text-accent-light">{m.org}</p>}
        <p className="mt-1 text-[13px] leading-relaxed text-white/60">{m.text}</p>
        {m.tags && (
          <div className="mt-auto flex flex-wrap gap-1 pt-3">
            {m.tags.slice(0, compact ? 3 : 4).map((t) => (
              <span key={t} className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/50">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/** Experience clock: the long hand aims at the current pin. */
/** Experience dial: only its lower arc shows on screen; the hands are drawn from a pivot (see Experience). */
function Clock() {
  return (
    <div className="relative h-full w-full" aria-hidden>
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full overflow-visible">
        <circle cx="200" cy="200" r="198" fill="none" stroke="var(--accent)" strokeOpacity="0.15" />
        <circle
          cx="200"
          cy="200"
          r="184"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.85"
          strokeWidth="3.5"
          className="drop-shadow-[0_0_10px_var(--accent)]"
        />
        <circle cx="200" cy="200" r="164" fill="none" stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="1" />
        {Array.from({ length: 180 }, (_, i) => (
          <line
            key={i}
            x1="200"
            y1={i % 10 === 0 ? 38 : i % 5 === 0 ? 33 : 30}
            x2="200"
            y2="20"
            stroke="var(--accent)"
            strokeWidth={i % 10 === 0 ? 2 : 1}
            strokeOpacity={i % 10 === 0 ? 0.9 : 0.45}
            transform={`rotate(${i * 2} 200 200)`}
          />
        ))}
      </svg>
    </div>
  );
}

export function Experience() {
  const n = MILESTONES.length;
  const ts = MILESTONES.map((_, i) => (i + 0.5) / n);

  // Desktop: the stage stays pinned while scroll walks the timeline from first to last milestone.
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(n - 1, Math.round(v * (n - 1)))));

  // Bright arc fills from the first pin to the active one.
  const fill = useTransform(progress, [0, 1], [ts[0], ts[n - 1]]);
  const fillClip = useTransform(fill, (f) => `inset(-20px ${(100 - f * 100).toFixed(2)}% -20px 0)`);

  // Pointer from the clock to the current pin, measured live so it holds at any viewport size.
  const boxRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fromX = useMotionValue(0);
  const fromY = useMotionValue(0);
  const toX = useMotionValue(0);
  const toY = useMotionValue(0);
  // Second hand: from the pivot, sweeping down and to the right as you scroll.
  const handX = useMotionValue(0);
  const handY = useMotionValue(0);
  // Pin and clock centres relative to the stage box don't change while scrolling, so they are
  // measured once (and again on resize) — the scroll handler only interpolates.
  const layout = useRef<{ clock: { x: number; y: number }; radius: number; pins: { x: number; y: number }[] } | null>(null);
  const measure = useCallback(() => {
    const box = boxRef.current?.getBoundingClientRect();
    const clock = clockRef.current?.getBoundingClientRect();
    if (!box || !clock || !box.width) return;
    const pins = pinRefs.current.slice(0, n).map((el) => {
      const r = el!.getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    });
    // The dial's centre sits above the screen, so the hands pivot from a point just inside its
    // visible arc, near the top edge — like the reference.
    const radius = clock.width / 2;
    const cx = clock.left + radius - box.left;
    layout.current = { clock: { x: cx + radius * 0.12, y: Math.max(clock.top + radius - box.top, 44) }, radius, pins };
  }, [n]);
  const point = useCallback(
    (p: number) => {
      if (!layout.current) measure();
      const l = layout.current;
      if (!l || l.pins.length < n) return;
      // Glide between neighbouring pins as the scroll moves.
      const f = Math.min(n - 1, Math.max(0, p * (n - 1)));
      const i = Math.min(n - 2, Math.floor(f));
      const k = f - i;
      const a = l.pins[i];
      const b = l.pins[i + 1];
      const tx = a.x + (b.x - a.x) * k;
      const ty = a.y + (b.y - a.y) * k;
      fromX.set(l.clock.x);
      fromY.set(l.clock.y);
      toX.set(tx);
      toY.set(ty);
      const angle = ((62 - p * 22) * Math.PI) / 180;
      handX.set(l.clock.x + Math.cos(angle) * l.radius * 0.85);
      handY.set(l.clock.y + Math.sin(angle) * l.radius * 0.85);
    },
    [n, measure, fromX, fromY, toX, toY, handX, handY],
  );
  useMotionValueEvent(progress, "change", point);
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const update = () => {
      measure();
      point(progress.get());
    };
    const ro = new ResizeObserver(update);
    ro.observe(box);
    update();
    return () => ro.disconnect();
  }, [measure, point, progress]);

  const stageOf = (i: number): Stage => (i < active ? "past" : i === active ? "active" : "future");

  return (
    <section id="experience" className="relative bg-ink text-white">
      {/* Desktop: pinned stage */}
      <div ref={stageRef} className="relative hidden md:block" style={{ height: `${n * 75}svh` }}>
        <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
          <div ref={boxRef} className="relative flex h-full w-full flex-col justify-center px-8 pt-64 pb-6 lg:px-14">
            {/* Heading, top left */}
            <div className="absolute top-14 left-8 z-20 max-w-xs lg:left-14">
              <span aria-hidden className="block h-0.5 w-20 bg-accent shadow-[0_0_10px_var(--accent)]" />
              <p className="mt-5 text-lg text-white/70">My</p>
              <h2 className="text-5xl font-semibold leading-none tracking-tight text-white lg:text-6xl">Experience</h2>
              <p className="mt-5 text-base leading-relaxed text-white/60">A journey of learning, building and creating impact.</p>
            </div>

            {/* Big dial, top right and partly off-screen — sits behind the timeline */}
            <div
              ref={clockRef}
              className="pointer-events-none absolute right-[4vw]"
              style={{ width: "min(44vw, 820px)", height: "min(44vw, 820px)", top: "calc(40% - min(44vw, 820px))" }}
            >
              <Clock />
            </div>

            {/* Arc, pins and cards */}
            <div className="relative z-10">
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-24 left-1/2 -z-10 h-64 w-[110%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(201,162,39,0.22),transparent)]"
              />
              <svg
                viewBox={`0 0 1000 ${ARC_H}`}
                preserveAspectRatio="none"
                className="absolute inset-x-0 top-0 w-full overflow-visible"
                style={{ height: ARC_H }}
                aria-hidden
              >
                <path d={arcD()} fill="none" stroke="var(--accent)" strokeOpacity="0.3" strokeWidth="4" vectorEffect="non-scaling-stroke" />
                <path
                  d={arcD(7)}
                  fill="none"
                  stroke="var(--accent)"
                  strokeOpacity="0.3"
                  strokeWidth="6"
                  strokeDasharray="1.5 16"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <motion.div aria-hidden className="absolute inset-x-0 top-0" style={{ height: ARC_H, clipPath: fillClip }}>
                <svg viewBox={`0 0 1000 ${ARC_H}`} preserveAspectRatio="none" className="h-full w-full overflow-visible">
                  <path d={arcD()} fill="none" stroke="var(--accent)" strokeOpacity="0.25" strokeWidth="16" vectorEffect="non-scaling-stroke" />
                  <path
                    d={arcD()}
                    fill="none"
                    stroke="#f0c75e"
                    strokeWidth="4"
                    vectorEffect="non-scaling-stroke"
                    className="drop-shadow-[0_0_10px_var(--accent)]"
                  />
                  <path d={arcD()} fill="none" stroke="#fff6d8" strokeOpacity="0.8" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                </svg>
              </motion.div>

              <ol className="relative grid gap-5 px-3 lg:gap-8" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                {MILESTONES.map((m, i) => (
                  <li key={m.year + m.title} className="flex flex-col items-center" style={{ paddingTop: arcY(ts[i]) - 14 }}>
                    <span
                      ref={(el) => {
                        pinRefs.current[i] = el;
                      }}
                      className="relative z-10"
                    >
                      <span
                        className={cn(
                          "pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap font-display text-4xl leading-none transition-[color,opacity] duration-500 lg:text-5xl",
                          stageOf(i) === "active"
                            ? "text-white [text-shadow:0_0_18px_var(--accent),0_0_40px_rgba(201,162,39,0.6)]"
                            : stageOf(i) === "past"
                              ? "text-accent-light [text-shadow:0_0_16px_rgba(201,162,39,0.55)]"
                              : "text-accent-light/40",
                        )}
                      >
                        {m.year}
                      </span>
                      <Pin m={m} stage={stageOf(i)} />
                    </span>
                    <span className="h-5 w-px bg-gradient-to-b from-accent to-transparent" />
                    {/* Same height for every card so their bottoms follow the arc evenly */}
                    <div className="h-[min(24rem,46vh)] w-full" style={{ transform: `rotate(${arcTilt(ts[i])}deg)` }}>
                      <MilestoneCard m={m} stage={stageOf(i)} compact />
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Pointer: clock centre → current pin, with a spotlight where it lands */}
            <svg aria-hidden className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible">
              <defs>
                <radialGradient id="exp-spot">
                  <stop offset="0%" stopColor="white" stopOpacity="0.95" />
                  <stop offset="35%" stopColor="var(--accent)" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <motion.line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke="var(--accent)" strokeOpacity="0.25" strokeWidth="10" strokeLinecap="round" />
              <motion.line
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_10px_var(--accent)]"
              />
              <motion.line x1={fromX} y1={fromY} x2={handX} y2={handY} stroke="white" strokeOpacity="0.85" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-[0_0_8px_var(--accent)]" />
              <motion.circle cx={fromX} cy={fromY} r="11" fill="white" className="drop-shadow-[0_0_16px_var(--accent)]" />
              <motion.circle cx={toX} cy={toY} r="46" fill="url(#exp-spot)" style={{ mixBlendMode: "screen" }} />
              <motion.circle
                cx={toX}
                cy={toY}
                r="20"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                className="animate-pulse drop-shadow-[0_0_8px_var(--accent)]"
              />
              <motion.circle cx={toX} cy={toY} r="6" fill="white" className="drop-shadow-[0_0_12px_white]" />
            </svg>
          </div>
        </div>
      </div>

      {/* Mobile: vertical glowing rail */}
      <ol className="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 pt-24 pb-28 pl-15 md:hidden">
        <span className="absolute top-14 bottom-28 left-[33px] w-[3px] rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
        {MILESTONES.map((m) => (
          <li key={m.year + m.title} className="relative">
            <span className="absolute top-0 -left-10">
              <Pin m={m} stage={m.next ? "future" : "past"} />
            </span>
            <Reveal>
              <span className="mb-3 block font-display text-3xl leading-none text-accent-light">{m.year}</span>
              <MilestoneCard m={m} stage={m.current ? "active" : "past"} />
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Skills                                                               */
/* ------------------------------------------------------------------ */

export function Skills() {
  return (
    <section id="skills">
      <SkillUniverse index="04" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                              */
/* ------------------------------------------------------------------ */

function ContactWord({
  children,
  progress,
  start,
  end,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [16, 0]);

  return (
    <motion.span aria-hidden style={{ opacity, y }} className="contact-word inline-block">
      {children}
    </motion.span>
  );
}

const contactMessage = "Open to full-time full stack and frontend roles, government and enterprise projects, and high-impact freelance work. The fastest way to reach me is email.";

// GalleryHeading in the site's charcoal + gold, carrying the contact line, always orbiting.
const CONTACT_GALLERY = {
  headline: ["LET’S BUILD", "SOMETHING GREAT"],
  palette: [
    "#c9a227", "#1b2225", "#e6cf85", "#3a4549", "#f7f0dc", "#8a6d12",
    "#101415", "#d4ae35", "#5f6b6f", "#ece6d6", "#2d3436", "#f0c75e",
  ],
  ink: ["#c9a227", "#f7f3e8", "#101415"],
  ghost: ["#c9a227", "#8c989c"],
  background: "#2d3436",
  idleSpeed: 0.35,
} as const;

export function Contact() {
  const contactRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: contactRef, offset: ["start start", "end end"] });
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section ref={contactRef} id="contact" className="contact-scroll text-white" aria-labelledby="contact-heading">
      <div className="contact-stage">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-8 sm:px-8 md:py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="min-w-0">
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-white/60">
              <span className="text-accent">05</span>
              <span className="h-px w-8 bg-white/25" />
              <span>Contact</span>
            </div>
          </Reveal>

          <h2 id="contact-heading" aria-label="Let's build something great." className="mt-6 text-[clamp(2.75rem,6vw,5.5rem)] font-semibold leading-[1] tracking-[-0.045em] md:mt-8">
            <span className="flex flex-wrap gap-x-[0.25em]">
              {["Let's", "build"].map((word, i) => (
                <ContactWord key={word} progress={scrollYProgress} start={i * 0.06} end={i * 0.06 + 0.06}>{word}</ContactWord>
              ))}
            </span>
            <span className="mt-1 flex flex-wrap gap-x-[0.25em] text-accent">
              {["something", "great."].map((word, i) => (
                <ContactWord key={word} progress={scrollYProgress} start={0.12 + i * 0.06} end={0.18 + i * 0.06}>{word}</ContactWord>
              ))}
            </span>
          </h2>

          <p className="mt-6 flex max-w-xl flex-wrap gap-x-[0.28em] text-base leading-relaxed text-white/75 sm:text-lg md:mt-8">
            <span className="sr-only">{contactMessage}</span>
            {contactMessage.split(" ").map((word, i, words) => (
              <ContactWord key={i} progress={scrollYProgress} start={0.24 + i / words.length * 0.5} end={0.24 + (i + 1) / words.length * 0.5}>{word}</ContactWord>
            ))}
          </p>

          <Reveal delay={0.3} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-ink transition-colors hover:bg-white sm:text-base"
              >
                {profile.email}
                <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={copyEmail}
              className="relative inline-flex h-[52px] min-w-[120px] items-center justify-center overflow-hidden rounded-full border border-white/25 px-6 text-sm font-medium text-white transition-colors hover:border-white sm:h-[58px]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "copied" : "copy"}
                  initial={{ y: "120%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-120%" }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="block"
                >
                  {copied ? "Copied ✓" : "Copy email"}
                </motion.span>
              </AnimatePresence>
            </button>
          </Reveal>

          <Reveal
            delay={0.4}
            className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:mt-10 md:grid-cols-4 lg:grid-cols-2"
          >
            {[
              { label: "LinkedIn", value: "in/ansh-sharma", href: profile.linkedin, external: true },
              { label: "GitHub", value: "ansh23092002", href: profile.github, external: true },
              { label: "Phone", value: profile.phone, href: profile.phoneHref, external: false },
              { label: "Résumé", value: "Download PDF", href: profile.resume, external: false, download: true },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(l.download ? { download: profile.resumeFileName } : {})}
                className="group flex flex-col gap-3 bg-ink p-4 transition-colors duration-300 hover:bg-[#363f42] sm:p-5"
              >
                <span className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.15em] text-white/60">
                  {l.label}
                  <span className="transition-all duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent">
                    ↗
                  </span>
                </span>
                <span className="truncate text-sm text-white sm:text-base">{l.value}</span>
              </a>
            ))}
          </Reveal>
        </div>

        {/* ThreeUI GalleryHeading — Glitch Fall */}
        <div className="shader-frame relative aspect-[4/3] w-full overflow-hidden bg-ink lg:aspect-auto lg:h-full lg:min-h-[560px] lg:self-stretch">
        <GalleryHeading
            variant="falling-diagonal"
            mode="dark"
            font="sans"
            weight="700"
            headlineSize={1.2}
            hue={0}
            saturation={1.0}
            brightness={1.0}
            customise={CONTACT_GALLERY}
          />
        </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const lenis = useLenis();

  return (
    <footer className="bg-accent text-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 text-[11px] font-medium uppercase tracking-[0.2em] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
            LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
            GitHub
          </a>
          <button type="button" onClick={() => scrollToId(lenis, "top")} className="group inline-flex items-center gap-1.5">
            Top <span className="transition-transform duration-500 group-hover:-translate-y-1">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
