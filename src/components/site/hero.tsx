"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { EASE } from "./motion";
import { scrollToId, useLenis } from "./providers";

/** Big display word whose letters rise in one by one. */
function Letters({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="inline-flex overflow-hidden" aria-hidden>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "105%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 1, ease: EASE, delay: delay + i * 0.04 }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

export function Hero({ photo }: { photo?: string }) {
  const lenis = useLenis();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const radius = useTransform(scrollYProgress, [0, 1], [28, 56]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(lenis, id);
  };

  return (
    <section ref={ref} id="top" className="h-dvh min-h-[620px] p-2 sm:p-3">
      <motion.div
        style={{ scale, borderRadius: radius }}
        className="relative flex h-full origin-top flex-col overflow-hidden bg-ink text-white"
      >
        {/* Name across the top — sits behind the photo */}
        <motion.div style={{ y: titleY }} className="relative z-0 px-4 pt-8 sm:px-8 sm:pt-10">
          <h1 className="text-center font-display uppercase leading-[0.85] text-white" aria-label="Ansh Sharma">
            <span className="block text-[26vw] sm:hidden">
              <Letters text="ANSH" delay={0.15} />
              <br />
              <Letters text="SHARMA" delay={0.3} />
            </span>
            <span className="hidden text-[16.5vw] sm:block">
              <Letters text="ANSH SHARMA" delay={0.15} />
            </span>
          </h1>

          <motion.div
            {...fade(0.8)}
            className="mt-3 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 sm:mt-4 sm:text-xs"
          >
            <span>[Full stack developer]</span>
            <span>[Since 2023]</span>
          </motion.div>
        </motion.div>

        {/* Portrait — in front of the name */}
        {photo && (
          <motion.div
            style={{ y: photoY }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.4 }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto h-[80%] w-full max-w-3xl sm:h-[88%]"
            aria-hidden
          >
            <Image
              src={photo}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-contain object-bottom grayscale"
            />
          </motion.div>
        )}

        {/* Bottom row */}
        <div className="relative z-20 mt-auto flex flex-col gap-6 px-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:pb-10">
          <motion.p
            {...fade(1)}
            className="max-w-sm text-xl font-semibold uppercase leading-tight tracking-tight sm:text-3xl"
          >
            Web platforms for <span className="text-accent">government</span> & enterprise
          </motion.p>

          <motion.div {...fade(1.1)} className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <a
              href="#work"
              onClick={goTo("work")}
              className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white sm:text-sm"
            >
              See my work
              <span className="text-accent transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                ⟶
              </span>
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
