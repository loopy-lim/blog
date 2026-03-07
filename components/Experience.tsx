'use client'

import { resume } from "../lib/data";
import { motion } from "framer-motion";

export function Experience() {
  return (
    <section id="experience" className="py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Experience
          </h2>
          <div className="mt-4 h-1 w-12 bg-accent" />
        </motion.div>

        <div className="relative space-y-12">
          {/* Subtle Vertical Line */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-border/40 ml-1" />
          
          {resume.experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-10 group"
            >
              {/* Point on Timeline - Static Signature Blue */}
              <div className="absolute left-[-4.5px] top-2 h-2.5 w-2.5 rounded-full bg-accent border-2 border-background shadow-sm" />
              
              <div className="relative flex flex-col items-start p-8 rounded-xl border border-border/50 bg-white/40 backdrop-blur-sm transition-all hover:border-foreground/10 hover:bg-white/60">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between w-full mb-4 gap-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-foreground tracking-tight">
                      {exp.company}
                    </h3>
                    <p className="text-[14px] font-bold text-accent tracking-wide uppercase">
                      {exp.position}
                    </p>
                  </div>
                  <div className="text-[12px] font-medium text-muted/60 tabular-nums">
                    {exp.period}
                  </div>
                </div>
                
                <p className="mb-8 text-[15px] text-muted leading-relaxed font-medium">
                  {exp.description}
                </p>

                <ul className="space-y-4 w-full">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-4 text-[14px] text-foreground/70 leading-relaxed font-medium">
                      <div className="mt-2.5 h-1 w-1 bg-accent/30 shrink-0" />
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlight.replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong class="text-foreground font-bold">$1</strong>'
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
