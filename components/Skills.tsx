'use client'

import { resume } from "../lib/data";
import { motion } from "framer-motion";
import { Layout, Server, Database, Smartphone, Wrench, Boxes } from "lucide-react";

export function Skills() {
  const getIcon = (name: string) => {
    switch (name) {
      case "Frontend": return <Layout size={18} />;
      case "Backend": return <Server size={18} />;
      case "DevOps": return <Database size={18} />;
      case "Mobile": return <Smartphone size={18} />;
      case "Tools": return <Wrench size={18} />;
      default: return <Boxes size={18} />;
    }
  };

  const skillCategories = [
    { name: "Frontend", keywords: resume.skills.frontend },
    { name: "Backend", keywords: resume.skills.backend },
    { name: "DevOps", keywords: resume.skills.devops },
    { name: "Mobile", keywords: resume.skills.mobile },
    { name: "Tools", keywords: resume.skills.tools },
  ];

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/5 text-accent text-xs font-black uppercase tracking-widest mb-4 border border-accent/10">
            Technical Arsenal
          </div>
          <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient">
            Expertise.
          </h2>
        </motion.div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((skillGroup, idx) => (
            <motion.div
              key={skillGroup.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group relative rounded-3xl border border-border bg-gray-50/30 p-8 transition-colors hover:bg-white"
            >
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-accent shadow-xs border border-border group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                {getIcon(skillGroup.name)}
              </div>
              
              <h3 className="mb-6 text-xl font-black text-foreground">
                {skillGroup.name}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {skillGroup.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-[12px] font-bold text-muted border border-border shadow-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
