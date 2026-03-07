'use client'

import { resume } from "../lib/data";
import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="relative pt-32 pb-24 overflow-hidden border-b border-black/[0.03]">
      <div className="container relative z-10 mx-auto max-w-5xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left Column: Fixed Headline */}
          <div className="lg:w-1/3 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="sticky top-32"
            >
              <p className="text-accent font-bold text-[10px] uppercase tracking-[0.4em] mb-8">
                Introduction
              </p>
              <h1 className="text-4xl font-bold tracking-tighter text-foreground leading-[1.15] break-keep mb-10">
                {resume.basics.shortSummary.split(',').map((part, i) => (
                  <span key={i} className="block">{part.trim()}{i === 0 ? ',' : ''}</span>
                ))}
              </h1>
              <div className="h-[2px] w-10 bg-accent mb-10" />
              <p className="text-[17px] font-bold leading-[1.6] text-foreground/80 tracking-tight break-keep">
                &quot;{resume.basics.summary}&quot;
              </p>
            </motion.div>
          </div>

          {/* Right Column: Structured Story */}
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-20"
            >
              {/* Pillar 1 */}
              <div className="group space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-black text-accent/20 tracking-tighter uppercase">01</span>
                  <h3 className="text-sm font-bold text-accent uppercase tracking-[0.25em]">Data-Driven UX</h3>
                </div>
                <div className="pl-8 border-l-2 border-black/[0.03] group-hover:border-accent/20 transition-colors">
                  <p 
                    className="text-[17px] text-muted leading-[1.9] font-medium break-keep max-w-[60ch]"
                    dangerouslySetInnerHTML={{
                      __html: resume.basics.about[0].replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="text-foreground font-bold underline underline-offset-4 decoration-accent/20">$1</strong>'
                      ),
                    }}
                  />
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="group space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-black text-accent/20 tracking-tighter uppercase">02</span>
                  <h3 className="text-sm font-bold text-accent uppercase tracking-[0.25em]">Problem Solving</h3>
                </div>
                <div className="pl-8 border-l-2 border-black/[0.03] group-hover:border-accent/20 transition-colors">
                  <p 
                    className="text-[17px] text-muted leading-[1.9] font-medium break-keep max-w-[60ch]"
                    dangerouslySetInnerHTML={{
                      __html: `${resume.basics.about[1]} <br/><br/> ${resume.basics.about[2]}`.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="text-foreground font-bold underline underline-offset-4 decoration-accent/20">$1</strong>'
                      ),
                    }}
                  />
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="group space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-black text-accent/20 tracking-tighter uppercase">03</span>
                  <h3 className="text-sm font-bold text-accent uppercase tracking-[0.25em]">Engineering Culture</h3>
                </div>
                <div className="pl-8 border-l-2 border-black/[0.03] group-hover:border-accent/20 transition-colors">
                  <p 
                    className="text-[17px] text-muted leading-[1.9] font-medium break-keep max-w-[60ch]"
                    dangerouslySetInnerHTML={{
                      __html: resume.basics.about[3].replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="text-foreground font-bold underline underline-offset-4 decoration-accent/20">$1</strong>'
                      ),
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
