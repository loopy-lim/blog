'use client'

import Link from "next/link";
import { resume } from "@/lib/data";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function Projects() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Selected Work
          </h2>
          <div className="mt-4 h-1 w-12 bg-accent" />
        </motion.div>

        <div className="space-y-12">
          {resume.caseStudies.map((study, index) => (
            <motion.div
              key={study.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative rounded-2xl border border-border/60 bg-white/40 backdrop-blur-sm p-8 sm:p-12 transition-all duration-500 hover:border-foreground/10 hover:bg-white/60"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-6 mb-12">
                <div className="flex flex-col gap-2">
                  {study.company && (
                    <p className="text-[11px] font-bold text-accent uppercase tracking-[0.2em]">
                      {study.company}
                    </p>
                  )}
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight transition-opacity group-hover:opacity-80">
                    {study.name}
                  </h3>
                  <p className="text-[13px] font-medium text-muted/80 uppercase tracking-widest mt-1">
                    {study.period} · {study.role}
                  </p>
                </div>

                <div className="shrink-0 px-4 py-1.5 rounded-full border border-border text-[12px] font-semibold text-muted/80 tracking-wide">
                  {study.summary}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-12 flex flex-wrap gap-2">
                {study.tech.map((keyword) => (
                  <span
                    key={keyword}
                    className="text-[11px] font-bold text-accent/60 uppercase tracking-wider px-2 py-1 bg-accent/[0.03] rounded-md border border-accent/10"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              {/* Content Grid */}
              <div className="grid gap-12 lg:grid-cols-2 border-t border-border/40 pt-12">
                <div className="space-y-10">
                  {study.problem && (
                    <div>
                      <h4 className="text-[10px] font-bold text-accent/40 uppercase tracking-[0.2em] mb-4">Problem</h4>
                      <p className="text-[15px] text-foreground/80 leading-relaxed font-medium max-w-prose word-keep-all">
                        {study.problem}
                      </p>
                    </div>
                  )}

                  {(study.approach || study.solution) && (
                    <div>
                      <h4 className="text-[10px] font-bold text-accent/40 uppercase tracking-[0.2em] mb-4">Implementation</h4>
                      <ul className="space-y-4">
                        {[...(study.approach || []), ...(study.solution || [])].slice(0, 4).map((item, i) => (
                          <li key={i} className="text-[14px] text-foreground/70 leading-relaxed font-medium pl-4 border-l border-accent/20 word-keep-all">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-8">
                  <div className="p-8 rounded-xl bg-black/[0.02] border border-black/[0.03]">
                    <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-8">Results</h4>
                    <div className="space-y-6">
                      {study.results.map((result, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                          <span className="text-[12px] font-bold text-muted/60 uppercase tracking-wider">
                            {result.label}
                          </span>
                          <span className="text-[16px] font-bold text-accent tabular-nums tracking-tight">
                            {'after' in result ? result.after : result.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  {study.links && (
                    <div className="flex gap-3 mt-auto pt-4">
                      {study.links.demo && (
                        <Link
                          href={study.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-white text-[13px] font-bold transition-all hover:brightness-110 active:scale-[0.98]"
                        >
                          View Project <ArrowUpRight size={14} />
                        </Link>
                      )}
                      {study.links.blog && (
                        <Link
                          href={study.links.blog}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-accent/20 text-accent text-[13px] font-bold transition-all hover:bg-accent/[0.03]"
                        >
                          Case Study
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
