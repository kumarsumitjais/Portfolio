"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import { Trophy, Award } from "lucide-react";
import { Achievement } from "@/content/achievements";

function PipelineNode({ ach, index, isLast }: { ach: Achievement; index: number; isLast: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative flex w-full">
      {/* Left side: Terminal & Timeline line */}
      <div className="hidden md:flex flex-col items-end w-1/4 pr-8 relative">
        {!isLast && (
          <motion.div 
            className="absolute top-10 bottom-[-40px] right-[27px] w-0.5 bg-electric-blue-500/20"
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : { height: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        )}
        
        {/* Node point */}
        <motion.div 
          className="absolute top-6 right-[19px] w-4 h-4 rounded-full border-2 border-cyan-400 bg-bg-base z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1, boxShadow: "0 0 15px rgba(34,211,238,0.5)" } : { scale: 0, opacity: 0 }}
          transition={{ type: "spring", delay: 0.2 }}
        />

        {/* Terminal Effect */}
        <div className="mt-5 text-right font-mono text-xs">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={isInView ? { opacity: 1 } : { opacity: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-text-secondary"
          >
            [JOB_ID: {2048 + index}]
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={isInView ? { opacity: 1 } : { opacity: 0 }} 
            transition={{ delay: 0.4 }}
            className="text-electric-blue-400"
          >
            STATUS: <span className="text-cyan-400 font-bold">COMPUTED</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={isInView ? { opacity: 1 } : { opacity: 0 }} 
            transition={{ delay: 0.6 }}
            className="text-text-secondary mt-1"
          >
            {ach.date}
          </motion.div>
        </div>
      </div>

      {/* Right side: Card */}
      <motion.div 
        className="w-full md:w-3/4 pb-12 md:pl-4"
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-bg-card border border-border-card rounded-2xl overflow-hidden shadow-level-1 group hover:border-cyan-400/50 transition-colors">
          <div className="flex flex-col sm:flex-row">
            {(ach.image?.includes('medal') || ach.image?.includes('certificate')) ? (
              <div className="relative flex items-center justify-center w-full sm:w-48 aspect-video sm:aspect-square bg-bg-base border-b sm:border-b-0 sm:border-r border-border-card shrink-0 overflow-hidden group-hover:bg-electric-blue-500/5 transition-colors">
                {ach.image.includes('medal') ? (
                  <Trophy className="w-16 h-16 text-electric-blue-400 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500" strokeWidth={1.5} />
                ) : (
                  <Award className="w-16 h-16 text-cyan-400 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500" strokeWidth={1.5} />
                )}
                <div className="absolute inset-0 bg-electric-blue-500/5 mix-blend-overlay" />
              </div>
            ) : ach.image ? (
              <div className="relative w-full sm:w-48 aspect-video sm:aspect-square bg-bg-base border-b sm:border-b-0 sm:border-r border-border-card shrink-0 overflow-hidden">
                <Image src={ach.image} alt={ach.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-electric-blue-500/10 mix-blend-overlay" />
              </div>
            ) : null}
            <div className="p-6 flex flex-col justify-center flex-grow">
              <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-electric-blue-400 transition-colors">
                {ach.title}
              </h3>
              <p className="text-sm text-text-secondary mb-4">{ach.event}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-card/50">
                <span className="md:hidden text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                  {ach.date}
                </span>
                {ach.blogUrl && (
                  <a href={ach.blogUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-text-primary hover:text-cyan-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Read Blog Log
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ComputingPipeline({ items }: { items: Achievement[] }) {
  const containerRef = useRef(null);
  
  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto relative pt-8">
      {/* Starting terminal header */}
      <div className="hidden md:flex flex-col items-end w-1/4 pr-8 mb-8">
        <div className="font-mono text-xs text-electric-blue-400 bg-electric-blue-500/10 px-3 py-1.5 rounded-md border border-electric-blue-500/20">
          $ init pipeline --achievements
        </div>
      </div>

      {items.map((ach, i) => (
        <PipelineNode key={i} ach={ach} index={i} isLast={i === items.length - 1} />
      ))}
      
      {/* Ending terminal footer */}
      <div className="hidden md:flex flex-col items-end w-1/4 pr-8 mt-[-1rem]">
        <div className="font-mono text-xs text-text-secondary">
          Process finished with exit code 0
        </div>
      </div>
    </div>
  );
}
