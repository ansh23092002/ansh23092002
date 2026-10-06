import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ansh Sharma — Full Stack Developer | React.js · Next.js · Node.js · WebRTC",
  description:
    "Portfolio of Ansh Sharma, Full Stack Developer experienced in production real-time WebRTC systems, state-level government platforms, and scalable Next.js applications.",
  keywords: [
    "Ansh Sharma",
    "Full Stack Developer",
    "Frontend Developer",
    "Next.js Developer",
    "React Developer",
    "WebRTC",
    "Node.js",
    "Rungta College",
  ],
  authors: [{ name: "Ansh Sharma" }],
  openGraph: {
    title: "Ansh Sharma — Full Stack Developer",
    description:
      "Architecting production-grade real-time systems, government web platforms, and Next.js applications.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050507] text-[#f4f4f5] relative selection:bg-white selection:text-black">
        {/* Ambient background glow and grid overlay from hero section */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[20%] w-[650px] h-[550px] rounded-full bg-gradient-to-br from-blue-600/15 via-cyan-500/10 to-transparent blur-[140px]" />
          <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-purple-600/15 via-pink-500/10 to-transparent blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-600/10 via-cyan-500/10 to-transparent blur-[130px]" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.35]" />
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
