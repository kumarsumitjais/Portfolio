"use client";

import { useState } from "react";
import Link from "next/link";
import type { Bubble } from "@/lib/content/skillMap";

const CATEGORY_COLOR: Record<string, string> = {
  NLP: "#7F77DD",
  "Data Science": "#1D9E75",
  "Computer Vision": "#D85A30",
  ML: "#378ADD",
  FullStack: "#C9A227",
};
const MIXED = "#2E6BFF";

// Colour a bubble by the category of the projects that use it (blue when mixed).
function colorOf(b: Bubble) {
  const cats = new Set(b.projects.map((p) => p.category));
  return cats.size === 1 ? CATEGORY_COLOR[[...cats][0]] ?? MIXED : MIXED;
}

export function SkillMap({ bubbles, width, height }: { bubbles: Bubble[]; width: number; height: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const current = selected === null ? null : bubbles[selected];
  const legend = [...Object.entries(CATEGORY_COLOR), ["Shared across domains", MIXED]];
  const toggle = (i: number) => setSelected(selected === i ? null : i);

  return (
    <div className="w-full max-w-5xl mx-auto bg-bg-card border border-border-card rounded-2xl shadow-level-2 p-4 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2 font-mono">
        <p className="text-xs md:text-sm text-text-primary">PCA(n_components=2).fit_transform(skills × projects)</p>
        <p className="text-[11px] text-text-secondary">closer = used together · bigger = used more · click a bubble</p>
      </div>

      {/* Keep labels readable on phones: fixed minimum width, scroll sideways. */}
      <div className="overflow-x-auto -mx-1 px-1">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[640px] h-auto"
        role="group"
        aria-label="Map of skills, clustered by the projects that use them"
      >
        <line x1={20} y1={height / 2} x2={width - 20} y2={height / 2} stroke="currentColor" className="text-border-card" strokeDasharray="4 6" />
        <line x1={width / 2} y1={20} x2={width / 2} y2={height - 20} stroke="currentColor" className="text-border-card" strokeDasharray="4 6" />
        <text x={width - 24} y={height / 2 - 8} textAnchor="end" className="fill-text-secondary font-mono" fontSize="11">PC1</text>
        <text x={width / 2 + 8} y={30} className="fill-text-secondary font-mono" fontSize="11">PC2</text>

        {bubbles.map((b, i) => {
          const color = colorOf(b);
          const active = selected === i;
          const dim = selected !== null && !active;
          return (
            <g
              key={b.names.join()}
              transform={`translate(${b.x} ${b.y})`}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(i);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={active}
              aria-label={`${b.names.join(", ")}: used in ${b.projects.length} project${b.projects.length === 1 ? "" : "s"}`}
              className="cursor-pointer outline-none"
              style={{ opacity: dim ? 0.3 : 1, transition: "opacity 0.3s" }}
            >
              <circle r={b.r} fill={color} fillOpacity={active ? 0.35 : 0.16} stroke={color} strokeWidth={active ? 2.5 : 1.2} />
              {b.lines.map((n, k) => (
                <text
                  key={n + k}
                  y={(k - (b.lines.length - 1) / 2) * 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-text-primary font-mono pointer-events-none"
                  fontSize={b.lines.length > 3 ? 9.5 : 11}
                >
                  {n}
                </text>
              ))}
              <text y={b.r - 9} textAnchor="middle" className="font-mono pointer-events-none" fill={color} fontSize="9.5">
                ×{b.projects.length}
              </text>
            </g>
          );
        })}
      </svg>
      </div>

      <div className="min-h-[56px] mt-2 border-t border-border-card pt-3">
        {current ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-text-secondary mr-1">{current.names.join(", ")} →</span>
            {current.projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="text-xs px-2.5 py-1 rounded-md border border-border-card text-text-primary hover:text-electric-blue-400 hover:border-electric-blue-500/40 transition-colors"
              >
                {p.title}
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {legend.map(([name, color]) => (
              <span key={name} className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
