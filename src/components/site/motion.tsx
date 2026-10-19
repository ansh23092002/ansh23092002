"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Big display word whose letters rise in one by one. */
export function Letters({ text, delay = 0, play = true }: { text: string; delay?: number; play?: boolean }) {
  return (
    <span className="inline-flex overflow-hidden" aria-hidden>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "105%" }}
          animate={{ y: play ? "0%" : "105%" }}
          transition={{ duration: 1, ease: EASE, delay: delay + i * 0.04 }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

/** Fades and lifts children into view once they enter the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Slides each word up from behind a mask. Plays on mount or when scrolled into view. */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  onMount = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  onMount?: boolean;
}) {
  const words = text.split(" ");
  const trigger = onMount
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "105%" },
              show: { y: "0%", transition: { duration: 1, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Paragraph whose words brighten one by one as it scrolls through the viewport. */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)} aria-label={text}>
      {words.map((word, i) => (
        <ScrollWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </ScrollWord>
      ))}
    </p>
  );
}

function ScrollWord({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.28em]" aria-hidden>
      {children}
    </motion.span>
  );
}

/** Counts from 0 to `value` when scrolled into view. */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

/** Pulls its child gently toward the cursor while hovered. */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.2 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Display title whose words flip in from 3D space as it scrolls into view.
 * Use "|" in `text` to force a line break; wrap a word in *asterisks* to colour it gold.
 */
export function AnimatedTitle({
  text,
  className,
  onMount = false,
  delay = 0,
}: {
  text: string;
  className?: string;
  onMount?: boolean;
  delay?: number;
}) {
  const lines = text.split("|").map((l) => l.trim().split(/\s+/));
  const trigger = onMount
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, margin: "0px 0px -15% 0px" } };

  return (
    <motion.span
      className={cn("block font-display uppercase [perspective:1000px]", className)}
      // Inline so a font-size class in `className` cannot strip it via tailwind-merge.
      style={{ lineHeight: 0.92 }}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: 0.05, delayChildren: delay }}
      aria-label={text.replace(/[|*]/g, " ").replace(/\s+/g, " ").trim()}
    >
      {lines.map((words, li) => (
        <span key={li} className="flex flex-wrap justify-[inherit] gap-x-[0.18em]" aria-hidden>
          {words.map((w, wi) => {
            const gold = w.startsWith("*") && w.endsWith("*");
            return (
              <motion.span
                key={wi}
                className={cn("inline-block [transform-style:preserve-3d]", gold && "text-accent")}
                variants={{
                  hidden: { opacity: 0, x: 10, y: 50, z: -60, rotateY: 60, rotateX: -40 },
                  show: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    z: 0,
                    rotateY: 0,
                    rotateX: 0,
                    transition: { duration: 1.1, ease: EASE },
                  },
                }}
              >
                {gold ? w.slice(1, -1) : w}
              </motion.span>
            );
          })}
        </span>
      ))}
    </motion.span>
  );
}

/** Card that tilts in 3D toward the cursor. */
export function Tilt({
  children,
  className,
  max = 6,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 220, damping: 20 });
  const ry = useSpring(0, { stiffness: 220, damping: 20 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-py * max);
    ry.set(px * max);
  };

  return (
    <div className="h-full [perspective:1200px]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        style={{ rotateX: rx, rotateY: ry }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Small uppercase label used above titles. */
export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em]",
        dark ? "text-white/60" : "text-muted",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  dark = false,
  center = false,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-5 md:gap-6", center && "items-center text-center")}>
      <Reveal>
        <Eyebrow dark={dark}>
          {index} · {eyebrow}
        </Eyebrow>
      </Reveal>
      <h2 className={cn(dark ? "text-white" : "text-fg", center && "justify-center")}>
        <AnimatedTitle
          text={title}
          className={cn("text-[clamp(3rem,9vw,7.5rem)]", center && "[&>span]:justify-center")}
        />
      </h2>
      {description && (
        <Reveal delay={0.15} className="max-w-md">
          <p className={cn("text-sm leading-relaxed sm:text-base", dark ? "text-white/60" : "text-muted")}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
