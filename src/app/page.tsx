"use client";

import React, { useState } from "react";
import Logo from "@/components/Logo";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("anshsharma7400@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const experiences = [
    {
      role: "Full Stack Developer",
      company: "Ailifebot",
      period: "Sep 2025 – Present",
      type: "Full-time",
      highlights: [
        "Architected and led the development of Loop-in, a real-time WebRTC conferencing platform, managing the signaling layer, TURN/STUN relay, and Google OAuth2/JWT authentication.",
        "Reduced manual release overhead by 40% by implementing an automated CI/CD deployment pipeline targeting AWS EC2 with Nginx reverse proxy and PM2 process management.",
        "Improved application load time by 30% across 5+ production dashboard modules using code splitting, memoization, and dynamic component imports.",
        "Built and integrated secure RESTful micro-endpoints enforcing role-based token authorization (RBAC) for enterprise clients.",
      ],
      tags: ["WebRTC", "Next.js", "Node.js", "AWS EC2", "Nginx", "PM2", "CI/CD", "TURN/STUN"],
    },
    {
      role: "Frontend Developer",
      company: "Inext Software Solutions",
      period: "Aug 2024 – Aug 2025",
      type: "Full-time",
      highlights: [
        "Accelerated front-end sprint delivery by 25% by engineering a shared, reusable UI component library adopted across internal enterprise dashboards.",
        "Integrated high-throughput Node.js/Express REST APIs with React/Next.js client applications, enabling dynamic, low-latency business workflows.",
        "Partnered directly with product and design teams to standardize UI/UX consistency across responsive viewports.",
      ],
      tags: ["React.js", "Next.js", "REST APIs", "Tailwind CSS", "UI Component Library"],
    },
    {
      role: "Frontend Developer Intern",
      company: "Xtention Crew Technologies",
      period: "Oct 2023 – Mar 2024",
      type: "Internship",
      highlights: [
        "Built and integrated an interactive real-time chat module using React.js and Vue.js with live status and message updates.",
        "Gained hands-on production experience in modular component architecture, state management, and cross-browser testing.",
      ],
      tags: ["React.js", "Vue.js", "Chat Module", "State Management", "Cross-browser UI"],
    },
  ];

  const keyProjects = [
    {
      title: "CGMSC EMSA",
      subtitle: "State Medical Inventory Management Platform",
      roleBadge: "Project Owner",
      link: "https://cgmsc.gov.in/Emsa",
      linkText: "cgmsc.gov.in/Emsa ↗",
      description:
        "Spearheaded the end-to-end architecture and deployment of a full-stack platform serving government medical inventory and distribution operations statewide across Chhattisgarh.",
      metrics: [
        "Migrated legacy frontend to Next.js SSR, reducing initial load times by 45%",
        "Implemented strict Role-Based Access Control (RBAC) & audio alerts",
        "Handling massive state medical inventory workflows with high data integrity",
      ],
      tech: ["Next.js SSR", "Node.js", "SQL Server / MySQL", "RBAC", "GovTech"],
      gradient: "from-blue-600/20 via-cyan-500/10 to-transparent",
    },
    {
      title: "Earth Care Foundation",
      subtitle: "NGO Portal & PhonePe Payment Backend",
      roleBadge: "Lead Engineer",
      link: "https://theearthcarefoundation.org",
      linkText: "theearthcarefoundation.org ↗",
      description:
        "Engineered the complete web application and backend logic for student scholarship applications (Project Udaan 2.0) and public donations.",
      metrics: [
        "Integrated PhonePe payment gateway with automated transaction reconciliation",
        "Zero payment drop-offs caused by UI or checkout failures",
        "Streamlined digital application verification for scholarship beneficiaries",
      ],
      tech: ["React.js", "Node.js", "PhonePe API", "Express.js", "Tailwind CSS"],
      gradient: "from-emerald-600/20 via-teal-500/10 to-transparent",
    },
    {
      title: "FuelTrack Tech",
      subtitle: "Fleet & Fuel Management Dashboard",
      roleBadge: "Frontend Architect",
      link: "https://fueltrack.in",
      linkText: "fueltrack.in ↗",
      description:
        "Built data-heavy report tables and real-time responsive fleet monitoring interfaces for enterprise logistics and fuel consumption tracking.",
      metrics: [
        "Reduced redundant API traffic by 35% through query caching & SWR deduplication",
        "Interactive analytics and high-density telemetry reporting data grids",
        "Responsive, mobile-friendly dispatch management dashboard",
      ],
      tech: ["Next.js", "Tailwind CSS", "SWR", "Data Visualization", "REST APIs"],
      gradient: "from-purple-600/20 via-pink-500/10 to-transparent",
    },
    {
      title: "Zenzy Web",
      subtitle: "Modern Next.js Application",
      roleBadge: "Full Stack",
      link: "https://zenzy-web.vercel.app",
      linkText: "zenzy-web.vercel.app ↗",
      description:
        "A modern and responsive web application built with Next.js App Router, focusing on performance, scalability, and clean UI design.",
      metrics: [
        "App Router architecture with zero layout shift",
        "SEO-friendly pages with dynamic meta generation",
        "Clean, modular component structure and dark aesthetic",
      ],
      tech: ["Next.js", "Tailwind CSS", "Vercel", "TypeScript"],
      gradient: "from-cyan-600/20 via-blue-500/10 to-transparent",
    },
    {
      title: "Movementor",
      subtitle: "Fitness Web Application",
      roleBadge: "Creator",
      link: "https://movemetorformgym.netlify.app",
      linkText: "movemetorformgym.netlify.app ↗",
      description:
        "A fitness-focused web app designed to help gym users track workouts, plan routines, and stay consistent with progress visualization.",
      metrics: [
        "Interactive routine tracker with local persistence",
        "High-contrast mobile UI engineered for gym environments",
        "Fast-loading responsive interface with instant interaction feedback",
      ],
      tech: ["React.js", "Tailwind CSS", "Netlify", "JavaScript"],
      gradient: "from-rose-600/20 via-amber-500/10 to-transparent",
    },
    {
      title: "Aarcee Casting",
      subtitle: "Industrial Enterprise Platform",
      roleBadge: "Frontend Engineer",
      link: "https://www.aarceecasting.com",
      linkText: "aarceecasting.com ↗",
      description:
        "A professional industrial website developed for a casting manufacturing enterprise, focusing on technical credibility and client conversions.",
      metrics: [
        "Production-ready layout with responsive product catalogs",
        "Optimized asset delivery and fast mobile loading speed",
        "Custom industrial UI design matching corporate branding",
      ],
      tech: ["React.js", "Tailwind CSS", "Corporate Web", "SEO"],
      gradient: "from-amber-600/20 via-orange-500/10 to-transparent",
    },
  ];

  const skillCategories = [
    {
      title: "Languages",
      skills: ["JavaScript (ES6+)", "TypeScript", "SQL", "HTML5", "CSS3"],
    },
    {
      title: "Frontend Engineering",
      skills: ["React.js", "Next.js (App Router)", "Vue.js", "Redux Toolkit", "Tailwind CSS", "Responsive Design"],
    },
    {
      title: "Backend & Real-Time",
      skills: ["Node.js", "Express.js", "RESTful APIs", "WebRTC (TURN/STUN, ICE)", "Microservices"],
    },
    {
      title: "Databases & Caching",
      skills: ["MySQL", "SQL Server", "MongoDB", "Redis"],
    },
    {
      title: "Security & Authentication",
      skills: ["JWT", "Google OAuth2", "Role-Based Access (RBAC)", "Data Sanitization"],
    },
    {
      title: "DevOps, Cloud & Tooling",
      skills: ["AWS EC2", "Nginx", "PM2", "Docker", "CI/CD Pipelines", "Git & GitHub", "Linux (Ubuntu)", "Postman"],
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#050507] text-[#f4f4f5] selection:bg-white selection:text-black">
      {/* Background glow and grid overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[650px] h-[550px] rounded-full bg-gradient-to-br from-blue-600/15 via-cyan-500/10 to-transparent blur-[140px]" />
        <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-purple-600/15 via-pink-500/10 to-transparent blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-600/10 via-cyan-500/10 to-transparent blur-[130px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.35]" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#050507]/80 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <Logo size="md" />
          </a>

          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider text-neutral-400 font-medium">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#education" className="hover:text-white transition-colors">Education</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="/resume.pdf"
              download="Ansh_Sharma_Resume.pdf"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Resume PDF</span>
            </a>
            <a
              href="https://linkedin.com/in/ansh-sharma"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex px-3 py-1.5 rounded-full text-xs font-medium border border-white/[0.12] text-neutral-300 hover:text-white hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.06] transition-all items-center gap-1.5"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-24">
        {/* HERO SECTION */}
        <section id="about" className="flex flex-col items-start gap-6 max-w-3xl">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Open for Full Stack & Frontend Roles | Remote & On-site
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
            Architecting <span className="gradient-text-blue-cyan">real-time systems</span>, WebRTC platforms &{" "}
            <span className="gradient-text-purple-pink">scalable web apps</span>.
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed">
            I am <strong className="text-white">Ansh Sharma</strong> — a Full Stack Developer with proven expertise in engineering production-grade real-time systems and government web platforms. Experienced in architecting WebRTC video conferencing platforms, leading state-level digitization end-to-end, and crafting performant Next.js & Node.js architectures.
          </p>

          {/* Quick Contact Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-mono">
            <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.06]">
              📧 anshsharma7400@gmail.com
            </span>
            <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.06]">
              📱 +91 7400772171
            </span>
            <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.06]">
              📍 India
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="/resume.pdf"
              download="Ansh_Sharma_Resume.pdf"
              className="px-6 py-3 rounded-full text-sm font-semibold bg-white text-black hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Verified Resume
            </a>
            <a
              href="#experience"
              className="px-6 py-3 rounded-full text-sm font-medium border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/30 text-white transition-all"
            >
              View Work Experience
            </a>
            <a
              href="https://github.com/ansh23092002"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-full text-sm font-medium border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              GitHub ↗
            </a>
          </div>

          {/* Code Terminal */}
          <div className="w-full mt-4 rounded-xl border border-white/[0.1] bg-[#0c0d12]/90 backdrop-blur-xl p-5 shadow-2xl font-mono text-xs sm:text-sm text-neutral-300">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2 text-neutral-400 text-xs">ansh-sharma.ts</span>
              </div>
              <span className="text-[11px] text-cyan-400 font-mono">B.Tech CSE &apos;25 (CGPA: 8.10/10)</span>
            </div>
            <pre className="overflow-x-auto leading-relaxed">
              <code>
                <span className="text-purple-400">export const</span>{" "}
                <span className="text-cyan-300">developer</span> = &#123;{"\n"}
                {"  "}name: <span className="text-amber-300">&apos;Ansh Sharma&apos;</span>,{"\n"}
                {"  "}role: <span className="text-amber-300">&apos;Full Stack Developer&apos;</span>,{"\n"}
                {"  "}currentCompany: <span className="text-amber-300">&apos;Ailifebot&apos;</span>,{"\n"}
                {"  "}coreStack: [<span className="text-emerald-300">&apos;React.js&apos;</span>, <span className="text-emerald-300">&apos;Next.js&apos;</span>, <span className="text-emerald-300">&apos;Node.js&apos;</span>, <span className="text-emerald-300">&apos;WebRTC&apos;</span>],{"\n"}
                {"  "}stateDigitization: <span className="text-emerald-300">&apos;CGMSC EMSA (State Medical Platform)&apos;</span>,{"\n"}
                {"  "}education: <span className="text-neutral-400">&apos;Rungta College of Eng & Tech (CSVTU)&apos;</span>,{"\n"}
                {"  "}availableFor: [<span className="text-cyan-300">&apos;Full-time Roles&apos;</span>, <span className="text-cyan-300">&apos;High-Impact Freelance&apos;</span>]{"\n"}
                &#125;;
              </code>
            </pre>
          </div>
        </section>

        {/* WORK EXPERIENCE */}
        <section id="experience" className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono">Career Trajectory</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Work Experience</h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
              Proven hands-on engineering in fast-paced production environments, leading WebRTC real-time systems and scalable enterprise modules.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-white/[0.08] bg-[#0c0d12]/75 p-6 md:p-8 backdrop-blur-xl hover:border-white/20 transition-all flex flex-col gap-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <span>{exp.role}</span>
                      <span className="text-cyan-400 font-normal text-base">@ {exp.company}</span>
                    </h3>
                    <div className="text-xs text-neutral-400 mt-1 font-mono flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-neutral-300">
                        {exp.type}
                      </span>
                      <span>{exp.period}</span>
                    </div>
                  </div>
                  {idx === 0 && (
                    <span className="self-start sm:self-center px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      Current Role
                    </span>
                  )}
                </div>

                <ul className="flex flex-col gap-2.5 text-sm text-neutral-300 leading-relaxed list-disc list-inside">
                  {exp.highlights.map((point, pIdx) => (
                    <li key={pIdx} className="pl-1">
                      <span className="text-neutral-300">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] text-neutral-300 border border-white/[0.06]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* KEY PRODUCTION & FEATURED PROJECTS */}
        <section id="projects" className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-xs uppercase tracking-widest text-purple-400 font-mono">Shipped Systems & Products</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Featured Projects</h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
              High-impact solutions from state-level government systems and payment backends to real-time dashboards and responsive web apps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyProjects.map((proj, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0d12]/75 p-6 backdrop-blur-xl hover:border-white/25 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${proj.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                      {proj.roleBadge}
                    </span>
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-neutral-400 hover:text-white transition-colors"
                    >
                      {proj.linkText}
                    </a>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mt-1">
                    {proj.title}
                  </h3>
                  <div className="text-xs text-neutral-400 font-medium -mt-1">
                    {proj.subtitle}
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mt-2">
                    {proj.description}
                  </p>

                  <div className="flex flex-col gap-1.5 my-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    {proj.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="text-[11px] text-neutral-300 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">✓</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.tech.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-neutral-400 border border-white/[0.06]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-5 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors"
                  >
                    Open Live Deployment ↗
                  </a>
                  <span className="text-[10px] text-emerald-400 font-mono">Live</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TECHNICAL SKILLS MATRIX */}
        <section id="skills" className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-mono">Engineered Competencies</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Technical Skills</h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
              Comprehensive toolkit spanning modern frontend development, backend micro-endpoints, WebRTC streaming, databases, and automated cloud deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((cat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-[#0c0d12]/60 p-6 backdrop-blur-xl flex flex-col gap-4"
              >
                <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-mono text-neutral-300 border-b border-white/[0.06] pb-2">
                  {cat.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 border border-white/[0.06] transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EDUCATION & ACADEMIC CREDENTIALS */}
        <section id="education" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-mono">Credentials</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Education</h2>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d12]/75 p-6 md:p-8 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lg">
            <div className="flex flex-col gap-1.5">
              <div className="inline-block self-start text-xs font-mono px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                Bachelor of Technology (B.Tech)
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                Computer Science & Engineering
              </h3>
              <p className="text-sm text-neutral-300">
                Rungta College of Engineering & Technology (CSVTU)
              </p>
            </div>

            <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-white/[0.08] pt-4 sm:pt-0 sm:pl-8 gap-1">
              <div className="text-xs text-neutral-400 font-mono">Graduation: 2025</div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">
                CGPA: 8.10 / 10
              </div>
            </div>
          </div>
        </section>

        {/* DESIGN SYSTEM & AWESOME-DESIGN-MD INTEGRATION */}
        <section
          id="design-system"
          className="rounded-3xl border border-white/[0.12] bg-gradient-to-b from-[#101118] to-[#07070a] p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-gradient-to-bl from-blue-500/10 via-purple-500/10 to-transparent blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-mono">
              ⚡ awesome-design-md + Stitch MCP Connected
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Built with token-based design standards
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              This portfolio repository is integrated with <strong className="text-white">VoltAgent/awesome-design-md</strong> and <strong className="text-white">Google Stitch MCP</strong>. The styling, typography scale, spacing tokens, and component definitions are directly governed by the project-level <code className="text-cyan-300 bg-white/[0.06] px-1.5 py-0.5 rounded font-mono text-xs">DESIGN.md</code> file.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/[0.08] text-xs">
              <div>
                <div className="text-neutral-500 font-mono">Design Doc</div>
                <div className="text-white font-semibold mt-1">DESIGN.md in root</div>
              </div>
              <div>
                <div className="text-neutral-500 font-mono">Color System</div>
                <div className="text-white font-semibold mt-1">Stark Ink & Mesh</div>
              </div>
              <div>
                <div className="text-neutral-500 font-mono">Typography</div>
                <div className="text-white font-semibold mt-1">Geist Sans & Mono</div>
              </div>
              <div>
                <div className="text-neutral-500 font-mono">Agent MCP</div>
                <div className="text-white font-semibold mt-1">StitchMCP Active</div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT & HIRE ME */}
        <section id="contact" className="flex flex-col items-center text-center gap-6 py-8">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-mono">Direct Connection</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-xl">
            Let&apos;s build something remarkable.
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-lg">
            I am currently open for Full Stack & Frontend Developer roles, contracts, and freelance projects. Get in touch directly via email, phone, or LinkedIn.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={copyEmail}
              className="px-6 py-3 rounded-full text-sm font-semibold bg-white text-black hover:bg-neutral-200 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              {copied ? "✓ anshsharma7400@gmail.com Copied!" : "📋 Copy Email Address"}
            </button>
            <a
              href="mailto:anshsharma7400@gmail.com"
              className="px-6 py-3 rounded-full text-sm font-medium border border-white/20 bg-white/[0.04] hover:bg-white/[0.08] text-white transition-all flex items-center gap-2"
            >
              Send Direct Email ✉
            </a>
            <a
              href="/resume.pdf"
              download="Ansh_Sharma_Resume.pdf"
              className="px-6 py-3 rounded-full text-sm font-medium border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-all flex items-center gap-2"
            >
              Download Resume 📄
            </a>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-400 pt-4">
            <a href="tel:+917400772171" className="hover:text-white transition-colors">
              📞 +91 7400772171
            </a>
            <span>•</span>
            <a href="https://linkedin.com/in/ansh-sharma" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              LinkedIn
            </a>
            <span>•</span>
            <a href="https://github.com/ansh23092002" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#050507] py-10 text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Logo size="sm" />
            <p className="text-neutral-500">© {new Date().getFullYear()} Ansh Sharma. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="https://github.com/ansh23092002" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="https://linkedin.com/in/ansh-sharma" className="hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="https://cgmsc.gov.in/Emsa" className="hover:text-white transition-colors">
              CGMSC EMSA
            </a>
            <a href="https://zenzy-web.vercel.app" className="hover:text-white transition-colors">
              Zenzy Web
            </a>
            <a href="/resume.pdf" download="Ansh_Sharma_Resume.pdf" className="hover:text-white transition-colors">
              Resume
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
