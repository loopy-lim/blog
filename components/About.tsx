'use client'

import { resume } from "../lib/data";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function About() {
  return (
    <section id="about" className="relative pt-24 sm:pt-32 pb-20 sm:pb-24 overflow-hidden bg-[#fbfbfa]">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[10%] left-[-5%] w-[40vw] h-[40vw] rounded-[4rem] rotate-12 bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] rounded-[4rem] -rotate-12 bg-green-500/5 blur-[100px] pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/5 text-accent text-xs font-black uppercase tracking-widest mb-4 border border-accent/10">
            Introduction
          </div>
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-6xl text-gradient">
            About Me.
          </h2>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative mb-12 sm:mb-20 rounded-[2rem] sm:rounded-[3rem] bg-white border border-gray-100 p-6 sm:p-12 shadow-2xl shadow-black/3"
        >
          <Quote size={32} className="absolute top-4 left-4 sm:top-8 sm:left-8 text-accent/10 z-0" />
          <p className="relative z-10 text-lg sm:text-3xl font-black leading-tight text-foreground tracking-tight">
            &quot;{resume.basics.summary}&quot;
          </p>
        </motion.div>

        <div className="space-y-8 sm:space-y-12 text-base sm:text-[19px] text-muted-foreground leading-relaxed font-medium px-2 sm:px-0">
          {resume.basics.about.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="relative"
              dangerouslySetInnerHTML={{
                __html: paragraph.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="text-foreground font-black bg-accent/5 px-1 rounded-sm">$1</strong>'
                ),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
