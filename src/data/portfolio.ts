export const profile = {
  name: "Ansh Sharma",
  role: "Full Stack Developer",
  email: "anshsharma7400@gmail.com",
  phone: "+91 7400772171",
  phoneHref: "tel:+917400772171",
  location: "India",
  timeZone: "Asia/Kolkata",
  github: "https://github.com/ansh23092002",
  linkedin: "https://linkedin.com/in/ansh-sharma",
  resume: "/resume.pdf",
  resumeFileName: "Ansh_Sharma_Resume.pdf",
};

export const navLinks = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export const stats = [
  { value: 45, suffix: "%", label: "Faster load on the CGMSC government platform", tone: "accent" },
  { value: 35, suffix: "%", label: "Less API traffic on FuelTrack via SWR caching", tone: "ink" },
  { value: 7, suffix: "", label: "Products shipped to production", tone: "soft" },
  { value: 2, suffix: "+", label: "Years of full-time experience", tone: "plain" },
] as const;

export const experiences = [
  {
    role: "Full Stack Developer",
    company: "Ailifebot",
    summary: "End-to-end products, secure APIs, fast dashboards and Loop-in, an in-house video conferencing app.",
    period: "Sep 2025 — Present",
    type: "Full-time",
    current: true,
    highlights: [
      "Built secure REST micro-endpoints with role-based token authorization (RBAC) for enterprise clients.",
      "Cut manual release overhead by 40% with an automated CI/CD pipeline to AWS EC2 behind an Nginx reverse proxy and PM2.",
      "Improved load time by 30% across 5+ production dashboard modules through code splitting, memoization and dynamic imports.",
      "Developed Loop-in, an in-house video conferencing product, including Google OAuth2/JWT authentication.",
    ],
    tags: ["Next.js", "Node.js", "RBAC", "AWS EC2", "Nginx", "PM2", "CI/CD"],
  },
  {
    role: "Frontend Developer",
    company: "Inext Software Solutions",
    summary: "Built a shared UI library and Next.js clients for enterprise dashboards.",
    period: "Aug 2024 — Aug 2025",
    type: "Full-time",
    current: false,
    highlights: [
      "Accelerated sprint delivery by 25% by engineering a shared UI component library adopted across internal enterprise dashboards.",
      "Integrated high-throughput Node.js/Express APIs with React and Next.js clients for low-latency business workflows.",
      "Partnered with product and design to standardise UI consistency across responsive viewports.",
    ],
    tags: ["React.js", "Next.js", "REST APIs", "Tailwind CSS", "Design Systems"],
  },
  {
    role: "Frontend Developer Intern",
    company: "Xtention Crew Technologies",
    summary: "Worked on real-world projects, including a real-time chat module in React and Vue.",
    period: "Oct 2023 — Mar 2024",
    type: "Internship",
    current: false,
    highlights: [
      "Built an interactive real-time chat module in React.js and Vue.js with live presence and message updates.",
      "Gained production experience in modular component architecture, state management and cross-browser testing.",
    ],
    tags: ["React.js", "Vue.js", "State Management"],
  },
];

