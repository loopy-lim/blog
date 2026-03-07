'use client'

import { resume } from "../lib/data";
import { motion } from "framer-motion";

export function KeyAchievements() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Achievements
          </h2>
          <div className="mt-4 h-1 w-12 bg-foreground/10" />
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-3">
          {resume.keyAchievements.map((achievement, idx) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group relative flex flex-col p-8 rounded-xl border border-border/50 bg-white/40 backdrop-blur-sm transition-all hover:bg-white hover:border-foreground/10"
            >
              <div className="mb-8 flex flex-col gap-1">
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  {achievement.title}
                </h3>
                <p className="text-[12px] font-bold text-muted/40 uppercase tracking-[0.2em]">
                  {achievement.tool}
                </p>
              </div>

              <div className="mb-8 flex items-baseline gap-3">
                <span className="text-[14px] font-medium text-muted/60">{achievement.before}</span>
                <span className="text-foreground/20">→</span>
                <span className="text-[24px] font-bold text-foreground tabular-nums tracking-tight">
                  {achievement.after}
                </span>
              </div>

              <p className="text-[15px] text-muted leading-relaxed font-medium">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
