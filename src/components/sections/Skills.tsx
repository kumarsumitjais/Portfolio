"use client";

import { motion } from "framer-motion";
import { skills } from "@/content/skills";

import Link from "next/link";

export function SkillsSection({ teaser = false }: { teaser?: boolean }) {
  const displayedSkills = teaser ? Object.entries(skills).slice(0, 4) : Object.entries(skills);

  return (
    <section className="py-24 bg-bg-elevated border-t border-border-card" id="skills">
      <div className="container mx-auto px-5 md:px-20">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-4">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-electric-blue-500">Arsenal</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            My toolset for building intelligent systems, turning data into insights, and delivering scalable solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedSkills.map(([key, category], idx) => {
            const displayedItems = teaser ? category.items.slice(0, 3) : category.items;
            const remainingCount = category.items.length - displayedItems.length;
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={key} 
                className="bg-bg-card border border-border-card rounded-2xl p-6 md:p-8 shadow-level-1 hover:border-electric-blue-500/30 transition-colors group flex flex-col"
              >
                <div className="mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-electric-blue-500/10 flex items-center justify-center border border-electric-blue-500/20 group-hover:bg-electric-blue-500/20 transition-colors shrink-0">
                      <span className="text-electric-blue-400 text-sm font-mono">✦</span>
                    </div>
                    {category.title}
                  </h3>
                  
                  {/* Domain Progress Bar */}
                  <div className="flex flex-col gap-1.5 mb-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-text-secondary">Overall Proficiency</span>
                      <span className="text-xs font-mono text-cyan-400/80">{category.proficiency}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-border-card rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${category.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-electric-blue-500 to-cyan-400"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Individual Skills Chips */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {displayedItems.map((item, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 bg-bg-elevated/50 text-text-secondary text-xs sm:text-sm rounded-md border border-border-card/50 hover:border-electric-blue-500/30 hover:text-text-primary transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                  {remainingCount > 0 && (
                    <span className="px-3 py-1.5 bg-electric-blue-500/5 text-electric-blue-400 text-xs sm:text-sm rounded-md border border-electric-blue-500/20 cursor-default">
                      +{remainingCount} more
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {teaser && (
          <div className="mt-16 text-center">
            <Link href="/skills" className="inline-flex items-center justify-center px-8 py-4 bg-bg-card border border-border-card text-text-primary font-medium rounded-xl hover:border-electric-blue-500/50 hover:text-electric-blue-400 transition-colors shadow-level-1 group">
              View Full Skillset
              <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
