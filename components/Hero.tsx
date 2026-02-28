"use client"

import Link from "next/link";
import { resume } from "@/lib/data";
import { Github, FileText, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import InnovativeBackground from "@/components/ui/InnovativeBackground";

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
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20">
      {/* Dynamic Animated Background */}
      <InnovativeBackground />
      
      {/* Subtle Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-background pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container relative z-10 mx-auto max-w-5xl"
      >
        <div className="mx-auto flex flex-col items-center text-center">
          
          {/* Icon Section */}
          <motion.div 
            variants={itemVariants}
            className="mb-8 h-20 w-20 flex items-center justify-center relative"
          >
            <div className="w-20 h-20 animate-float">
              <img 
                src="/favicon.png" 
                alt="Profile Icon" 
                className="w-full h-full object-contain drop-shadow-xl"
                loading="eager"
              />
            </div>
          </motion.div>
          
          {/* Name/Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-6xl font-black tracking-tight text-foreground sm:text-8xl lg:text-9xl leading-[0.9] text-gradient"
          >
            {resume.basics.name}
          </motion.h1>
            
          {/* Label/Role */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-col items-center">
            <span className="text-2xl font-black text-foreground/80 sm:text-4xl tracking-tight">
              {resume.basics.label}
            </span>
            <div className="mt-4 h-1 w-20 bg-accent rounded-full opacity-20" />
          </motion.div>

          {/* Summary */}
          <motion.p 
            variants={itemVariants}
            className="mx-auto mt-10 mb-12 max-w-2xl text-lg text-muted sm:text-2xl leading-relaxed font-medium"
          >
            {resume.basics.shortSummary}
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-5"
          >
            <Link
              href={resume.basics.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-foreground text-background px-10 py-4 text-sm font-black transition-all shadow-xl"
            >
              <div className="absolute inset-0 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <Github size={20} className="relative z-10 mr-3" />
              <span className="relative z-10">GitHub</span>
            </Link>

            <Link
              href="/blog"
              className="group inline-flex items-center justify-center rounded-2xl bg-white/80 border border-border backdrop-blur-xl px-10 py-4 text-sm font-black text-foreground transition-all hover:bg-white shadow-sm"
            >
              <FileText size={20} className="mr-3 text-accent" />
              포스트 읽기
              <ArrowRight size={18} className="ml-3 text-muted transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-2xl bg-white/50 border border-border backdrop-blur-lg px-10 py-4 text-sm font-black text-foreground transition-all hover:bg-white/80 shadow-sm"
            >
              <User size={20} className="mr-3 text-green-500" />
              About Me
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Background Decor */}
      <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[25vw] h-[25vw] bg-green-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <div className="w-px h-16 bg-gradient-to-b from-accent/50 to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-muted">Scroll</span>
      </motion.div>
    </section>
  );
}
