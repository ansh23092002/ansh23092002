"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { projects } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";
import { slug } from "./skills-lab";

type Project = (typeof projects)[number];

const ORDERED = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));

/** Screenshot inside a minimal browser frame. */
function BrowserShot({ project, sizes }: { project: Project; sizes: string }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#161b1d]">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
        <span className="flex-1 truncate rounded-full bg-white/5 px-3 py-1 text-center font-mono text-[11px] text-white/50">
          {project.domain}
        </span>
      </div>
      <div className="relative min-h-[180px] flex-1 overflow-hidden">
        {project.image && (
          <Image
            src={project.image}
            alt={`${project.title} — screenshot of the live site`}
            fill
            sizes={sizes}
            style={"imageFocus" in project ? { objectPosition: project.imageFocus } : undefined}
            className="object-cover object-left-top transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04]"
          />
        )}
      </div>
    </div>
  );
}

/** Card contents, shared by the desktop carousel and the mobile list. */
function ProjectCard({ project, index, active }: { project: Project; index: number; active: boolean }) {
  return (
    <article
      id={`project-${slug(project.title)}`}
      className={cn(
        "group grid h-full overflow-hidden rounded-[28px] border bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] text-white transition-[border-color,box-shadow] duration-500 lg:grid-cols-[1.25fr_1fr]",
        active ? "border-accent shadow-[0_0_0_1px_var(--accent),0_0_60px_-12px_var(--accent)]" : "border-white/10",
      )}
    >
      <div className="h-56 p-3 sm:h-72 lg:h-auto lg:p-4 lg:pr-0">
        <BrowserShot project={project} sizes="(min-width: 1024px) 640px, 100vw" />
      </div>

      <div className="flex min-h-0 flex-col justify-between gap-6 p-6 lg:p-8">
        <div>
          <span
            className={cn(
              "inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
              project.featured ? "bg-accent text-ink" : "bg-white/10 text-white",
            )}
          >
            {project.featured ? "★ " : ""}
            {project.category}
          </span>
          <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/50">
            {project.year} · {project.role}
          </div>

          <div className="mt-5 flex items-start gap-3">
            <span className="mt-1 font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="font-display text-[clamp(2.2rem,3.4vw,3.4rem)] uppercase leading-[0.9]">{project.title}</h3>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{project.description}</p>

          <ul className="mt-5 flex flex-col gap-2 text-sm text-white/80">
            {project.metrics.map((m) => (
              <li key={m} className="flex gap-3">
                <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span key={t} className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] text-white/60">
                {t}
              </span>
            ))}
          </div>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-max items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink shadow-[0_0_24px_-6px_var(--accent)] transition-colors hover:bg-white"
          >
            Visit site <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}

/** Right-hand page of a spread: the project's screenshot. */
function ShotPage({ project, page }: { project: Project; page: number }) {
  return (
    <div className="flex h-full flex-col gap-4 p-5 lg:p-7">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-white/40">
        <span>{project.category}</span>
        <span className="text-accent">{project.year}</span>
      </div>
      <div className="min-h-0 flex-1">
        <BrowserShot project={project} sizes="(min-width: 1024px) 600px, 50vw" />
      </div>
      <div className="flex items-center justify-between font-mono text-[10px] text-white/35">
        <span>{project.domain}</span>
        <span>— {page} —</span>
      </div>
    </div>
  );
}

/** Left-hand page of a spread: the project's story. */
function InfoPage({ project, index, page }: { project: Project; index: number; page: number }) {
  return (
    <div className="flex h-full flex-col justify-between gap-4 p-6 lg:p-9">
      <div className="min-h-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
              project.featured ? "bg-accent text-ink" : "bg-white/10 text-white",
            )}
          >
            {project.featured ? "★ Featured" : project.role}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
            {project.year} · {project.role}
          </span>
        </div>
        <div className="mt-4 flex items-start gap-3">
          <span className="mt-1 font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="font-display text-[clamp(2rem,3vw,3.2rem)] uppercase leading-[0.9] text-white">{project.title}</h3>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-white/70 lg:text-sm">{project.description}</p>
        <ul className="mt-4 flex flex-col gap-1.5 text-[13px] text-white/80 lg:text-sm">
          {project.metrics.map((m) => (
            <li key={m} className="flex gap-3">
              <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
              {m}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] text-white/60">
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink shadow-[0_0_24px_-6px_var(--accent)] transition-colors hover:bg-white"
          >
            Visit site <span aria-hidden>↗</span>
          </a>
          <span className="font-mono text-[10px] text-white/35">— {page} —</span>
        </div>
      </div>
    </div>
  );
}

// Paper: dark sheet, faint ruled lines, gold fore-edge; `side` adds the shadow that falls into the spine.
const PAGE =
  "absolute inset-0 overflow-hidden border border-accent/25 bg-[#1b2225] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_27px,rgba(255,255,255,0.025)_28px)]";
const SPINE_SHADE = {
  left: "after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-16 after:bg-[linear-gradient(to_left,rgba(0,0,0,0.45),transparent)]",
  right: "after:pointer-events-none after:absolute after:inset-y-0 after:left-0 after:w-16 after:bg-[linear-gradient(to_right,rgba(0,0,0,0.45),transparent)]",
};

/**
 * One leaf of the book, hinged at the spine. Front = right page (screenshot) of spread `k`,
 * back = left page (story) of spread `k + 1`. It turns from 0° to −180° as `pos` passes k → k + 1.
 */
