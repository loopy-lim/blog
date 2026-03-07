'use client'

import { resume } from "../lib/data";
import { motion } from "framer-motion";

export function Background() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Background
          </h2>
          <div className="mt-4 h-1 w-12 bg-black/[0.05]" />
        </motion.div>

        <div className="space-y-24">
          {/* Education & Awards (Merged for density control) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
            <div className="lg:col-span-1">
              <h3 className="text-[10px] font-bold text-accent uppercase tracking-[0.4em]">Academic & Awards</h3>
            </div>
            <div className="lg:col-span-2 space-y-12">
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-6">
                  {resume.education.map((edu, idx) => (
                    <div key={idx} className="space-y-1">
                      <h4 className="font-bold text-foreground text-lg">{edu.school}</h4>
                      <p className="text-muted text-[14px] font-medium">{edu.degree}</p>
                      <p className="text-muted/30 text-[11px] tabular-nums font-bold">{edu.period}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {resume.awards.map((award, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-black/[0.03]">
                      <span className="text-[14px] font-medium text-muted/80 break-keep">{award.title}</span>
                      <span className="text-[11px] font-bold text-muted/20 tabular-nums">{award.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
            <div className="lg:col-span-1">
              <h3 className="text-[10px] font-bold text-accent uppercase tracking-[0.4em]">Activities</h3>
            </div>
            <div className="lg:col-span-2 space-y-10">
              {resume.activities.map((activity, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between border-b border-black/[0.05] pb-2">
                    <h4 className="font-bold text-foreground text-[17px]">{activity.name}</h4>
                    <span className="text-[11px] font-bold text-muted/30 uppercase tracking-widest">{activity.period}</span>
                  </div>
                  <p className="text-muted text-[15px] leading-relaxed font-medium break-keep">
                    {activity.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Open Source & More */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
            <div className="lg:col-span-1">
              <h3 className="text-[10px] font-bold text-accent uppercase tracking-[0.4em]">Contributions</h3>
            </div>
            <div className="lg:col-span-2 grid gap-12 sm:grid-cols-2">
              <div className="space-y-6">
                {resume.openSource.map((os, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="font-bold text-foreground text-[16px]">{os.project}</h4>
                    <p className="text-muted text-[14px] font-medium leading-relaxed break-keep">{os.description}</p>
                    <a href={os.url} target="_blank" rel="noopener noreferrer" className="inline-block text-accent text-[11px] font-bold uppercase tracking-wider underline underline-offset-4">
                      PR LINK
                    </a>
                  </div>
                ))}
              </div>
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted/20 uppercase tracking-[0.2em]">Military</p>
                  <p className="text-foreground font-bold text-[15px]">{resume.military.service}</p>
                  <p className="text-muted text-[12px] font-medium">{resume.military.role}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted/20 uppercase tracking-[0.2em]">Certifications</p>
                  {resume.certifications.map((cert, idx) => (
                    <div key={idx}>
                      <p className="text-foreground font-bold text-[15px]">{cert.name}</p>
                      <p className="text-muted text-[11px] font-medium">{cert.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
