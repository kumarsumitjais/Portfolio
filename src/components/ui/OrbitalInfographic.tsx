"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Certification } from "@/content/certifications";

export function OrbitalInfographic({ items }: { items: Certification[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  
  // Radius calculation (responsive)
  const radius = Math.min(centerX, centerY) * 0.7;

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8 items-center justify-center">
      
      {/* Interactive Graph Area */}
      <div 
        ref={containerRef} 
        className="relative w-full max-w-[500px] aspect-square rounded-full flex items-center justify-center"
      >
        {/* Background Rings */}
        <div className="absolute inset-0 m-auto w-[60%] h-[60%] rounded-full border border-dashed border-electric-blue-500/20 animate-[spin_30s_linear_infinite]" />
        <div className="absolute inset-0 m-auto w-[85%] h-[85%] rounded-full border border-dashed border-cyan-400/10 animate-[spin_40s_linear_infinite_reverse]" />

        {/* Central Hub */}
        <motion.div 
          className="absolute z-20 flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-bg-card border-2 border-electric-blue-500 shadow-[0_0_30px_rgba(45,212,191,0.2)] cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => setActiveIndex(null)}
        >
          <span className="text-electric-blue-400 font-bold text-xs sm:text-sm tracking-wider text-center px-2">
            CORE<br/>CREDENTIALS
          </span>
        </motion.div>

        {/* Nodes and Connectors */}
        {dimensions.width > 0 && items.map((item, i) => {
          const angle = (i / items.length) * 2 * Math.PI - Math.PI / 2; // Start from top
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          const isActive = activeIndex === i;

          return (
            <div key={i} className="absolute inset-0 pointer-events-none">
              {/* SVG Connecting Line */}
              <svg className="absolute inset-0 w-full h-full -z-10">
                <motion.line
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke={isActive ? "#06b6d4" : "rgba(255,255,255,0.1)"}
                  strokeWidth={isActive ? 2 : 1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </svg>

              {/* Orbital Node */}
              <motion.button
                className={`absolute px-4 py-2 rounded-full whitespace-nowrap flex items-center justify-center pointer-events-auto transition-colors z-30 ${
                  isActive ? "bg-cyan-400 shadow-[0_0_15px_#22d3ee]" : "bg-bg-elevated border border-border-card hover:border-cyan-400"
                }`}
                style={{ left: x, top: y }}
                initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
                animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 + i * 0.1 }}
                onClick={() => setActiveIndex(isActive ? null : i)}
                whileHover={{ scale: 1.1, x: "-50%", y: "-50%" }}
              >
                <span className={`text-xs font-bold truncate max-w-[120px] sm:max-w-[150px] ${isActive ? "text-black" : "text-text-secondary"}`}>
                  {item.name}
                </span>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Details Panel */}
      <div className="w-full xl:w-[450px] min-h-[420px]">
        <AnimatePresence mode="wait">
          {activeIndex !== null ? (
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-bg-card border border-border-card rounded-2xl overflow-hidden shadow-level-2 h-full flex flex-col"
            >
              {items[activeIndex].image && (
                <div className="relative w-full aspect-video bg-bg-base border-b border-border-card">
                  <Image 
                    src={items[activeIndex].image as string} 
                    alt={items[activeIndex].name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Node {activeIndex + 1} Data</span>
                </div>
                <h3 className="font-bold text-xl text-text-primary mb-2 leading-tight">
                  {items[activeIndex].name}
                </h3>
                <p className="text-sm text-text-secondary mb-6">{items[activeIndex].issuer}</p>
                
                <div className="mt-auto pt-6 border-t border-border-card flex items-center justify-between">
                  <span className="text-xs font-mono bg-bg-base px-3 py-1.5 rounded border border-border-card text-text-secondary">
                    {items[activeIndex].date}
                  </span>
                  
                  {items[activeIndex].credentialUrl && items[activeIndex].credentialUrl !== "#" && (
                    <a 
                      href={items[activeIndex].credentialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm font-medium text-electric-blue-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
                    >
                      View Credential <span aria-hidden="true">&rarr;</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center border border-dashed border-border-card rounded-2xl bg-bg-elevated/50 min-h-[420px]"
            >
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-electric-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-electric-blue-500/20">
                  <span className="text-electric-blue-400 text-xl font-mono">?</span>
                </div>
                <p className="text-text-secondary">Select a node in the network<br/>to decode certificate data.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