function Leaf({
  pos,
  k,
  interactive,
  front,
  back,
}: {
  pos: MotionValue<number>;
  k: number;
  interactive: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
}) {
  const turn = useTransform(pos, (p) => Math.min(1, Math.max(0, p - k)));
  const rotateY = useTransform(turn, (t) => t * -180);
  // Unturned leaves stack with the next one on top; turned ones stack with the latest on top.
  const zIndex = useTransform(turn, (t) => (t > 0.5 ? 10 + k : 100 - k));
  // Light and shadow sweeping across the page while it's mid-turn.
  const shade = useTransform(turn, (t) => Math.sin(t * Math.PI) * 0.55);

  return (
    <motion.div
      style={{ rotateY, zIndex }}
      inert={!interactive}
      className="absolute inset-y-0 left-1/2 w-1/2 origin-left [transform-style:preserve-3d] will-change-transform"
    >
      <div className={cn(PAGE, SPINE_SHADE.right, "rounded-r-2xl [backface-visibility:hidden]")}>
        {front}
        <motion.span style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_left,rgba(0,0,0,0.7),transparent_70%)]" />
      </div>
      <div className={cn(PAGE, SPINE_SHADE.left, "rounded-l-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]")}>
        {back}
        <motion.span style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.7),transparent_70%)]" />
      </div>
    </motion.div>
  );
}

export function Work() {
  const count = ORDERED.length;
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.0005 });
  const pos = useTransform(progress, (p) => p * (count - 1));
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.round(v * (count - 1))));
  const bar = useTransform(progress, [0, 1], ["0%", "100%"]);
  const page = (i: number, side: 0 | 1) => i * 2 + 1 + side;

  return (
    <section id="work" className="relative bg-[#101415] text-white">
      {/* Desktop: pinned book — each scroll step turns one page */}
      <div ref={stageRef} className="relative hidden md:block" style={{ height: `${count * 80}svh` }}>
        <div className="sticky top-0 flex h-dvh flex-col overflow-hidden">
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-[-25%] left-1/2 h-[60%] w-[80%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(201,162,39,0.18),transparent)]"
          />

          {/* Heading */}
          <div className="relative z-10 flex items-end justify-between gap-8 px-8 pt-10 lg:px-14">
            <div className="max-w-md">
              <span aria-hidden className="block h-0.5 w-20 bg-accent shadow-[0_0_10px_var(--accent)]" />
              <p className="mt-4 text-lg text-white/70">Selected</p>
              <h2 className="text-5xl font-semibold leading-none tracking-tight lg:text-6xl">Work</h2>
            </div>
            <p className="hidden max-w-sm text-right text-sm leading-relaxed text-white/55 lg:block">
              A book of things shipped to production. Scroll to turn the page.
            </p>
          </div>

          {/* The book */}
          <div className="relative min-h-0 flex-1 px-8 py-6 [perspective:2200px] lg:px-14">
            <div className="relative mx-auto h-full max-h-[640px] w-full max-w-[1180px]">
              {/* Cover, peeking out around the pages */}
              <div className="absolute -inset-3 rounded-[22px] border border-accent/30 bg-[#0b0e0f] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),0_0_50px_-20px_var(--accent)]" />

              {/* Static pages: first spread's left page and last spread's right page */}
              <div className={cn(PAGE, SPINE_SHADE.left, "right-1/2 rounded-l-2xl")} inert={active !== 0}>
                <InfoPage project={ORDERED[0]} index={0} page={page(0, 0)} />
              </div>
              <div className={cn(PAGE, SPINE_SHADE.right, "left-1/2 rounded-r-2xl")} inert={active !== count - 1}>
                <ShotPage project={ORDERED[count - 1]} page={page(count - 1, 1)} />
              </div>

              {/* Turning leaves */}
              {ORDERED.slice(0, -1).map((p, k) => (
                <Leaf
                  key={p.title}
                  pos={pos}
                  k={k}
                  interactive={k === active}
                  front={<ShotPage project={p} page={page(k, 1)} />}
                  back={<InfoPage project={ORDERED[k + 1]} index={k + 1} page={page(k + 1, 0)} />}
                />
              ))}

              {/* Spine */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-1/2 z-[200] w-px -translate-x-1/2 bg-accent/40 shadow-[0_0_12px_var(--accent)]"
              />
            </div>
          </div>

          {/* Progress */}
          <div className="relative z-10 px-8 pb-6 lg:px-14">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] tabular-nums text-accent">
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              <div className="relative h-px flex-1 bg-white/15">
                <motion.div style={{ width: bar }} className="absolute inset-y-0 left-0 bg-accent shadow-[0_0_10px_var(--accent)]" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Scroll to turn</span>
            </div>
            <ol className="mt-3 hidden justify-between text-[10px] uppercase tracking-[0.18em] lg:flex">
              {ORDERED.map((p, i) => (
                <li key={p.title} className={cn("transition-colors duration-500", i === active ? "text-accent" : "text-white/35")}>
                  {p.title}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="px-4 py-20 md:hidden">
        <span aria-hidden className="block h-0.5 w-16 bg-accent shadow-[0_0_10px_var(--accent)]" />
        <p className="mt-4 text-base text-white/70">Selected</p>
        <h2 className="text-4xl font-semibold leading-none tracking-tight">Work</h2>
        <div className="mt-10 flex flex-col gap-6">
          {ORDERED.map((p, i) => (
            <Reveal key={p.title}>
              <ProjectCard project={p} index={i} active={!!p.featured} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
