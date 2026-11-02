import { CommandPalette, Cursor, Nav, ScrollProgress, Toaster } from "@/components/chrome";
import { Hero } from "@/components/hero";
import { About, Contact, Experience, Footer, Stack, Writing } from "@/components/sections";
import { Studio } from "@/components/studio";
import { Terminal } from "@/components/terminal";
import { Credentials, Work } from "@/components/work";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        <Stack />
        <Experience />
        <Work />
        <Studio />
        <Credentials />
        <Terminal />
        <Writing />
        <Contact />
      </main>
      <Footer />
      <CommandPalette />
      <Toaster />
      <Cursor />
      <div className="noise" aria-hidden />
    </>
  );
}
