"use client";

import React, { useState } from "react";
import { Certification } from "@/content/certifications";
import { ExternalLink, CheckCircle2, Search, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper to assign a domain to each certificate for the DataFrame
const getDomain = (certName: string) => {
  const name = certName.toLowerCase();
  if (name.includes("generative") || name.includes("prompt") || name.includes("vertex")) {
    return "GenAI";
  }
  if (name.includes("ml") || name.includes("machine learning") || name.includes("ai-ml")) {
    return "ML";
  }
  return "Analytics";
};

// Domain color mapping for heatmap effect
const domainColors = {
  "GenAI": "bg-purple-500/10 text-purple-400 border-purple-500/30",
  "ML": "bg-green-500/10 text-green-400 border-green-500/30",
  "Analytics": "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

export function FeatureMatrix({ items }: { items: Certification[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const domains = ["All", "Analytics", "GenAI", "ML"];

  // Enhance items with domain
  const enhancedItems = items.map((cert) => ({
    ...cert,
    domain: getDomain(cert.name)
  }));

  const filteredItems = activeFilter === "All" 
    ? enhancedItems 
    : enhancedItems.filter(item => item.domain === activeFilter);

  return (
    <div className="w-full bg-white dark:bg-[#0d1117] border border-border-card rounded-2xl overflow-hidden shadow-level-1 font-mono text-sm transition-colors">
      
      {/* Jupyter Notebook Cell Header */}
      <div className="p-4 border-b border-border-card bg-gray-50 dark:bg-[#161b22] flex flex-col md:flex-row gap-4 justify-between items-start md:items-center transition-colors">
        <div className="flex items-start gap-3 w-full md:w-auto">
          <div className="text-electric-blue-500 dark:text-electric-blue-400 shrink-0 mt-1">In [1]:</div>
          <div className="w-full bg-white dark:bg-[#0d1117] border border-border-card rounded-md p-2 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            <Code2 className="w-4 h-4 text-text-secondary shrink-0" />
            <span className="text-text-primary whitespace-nowrap">
              <span className="text-purple-600 dark:text-purple-400">df</span> = portfolio.get_credentials()
              <br/>
              {activeFilter === "All" 
                ? <><span className="text-purple-600 dark:text-purple-400">df</span>.show_all()</>
                : <><span className="text-purple-600 dark:text-purple-400">df</span>[<span className="text-purple-600 dark:text-purple-400">df</span>[<span className="text-green-600 dark:text-green-400">'domain'</span>] == <span className="text-green-600 dark:text-green-400">'{activeFilter}'</span>]</>
              }
            </span>
          </div>
        </div>

        {/* Pandas-style Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setActiveFilter(domain)}
              className={`px-3 py-1.5 rounded border transition-all text-xs
                ${activeFilter === domain 
                  ? "bg-electric-blue-500/10 border-electric-blue-500 text-electric-blue-600 dark:text-electric-blue-400" 
                  : "bg-transparent border-border-card text-text-secondary hover:border-text-secondary"}
              `}
            >
              {domain === "All" ? "df.show_all()" : `domain=='${domain}'`}
            </button>
          ))}
        </div>
      </div>

      {/* DataFrame Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#161b22] border-b border-border-card text-text-secondary transition-colors">
              <th className="py-3 px-4 w-12 text-center font-normal border-r border-border-card"></th>
              <th className="py-3 px-4 font-normal w-16">Asset</th>
              <th className="py-3 px-4 font-normal">Credential_Name</th>
              <th className="py-3 px-4 font-normal">Domain</th>
              <th className="py-3 px-4 font-normal">Issuer</th>
              <th className="py-3 px-4 font-normal">Confidence</th>
              <th className="py-3 px-4 font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredItems.map((cert, idx) => {
                const domainStyle = domainColors[cert.domain as keyof typeof domainColors];
                
                // If it HAS an image, render the full-width layout
                if (cert.image && cert.image !== "") {
                  return (
                    <motion.tr 
                      key={cert.name + idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-border-card/50 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      <td colSpan={7} className="p-4 sm:p-6">
                        <div className="flex flex-col gap-4 sm:gap-6">
                          {/* Image above, left-aligned */}
                          <div className="w-full max-w-xs md:max-w-md lg:max-w-xl rounded-xl overflow-hidden border border-border-card bg-gray-100 dark:bg-black/40 flex items-center justify-center p-2 shadow-sm transition-all duration-300 self-start">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={cert.image} alt={cert.name} className="max-w-full h-auto max-h-32 sm:max-h-40 md:max-h-48 object-contain rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" />
                          </div>
                          
                          {/* Details below (matching columns style visually) */}
                          <div className="flex flex-wrap items-center justify-between gap-6 w-full px-2">
                            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                              <span className="text-text-secondary font-mono bg-gray-50 dark:bg-[#161b22] px-2 py-1 rounded border border-border-card shrink-0">{idx}</span>
                              <div className="min-w-0">
                                <div className="text-text-primary font-sans font-semibold text-base truncate">{cert.name}</div>
                                <div className="text-xs font-mono text-text-secondary mt-1 truncate">
                                  {cert.skills.slice(0, 4).join(", ")}{cert.skills.length > 4 ? "..." : ""}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6 flex-wrap">
                              <span className={`px-2.5 py-1 rounded-md border text-xs whitespace-nowrap ${domainStyle}`}>
                                {cert.domain}
                              </span>
                              
                              <div className="text-text-secondary text-sm whitespace-nowrap">
                                {cert.issuer}
                                <span className="text-xs opacity-50 ml-2">({cert.date})</span>
                              </div>
                              
                              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 whitespace-nowrap">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-xs font-medium">Verified</span>
                              </div>
                              
                              {cert.credentialUrl && cert.credentialUrl !== "#" ? (
                                <a 
                                  href={cert.credentialUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 hover:bg-blue-600/20 dark:hover:bg-blue-500/20 transition-colors text-sm font-medium"
                                >
                                  View Badge <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              ) : (
                                <span className="ml-auto text-text-muted font-mono text-sm px-3 py-1.5">NaN</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                    </motion.tr>
                  );
                }

                // If NO image, render standard row
                return (
                  <motion.tr 
                    key={cert.name + idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-border-card/50 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-4 px-4 text-center text-text-secondary border-r border-border-card bg-gray-50/50 dark:bg-[#161b22]/50 group-hover:bg-gray-50 dark:group-hover:bg-[#161b22] transition-colors">
                      {idx}
                    </td>

                    {/* Image Asset (NaN) */}
                    <td className="py-4 px-4">
                      <span className="text-text-secondary opacity-50 text-xs">NaN</span>
                    </td>
                    
                    {/* Credential Name */}
                    <td className="py-4 px-4 text-text-primary font-sans font-medium">
                      {cert.name}
                      <div className="text-xs font-mono text-text-secondary mt-1 opacity-70">
                        {cert.skills.slice(0, 3).join(", ")}{cert.skills.length > 3 ? "..." : ""}
                      </div>
                    </td>
                    
                    {/* Domain (Heatmap Chip) */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-md border text-xs ${domainStyle}`}>
                        {cert.domain}
                      </span>
                    </td>
                    
                    {/* Issuer */}
                    <td className="py-4 px-4 text-text-secondary">
                      {cert.issuer}
                      <div className="text-xs opacity-50 mt-1">{cert.date}</div>
                    </td>
                    
                    {/* Verification Status */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>1.00</span>
                      </div>
                    </td>
                    
                    {/* Action */}
                    <td className="py-4 px-4">
                      {cert.credentialUrl && cert.credentialUrl !== "#" ? (
                        <a 
                          href={cert.credentialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-electric-blue-600 dark:text-electric-blue-400 hover:text-white bg-electric-blue-500/10 hover:bg-electric-blue-600 dark:hover:bg-electric-blue-500 border border-electric-blue-500/30 transition-colors px-3 py-1.5 rounded text-xs"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View
                        </a>
                      ) : (
                        <span className="text-text-secondary opacity-50 text-xs">NaN</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-text-secondary">
                  Empty DataFrame
                  <br/>
                  Columns: [Asset, Credential_Name, Domain, Issuer, Confidence, Action]
                  <br/>
                  Index: []
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Output footer */}
      <div className="p-3 bg-gray-50 dark:bg-[#161b22] border-t border-border-card text-text-secondary text-xs flex justify-between transition-colors">
        <span>{filteredItems.length} rows × 6 columns</span>
        <span>Dtype: object</span>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 195, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 195, 255, 0.4);
        }
      `}} />
    </div>
  );
}
