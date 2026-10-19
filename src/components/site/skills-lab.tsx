"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { IconType } from "react-icons";
import { DiMsqlServer } from "react-icons/di";
import {
  SiAmazonec2,
  SiCss3,
  SiDocker,
  SiExpress,
  SiGit,
  SiGithubactions,
  SiGoogle,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiPhonepe,
  SiPm2,
  SiReact,
  SiRedis,
  SiRedux,
  SiSwr,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
  SiWebrtc,
} from "react-icons/si";
import { TbApi, TbSeo, TbShieldLock, TbSql, TbTopologyStar3 } from "react-icons/tb";
import {
  skillCategories,
  skillElements,
  type SkillCategory,
  type SkillElement,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { EASE } from "./motion";

export const skillIcons: Record<string, IconType> = {
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  SQL: TbSql,
  HTML5: SiHtml5,
  CSS3: SiCss3,
  "React.js": SiReact,
  "Next.js": SiNextdotjs,
  "Vue.js": SiVuedotjs,
  "Redux Toolkit": SiRedux,
  "Tailwind CSS": SiTailwindcss,
  SWR: SiSwr,
  SEO: TbSeo,
  "Node.js": SiNodedotjs,
  "Express.js": SiExpress,
  "REST APIs": TbApi,
  "PhonePe API": SiPhonepe,
  WebRTC: SiWebrtc,
  Microservices: TbTopologyStar3,
  MySQL: SiMysql,
  "SQL Server": DiMsqlServer,
  MongoDB: SiMongodb,
  Redis: SiRedis,
  JWT: SiJsonwebtokens,
  "Google OAuth2": SiGoogle,
  RBAC: TbShieldLock,
  "AWS EC2": SiAmazonec2,
  Nginx: SiNginx,
  PM2: SiPm2,
  Docker: SiDocker,
  "CI/CD": SiGithubactions,
  Git: SiGit,
  Linux: SiLinux,
};

// Official brand colours, used only for the logo in the skill log.
export const brandColors: Record<string, string> = {
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  SQL: "#4479A1",
  HTML5: "#E34F26",
  CSS3: "#1572B6",
  "React.js": "#61DAFB",
  "Next.js": "var(--fg)",
  "Vue.js": "#4FC08D",
  "Redux Toolkit": "#764ABC",
  "Tailwind CSS": "#06B6D4",
  SWR: "var(--fg)",
  SEO: "#4285F4",
  "Node.js": "#5FA04E",
  "Express.js": "var(--fg)",
  "REST APIs": "#6BA539",
  "PhonePe API": "#5F259F",
  WebRTC: "var(--fg)",
  Microservices: "#FF6F00",
  MySQL: "#4479A1",
  "SQL Server": "#CC2927",
  MongoDB: "#47A248",
  Redis: "#FF4438",
  JWT: "var(--fg)",
  "Google OAuth2": "#4285F4",
  RBAC: "#2E7D32",
  "AWS EC2": "#FF9900",
  Nginx: "#009639",
  PM2: "#2B037A",
  Docker: "#2496ED",
  "CI/CD": "#2088FF",
  Git: "#F05032",
  Linux: "var(--fg)",
};

const byName = new Map(skillElements.map((e) => [e.name, e]));

/* ------------------------------------------------------------------ */
/* Element tile — icon + full name                                      */
/* ------------------------------------------------------------------ */

export function ElementTile({
  el,
  state,
  onClick,
  compact = false,
}: {
  el: SkillElement;
  state: "default" | "highlight" | "dim" | "selected";
  onClick?: () => void;
  compact?: boolean;
}) {
  const dark = state === "highlight" || state === "selected";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      aria-pressed={state === "selected"}
      className={cn(
        "group relative flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-xl border p-1.5 text-center transition-[background-color,border-color,color,opacity,box-shadow] duration-300",
        dark && "border-ink bg-ink text-white",
        state === "selected" && "ring-2 ring-accent ring-offset-2 ring-offset-bg",
        state === "default" && "border-line bg-white text-fg hover:border-ink hover:bg-ink hover:text-white",
        state === "dim" && "border-line bg-white text-fg opacity-25 hover:opacity-100",
      )}
    >
      <span className="absolute top-1.5 left-2 font-mono text-[9px] opacity-50">{el.n}</span>
      <span
        className={cn(
          "w-full font-semibold leading-tight transition-colors duration-300",
          compact ? "text-[10px]" : "text-[10px] sm:text-[12px] hyphens-auto",
          dark ? "text-accent" : "group-hover:text-accent",
        )}
      >
        {el.name}
      </span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Selected skill — brand-coloured logo                                */
/* ------------------------------------------------------------------ */

function SkillIcon({ el }: { el: SkillElement }) {
  const Icon = skillIcons[el.name];

  return (
    <div className="flex min-h-[120px] items-center justify-center py-3 sm:min-h-[180px] xl:min-h-[440px] xl:py-0">
      <motion.span
        key={el.name}
        initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        className="flex items-center justify-center"
      >
        {Icon && <Icon className="h-20 w-20 sm:h-32 sm:w-32 xl:h-56 xl:w-56" style={{ color: brandColors[el.name] }} aria-hidden />}
        <span className="sr-only">{el.name}</span>
      </motion.span>
    </div>
  );
}

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/* ------------------------------------------------------------------ */
/* Periodic table + filters + selected icon                               */
/* ------------------------------------------------------------------ */

export function PeriodicSkills() {
  const [filter, setFilter] = useState<SkillCategory | "All">("All");
  const [selected, setSelected] = useState<string>("Next.js");
  const selectedEl = byName.get(selected) ?? skillElements[0];

  const stateFor = (el: SkillElement) => {
    if (el.name === selected) return "selected" as const;
    if (filter === "All") return "default" as const;
    return el.category === filter ? ("highlight" as const) : ("dim" as const);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter skills by category">
        {(["All", ...skillCategories] as const).map((c) => {
          const active = filter === c;
          const count = c === "All" ? skillElements.length : skillElements.filter((e) => e.category === c).length;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={active}
              className={cn(
                "relative rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300",
                active ? "border-ink text-white" : "border-line text-fg hover:border-ink",
              )}
            >
              {active && (
                <motion.span
                  layoutId="skill-filter"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">
                {c}
                <span className={cn("ml-1.5 font-mono", active ? "text-accent" : "text-subtle")}>{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 md:mt-8 xl:grid-cols-[1fr_320px] xl:gap-6">
        {/* Mobile / tablet: simple grid. Desktop: periodic-table layout. */}
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 sm:gap-2 lg:grid-cols-9">
          {skillElements.map((el, i) => (
            <motion.div
              key={el.name}
              initial={{ opacity: 0, scale: 0.8, rotateX: -30 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "0px 0px -5% 0px" }}
              transition={{ duration: 0.6, ease: EASE, delay: (el.col + el.row) * 0.03 + i * 0.002 }}
              className="lg:[grid-column:var(--col)] lg:[grid-row:var(--row)]"
              style={{ "--col": el.col, "--row": el.row + (el.row === 5 ? 1 : 0) } as React.CSSProperties}
            >
              <ElementTile el={el} state={stateFor(el)} onClick={() => setSelected(el.name)} />
            </motion.div>
          ))}
          <div className="hidden flex-col justify-center gap-1 px-4 lg:col-[3/9] lg:row-[1/2] lg:flex">
            <span className="font-display text-2xl uppercase tracking-wide text-fg">Periodic table of my stack</span>
            <span className="text-sm text-muted">Pick a category above, or tap any element.</span>
          </div>
          <div className="hidden lg:col-[1/10] lg:row-[5/6] lg:block lg:h-2" aria-hidden />
        </div>

        <div className="sticky top-3 z-10 order-first rounded-2xl bg-bg xl:top-24 xl:order-none xl:self-start xl:bg-transparent">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEl.name}
              initial={{ opacity: 0, y: 16, rotateX: -12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <SkillIcon el={selectedEl} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Inline stack for a project card                                     */
/* ------------------------------------------------------------------ */

export function ProjectStack({ tech }: { tech: readonly string[] }) {
  const elements = tech.map((t) => byName.get(t)).filter((e): e is SkillElement => Boolean(e));
  const extras = tech.filter((t) => !byName.has(t));

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {elements.map((el) => (
          <ElementTile key={el.name} el={el} state="highlight" compact />
        ))}
      </div>
      {extras.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {extras.map((t) => (
            <span key={t} className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] text-white">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
