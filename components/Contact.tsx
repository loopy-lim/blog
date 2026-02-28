'use client'

import { motion } from "framer-motion";
import { Mail, Github, ArrowUpRight } from "lucide-react";
import { resume } from "@/lib/data";
import Link from "next/link";

interface ContactProps {
  currentYear: number;
}

export function Contact({ currentYear }: ContactProps) {
  return (
    <section id="contact" className="relative py-24 overflow-hidden bg-background">
      {/* Background Decor - Changed from full rounded to more geometric */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
      
      <div className="container relative z-10 mx-auto px-6 lg:px-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/5 text-accent text-xs font-black uppercase tracking-widest mb-6 border border-accent/10"
            >
              Contact
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.1] mb-6"
            >
              궁금한 점이 있거나<br />
              <span className="text-accent">함께 일하고 싶다면</span><br />
              언제든 연락주세요.
            </motion.h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div className="p-8 rounded-3xl bg-accent/5 border border-accent/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -translate-y-1/2 translate-x-1/2 rotate-45 group-hover:bg-accent/10 transition-colors" />
              
              <div className="relative z-10">
                <Mail size={32} className="text-accent mb-6" />
                <h3 className="text-xl font-black mb-2">Email Me</h3>
                <p className="text-muted text-sm font-medium mb-6">전송 즉시 알림이 전달됩니다.</p>
                
                <a 
                  href={`mailto:${resume.basics.email}`}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-foreground text-background text-sm font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
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
                className="flex-1 flex items-center justify-between p-6 rounded-2xl bg-white border border-border text-foreground hover:bg-gray-50 hover:border-accent/30 transition-all shadow-sm group"
              >
                <div className="flex items-center gap-4">
                  <Github size={24} />
                  <span className="font-black text-sm uppercase tracking-widest">GitHub</span>
                </div>
                <ArrowUpRight size={18} className="text-muted group-hover:text-accent transition-colors" />
              </a>
            </div>
          </motion.div>
        </div>

        <div className="mt-24 pt-10 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-black text-muted uppercase tracking-[0.2em]">
            © {currentYear} {resume.basics.name}
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
