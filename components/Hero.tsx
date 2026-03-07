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
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-20">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container relative z-10 mx-auto max-w-5xl"
      >
        <div className="mx-auto flex flex-col items-center text-center">
          
          {/* Label/Role - Subtle Signature Accent */}
          <motion.div variants={itemVariants} className="mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent/[0.03] text-accent text-[11px] font-bold uppercase tracking-[0.2em] border border-accent/10">
              {resume.basics.label}
            </span>
          </motion.div>
          
          {/* Name/Title - Bold Grayscale */}
          <motion.h1 
            variants={itemVariants}
            className="text-6xl xs:text-7xl font-bold tracking-tight text-foreground sm:text-9xl leading-[0.9] mb-12"
          >
            {resume.basics.name}
          </motion.h1>

          {/* Summary - Compact & Readable */}
          <motion.p 
            variants={itemVariants}
            className="mx-auto max-w-xl text-lg sm:text-xl leading-relaxed font-medium text-muted/80 mb-14 break-keep"
          >
            {resume.basics.shortSummary}
          </motion.p>

          {/* Action Buttons - No Color Hover */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
          >
            <Link
              href={resume.basics.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center rounded-lg bg-foreground text-background px-8 py-3.5 text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <Github size={16} className="mr-2" />
              <span>GitHub</span>
            </Link>

            <Link
              href="/blog"
              className="group inline-flex items-center justify-center rounded-lg bg-white border border-border px-8 py-3.5 text-sm font-bold text-foreground transition-all hover:bg-black/[0.02]"
            >
              <FileText size={16} className="mr-2 text-accent/60" />
              Read Blog
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-muted/60 hover:text-foreground transition-colors group"
            >
              About
              <ArrowRight size={14} className="ml-2 opacity-30 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator - Minimal */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-8 bg-foreground/20" />
        <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-muted/60">Scroll</span>
      </motion.div>
    </section>
  );
}
