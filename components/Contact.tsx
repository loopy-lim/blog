'use client'

import { motion } from "framer-motion";
import { Mail, Github, ExternalLink, ArrowUpRight } from "lucide-react";
import { resume } from "@/lib/data";
import Link from "next/link";

export function Contact() {
  return (
    <section id="contact" className="relative py-24 overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
      
      <div className="container relative z-10 mx-auto px-6 lg:px-8 max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8 p-5 rounded-3xl bg-accent/5 text-accent shadow-sm border border-accent/10"
          >
            <Mail size={32} strokeWidth={1.5} />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted font-medium mb-10 max-w-lg leading-relaxed"
          >
            궁금한 점이 있거나 함께 일하고 싶다면 언제든 연락주세요.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a 
              href={`mailto:${resume.basics.email}`}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <Mail size={18} className="relative z-10" />
              <span className="relative z-10">Say Hello</span>
              <ArrowUpRight size={16} className="relative z-10 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>

            <div className="flex gap-3">
               <a 
                href={resume.basics.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white border border-border text-foreground hover:bg-gray-50 transition-all shadow-sm"
              >
                <Github size={20} />
              </a>
               <a 
                href={resume.basics.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white border border-border text-accent hover:bg-gray-50 transition-all shadow-sm"
              >
                <ExternalLink size={20} />
              </a>
            </div>
          </motion.div>
        </div>

        <div className="mt-24 pt-10 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-black text-muted uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} {resume.basics.name}
          </p>
          <div className="flex gap-8">
            <Link href="/" className="text-[11px] font-black text-foreground hover:text-accent transition-colors uppercase tracking-widest">Home</Link>
            <Link href="/blog" className="text-[11px] font-black text-foreground hover:text-accent transition-colors uppercase tracking-widest">Blog</Link>
            <Link href="/about" className="text-[11px] font-black text-foreground hover:text-accent transition-colors uppercase tracking-widest">About</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
