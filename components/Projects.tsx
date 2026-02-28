'use client'

import Link from "next/link";
import { resume } from "@/lib/data";
import { motion } from "framer-motion";
import { Github, ExternalLink, Rocket, Star } from "lucide-react";

export function Projects() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/5 text-accent text-xs font-black uppercase tracking-widest mb-4 border border-accent/10">
            Builds & Creations
          </div>
          <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient">
            Projects.
          </h2>
        </motion.div>

        <div className="grid gap-12">
          {resume.projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative rounded-3xl border border-border bg-gray-50/20 p-8 sm:p-12 overflow-hidden transition-all duration-500 hover:bg-white hover:shadow-xl"
            >
              {/* Background Decor */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-[4rem] rotate-45 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-white shadow-xs text-accent border border-border">
                      <Rocket size={22} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-foreground tracking-tight group-hover:text-accent transition-colors duration-300">
                        {project.name}
                      </h3>
                      <p className="text-[13px] font-bold text-muted uppercase tracking-widest">
                        {project.period}
                      </p>
                    </div>
                  </div>

                  <p className="text-lg text-muted font-medium mb-10 leading-relaxed max-w-2xl">
                    {project.description}
                  </p>

                  <div className="mb-10">
                    <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em] mb-4 opacity-40">Stack</h4>
                    <div className="flex flex-wrap gap-2">
                       {project.tech.map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center rounded-xl bg-white px-3 py-1.5 text-[12px] font-bold text-foreground border border-border shadow-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {project.links?.github && (
                       <Link
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background text-sm font-black transition-all hover:bg-accent hover:scale-105 active:scale-95"
                      >
                        <Github size={18} />
                        View Source
                      </Link>
                    )}
                    {project.links?.demo && (
                      <Link
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-border text-foreground text-sm font-black transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 shadow-xs"
                      >
                         <ExternalLink size={18} />
                         Live Demo
                      </Link>
                    )}
                  </div>
                </div>

                <div className="lg:w-1/3 flex flex-col gap-6">
                  <div className="p-8 rounded-3xl bg-white border border-border shadow-xs hover:shadow-md transition-shadow duration-500">
                    <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                      <Star size={12} fill="currentColor" /> Highlights
                    </h4>
                    <ul className="space-y-5 pl-3 border-l border-border/40 ml-1">
                      {project.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-3 text-[14px] text-foreground/90 leading-relaxed font-medium group/hl">
                          <div className="mt-2 h-1.5 w-1.5 rounded-sm bg-accent/30 group-hover/hl:bg-accent shrink-0 rotate-45 transition-all" />
                          <span dangerouslySetInnerHTML={{ __html: highlight.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-foreground">$1</strong>') }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
