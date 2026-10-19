"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useInView } from "motion/react";
import { skillCategories, skillElements } from "@/data/portfolio";

function SkillsPlaceholder() {
  return (
    <div className="relative h-[860px] min-h-dvh overflow-hidden bg-[#101415] px-5 pt-16 text-center text-white sm:h-[1020px] sm:pt-20 xl:h-dvh xl:min-h-[760px]">
      <p className="text-xs uppercase tracking-[0.25em] text-accent">04 · Skills &amp; tools</p>
      <h2 className="mt-4 font-display text-[clamp(2.6rem,8vw,6.5rem)] uppercase leading-[0.9]">The skill <span className="text-accent">universe</span></h2>
      <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/50 sm:text-xs">{skillCategories.join(" / ")}</p>
      <p className="sr-only">{skillElements.map((skill) => skill.name).join(", ")}</p>
    </div>
  );
}

const SkillUniverse = dynamic(() => import("./skill-universe").then((module) => module.SkillUniverse), {
  ssr: false,
  loading: SkillsPlaceholder,
});

export function LazySkills() {
  const ref = useRef<HTMLDivElement>(null);
  const nearby = useInView(ref, { once: true, margin: "600px 0px" });

  return <div ref={ref}>{nearby ? <SkillUniverse index="04" /> : <SkillsPlaceholder />}</div>;
}
