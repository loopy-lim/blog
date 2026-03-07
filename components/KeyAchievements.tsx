'use client'

import { resume } from "../lib/data";
import { motion } from "framer-motion";

export function KeyAchievements() {
  return (
    <section className="py-24 sm:py-32 border-y border-border/40 bg-black/[0.01]">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Impact
          </h2>
          <div className="mt-4 h-1 w-12 bg-accent" />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3">
          {resume.keyAchievements.map((achievement, idx) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group relative flex flex-col p-8 rounded-2xl border border-border/50 bg-white shadow-sm transition-all hover:border-accent/40"
            >
              <div className="mb-10 flex flex-col gap-1">
                <p className="text-[11px] font-bold text-accent uppercase tracking-[0.2em] mb-2">
                  {achievement.tool}
                </p>
                <h3 className="text-xl font-bold text-foreground tracking-tight break-keep">
                  {achievement.title}
                </h3>
              </div>

              <div className="mb-10 flex items-baseline gap-3">
                <span className="text-[14px] font-medium text-muted/40 line-through decoration-muted/20">{achievement.before}</span>
                <span className="text-accent/20">→</span>
                <span className="text-[32px] font-bold text-foreground tabular-nums tracking-tighter">
                  {achievement.after}
                </span>
              </div>

              <p className="text-[14px] text-muted leading-relaxed font-medium break-keep">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
