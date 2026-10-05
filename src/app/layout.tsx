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
      <body className="min-h-full flex flex-col bg-[#050507] text-[#f4f4f5]">
        {children}
      </body>
    </html>
  );
}
