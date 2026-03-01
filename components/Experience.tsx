'use client'

import { resume } from "../lib/data";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export function Experience() {
  return (
    <section id="experience" className="py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/5 text-accent text-xs font-black uppercase tracking-widest mb-4 border border-accent/10">
            Professional Journey
          </div>
          <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient">
            Experience.
          </h2>
        </motion.div>

        <div className="relative space-y-12">
          {/* Vertical Line - Shifted to left for cleaner single column look */}
          <div className="absolute left-0 top-4 bottom-4 w-px bg-border ml-2 sm:ml-0" />
          
          {resume.experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-10 sm:pl-16"
            >
              {/* Square on Timeline */}
              <div className="absolute left-0 top-2 h-3.5 w-3.5 rounded-sm border-2 border-background bg-accent ml-[1.5px] sm:-ml-[6.5px] rotate-45" />
              
              <div className="flex flex-col items-start p-8 rounded-3xl bg-white border border-border shadow-sm transition-shadow hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full mb-4 gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-foreground">
                      {exp.company}
                    </h3>
                    <p className="text-[15px] font-bold text-accent mt-0.5">
                      {exp.position}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-[11px] font-black text-muted uppercase tracking-widest border border-border shadow-xs whitespace-nowrap h-fit">
                    <Calendar size={12} className="text-accent" />
                    {exp.period}
                  </div>
                </div>
                
                <p className="mb-6 text-[16px] text-muted leading-relaxed font-medium">
                  {exp.description}
                </p>

                <ul className="space-y-4 w-full pl-3 border-l border-border/40 ml-1 mt-6">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3 text-[15px] text-foreground/90 leading-relaxed font-medium group/hl">
                      <div className="mt-2 h-1.5 w-1.5 rounded-sm bg-accent/30 group-hover/hl:bg-accent shrink-0 rotate-45 transition-all" />
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlight.replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong class="text-foreground font-black bg-accent/5 px-1 rounded-sm">$1</strong>'
                          ),
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
