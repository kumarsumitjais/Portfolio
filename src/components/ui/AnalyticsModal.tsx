"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, Target, BrainCircuit } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Area,
  AreaChart
} from "recharts";

const progressionData = [
  { year: "2022", Analytics: 12, GenAI: 1, ML: 5 },
  { year: "2023", Analytics: 35, GenAI: 7, ML: 20 },
  { year: "2024", Analytics: 70, GenAI: 50, ML: 55 },
  { year: "2025", Analytics: 85, GenAI: 80, ML: 75 },
  { year: "2026", Analytics: 95, GenAI: 92, ML: 90 },
];

const masteryData = [
  { domain: "Analytics", Current: 95, ProLevel: 100 },
  { domain: "GenAI", Current: 92, ProLevel: 100 },
  { domain: "Machine Learning", Current: 90, ProLevel: 100 },
  { domain: "Web Dev", Current: 85, ProLevel: 100 },
];

export function AnalyticsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-white dark:bg-[#0d1117] border border-border-card rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border-card bg-white/80 dark:bg-[#0d1117]/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-electric-blue-500/10 rounded-lg border border-electric-blue-500/20">
                <BrainCircuit className="w-5 h-5 text-electric-blue-500" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-text-primary">Skill Analytics</h3>
                <p className="text-xs font-mono text-text-secondary">Chasing Perfection (df.describe())</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-8">
            {/* Chart 1: Progression Over Time */}
            <div className="bg-gray-50 dark:bg-[#161b22] border border-border-card p-4 sm:p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <h4 className="font-mono text-sm text-text-primary">Domain Progression Over Time</h4>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAnalytics" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorGenAI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorML" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} vertical={false} />
                    <XAxis dataKey="year" tick={{ fill: '#888', fontSize: 12, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#888', fontSize: 12, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(13, 17, 23, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }} />
                    <Area type="monotone" dataKey="Analytics" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAnalytics)" strokeWidth={2} />
                    <Area type="monotone" dataKey="GenAI" stroke="#a855f7" fillOpacity={1} fill="url(#colorGenAI)" strokeWidth={2} />
                    <Area type="monotone" dataKey="ML" stroke="#22c55e" fillOpacity={1} fill="url(#colorML)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Current Mastery vs Pro Level */}
            <div className="bg-gray-50 dark:bg-[#161b22] border border-border-card p-4 sm:p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-4 h-4 text-electric-blue-500" />
                <h4 className="font-mono text-sm text-text-primary">Current Mastery vs Pro Level (Target: 100)</h4>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={masteryData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="domain" type="category" tick={{ fill: '#888', fontSize: 12, fontFamily: 'monospace' }} axisLine={false} tickLine={false} width={100} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: 'rgba(13, 17, 23, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }} />
                    <Bar dataKey="ProLevel" fill="#2a2a2a" radius={[0, 4, 4, 0]} barSize={20} />
                    <Bar dataKey="Current" fill="#00C3FF" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
