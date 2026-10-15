import type { Metadata } from "next";
import { Nav } from "@/components/site/nav";
import { About, Contact, Experience, Footer } from "@/components/site/sections";

export const metadata: Metadata = {
  title: "About — Ansh Sharma",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <About />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
