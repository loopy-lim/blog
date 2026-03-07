'use client'

import Link from "next/link";
import { resume } from "@/lib/data";
import { motion } from "framer-motion";
import { ExternalLink, Building2, Rocket } from "lucide-react";

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
            Selected Work
          </div>
          <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient">
            Case Studies.
          </h2>
        </motion.div>

        <div className="space-y-16">
          {resume.caseStudies.map((study, index) => (
            <motion.div
              key={study.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative rounded-3xl border border-border bg-gray-50/20 p-8 sm:p-12 overflow-hidden transition-all duration-500 hover:bg-white hover:shadow-xl"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white shadow-xs text-accent border border-border shrink-0">
                    {study.company ? <Building2 size={22} /> : <Rocket size={22} />}
                  </div>
                  <div>
                    {study.company && (
                      <p className="text-[11px] font-bold text-accent uppercase tracking-widest mb-1">
                        {study.company}
                      </p>
                    )}
                    <h3 className="text-2xl font-black text-foreground tracking-tight group-hover:text-accent transition-colors duration-300">
                      {study.name}
                    </h3>
                    <p className="text-[13px] font-bold text-muted uppercase tracking-widest mt-1">
                      {study.period} · {study.role}
                    </p>
                  </div>
                </div>

                {/* Summary Badge */}
                <div className="shrink-0 px-4 py-2 rounded-xl bg-accent/5 border border-accent/10 text-sm font-bold text-accent">
                  {study.summary}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-8">
                <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em] mb-3 opacity-40">Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {study.tech.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center rounded-xl bg-white px-3 py-1.5 text-[12px] font-bold text-foreground border border-border shadow-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Problem & Solution */}
                <div className="space-y-6">
                  {study.problem && (
                    <div>
                      <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-2">Problem</h4>
                      <p className="text-[14px] text-foreground/90 leading-relaxed font-medium">
                        {study.problem}
                      </p>
                    </div>
                  )}

                  {study.approach && study.approach.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">Approach</h4>
                      <ul className="space-y-2">
                        {study.approach.map((item, i) => (
                          <li key={i} className="text-[14px] text-foreground/90 leading-relaxed font-medium pl-3 border-l border-border/40">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {study.solution && study.solution.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-2">Solution</h4>
                      <ul className="space-y-2">
                        {study.solution.map((item, i) => (
                          <li key={i} className="text-[14px] text-foreground/90 leading-relaxed font-medium pl-3 border-l border-border/40">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Results */}
                <div className="p-6 rounded-2xl bg-white border border-border shadow-xs">
                  <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-6">Results</h4>

                  <div className="space-y-4">
                    {study.results.map((result, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                        <span className="text-[13px] font-bold text-muted uppercase tracking-wider">
                          {result.label}
                        </span>
                        <div className="flex items-center gap-2">
                          {'before' in result && result.before && (
                            <>
                              <span className="text-[13px] text-muted">{result.before}</span>
                              <span className="text-accent">→</span>
                            </>
                          )}
                          <span className="text-[15px] font-black text-foreground">
                            {'after' in result ? result.after : result.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {study.learnings && (
                    <div className="mt-6 pt-6 border-t border-border/40">
                      <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em] mb-2 opacity-40">Learnings</h4>
                      <p className="text-[13px] text-foreground/80 leading-relaxed italic">
                        &quot;{study.learnings}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Links */}
              {study.links && (
                <div className="mt-8 flex gap-4">
                  {study.links.demo && (
                    <Link
                      href={study.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-black transition-all hover:bg-accent hover:scale-105 active:scale-95"
                    >
                      <ExternalLink size={16} />
                      Demo
                    </Link>
                  )}
                  {study.links.blog && (
                    <Link
                      href={study.links.blog}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-border text-foreground text-sm font-black transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 shadow-xs"
                    >
                      <ExternalLink size={16} />
                      Blog
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
