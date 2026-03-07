'use client'

import { motion } from "framer-motion";
import { Mail, Github, ArrowUpRight, ArrowRight } from "lucide-react";
import { resume } from "@/lib/data";
import Link from "next/link";

interface ContactProps {
  currentYear: number;
}

export function Contact({ currentYear }: ContactProps) {
  return (
    <section id="contact" className="relative py-24 overflow-hidden border-t border-border bg-white/60 backdrop-blur-sm">
      <div className="container relative z-10 mx-auto px-6 lg:px-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl text-left">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 text-accent text-[12px] font-bold uppercase tracking-widest mb-6 border border-accent/10"
            >
              Contact
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.1] mb-8"
            >
              궁금한 점이 있거나<br />
              <span className="text-accent">함께 일하고 싶다면</span><br />
              언제든 연락주세요.
            </motion.h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div className="p-10 rounded-[2.5rem] bg-stone-50/50 border border-border relative overflow-hidden group">
              <div className="relative z-10">
                <Mail size={32} className="text-accent mb-8" />
                <h3 className="text-2xl font-black mb-2">Email Me</h3>
                <p className="text-muted text-base font-medium mb-10">전송 즉시 알림이 전달됩니다.</p>
                
                <a 
                  href={`mailto:${resume.basics.email}`}
                  className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-foreground text-background text-sm font-black transition-all hover:bg-accent hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/5 overflow-hidden"
                >
                  <Mail size={18} className="relative z-10" />
                  <span className="relative z-10">{resume.basics.email}</span>
                  <ArrowUpRight size={16} className="relative z-10 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
               <a 
                href={resume.basics.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-between p-8 rounded-3xl bg-white border border-border text-foreground hover:border-accent/30 transition-all hover:shadow-lg group"
              >
                <div className="flex items-center gap-4">
                  <Github size={24} />
                  <span className="font-bold text-sm uppercase tracking-widest">GitHub</span>
                </div>
                <ArrowRight size={20} className="text-muted group-hover:text-accent transition-all group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </div>

        <div className="mt-24 pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-8">
          <p className="text-[11px] font-bold text-muted uppercase tracking-[0.2em]">
            © {currentYear} {resume.basics.name}
          </p>
          <div className="flex gap-10">
            <Link href="/" className="text-[11px] font-bold text-muted hover:text-accent transition-colors uppercase tracking-widest">Home</Link>
            <Link href="/blog" className="text-[11px] font-bold text-muted hover:text-accent transition-colors uppercase tracking-widest">Blog</Link>
            <Link href="/about" className="text-[11px] font-bold text-muted hover:text-accent transition-colors uppercase tracking-widest">About</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
