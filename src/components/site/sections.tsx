"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { education, experiences, marqueeSkills, profile, projects, stats } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { AnimatedTitle, CountUp, EASE, Eyebrow, Magnetic, Reveal, ScrollText, SectionHeading, SplitWords, Tilt } from "./motion";
import { scrollToId, useLenis } from "./providers";
import { PeriodicSkills } from "./skills-lab";

const toneClasses = {
  accent: "bg-accent text-ink",
  ink: "bg-ink text-white",
  soft: "bg-white text-fg border border-line",
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
            <p className="font-display text-[clamp(2.75rem,8vw,7rem)] uppercase leading-[0.9]">
              Projects I&apos;ve <span className="text-accent">built</span>
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-surface-2/85 sm:text-base">
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

        <div className="mt-14 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-4 md:gap-4">
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

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section id="experience" className="mx-auto max-w-6xl px-5 py-28 sm:px-8 md:py-40">
      <SectionHeading
        index="02"
        eyebrow="Experience"
        title="Where I've | *worked*"
        description="Shipping production software in fast-moving teams — from internal tooling to secure platforms for enterprise and public-sector clients."
      />

      <ol ref={listRef} className="relative mt-12 md:mt-20">
        {/* Timeline track + scroll-linked fill */}
        <div className="absolute top-2 bottom-2 left-[5px] w-px bg-line md:left-[calc(25%+5px)]" />
        <motion.div
          className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-accent md:left-[calc(25%+5px)]"
          style={{ scaleY: lineScale }}
        />

        {experiences.map((exp, i) => (
          <li key={exp.company} className="relative grid gap-3 pb-12 pl-8 last:pb-0 md:grid-cols-4 md:gap-0 md:pb-16 md:pl-0">
            <Reveal delay={0.05} className="md:pr-12">
              <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">{exp.period}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-subtle">{exp.type}</div>
            </Reveal>

            <motion.span
              className={cn(
                "absolute top-1.5 left-0 h-[11px] w-[11px] rounded-full border-2 border-bg md:left-[25%]",
                exp.current ? "pulse-dot bg-accent" : "bg-ink",
              )}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 * i }}
            />

            <Reveal delay={0.1} className="md:col-span-3 md:pl-12">
              <h3 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                {exp.role}
                <span className="mt-1 block text-accent-strong sm:mt-0 sm:inline">
                  <span className="hidden sm:inline"> · </span>
                  {exp.company}
                </span>
              </h3>
              <ul className="mt-6 flex flex-col gap-3 text-[15px] leading-relaxed text-muted">
                {exp.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-[0.7em] h-px w-3 shrink-0 bg-subtle" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {exp.tags.map((t) => (
                  <span key={t} className="rounded-full bg-surface-2 px-3 py-1 font-mono text-[11px] text-muted">
                    {t}
                  </span>
                ))}
              </div>
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
  const row = [...marqueeSkills, ...marqueeSkills];

  return (
    <section id="skills" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="04"
          eyebrow="Capabilities"
          title="Tools of | the *trade*"
          description="My stack as a periodic table. Filter by category, or tap any element."
        />
      </div>

      <div className="marquee mt-12 overflow-hidden bg-ink py-5 md:mt-16 md:py-6" aria-hidden>
        <div className="marquee-track flex w-max items-center">
          {row.map((s, i) => (
            <span key={i} className="flex items-center whitespace-nowrap font-display text-5xl uppercase text-white md:text-7xl">
              {s}
              <span className="mx-8 text-accent md:mx-12">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-5 sm:px-8 md:mt-16">
        <PeriodicSkills />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                              */
/* ------------------------------------------------------------------ */

export function Contact() {
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
    <section id="contact" className="px-2 pb-2 sm:px-4 sm:pb-4">
      <div className="rounded-[32px] bg-ink text-white sm:rounded-[40px]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-32">
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-white/60">
              <span className="text-accent">05</span>
              <span className="h-px w-8 bg-white/25" />
              <span>Contact</span>
            </div>
          </Reveal>

          <h2 className="mt-6 text-[clamp(2.75rem,9vw,7.5rem)] font-semibold leading-[1] tracking-[-0.045em] md:mt-8">
            <SplitWords text="Let's build" />
            <br />
            <span className="text-accent">
              <SplitWords text="something great." delay={0.15} />
            </span>
          </h2>

          <Reveal delay={0.2} className="mt-8 max-w-xl md:mt-12">
            <p className="text-base leading-relaxed text-surface-2/75 sm:text-lg">
              Open to full-time full stack and frontend roles, government and enterprise projects, and
              high-impact freelance work. The fastest way to reach me is email.
            </p>
          </Reveal>

          <Reveal delay={0.3} className="mt-8 flex flex-wrap items-center gap-3 md:mt-12">
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
            className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:mt-20 md:grid-cols-4"
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
                className="group flex flex-col gap-6 bg-ink p-5 transition-colors duration-300 hover:bg-[#363f42] sm:p-6"
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
