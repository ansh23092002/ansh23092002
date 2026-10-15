"use client";

import { createContext, useContext, useEffect, useRef, type RefObject } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";

const LenisContext = createContext<RefObject<Lenis | null>>({ current: null });

/** Ref to the active Lenis instance (null when reduced motion is on). */
export const useLenis = () => useContext(LenisContext);

/** Scroll to an in-page section, using Lenis when it is active. */
export function scrollToId(lenisRef: RefObject<Lenis | null>, id: string) {
  const lenis = lenisRef.current;
  const target = id === "top" ? 0 : document.getElementById(id);
  if (target === null) return;
  if (lenis) {
    lenis.scrollTo(target, { offset: -72, duration: 1.4 });
  } else if (target === 0) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
      anchors: { offset: -72 },
    });
    lenis.current = instance;

    return () => {
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LenisContext.Provider>
  );
}
