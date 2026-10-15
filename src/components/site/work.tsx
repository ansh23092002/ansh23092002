"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { projects } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { EASE, SectionHeading, Tilt } from "./motion";
import { ProjectStack, slug } from "./skills-lab";

type Project = (typeof projects)[number];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const featured = project.featured;

  return (
    <Tilt max={3} className="h-full">
      <article
        id={`project-${slug(project.title)}`}
        className="group relative isolate flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-ink text-white"
      >
        {project.image && (
          <Image
            src={project.image}
            alt={`${project.title} — screenshot of the live site`}
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            style={"imageFocus" in project ? { objectPosition: project.imageFocus } : undefined}
            className="-z-20 scale-105 object-cover object-top blur-[5px] transition-transform duration-[1.4s] ease-out-expo group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-ink/75 transition-colors duration-700 group-hover:bg-ink/70" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]",
                featured ? "bg-accent text-ink" : "bg-white/10 text-white",
              )}
            >
              {featured ? "★ Featured · " : ""}
              {project.category}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
              {String(index + 1).padStart(2, "0")} · {project.year} · {project.role}
            </span>
          </div>
          <h3 className="mt-5 font-display text-[clamp(2.75rem,7vw,6.5rem)] uppercase leading-[0.88]">{project.title}</h3>
          <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-lg">{project.description}</p>
          <ul className="mt-5 hidden max-w-xl flex-col gap-1.5 text-sm text-white/80 sm:flex">
            {project.metrics.map((m) => (
              <li key={m} className="flex gap-2.5">
                <span className="text-accent">●</span>
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 pt-0 sm:p-8 sm:pt-0">
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="stack"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="mb-4 rounded-2xl border border-white/10 bg-ink/80 p-4 backdrop-blur-sm">
                  <div className="mb-3 font-mono text-[11px] text-white/50">$ stack --project &quot;{project.title}&quot;</div>
                  <ProjectStack tech={project.tech} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white"
            >
              Visit site <span aria-hidden>↗</span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors",
                open ? "border-white bg-white text-ink" : "border-white/30 text-white hover:border-white",
              )}
            >
              {open ? "Hide stack" : "Stack"}
              <span className="font-mono">[{project.tech.length}]</span>
            </button>
            <span className="ml-auto hidden font-mono text-[11px] text-white/40 sm:block">{project.domain}</span>
          </div>
        </div>
      </article>
    </Tilt>
  );
}

/**
 * One project in the zoom stage. It rises from depth as it approaches its slot,
 * holds full-size, then flies past the camera and fades as the next one arrives.
 */
function ZoomLayer({
  progress,
  index,
  count,
  active,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  count: number;
  active: boolean;
  children: React.ReactNode;
}) {
  const step = 1 / (count - 1);
  const center = index * step;
  // Keyframes outside 0–1 crash the browser's scroll-linked animation, so the first
  // layer starts already full-size and the last one never zooms away.
  const frames = [
    { at: center - step, scale: 0.55, opacity: 0 },
    { at: center - step * 0.15, scale: 1, opacity: 1 },
    { at: center + step * 0.15, scale: 1, opacity: 1 },
    { at: center + step, scale: 2.4, opacity: 0 },
  ].filter((f) => f.at >= 0 && f.at <= 1);
  if (index === 0) frames.unshift({ at: 0, scale: 1, opacity: 1 });
  if (index === count - 1) frames.push({ at: 1, scale: 1, opacity: 1 });
  const input = frames.map((f) => f.at);
  const scale = useTransform(progress, input, frames.map((f) => f.scale));
  const opacity = useTransform(progress, input, frames.map((f) => f.opacity));

  return (
    <motion.div
      style={{ scale, opacity, zIndex: count - index }}
      inert={!active}
      className={cn(
        "absolute inset-0 flex items-center justify-center px-4 pt-24 pb-16 will-change-transform sm:px-8 motion-reduce:!transform-none",
        !active && "pointer-events-none",
      )}
    >
      <div className="h-full w-full max-w-7xl">{children}</div>
    </motion.div>
  );
}

export function Work() {
  const ordered = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));
  const count = ordered.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.round(v * (count - 1))));
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="work" className="bg-surface-2 pt-20 md:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="Selected work"
          title="Shipped to | *production*"
          description="Led by a state-wide government platform — plus payment backends, logistics dashboards and product sites, all live and in use."
        />
      </div>

      {/* Each project gets one viewport of scroll to zoom through. */}
      <div ref={stageRef} className="relative" style={{ height: `${count * 100}svh` }}>
        <div className="sticky top-0 h-dvh overflow-hidden">
          {ordered.map((p, i) => (
            <ZoomLayer key={p.title} progress={scrollYProgress} index={i} count={count} active={i === active}>
              <ProjectCard project={p} index={i} />
            </ZoomLayer>
          ))}

          <div className="absolute inset-x-4 bottom-5 z-50 mx-auto flex max-w-7xl items-center gap-4 sm:inset-x-8">
            <span className="font-mono text-[11px] tabular-nums text-muted">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <div className="h-px flex-1 overflow-hidden bg-fg/15">
              <motion.div style={{ width: bar }} className="h-full bg-accent" />
            </div>
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted sm:block">Scroll to zoom</span>
          </div>
        </div>
      </div>
    </section>
  );
}
