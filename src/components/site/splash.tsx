"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, animate } from "motion/react";
import { EASE } from "./motion";
import { useLenis } from "./providers";

// "Intro ready" signal: flips once the splash starts lifting, so the hero can begin its intro then.
let introReady = false;
const listeners = new Set<() => void>();
function markIntroReady() {
  introReady = true;
  listeners.forEach((l) => l());
}
/** True once the splash has started to leave (always false on the server). */
export function useIntroReady() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => introReady,
    () => false,
  );
}

/** Used only if the video can't play (e.g. autoplay blocked): how long the counter runs, in seconds. */
const FALLBACK_DURATION = 3.6;

/** Full-screen intro: the video plays through once while the bottom-right counter tracks it 0 → 100, then it lifts away. */
export function Splash() {
  const lenis = useLenis();
  const [done, setDone] = useState(false);
  const [shown, setShown] = useState(0);
  const count = useMotionValue(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  useMotionValueEvent(count, "change", (v) => setShown(Math.round(v)));

  useEffect(() => {
    // Lenis is created in the parent's effect, which runs after this one.
    const lock = requestAnimationFrame(() => lenis.current?.stop());
    document.documentElement.style.overflow = "hidden";

    const video = videoRef.current;
    let cancelled = false;
    let frame = 0;
    let fallback: ReturnType<typeof animate> | null = null;
    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      count.set(100);
      setTimeout(() => setDone(true), 300);
    };

    // Counter follows the video's own playback, so it hits 100 exactly as the video ends.
    const track = () => {
      if (video && video.duration) count.set(Math.min(99, (video.currentTime / video.duration) * 100));
      frame = requestAnimationFrame(track);
    };
    const runFallback = () => {
      if (cancelled || fallback) return;
      cancelAnimationFrame(frame);
      fallback = animate(count, 100, { duration: FALLBACK_DURATION, ease: [0.3, 0, 0.2, 1] });
      fallback.then(finish);
    };

    if (video) {
      video.addEventListener("ended", finish, { once: true });
      video.addEventListener("error", runFallback, { once: true });
      video
        .play()
        .then(() => (frame = requestAnimationFrame(track)))
        .catch(runFallback);
    } else {
      runFallback();
    }

    return () => {
      cancelled = true;
      fallback?.stop();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(lock);
      video?.removeEventListener("ended", finish);
      video?.removeEventListener("error", runFallback);
    };
  }, [count, lenis]);

  useEffect(() => {
    if (!done) return;
    document.documentElement.style.overflow = "";
    const l = lenis.current;
    if (l) {
      l.scrollTo(0, { immediate: true, force: true });
      l.start();
    } else {
      window.scrollTo(0, 0);
    }
    // Start the hero intro as the splash lifts, so the two overlap smoothly.
    const t = setTimeout(markIntroReady, 350);
    return () => clearTimeout(t);
  }, [done, lenis]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="splash"
          aria-hidden
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: EASE }}
          className="fixed inset-0 z-[100] overflow-hidden bg-[#ececec]"
        >
          <video
            ref={videoRef}
            src="/splash.mp4?v=4"
            poster="/splash-poster.jpg?v=3"
            autoPlay
            muted
            playsInline
            preload="auto"
            className="absolute inset-x-0 top-[14%] h-[58%] w-full object-cover [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)] sm:inset-0 sm:top-0 sm:h-full sm:[mask-image:none]"
          />

          {/* Loader, bottom right */}
          <div className="absolute right-5 bottom-5 flex flex-col items-end gap-3 sm:right-10 sm:bottom-8">
            <div className="flex items-start font-display leading-none text-ink tabular-nums">
              <span className="text-[clamp(4.5rem,13vw,10rem)]">{shown}</span>
              <span className="mt-2 text-3xl text-accent-strong sm:mt-4 sm:text-5xl">%</span>
            </div>
            <div className="h-[3px] w-40 overflow-hidden rounded-full bg-ink/10 sm:w-64">
              <div className="h-full origin-left bg-accent" style={{ transform: `scaleX(${shown / 100})` }} />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-ink/60">Loading portfolio</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
