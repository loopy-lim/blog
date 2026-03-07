'use client'

import { motion } from "framer-motion";
import { Mail, Github, ArrowRight } from "lucide-react";
import { resume } from "@/lib/data";
import Link from "next/link";

interface ContactProps {
  currentYear: number;
}

export function Contact({ currentYear }: ContactProps) {
  return (
    <section id="contact" className="relative py-24 border-t border-border/40">
      <div className="container relative z-10 mx-auto px-6 lg:px-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="max-w-xl text-left">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                Contact
              </h2>
              <div className="mt-4 h-1 w-12 bg-accent" />
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-[1.4] mb-8 break-keep"
            >
              궁금한 점이 있거나 함께 일하고 싶다면<br />
              언제든 편하게 연락주세요.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="p-8 sm:p-10 rounded-xl bg-white border border-border/60 shadow-sm transition-all hover:bg-black/[0.01]">
              <Mail size={24} className="text-accent mb-6" />
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-muted/60 text-sm font-medium mb-8 break-keep">전송 즉시 알림이 전달되어 빠르게 확인 가능합니다.</p>
              
              <a 
                href={`mailto:${resume.basics.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background text-[13px] font-bold transition-all hover:brightness-110 active:scale-[0.98]"
              >
                {resume.basics.email}
              </a>
            </div>

            <a 
              href={resume.basics.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-6 rounded-xl bg-white border border-border/60 text-foreground transition-all hover:bg-black/[0.01] group shadow-sm"
            >
              <div className="flex items-center gap-4">
                <Github size={20} className="text-muted/40 group-hover:text-foreground transition-colors" />
                <span className="font-bold text-[13px] uppercase tracking-widest">GitHub</span>
              </div>
              <ArrowRight size={16} className="text-muted/20 group-hover:text-accent transition-all group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>

        {/* Footer Minimal */}
        <div className="mt-24 pt-10 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-bold text-muted/30 uppercase tracking-[0.2em]">
            © {currentYear} {resume.basics.name}
          </p>
          <div className="flex gap-10">
            {['Home', 'Blog', 'About'].map((item) => (
              <Link 
                key={item}
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                className="text-[10px] font-bold text-muted/40 hover:text-accent transition-colors uppercase tracking-[0.15em]"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
