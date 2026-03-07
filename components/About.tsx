'use client'

import { resume } from "../lib/data";
import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="relative pt-24 pb-20 sm:pb-32 overflow-hidden border-y border-border/40">
      <div className="container relative z-10 mx-auto max-w-5xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left Side: Title & Summary */}
          <div className="lg:w-1/3 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="sticky top-32"
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                About
              </h2>
              <div className="mt-4 h-1 w-12 bg-accent" />
              <p className="mt-8 text-xl font-bold leading-tight text-foreground tracking-tight">
                &quot;{resume.basics.summary}&quot;
              </p>
            </motion.div>
          </div>

          {/* Right Side: Detailed Paragraphs */}
          <div className="lg:w-2/3 space-y-12">
            {resume.basics.about.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-[17px] sm:text-[18px] text-muted leading-[1.8] font-medium max-w-[65ch] word-keep-all"
                dangerouslySetInnerHTML={{
                  __html: paragraph.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong class="text-accent font-bold">$1</strong>'
                  ),
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
