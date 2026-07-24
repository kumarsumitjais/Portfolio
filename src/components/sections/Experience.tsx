"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experiences } from "@/content/experience";

export function ExperienceSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-24 bg-bg-base border-t border-border-card relative overflow-hidden" id="experience">
      <div className="container mx-auto px-5 md:px-20 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-4">
            Experience & <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue-500 to-cyan-400">Involvement</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Organizations I've been a part of and the roles that have shaped my journey.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Tabs (Left Column) */}
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar lg:w-1/3 flex-shrink-0 border-b lg:border-b-0 lg:border-l border-border-card pb-2 lg:pb-0">
            {experiences.map((exp, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`relative flex-shrink-0 text-left px-5 py-4 transition-all duration-300 font-medium whitespace-nowrap lg:whitespace-normal group ${
                  activeTab === i
                    ? "text-electric-blue-400 bg-electric-blue-500/5"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                }`}
              >
                {/* Active Indicator Line */}
                {activeTab === i && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 w-full h-[2px] lg:w-[2px] lg:h-full bg-electric-blue-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <span className="relative z-10 text-sm md:text-base">
                  {exp.company.split(',')[0]} {/* Shorten name for tab */}
                </span>
              </button>
            ))}
          </div>

          {/* Details (Right Column) */}
          <div className="lg:w-2/3 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-bg-card border border-border-card rounded-2xl p-6 md:p-10 shadow-level-1 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-electric-blue-500/5 to-cyan-400/5 pointer-events-none" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                    {experiences[activeTab].title ? `${experiences[activeTab].title} @ ` : ""}
                    <span className="text-cyan-400">{experiences[activeTab].company}</span>
                  </h3>
                  
                  <div className="space-y-12 mt-10">
                    {experiences[activeTab].roles.map((role, j) => (
                      <div key={j} className="relative">
                        {/* Connector line for multiple roles */}
                        {experiences[activeTab].roles.length > 1 && j !== experiences[activeTab].roles.length - 1 && (
                          <div className="absolute left-[7px] top-8 bottom-[-48px] w-[2px] bg-border-card" />
                        )}
                        
                        <div className="flex flex-col mb-4">
                          <div className="flex items-center gap-4 mb-2">
                            {experiences[activeTab].roles.length > 1 && (
                              <div className="w-4 h-4 rounded-full border-2 border-electric-blue-500 bg-bg-card z-10 flex-shrink-0" />
                            )}
                            <h4 className="text-xl font-bold text-text-primary">{role.title}</h4>
                          </div>
                          <span className={`text-sm font-mono text-electric-blue-400 bg-electric-blue-500/10 px-3 py-1.5 rounded-md w-fit border border-electric-blue-500/20 ${experiences[activeTab].roles.length > 1 ? 'ml-8' : ''}`}>
                            {role.start} &mdash; {role.end}
                          </span>
                        </div>
                        
                        <ul className={`space-y-3 text-text-secondary ${experiences[activeTab].roles.length > 1 ? 'ml-8' : ''}`}>
                          {role.bullets.map((bullet, k) => (
                            <li key={k} className="flex items-start">
                              <span className="mr-3 text-cyan-400 mt-1 opacity-80 flex-shrink-0">▹</span>
                              <span className="text-base leading-relaxed">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
