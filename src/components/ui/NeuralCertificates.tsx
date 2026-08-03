"use client";

import React, { useState } from "react";
import { Certification } from "@/content/certifications";
import { ExternalLink, Award, Calendar } from "lucide-react";
import { motion } from "framer-motion";

// Helper to categorize certificates based on the user's mapping
const categorizeCertificates = (items: Certification[]) => {
  const inputLayer: Certification[] = [];
  const hiddenLayer: Certification[] = [];
  const outputLayer: Certification[] = [];

  items.forEach((cert) => {
    const name = cert.name.toLowerCase();
    if (
      name.includes("essentials") ||
      name.includes("get started") ||
      name.includes("foundations")
    ) {
      inputLayer.push(cert);
    } else if (
      name.includes("analytics certification") ||
      name.includes("dive deeper") ||
      name.includes("job simulation") ||
      name.includes("feature")
    ) {
      hiddenLayer.push(cert);
    } else {
      outputLayer.push(cert);
    }
  });

  return { inputLayer, hiddenLayer, outputLayer };
};

export function NeuralCertificates({ items }: { items: Certification[] }) {
  const { inputLayer, hiddenLayer, outputLayer } = categorizeCertificates(items);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const renderCard = (cert: Certification, layerName: string, idx: number) => {
    const nodeId = `${layerName}-${idx}`;
    const isHovered = hoveredNode === nodeId;
    const isRelated = hoveredNode && hoveredNode !== nodeId && Math.random() > 0.5; // Simulate synapse relationship

    return (
      <div
        key={idx}
        className={`relative p-5 rounded-2xl border transition-all duration-300 z-10 
          ${isHovered ? "bg-electric-blue-500/10 border-electric-blue-400 shadow-[0_0_20px_rgba(0,195,255,0.2)] scale-[1.02]" : "bg-bg-elevated border-border-card hover:border-electric-blue-500/50"}
          ${hoveredNode && !isHovered && !isRelated ? "opacity-50" : "opacity-100"}
        `}
        onMouseEnter={() => setHoveredNode(nodeId)}
        onMouseLeave={() => setHoveredNode(null)}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="text-sm font-bold text-text-primary leading-tight mb-1">{cert.name}</h4>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Award className="w-3 h-3 text-electric-blue-400" />
              <span>{cert.issuer}</span>
            </div>
          </div>
          {cert.credentialUrl && cert.credentialUrl !== "#" && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-electric-blue-400 transition-colors p-1"
              aria-label="View Credential"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-3 h-3 text-text-secondary" />
          <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">{cert.date}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {cert.skills.slice(0, 3).map((skill, sIdx) => (
            <span
              key={sIdx}
              className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-colors
                ${isHovered ? "text-electric-blue-400 border-electric-blue-500/30 bg-electric-blue-500/10" : "text-text-secondary border-border-card bg-black/20"}
              `}
            >
              {skill}
            </span>
          ))}
          {cert.skills.length > 3 && (
            <span className="text-[10px] font-mono text-text-secondary bg-black/30 px-2 py-0.5 rounded-md border border-border-card">
              +{cert.skills.length - 3}
            </span>
          )}
        </div>

        {/* Node Connection Points */}
        {layerName !== "output" && (
          <div className={`absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-colors duration-300 ${isHovered ? "bg-electric-blue-400 shadow-[0_0_10px_rgba(0,195,255,0.8)]" : "bg-border-card"}`}></div>
        )}
        {layerName !== "input" && (
          <div className={`absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-colors duration-300 ${isHovered ? "bg-electric-blue-400 shadow-[0_0_10px_rgba(0,195,255,0.8)]" : "bg-border-card"}`}></div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto py-10">
      
      {/* Background SVG Synapses (Abstract visual representation) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 md:opacity-50">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="synapse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00C3FF" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#00C3FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00C3FF" stopOpacity="0.1" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Abstract Synapse Lines - Visible strongly only when hovering a node */}
          <g className={`transition-opacity duration-700 ${hoveredNode ? "opacity-100" : "opacity-30"}`}>
            <path d="M 20% 25% C 40% 25%, 60% 50%, 80% 25%" fill="none" stroke="url(#synapse-grad)" strokeWidth="1.5" filter="url(#glow)" />
            <path d="M 20% 50% C 40% 50%, 60% 25%, 80% 75%" fill="none" stroke="url(#synapse-grad)" strokeWidth="1.5" filter="url(#glow)" />
            <path d="M 20% 75% C 40% 75%, 60% 75%, 80% 50%" fill="none" stroke="url(#synapse-grad)" strokeWidth="1.5" filter="url(#glow)" />
            <path d="M 20% 25% C 50% 50%, 50% 75%, 80% 75%" fill="none" stroke="url(#synapse-grad)" strokeWidth="1.5" filter="url(#glow)" />
            <path d="M 20% 75% C 50% 50%, 50% 25%, 80% 25%" fill="none" stroke="url(#synapse-grad)" strokeWidth="1.5" filter="url(#glow)" />
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
        
        {/* Column 1: Input Layer */}
        <div className="flex flex-col gap-6">
          <div className="mb-2 border-b border-border-card pb-2">
            <h3 className="text-xs font-mono text-electric-blue-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-electric-blue-500 animate-pulse"></span>
              Input Layer
            </h3>
            <p className="text-[11px] text-text-secondary mt-1">Foundations / Data Input</p>
          </div>
          <div className="flex flex-col gap-5">
            {inputLayer.map((cert, idx) => renderCard(cert, "input", idx))}
          </div>
        </div>

        {/* Column 2: Hidden Layer */}
        <div className="flex flex-col gap-6 mt-0 md:mt-12">
          <div className="mb-2 border-b border-border-card pb-2">
            <h3 className="text-xs font-mono text-electric-blue-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              Hidden Layer
            </h3>
            <p className="text-[11px] text-text-secondary mt-1">Specialized / Feature Extraction</p>
          </div>
          <div className="flex flex-col gap-5">
            {hiddenLayer.map((cert, idx) => renderCard(cert, "hidden", idx))}
          </div>
        </div>

        {/* Column 3: Output Layer */}
        <div className="flex flex-col gap-6 mt-0 md:mt-24">
          <div className="mb-2 border-b border-border-card pb-2">
            <h3 className="text-xs font-mono text-electric-blue-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Output Layer
            </h3>
            <p className="text-[11px] text-text-secondary mt-1">Advanced / MLOps</p>
          </div>
          <div className="flex flex-col gap-5">
            {outputLayer.map((cert, idx) => renderCard(cert, "output", idx))}
          </div>
        </div>

      </div>
    </div>
  );
}
