"use client";

import React, { useState } from "react";
import { Certification } from "@/content/certifications";
import { Terminal, CheckCircle, ExternalLink, Award, Code2 } from "lucide-react";

export function TrainingTimeline({ items }: { items: Certification[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCert = items[activeIndex];

  return (
    <div className="w-full bg-bg-elevated border border-border-card rounded-2xl overflow-hidden shadow-level-1">
      {/* Terminal Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border-card bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-xs font-mono text-green-400 uppercase tracking-widest">
            Training Complete: {items.length}/{items.length} Certificates Loaded | Validation Accuracy: 100%
          </span>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        
        {/* Left Side - Timeline */}
        <div className="col-span-1 lg:col-span-5 border-r border-border-card p-6 lg:p-8 max-h-[800px] overflow-y-auto custom-scrollbar">
          <div className="relative border-l-2 border-border-card ml-3 space-y-8 pb-8">
            {items.map((cert, idx) => (
              <div 
                key={idx} 
                className="relative pl-8 cursor-pointer group"
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-colors duration-300 ${activeIndex === idx ? "bg-green-400 border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" : "bg-bg-elevated border-border-card group-hover:border-green-400/50"}`}></div>
                
                {/* Timeline Card */}
                <div className={`p-4 rounded-xl border transition-all duration-300 ${activeIndex === idx ? "bg-green-400/5 border-green-400/30" : "bg-black/20 border-border-card group-hover:border-border-card/80"}`}>
                  <div className="text-[10px] font-mono text-text-secondary mb-2 flex items-center gap-2">
                    <span className="text-green-400">Epoch {idx + 1}</span> 
                    <span>{"//"}</span>
                    <span>{cert.date}</span>
                  </div>
                  <h4 className={`text-sm font-bold mb-1 transition-colors ${activeIndex === idx ? "text-green-400" : "text-text-primary"}`}>{cert.name}</h4>
                  <div className="text-xs text-text-secondary flex items-center gap-1.5">
                    <Award className="w-3 h-3" />
                    {cert.issuer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Inspector (Sticky) */}
        <div className="col-span-1 lg:col-span-7 bg-[#050505] relative overflow-hidden">
          {/* Abstract Tech Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4ade80 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          <div className="sticky top-0 p-8 h-full flex flex-col justify-center min-h-[400px]">
            {activeCert && (
              <div className="relative z-10 animate-in fade-in slide-in-from-right-4 duration-500" key={activeIndex}>
                
                {/* Output Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-green-400/10 border border-green-400/30 flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-text-primary">{activeCert.name}</h2>
                    <p className="text-sm text-text-secondary mt-1 flex flex-col gap-1">
                      <span><span className="text-green-400">Authority:</span> {activeCert.issuer}</span>
                      {activeCert.credentialId && (
                        <span><span className="text-green-400">Credential ID:</span> {activeCert.credentialId}</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Simulated Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-black/40 border border-border-card rounded-lg p-3">
                    <div className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Status</div>
                    <div className="text-sm font-mono text-green-400 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified
                    </div>
                  </div>
                  <div className="bg-black/40 border border-border-card rounded-lg p-3">
                    <div className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Timestamp</div>
                    <div className="text-sm font-mono text-text-primary">{activeCert.date}</div>
                  </div>
                  <div className="bg-black/40 border border-border-card rounded-lg p-3">
                    <div className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Capabilities</div>
                    <div className="text-sm font-mono text-text-primary">{activeCert.skills.length} Extracted</div>
                  </div>
                </div>

                {/* Skills Extracted */}
                <div className="mb-8">
                  <h3 className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-border-card"></span>
                    Feature Extraction (Skills)
                    <span className="flex-1 h-[1px] bg-border-card"></span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activeCert.skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx} 
                        className="text-xs font-mono text-green-400 bg-green-400/10 px-3 py-1.5 rounded-md border border-green-400/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action */}
                {activeCert.credentialUrl && activeCert.credentialUrl !== "#" && (
                  <div className="mt-auto">
                    <a 
                      href={activeCert.credentialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-black bg-green-400 hover:bg-green-300 transition-colors px-5 py-2.5 rounded-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Source Credential
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Global styles for custom scrollbar within this component */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(74, 222, 128, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(74, 222, 128, 0.4);
        }
      `}} />
    </div>
  );
}
