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
    <section className="py-24 sm:py-32 bg-black/[0.01]">
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
          <div className="mt-4 h-1 w-12 bg-black/[0.05]" />
        </motion.div>
        
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((skillGroup, idx) => (
            <motion.div
              key={skillGroup.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-start"
            >
              <h3 className="text-[11px] font-bold text-accent uppercase tracking-[0.3em] mb-8">
                {skillGroup.name}
              </h3>
              
              <div className="flex flex-col gap-3 w-full">
                {skillGroup.keywords.map((keyword) => (
                  <div
                    key={keyword}
                    className="group flex items-center justify-between py-2 border-b border-black/[0.03] last:border-0"
                  >
                    <span className="text-[13px] font-bold text-foreground/70 group-hover:text-accent transition-colors">
                      {keyword}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
