"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LX = [55, 197, 340, 482, 625];
const CY = 255, VS = 55, NR = 20;

const LAYERS = [
  { name:'Languages', sub:'Input', color:'#378ADD', nodes:[
    {name:'Python',abbr:'Py',prof:92},
    {name:'SQL',abbr:'SQL',prof:82},
    {name:'C/C++',abbr:'C++',prof:72},
    {name:'HTML/CSS',abbr:'HTM',prof:70},
  ]},
  { name:'Processing', sub:'Hidden I', color:'#1D9E75', nodes:[
    {name:'Pandas',abbr:'Pnd',prof:92},
    {name:'NumPy',abbr:'Npy',prof:90},
    {name:'Matplotlib',abbr:'Mpl',prof:88},
    {name:'Power BI',abbr:'PBI',prof:78},
    {name:'Tableau',abbr:'Tab',prof:75},
  ]},
  { name:'Frameworks', sub:'Hidden II', color:'#7F77DD', nodes:[
    {name:'Scikit-learn',abbr:'SKL',prof:90},
    {name:'TensorFlow',abbr:'TF',prof:85},
    {name:'Keras',abbr:'Krs',prof:83},
    {name:'LangChain',abbr:'LC',prof:85},
    {name:'LangGraph',abbr:'LG',prof:80},
    {name:'FAISS',abbr:'FSS',prof:82},
  ]},
  { name:'Domains', sub:'Hidden III', color:'#D85A30', nodes:[
    {name:'Machine Learning',abbr:'ML',prof:88},
    {name:'Deep Learning',abbr:'DL',prof:82},
    {name:'NLP',abbr:'NLP',prof:85},
    {name:'Comp. Vision',abbr:'CV',prof:78},
    {name:'Gen AI',abbr:'GAI',prof:80},
  ]},
  { name:'Capabilities', sub:'Output', color:'#5BA85B', nodes:[
    {name:'ML Models',abbr:'MLM',prof:94},
    {name:'LLM Agents',abbr:'LLM',prof:85},
    {name:'Data Analysis',abbr:'DA',prof:90},
    {name:'CV Systems',abbr:'CVS',prof:79},
  ]},
];

const pos = LAYERS.map((layer, li) => {
  const n = layer.nodes.length;
  const total = (n-1)*VS;
  return layer.nodes.map((node, ni) => ({
    x: LX[li], y: CY - total/2 + ni*VS,
    ...node, color: layer.color, li, ni, id:`n${li}_${ni}`
  }));
});
const allNodes = pos.flat();

const conns: any[] = [];
for (let li = 0; li < LAYERS.length-1; li++) {
  for (const f of pos[li]) {
    for (const t of pos[li+1]) {
      conns.push({ f, t, id:`c${f.id}_${t.id}` });
    }
  }
}

