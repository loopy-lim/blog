'use client'

import { resume } from "../lib/data";
import { motion } from "framer-motion";

export function Skills() {
  const skillCategories = [
    { name: "Main", keywords: resume.skills.main },
    { name: "Experienced", keywords: resume.skills.experienced },
    { name: "Tooling", keywords: resume.skills.tooling },
    { name: "Deploy", keywords: resume.skills.deploy },
  ];

  return (
    <section className="py-24 sm:py-32 border-y border-border/40">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Expertise
          </h2>
          <div className="mt-4 h-1 w-12 bg-foreground/10" />
        </motion.div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((skillGroup, idx) => (
            <motion.div
              key={skillGroup.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-start"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
                <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-[0.2em]">
                  {skillGroup.name}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {skillGroup.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center rounded px-2.5 py-1 text-[12px] font-bold text-muted border border-border/50 bg-black/[0.01] hover:bg-black/[0.03] transition-colors"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
