"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { navLinks, profile } from "@/data/portfolio";
import { EASE } from "./motion";
import { scrollToId, useLenis } from "./providers";

export function Nav() {
  const lenis = useLenis();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  // Hidden on the hero and while scrolling down; revealed only when the user scrolls up.
  const [hidden, setHidden] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - (scrollY.getPrevious() ?? 0);
    if (menuOpen) setHidden(false);
    else if (y < 16 || delta > 4) setHidden(true);
    else if (delta < -4) setHidden(false);
  });

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of navLinks) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (menuOpen) lenis.current?.stop();
    else lenis.current?.start();
  }, [menuOpen, lenis]);

  const go = (e: React.MouseEvent, id: string) => {
    setMenuOpen(false);
    if (id !== "top" && !document.getElementById(id)) return; // Not on the home page: follow the link.
    e.preventDefault();
    scrollToId(lenis, id);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
        initial={false}
        animate={{ y: hidden ? "-130%" : "0%" }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-ink text-white shadow-[0_18px_40px_-18px_rgba(45,52,54,0.6)]">
          <div className="flex h-14 items-center justify-between px-3 sm:px-4">
            <div className="flex items-center gap-3">
              <Link href="/" onClick={(e) => go(e, "top")} aria-label="Ansh Sharma — home" className="group">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-semibold text-ink transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg]">
                  AS
                </span>
              </Link>
              <a
                href={profile.resume}
                download={profile.resumeFileName}
                className="hidden rounded-full bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-accent sm:inline-flex"
              >
                Résumé
              </a>
            </div>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={`/#${link.id}`}
                  onClick={(e) => go(e, link.id)}
                  className={`relative px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 ${
                    active === link.id ? "text-accent" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3.5 -bottom-0.5 h-px bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full border border-white/20 md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <motion.span
                className="block h-px w-4 bg-white"
                animate={menuOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              />
              <motion.span
                className="block h-px w-4 bg-white"
                animate={menuOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            </button>
          </div>
          <motion.div className="h-0.5 origin-left bg-accent" style={{ scaleX: progress }} />
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-ink px-5 pt-24 pb-10 text-white md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <nav className="flex flex-col" aria-label="Mobile">
              {navLinks.map((link, i) => (
                <div key={link.id} className="overflow-hidden border-b border-white/10">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.05 }}
                  >
                    <Link
                      href={`/#${link.id}`}
                      onClick={(e) => go(e, link.id)}
                      className="flex items-baseline justify-between py-5 font-display text-5xl uppercase text-white"
                    >
                      {link.label}
                      <span className="font-mono text-xs text-accent">0{i + 1}</span>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>
            <motion.div
              className="mt-auto flex flex-col gap-2 text-sm text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <a href={`mailto:${profile.email}`} className="text-white">
                {profile.email}
              </a>
              <a href={profile.resume} download={profile.resumeFileName}>
                Download résumé ↓
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
