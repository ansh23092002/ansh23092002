import fs from "node:fs";
import path from "node:path";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Splash } from "@/components/site/splash";
import { Work } from "@/components/site/work";
import { About, Contact, Experience, Footer, Skills } from "@/components/site/sections";

// Drop a portrait into public/ as me.png (or .jpg/.webp) and it becomes the hero watermark.
const PHOTO_FILES = ["me.png", "me.jpg", "me.jpeg", "me.webp"];

export default function Home() {
  const found = PHOTO_FILES.find((f) => fs.existsSync(path.join(process.cwd(), "public", f)));
  const photo = found ? `/${found}` : undefined;

  return (
    <>
      <Splash />
      <Nav />
      <main>
        <Hero photo={photo} />
        <About />
        <Experience />
        <Work />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
