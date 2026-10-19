"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { EASE, Letters } from "./motion";
import { scrollToId, useLenis } from "./providers";
import { useIntroReady } from "./splash";

const fade = (delay: number, play: boolean) => ({
  initial: { opacity: 0, y: 14 },
  animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
  transition: { duration: 0.9, ease: EASE, delay },
});

// Torn bottom edge: irregular teeth from a fixed pseudo-random sequence, so server and client draw the same shape.
const rand = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const TOOTH_COUNT = 34;
const TEETH = Array.from({ length: TOOTH_COUNT }, (_, i) => {
  const edge = i === 0 || i === TOOTH_COUNT - 1;
  return {
    x: ((i + (edge ? 0 : (rand(i + 50) - 0.5) * 0.7)) / (TOOTH_COUNT - 1)) * 100,
    depth: i % 2 === 0 ? 0.1 + 0.3 * rand(i) : 0.5 + 0.5 * rand(i),
  };
});

/** Clip-path for the torn edge: straight at rest, tearing in and rising as the hero scrolls away. */
const tornEdge = (progress: number) => {
  const amp = 90 * progress;
  const lift = 160 * progress;
  const bottom = [...TEETH]
    .reverse()
    .map((t) => `${t.x.toFixed(2)}% calc(100% - ${(t.depth * amp + lift).toFixed(1)}px)`)
    .join(", ");
  return `polygon(0 0, 100% 0, ${bottom})`;
};

export function Hero({ photo }: { photo?: string }) {
  const lenis = useLenis();
  const play = useIntroReady();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const radius = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const clipPath = useTransform(scrollYProgress, tornEdge);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(lenis, id);
  };

  return (
    <section ref={ref} id="top" className="h-dvh min-h-[620px]">
      <motion.div
        style={{ scale, borderRadius: radius, clipPath }}
        className="relative flex h-full origin-top flex-col overflow-hidden bg-ink text-white"
      >
        {/* Name across the top — sits behind the photo */}
        <motion.div style={{ y: titleY }} className="relative z-0 px-4 pt-8 sm:px-8 sm:pt-10">
          <h1 className="text-center font-display uppercase leading-[0.85] text-white" aria-label="Ansh Sharma">
            <span className="block text-[26vw] sm:hidden">
              <Letters text="ANSH" delay={0.15} play={play} />
              <br />
              <Letters text="SHARMA" delay={0.3} play={play} />
            </span>
            <span className="hidden text-[16.5vw] sm:block">
              <Letters text="ANSH SHARMA" delay={0.15} play={play} />
            </span>
          </h1>

          <motion.div
            {...fade(0.8, play)}
            className="mt-3 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 sm:mt-4 sm:text-xs"
          >
            <span>[Full stack developer]</span>
            <span>[Since 2023]</span>
          </motion.div>
        </motion.div>

        {/* Portrait — in front of the name */}
        {photo && (
          <motion.div style={{ y: photoY }} className="pointer-events-none absolute bottom-[34%] right-0 z-10 h-[37%] w-full sm:bottom-0 max-w-3xl sm:h-[88%] sm:w-[62%]" aria-hidden>
            <motion.div
              className="relative h-full w-full"
              initial={{ opacity: 0, y: 60 }}
              animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.4 }}
            >
            <Image
              src={photo}
              alt=""
              fill
              preload
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-contain object-right-bottom [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent),linear-gradient(to_bottom,black_70%,transparent)]"
            />
            </motion.div>
          </motion.div>
        )}

        {/* Intro — stacked on the left, clear of the portrait on the right */}
        <div className="relative z-20 mt-auto flex flex-col gap-5 px-5 pb-6 sm:max-w-[44%] sm:gap-6 sm:px-10 sm:pb-10">
          <motion.p
            {...fade(1, play)}
            className="text-xl font-semibold uppercase leading-tight tracking-tight sm:text-3xl lg:text-4xl"
          >
            Web platforms for <span className="text-accent">government</span> & enterprise
          </motion.p>

          <motion.p {...fade(1.05, play)} className="max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            Full stack developer building fast, secure products — from real-time WebRTC pipelines to scalable
            Next.js architecture.
          </motion.p>

          <motion.div {...fade(1.1, play)} className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-1">
            <a
              href="#work"
              onClick={goTo("work")}
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white sm:text-sm"
            >
              See my work
              <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">⟶</span>
            </a>
            <a
              href="#contact"
              onClick={goTo("contact")}
              className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white sm:text-sm"
            >
              Get in touch
              <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">⟶</span>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
