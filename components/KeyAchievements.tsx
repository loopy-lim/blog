'use client'

import { resume } from "../lib/data";
import { motion } from "framer-motion";
import { TrendingUp, Zap, Cpu } from "lucide-react";

const icons = [TrendingUp, Zap, Cpu];

export function KeyAchievements() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/5 text-accent text-xs font-black uppercase tracking-widest mb-4 border border-accent/10">
            Key Results
          </div>
          <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient">
            Achievements.
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3">
          {resume.keyAchievements.map((achievement, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group relative rounded-3xl border border-border bg-gray-50/30 p-8 transition-colors hover:bg-white"
              >
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-accent shadow-xs border border-border group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  <Icon size={18} />
                </div>

                <h3 className="mb-3 text-lg font-black text-foreground">
                  {achievement.title}
                </h3>

                <div className="mb-4 flex items-center gap-2 text-sm">
                  <span className="text-muted">{achievement.before}</span>
                  <span className="text-accent">→</span>
                  <span className="font-black text-accent">{achievement.after}</span>
                </div>

                <p className="text-[13px] text-muted leading-relaxed">
                  {achievement.description}
                </p>

                <div className="mt-4 text-[10px] font-bold text-muted/60 uppercase tracking-widest">
                  {achievement.tool}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
