"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { projects } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./motion";
import { slug } from "./skills-lab";

type Project = (typeof projects)[number];

/** Screenshot inside a minimal browser frame. */
function BrowserShot({ project }: { project: Project }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1f2628] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
        <span className="flex-1 truncate rounded-full bg-white/5 px-3 py-1 text-center font-mono text-[11px] text-white/50">
          {project.domain}
        </span>
      </div>
      <div className="relative min-h-[200px] flex-1 overflow-hidden">
        {project.image && (
          <Image
            src={project.image}
            alt={`${project.title} — screenshot of the live site`}
            fill
            sizes="(min-width: 768px) 640px, 100vw"
            style={"imageFocus" in project ? { objectPosition: project.imageFocus } : undefined}
            className="object-cover object-top transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04]"
          />
        )}
      </div>
    </div>
  );
}

/**
 * One project card. On md+ each card sticks a little lower than the last, so they pile up
 * like a deck; earlier cards shrink back as later ones slide over them.
 */
function StackCard({
  project,
  index,
  count,
  progress,
}: {
  project: Project;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const featured = project.featured;
  const scale = useTransform(progress, [index / count, 1], [1, 1 - (count - index) * 0.03]);

  return (
    <div
      className="mb-6 md:sticky md:top-[var(--stack-top)] md:mb-10"
      style={{ "--stack-top": `${96 + index * 22}px` } as React.CSSProperties}
    >
      <motion.article
        id={`project-${slug(project.title)}`}
        style={{ scale }}
        className="group grid origin-top overflow-hidden rounded-[28px] border border-white/10 bg-ink text-white md:h-[min(76vh,620px)] md:grid-cols-[1.05fr_1fr] motion-reduce:!transform-none"
      >
        <div className="order-2 flex flex-col justify-between gap-8 p-6 sm:p-8 md:order-1 md:p-10">
          <div>
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
                {project.year} · {project.role}
              </span>
            </div>

            <div className="mt-6 flex items-start gap-4">
              <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] uppercase leading-[0.9]">{project.title}</h3>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">{project.description}</p>

            <ul className="mt-5 flex max-w-lg flex-col gap-2 text-sm text-white/80">
              {project.metrics.map((m) => (
                <li key={m} className="flex gap-3">
                  <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                  {m}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span key={t} className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] text-white/70">
                  {t}
                </span>
              ))}
            </div>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-max items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white"
            >
              Visit site <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        <div className="order-1 h-60 p-3 sm:h-80 md:order-2 md:h-auto md:p-5 md:pl-0">
          <BrowserShot project={project} />
        </div>
      </motion.article>
    </div>
  );
}

export function Work() {
  const ordered = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));
  const count = ordered.length;

  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  return (
    <section id="work" className="bg-surface-2 pt-20 pb-24 md:pt-32 md:pb-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="Selected work"
          title="Shipped to | *production*"
          description="Led by a state-wide government platform — plus payment backends, logistics dashboards and product sites, all live and in use."
        />

        <div ref={stackRef} className="mt-12 md:mt-20">
          {ordered.map((p, i) => (
            <StackCard key={p.title} project={p} index={i} count={count} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
