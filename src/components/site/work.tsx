"use client";

import { useState } from "react";
import Image from "next/image";
import { projects } from "@/data/portfolio";

const GROUPS = [[0, 1, 4], [3, 2, 5]];
const FRAMES = ["back", "front", "side"];

export function Work() {
  const [group, setGroup] = useState(0);
  const featured = projects[GROUPS[group][0]];

  return (
    <section id="work" className="work-library" aria-labelledby="work-heading">
      <div className="work-library-copy">
        <p className="work-library-eyebrow"><span aria-hidden="true" />Selected work · In production</p>
        <h2 id="work-heading">Real projects.<br /><span>Built to last.</span></h2>
        <p className="work-library-description">Government platforms, enterprise dashboards, and independent websites. A selection of the products I&apos;ve designed, built, and shipped.</p>
        <div className="work-library-actions">
          <a className="work-library-primary" href={featured.link} target="_blank" rel="noopener noreferrer">Explore live project <span aria-hidden="true">↗</span></a>
          <button type="button" className="work-library-more" onClick={() => setGroup((value) => (value + 1) % GROUPS.length)} aria-controls="work-library-stack">{group === 0 ? "More projects" : "Previous projects"} <span aria-hidden="true">{group === 0 ? "↓" : "↑"}</span></button>
        </div>
      </div>

      <div id="work-library-stack" className="work-library-stack" role="group" aria-label={`Project collection ${group + 1} of ${GROUPS.length}`} aria-live="polite">
        {GROUPS[group].map((index, position) => {
          const project = projects[index];
          return (
            <a key={project.title} className={`work-browser work-browser-${FRAMES[position]}`} href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title} (opens in a new tab)`}>
              <div className="work-browser-toolbar">
                <span className="work-browser-dots" aria-hidden="true"><i /><i /><i /></span>
                <span className="work-browser-category" title={project.link}>{project.domain}</span>
                <span className="work-browser-arrow" aria-hidden="true">↗</span>
              </div>
              <div className="work-browser-image">
                <Image src={project.image} alt={`${project.title} website screenshot`} fill sizes="(max-width: 767px) 75vw, (max-width: 1023px) 65vw, 45vw" className="object-cover object-top" style={"imageFocus" in project ? { objectPosition: project.imageFocus } : undefined} />
              </div>
              <div className="work-browser-caption"><span>{project.title}</span><span aria-hidden="true">↗</span></div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
