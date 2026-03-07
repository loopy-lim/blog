"use client"

import Link from "next/link";
import { resume } from "@/lib/data";
import { Github, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 sm:px-6 py-20">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container relative z-10 mx-auto max-w-5xl"
      >
        <div className="mx-auto flex flex-col items-center text-center">
          
          {/* Label/Role */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-accent/5 text-accent text-[12px] font-bold uppercase tracking-[0.2em] border border-accent/10">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {resume.basics.label}
            </span>
          </motion.div>
          
          {/* Name/Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-6xl xs:text-7xl font-black tracking-tight text-foreground sm:text-9xl leading-[0.85] mb-10"
          >
            {resume.basics.name}
          </motion.h1>

          {/* Summary */}
          <motion.p 
            variants={itemVariants}
            className="mx-auto max-w-xl text-lg sm:text-xl leading-relaxed font-medium text-muted mb-12 px-6 py-3 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/40 shadow-sm shadow-black/[0.01]"
          >
            {resume.basics.shortSummary}
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full"
          >
            <Link
              href={resume.basics.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center rounded-2xl bg-foreground text-background px-10 py-4 text-sm font-black transition-all hover:bg-accent hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/5"
            >
              <Github size={18} className="mr-2.5" />
              <span>GitHub</span>
            </Link>

            <Link
              href="/blog"
              className="group inline-flex items-center justify-center rounded-2xl bg-white border border-border px-10 py-4 text-sm font-black text-foreground transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-black/[0.02]"
            >
              <FileText size={18} className="mr-2.5 text-accent" />
              포스트 읽기
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-black text-muted hover:text-accent transition-colors group"
            >
              About Me
              <ArrowRight size={16} className="ml-2.5 opacity-50 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <div className="w-px h-12 bg-gradient-to-b from-accent/50 to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-muted">Scroll</span>
      </motion.div>
    </section>
  );
}
