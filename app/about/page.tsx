import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
    </main>
  );
}
