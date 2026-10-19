"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { preload } from "react-dom";
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
const FALLBACK_DURATION = 1.2;
const VIDEO_WAIT_MS = 15000;
const POSTER = "/splash-poster.jpg?v=3";

/** Play the intro through once; use a timeout only while loading or buffering. */
export function Splash() {
  preload(POSTER, { as: "image", fetchPriority: "high" });
  const lenis = useLenis();
  const [done, setDone] = useState(false);
  const [shown, setShown] = useState(0);
  const [needsPlay, setNeedsPlay] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const count = useMotionValue(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishRef = useRef<(() => void) | null>(null);
  const playRef = useRef<(() => void) | null>(null);
  useMotionValueEvent(count, "change", (v) => setShown(Math.round(v)));

  useEffect(() => {
    // Lenis is created in the parent's effect, which runs after this one.
    let scrollInstance = lenis.current;
    const lock = requestAnimationFrame(() => {
      scrollInstance = lenis.current;
      scrollInstance?.stop();
    });
    const previousOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const video = videoRef.current;
    let cancelled = false;
    let frame = 0;
    let playPending = false;
    let autoplayBlocked = false;
    let retries = 0;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    let finishDelay: ReturnType<typeof setTimeout> | undefined;
    let fallback: ReturnType<typeof animate> | null = null;
    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      clearTimeout(watchdog);
      clearTimeout(retry);
      cancelAnimationFrame(frame);
      fallback?.stop();
      video?.pause();
      count.set(100);
      finishDelay = setTimeout(() => setDone(true), 150);
    };
    finishRef.current = finish;

    // Follow actual playback, including any time spent buffering.
    const track = () => {
      if (cancelled) return;
      if (video && Number.isFinite(video.duration) && video.duration > 0) count.set(Math.min(99, (video.currentTime / video.duration) * 100));
      frame = requestAnimationFrame(track);
    };
    const runFallback = () => {
      if (cancelled || fallback) return;
      clearTimeout(watchdog);
      cancelAnimationFrame(frame);
      fallback = animate(count, 100, { duration: FALLBACK_DURATION, ease: [0.3, 0, 0.2, 1] });
      fallback.then(finish);
    };

    const waitForVideo = () => {
      if (cancelled) return;
      clearTimeout(watchdog);
      watchdog = setTimeout(runFallback, VIDEO_WAIT_MS);
    };
    const onPlaying = () => {
      if (cancelled || fallback) return;
      clearTimeout(watchdog);
      setNeedsPlay(false);
      setHasPlayed(true);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(track);
    };
    const play = () => {
      if (!video || cancelled || fallback || playPending) return;
      playPending = true;
      autoplayBlocked = false;
      // Set the DOM properties as well as the JSX attributes for mobile autoplay.
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      waitForVideo();
      video.play().then(() => {
        playPending = false;
        onPlaying();
      }).catch((error: unknown) => {
        playPending = false;
        if (cancelled) return;
        const name = error && typeof error === "object" && "name" in error ? error.name : "";
        if (name === "NotAllowedError") {
          autoplayBlocked = true;
          clearTimeout(watchdog);
          setNeedsPlay(true);
        } else if (name === "AbortError" && retries < 2) {
          retries++;
          retry = setTimeout(play, 150);
        } else if (name !== "AbortError") {
          runFallback();
        }
      });
    };
    const onReady = () => {
      if (!autoplayBlocked && video?.paused && !video.ended) play();
    };
    playRef.current = play;

    if (video) {
      video.addEventListener("ended", finish, { once: true });
      video.addEventListener("error", runFallback, { once: true });
      video.addEventListener("playing", onPlaying);
      video.addEventListener("waiting", waitForVideo);
      video.addEventListener("canplay", onReady);
      // Native <source> selection starts loading before hydration. Do not reset it here.
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("webkit-playsinline", "true");
      play();
    } else {
      runFallback();
    }

    return () => {
      cancelled = true;
      finishRef.current = null;
      playRef.current = null;
      clearTimeout(watchdog);
      clearTimeout(retry);
      clearTimeout(finishDelay);
      fallback?.stop();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(lock);
      video?.removeEventListener("ended", finish);
      video?.removeEventListener("error", runFallback);
      video?.removeEventListener("playing", onPlaying);
      video?.removeEventListener("waiting", waitForVideo);
      video?.removeEventListener("canplay", onReady);
      video?.pause();
      document.documentElement.style.overflow = previousOverflow;
      document.body.style.overflow = previousBodyOverflow;
      scrollInstance?.start();
    };
  }, [count, lenis]);

  useEffect(() => {
    if (!done) return;
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
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
          aria-label="Portfolio introduction"
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: EASE }}
          className="splash-screen fixed inset-0 z-[100] overflow-hidden bg-[#ececec]"
        >
          <video
            ref={videoRef}
            poster={POSTER}
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="splash-video"
          >
            <source src="/splash-mobile.mp4" media="(max-width: 1023px)" type="video/mp4" />
            <source src="/splash-desktop.mp4" type="video/mp4" />
          </video>

          {!hasPlayed && needsPlay && <button type="button" onClick={() => playRef.current?.()} className="splash-play is-visible">Play intro ▶</button>}

          <button type="button" onClick={() => finishRef.current?.()} className="splash-skip absolute z-10 rounded-full border border-ink/20 bg-white/80 px-4 py-2 text-xs font-medium text-ink transition-colors hover:bg-white">Skip intro ↗</button>

          {/* Loader, bottom right */}
          <div aria-hidden="true" className="splash-progress absolute flex flex-col items-end gap-3">
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