export function SkillsRadar({ 
  activeFilter = "All", 
  setActiveFilter = () => {},
  isScanning = false
}: { 
  activeFilter?: string, 
  setActiveFilter?: (domain: string) => void,
  isScanning?: boolean
} = {}) {
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<(SVGCircleElement | null)[]>([]);

  const bezPt = (t: number, x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1+x2)/2, mt = 1-t;
    return {
      x: mt*mt*mt*x1 + 3*mt*mt*t*mx + 3*mt*t*t*mx + t*t*t*x2,
      y: y1*mt*mt*(1+2*t) + y2*t*t*(3-2*t)
    };
  };

  useEffect(() => {
    let parts: any[] = [];
    const initWave = () => {
      parts = conns.map((c, i) => ({
        c,
        delay: c.f.li * 380 + (i % 5) * 22,
        dur: 550 + (i % 3) * 80,
        t: -(c.f.li * 380 + (i % 5) * 22),
        done: false,
      }));
    };

    initWave();

    const animate = (time: number) => {
      const dt = time - (lastTimeRef.current || time);
      lastTimeRef.current = time;
      
      let allDone = true;
      
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const el = particlesRef.current[i];
        if (p.done || !el) continue;
        
        p.t += dt; 
        allDone = false;
        
        if (p.t < 0) {
          if (el.getAttribute('opacity') !== '0') el.setAttribute('opacity', '0');
          continue;
        }
        
        const prog = Math.min(p.t / p.dur, 1);
        const pt = bezPt(prog, p.c.f.x, p.c.f.y, p.c.t.x, p.c.t.y);
        el.setAttribute('cx', String(pt.x));
        el.setAttribute('cy', String(pt.y));
        
        const alpha = prog < 0.12 ? prog/0.12 : prog > 0.88 ? (1-prog)/0.12 : 1;
        el.setAttribute('opacity', String((alpha * 0.9).toFixed(2)));
        
        if (prog >= 1) { 
          el.setAttribute('opacity', '0'); 
          p.done = true; 
        }
      }
      
      if (!allDone) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        lastTimeRef.current = 0;
        setTimeout(() => {
          initWave();
          lastTimeRef.current = 0;
          if (document.visibilityState === 'visible') {
            requestRef.current = requestAnimationFrame(animate);
          }
        }, 1800);
      }
    };
    
    // Setup visibility handler to pause animation when tab is inactive
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        lastTimeRef.current = 0;
        requestRef.current = requestAnimationFrame(animate);
      } else if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibility);
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const getTooltipStyle = () => {
    if (!hoveredNode || !svgRef.current || !wrapRef.current) return { display: 'none' };
    const svgR = svgRef.current.getBoundingClientRect();
    const wR = wrapRef.current.getBoundingClientRect();
    const sc = svgR.width / 680;
    let tx = (hoveredNode.x * sc) + (svgR.left - wR.left) + 28;
    const ty = (hoveredNode.y * sc) + (svgR.top - wR.top) - 20;
    if (tx + 160 > wR.width) tx = (hoveredNode.x * sc) + (svgR.left - wR.left) - 188;
    
    return {
      left: tx,
      top: ty,
      display: 'block'
    };
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto min-h-[500px] md:min-h-[600px] bg-bg-card border border-border-card rounded-2xl shadow-level-2 p-4 md:p-8 flex flex-col relative overflow-hidden group"
    >
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-electric-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-4 flex-wrap z-20">
        <span className="text-[11px] text-text-secondary">model: skj-skills-v2.0 &nbsp;·&nbsp; avg accuracy: 94.2% &nbsp;·&nbsp; depth: 5 layers</span>
        <span className="text-[11px] text-cyan-400 ml-auto flex items-center gap-2 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
          forward pass running
        </span>
      </div>

      <div id="wrap" ref={wrapRef} className="relative flex-1 flex flex-col items-center justify-center w-full min-h-[400px] z-10">
        <svg ref={svgRef} width="100%" viewBox="0 0 680 430" className="block overflow-visible w-full h-auto max-h-[500px]">
          {/* Label Layer */}
          <g id="label-layer">
            {LAYERS.map((layer, li) => (
              <React.Fragment key={layer.name}>
                <text x={LX[li]} y="18" textAnchor="middle" fill={layer.color} fontSize="11" fontWeight="500" fontFamily="monospace">
                  {layer.name}
                </text>
                <text x={LX[li]} y="31" textAnchor="middle" fill="#8b949e" fontSize="9" fontWeight="400" fontFamily="monospace">
                  {layer.sub}
                </text>
              </React.Fragment>
            ))}
          </g>

          {/* Connection Layer */}
          <g id="conn-layer">
            {conns.map((c) => {
              const mx = (c.f.x + c.t.x) / 2;
              const isRelated = hoveredNode && (c.f.id === hoveredNode.id || c.t.id === hoveredNode.id);
              const isHovered = hoveredNode !== null;
              
              const strokeColor = isRelated ? (c.f.id === hoveredNode.id ? c.f.color : c.t.color) : 'rgba(255,255,255,0.1)';
              const strokeWidth = isRelated ? 1.5 : 0.5;
              const opacity = isHovered ? (isRelated ? 0.85 : 0.06) : 0.35;
              
              return (
                <path
                  key={c.id}
                  d={`M${c.f.x} ${c.f.y}C${mx} ${c.f.y} ${mx} ${c.t.y} ${c.t.x} ${c.t.y}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  opacity={opacity}
                  strokeLinecap="round"
                  style={{ transition: 'stroke 0.3s, stroke-width 0.3s, opacity 0.3s' }}
                />
              )
            })}
          </g>

          {/* Particles Layer */}
          <g id="part-layer">
            {conns.map((c, i) => (
              <circle
                key={`part-${i}`}
                ref={el => { particlesRef.current[i] = el; }}
                r="3"
                fill={c.f.color}
                opacity="0"
              />
            ))}
          </g>

          {/* Node Layer */}
          <g id="node-layer">
            {allNodes.map((node) => {
              const isHovered = hoveredNode?.id === node.id;
              const fillOpacity = isHovered ? 0.3 : 0.18;
              
              return (
                <g 
                  key={node.id} 
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle cx={node.x} cy={node.y} r={NR} fill="#0d1117" stroke={node.color} strokeWidth="1.5" />
                  <circle cx={node.x} cy={node.y} r={(node.prof/100)*NR*0.65} fill={node.color} opacity={fillOpacity} style={{ transition: 'opacity 0.3s' }} />
                  <text 
                    x={node.x} 
                    y={node.y} 
                    textAnchor="middle" 
                    dominantBaseline="central" 
                    fill={node.color} 
                    fontSize={node.abbr.length <= 2 ? 11 : 9} 
                    fontWeight="500" 
                    fontFamily="monospace" 
                    pointerEvents="none"
                  >
                    {node.abbr}
                  </text>
                </g>
              )
            })}
          </g>

          {/* SVG Tooltip using foreignObject */}
          {hoveredNode && (
            <foreignObject
              x={hoveredNode.x > 340 ? hoveredNode.x - 170 : hoveredNode.x + 20}
              y={hoveredNode.y - 45}
              width="160"
              height="100"
              className="overflow-visible pointer-events-none"
              style={{ zIndex: 50 }}
            >
              <div className="bg-[#0d1117] border border-slate-700/50 rounded-lg p-3 text-xs shadow-lg w-[148px]">
                <div className="font-medium text-white mb-0.5">{hoveredNode.name}</div>
                <div className="text-[11px] text-gray-400 mb-2">{LAYERS[hoveredNode.li].name}</div>
                <div className="h-[3px] bg-slate-800 rounded-sm overflow-hidden mb-1.5">
                  <div 
                    className="h-full rounded-sm transition-all duration-300"
                    style={{ width: `${hoveredNode.prof}%`, backgroundColor: hoveredNode.color }}
                  />
                </div>
                <div className="text-[11px] text-gray-300">Proficiency: {hoveredNode.prof}%</div>
              </div>
            </foreignObject>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 z-20">
        {LAYERS.map(layer => (
          <div key={layer.name} className="flex items-center gap-1.5 text-[11px] text-text-secondary">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
            {layer.name}
          </div>
        ))}
      </div>

    </motion.div>
  );
}
