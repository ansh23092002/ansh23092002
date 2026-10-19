import type { Metadata, Viewport } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/site/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ansh Sharma — Full Stack Developer",
  description:
    "Portfolio of Ansh Sharma, a full stack developer who led CGMSC EMSA, a state-wide government platform, and builds secure, fast Next.js and Node.js products.",
  keywords: [
    "Ansh Sharma",
    "Full Stack Developer",
    "Frontend Developer",
    "Next.js Developer",
    "React Developer",
    "WebRTC",
    "Node.js",
  ],
  authors: [{ name: "Ansh Sharma" }],
  openGraph: {
    title: "Ansh Sharma — Full Stack Developer",
    description: "Building digital platforms for government and enterprise.",
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

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} antialiased`}>
      <body className="min-h-screen bg-bg text-fg">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
