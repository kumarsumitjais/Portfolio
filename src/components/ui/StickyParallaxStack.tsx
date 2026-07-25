"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

// A single card in the stack
function StickyProjectCard({ project, index, total }: { project: any, index: number, total: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Create a subtle parallax effect and scale down when scrolled past
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"]
  });

  // Cap the visual stack to a maximum of 3 cards behind the current one.
  const stackLevel = Math.min(index, 3);

  return (
    <div 
      className="sticky w-full top-[var(--top-mobile)] md:top-[var(--top-desktop)] h-[calc(100dvh-130px)] min-h-[450px] max-h-[600px] md:h-[500px] flex items-center justify-center mb-16 md:mb-24 last:mb-0"
      style={{ 
        "--top-mobile": `calc(70px + ${stackLevel * 12}px)`,
        "--top-desktop": `calc(120px + ${stackLevel * 30}px)`
      } as React.CSSProperties}
    >
      <motion.div 
        ref={cardRef}
        className="w-full h-full bg-bg-elevated border border-border-card rounded-3xl overflow-hidden shadow-level-3 relative flex flex-col md:flex-row group"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Left Side: Cinematic Image/Visual */}
        <div className="w-full md:w-1/2 h-[35%] min-h-[180px] md:h-full relative overflow-hidden bg-bg-base border-b md:border-b-0 md:border-r border-border-card shrink-0">
          {project.meta.image ? (
            <Image 
              src={project.meta.image} 
              alt={project.meta.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            // Fallback cinematic visual if no image
            <div className="absolute inset-0 bg-gradient-to-br from-bg-card to-bg-base flex flex-col items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue-500/20 to-indigo-500/10 mix-blend-overlay opacity-50" />
               <span className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-electric-blue-600 drop-shadow-lg z-10">
                 {project.meta.heroMetric?.value || "DATA"}
               </span>
               <p className="text-xs font-mono uppercase tracking-[0.2em] text-text-secondary mt-4 z-10">
                 {project.meta.heroMetric?.label || "AI MODEL"}
               </p>
            </div>
          )}
          
          {/* Overlay gradient to blend into content */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-bg-elevated/90 to-transparent pointer-events-none" />
        </div>

        {/* Right Side: Data Sheet */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col flex-1 md:h-full bg-bg-elevated relative z-10 overflow-y-auto">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="px-3 py-1.5 bg-electric-blue-500/10 text-electric-blue-400 text-xs font-bold rounded border border-electric-blue-500/20">
              {project.meta.category}
            </span>
            {project.meta.tags?.slice(0, 3).map((tag: string) => (
              <span key={tag} className="px-3 py-1.5 bg-border-card/30 text-text-secondary text-xs font-medium rounded border border-border-card/50">
                {tag}
              </span>
            ))}
          </div>

          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4 leading-tight group-hover:text-electric-blue-400 transition-colors">
            {project.meta.title}
          </h2>
          
          <p className="text-base md:text-lg text-text-secondary mb-8 leading-relaxed max-w-xl">
            {project.meta.oneLiner}
          </p>
          
          <div className="mt-auto">
            <Link 
              href={`/projects/${project.slug}`}
              className="inline-flex items-center justify-center px-8 py-4 bg-electric-blue-500 hover:bg-electric-blue-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-electric-blue-500/25 group/btn w-full sm:w-auto"
            >
              Access Case Study 
              <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function StickyParallaxStack({ projects }: { projects: any[] }) {
  return (
    <div className="w-full relative pb-32">
      {projects.map((project, index) => (
        <StickyProjectCard 
          key={project.slug} 
          project={project} 
          index={index} 
          total={projects.length} 
        />
      ))}
    </div>
  );
}