export const projects = [
  {
    title: "CGMSC EMSA",
    category: "GovTech · Govt. of Chhattisgarh",
    image: "/projects/cgmsc-emsa.webp",
    featured: true,
    subtitle: "State medical equipment & inventory platform",
    role: "Project Owner",
    year: "2025",
    link: "https://cgmsc.gov.in/Emsa",
    domain: "cgmsc.gov.in",
    description:
      "End-to-end architecture and deployment of a full-stack platform running government medical inventory and distribution operations across Chhattisgarh.",
    metrics: [
      "Migrated legacy frontend to Next.js SSR — 45% faster initial load",
      "Strict role-based access control with audio alerts",
      "State-scale inventory workflows with high data integrity",
    ],
    tech: ["Next.js", "Node.js", "SQL Server", "MySQL", "RBAC"],
  },
  {
    title: "Earth Care Foundation",
    category: "Non-profit · Payments",
    image: "/projects/earth-care.webp",
    featured: false,
    subtitle: "NGO portal & payments backend",
    role: "Lead Engineer",
    year: "2025",
    link: "https://theearthcarefoundation.org",
    domain: "theearthcarefoundation.org",
    description:
      "The complete web application and backend for student scholarship applications (Project Udaan 2.0) and public donations.",
    metrics: [
      "PhonePe gateway with automated transaction reconciliation",
      "Zero payment drop-offs caused by checkout failures",
      "Streamlined digital verification for scholarship applicants",
    ],
    tech: ["React.js", "Node.js", "Express.js", "PhonePe API"],
  },
  {
    title: "Jai Matadi Constructions",
    category: "Infrastructure · PWD-empanelled",
    image: "/projects/jai-mata-di.webp",
    featured: false,
    subtitle: "Construction & infrastructure company website",
    role: "Full Stack",
    year: "2025",
    link: "https://www.jaimatadiconstruction.in",
    domain: "jaimatadiconstruction.in",
    description:
      "The web presence for a PWD-empanelled construction firm working on buildings, roads and RMC supply across Chhattisgarh, Odisha and Jharkhand.",
    metrics: [
      "Service, fleet and project showcase for 50+ projects",
      "Search-optimised metadata for local and B2B discovery",
      "Quote-request flow for enterprise and government clients",
    ],
    tech: ["Next.js", "SEO", "Responsive UI"],
  },
  {
    title: "FuelTrack",
    category: "Logistics SaaS",
    image: "/projects/fueltrack.webp",
    imageFocus: "78% 0%",
    featured: false,
    subtitle: "Fleet & fuel management dashboard",
    role: "Frontend Architect",
    year: "2024",
    link: "https://fueltrack.in",
    domain: "fueltrack.in",
    description:
      "Data-heavy reporting tables and real-time fleet monitoring interfaces for enterprise logistics and fuel consumption tracking.",
    metrics: [
      "35% less redundant API traffic via SWR caching & deduplication",
      "High-density telemetry grids and interactive analytics",
      "Mobile-ready dispatch management",
    ],
    tech: ["Next.js", "SWR", "Tailwind CSS", "REST APIs"],
  },
  {
    title: "Zenzy Web",
    category: "Gaming · Web app",
    image: "/projects/zenzy.jpg",
    featured: false,
    subtitle: "Immersive gaming landing experience",
    role: "Full Stack",
    year: "2024",
    link: "https://zenzy-web.vercel.app",
    domain: "zenzy-web.vercel.app",
    description:
      "A cinematic, video-led landing experience for a gaming platform, built on the Next.js App Router for performance and a bold, clean interface.",
    metrics: [
      "App Router architecture with zero layout shift",
      "SEO-friendly pages with dynamic metadata",
      "Modular component structure",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
  },
  {
    title: "Aarcee Casting",
    category: "Manufacturing",
    image: "/projects/aarcee-casting.webp",
    featured: false,
    subtitle: "Industrial enterprise website",
    role: "Frontend Engineer",
    year: "2023",
    link: "https://www.aarceecasting.com",
    domain: "aarceecasting.com",
    description:
      "A professional website for a casting manufacturer, focused on technical credibility and client conversion.",
    metrics: [
      "Responsive product catalogues",
      "Optimised asset delivery for fast mobile loads",
      "Custom UI aligned with corporate branding",
    ],
    tech: ["React.js", "Tailwind CSS", "SEO"],
  },

];

export const skillCategories = ["Languages", "Frontend", "Backend", "Database", "Security", "DevOps"] as const;

export type SkillCategory = (typeof skillCategories)[number];

export type SkillElement = {
  n: number;
  name: string;
  category: SkillCategory;
  note: string;
  /** Position in the desktop periodic layout (1-based column / row). */
  col: number;
  row: number;
};

export const skillElements: SkillElement[] = [
  { n: 1, name: "JavaScript", category: "Languages", note: "ES6+ — the core of every product I ship.", col: 1, row: 1 },
  { n: 2, name: "TypeScript", category: "Languages", note: "Typed, safer codebases that scale with the team.", col: 1, row: 2 },
  { n: 3, name: "SQL", category: "Languages", note: "Queries, joins and reporting for data-heavy apps.", col: 2, row: 2 },
  { n: 4, name: "HTML5", category: "Languages", note: "Semantic, accessible markup.", col: 1, row: 3 },
  { n: 5, name: "CSS3", category: "Languages", note: "Layouts, motion and responsive design.", col: 2, row: 3 },
  { n: 6, name: "React.js", category: "Frontend", note: "Component-driven interfaces and shared UI libraries.", col: 4, row: 2 },
  { n: 7, name: "Next.js", category: "Frontend", note: "App Router, SSR and SEO-ready production apps.", col: 5, row: 2 },
  { n: 8, name: "Vue.js", category: "Frontend", note: "Real-time chat module during my internship.", col: 6, row: 2 },
  { n: 9, name: "Redux Toolkit", category: "Frontend", note: "Predictable state for complex dashboards.", col: 4, row: 3 },
  { n: 10, name: "Tailwind CSS", category: "Frontend", note: "Fast, consistent, token-based styling.", col: 5, row: 3 },
  { n: 11, name: "SWR", category: "Frontend", note: "Caching and request deduplication — 35% less API traffic.", col: 6, row: 3 },
  { n: 12, name: "SEO", category: "Frontend", note: "Metadata and performance that help sites get found.", col: 9, row: 1 },
  { n: 13, name: "Node.js", category: "Backend", note: "APIs and services behind every full-stack build.", col: 7, row: 2 },
  { n: 14, name: "Express.js", category: "Backend", note: "Lean REST services and middleware.", col: 8, row: 2 },
  { n: 15, name: "REST APIs", category: "Backend", note: "Clean, versioned endpoints for web and mobile clients.", col: 9, row: 2 },
  { n: 16, name: "PhonePe API", category: "Backend", note: "Payment gateway with automated reconciliation.", col: 7, row: 3 },
  { n: 17, name: "WebRTC", category: "Backend", note: "Video conferencing with TURN/STUN relays.", col: 8, row: 3 },
  { n: 18, name: "Microservices", category: "Backend", note: "Small, focused services that deploy independently.", col: 9, row: 3 },
  { n: 19, name: "MySQL", category: "Database", note: "Relational data for government and business apps.", col: 1, row: 4 },
  { n: 20, name: "SQL Server", category: "Database", note: "State-scale inventory data with high integrity.", col: 2, row: 4 },
  { n: 21, name: "MongoDB", category: "Database", note: "Flexible document storage.", col: 3, row: 4 },
  { n: 22, name: "Redis", category: "Database", note: "Caching and fast session storage.", col: 4, row: 4 },
  { n: 23, name: "JWT", category: "Security", note: "Stateless, token-based authentication.", col: 5, row: 4 },
  { n: 24, name: "Google OAuth2", category: "Security", note: "Secure single sign-on.", col: 6, row: 4 },
  { n: 25, name: "RBAC", category: "Security", note: "Role-based access for enterprise and government users.", col: 7, row: 4 },
  { n: 26, name: "AWS EC2", category: "DevOps", note: "Production hosting for Node.js services.", col: 8, row: 4 },
  { n: 27, name: "Nginx", category: "DevOps", note: "Reverse proxy, TLS and load handling.", col: 9, row: 4 },
  { n: 28, name: "PM2", category: "DevOps", note: "Process management with zero-downtime reloads.", col: 3, row: 5 },
  { n: 29, name: "Docker", category: "DevOps", note: "Reproducible builds and environments.", col: 4, row: 5 },
  { n: 30, name: "CI/CD", category: "DevOps", note: "Automated pipelines — 40% less release overhead.", col: 5, row: 5 },
  { n: 31, name: "Git", category: "DevOps", note: "Branching, reviews and clean history.", col: 6, row: 5 },
  { n: 32, name: "Linux", category: "DevOps", note: "Ubuntu servers and shell tooling.", col: 7, row: 5 },
];

export const marqueeSkills = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Express.js",
  "SQL Server",
  "Tailwind CSS",
  "MySQL",
  "MongoDB",
  "Redis",
  "AWS EC2",
  "Docker",
  "Nginx",
  "CI/CD",
];

export const education = {
  degree: "B.Tech, Computer Science & Engineering",
  school: "Rungta College of Engineering & Technology (CSVTU)",
  year: "2025",
  grade: "CGPA 8.10 / 10",
};
