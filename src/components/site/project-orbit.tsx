"use client";

import { GalleryHeading } from "@/components/threeui/gallery-heading";
import { projects } from "@/data/portfolio";

const ITEMS = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));
const PROJECT_GALLERY = {
  headline: ["SELECTED", "PROJECTS"],
  palette: [
    "#c9a227", "#1b2225", "#e6cf85", "#3a4549", "#f7f0dc", "#8a6d12",
    "#101415", "#d4ae35", "#5f6b6f", "#ece6d6", "#2d3436", "#f0c75e",
  ],
  ink: ["#c9a227", "#f7f3e8", "#101415"],
  ghost: ["#c9a227", "#8c989c"],
  background: "#2d3436",
  idleSpeed: 0.35,
  sceneScale: 1.6,
  projects: ITEMS.map(({ image, title, link }) => ({ image, title, link })),
} as const;

export function ProjectOrbit() {
  return (
    <>
      <div className="project-orbit">
        <GalleryHeading variant="falling-diagonal" mode="dark" font="sans" weight="700" headlineSize={1.2} hue={0} saturation={1} brightness={1} customise={PROJECT_GALLERY} />
      </div>
      <nav className="project-orbit-links" aria-label="Project websites">
        {ITEMS.map((project) => <a key={project.title} href={project.link} target="_blank" rel="noopener noreferrer">{project.title} ↗</a>)}
      </nav>
    </>
  );
}
