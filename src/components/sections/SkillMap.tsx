"use client";

import { useState } from "react";
import Link from "next/link";
import type { Bubble, MapLayout } from "@/lib/content/skillMap";

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

type Map = { layout: MapLayout; bubbles: Bubble[] };

// Three layouts of the same bubbles (same order): wide for desktop, squarer for
// tablets, tall for phones, so labels stay readable without sideways scrolling.
export function SkillMap({ desktop, tablet, mobile }: { desktop: Map; tablet: Map; mobile: Map }) {
  const [selected, setSelected] = useState<number | null>(null);
  const current = selected === null ? null : desktop.bubbles[selected];
  const legend = [...Object.entries(CATEGORY_COLOR), ["Shared across domains", MIXED]];
  const toggle = (i: number) => setSelected(selected === i ? null : i);

  const renderMap = ({ layout, bubbles }: Map, className: string) => {
    const { width, height, vertical } = layout;
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        role="group"
        aria-label="Map of skills, clustered by the projects that use them"
      >
        <line x1={20} y1={height / 2} x2={width - 20} y2={height / 2} stroke="currentColor" className="text-border-card" strokeDasharray="4 6" />
        <line x1={width / 2} y1={20} x2={width / 2} y2={height - 20} stroke="currentColor" className="text-border-card" strokeDasharray="4 6" />
        <text x={width - 24} y={height / 2 - 8} textAnchor="end" className="fill-text-secondary font-mono" fontSize="11">
          {vertical ? "PC2" : "PC1"}
        </text>
        <text x={width / 2 + 8} y={30} className="fill-text-secondary font-mono" fontSize="11">
          {vertical ? "PC1" : "PC2"}
        </text>

        {bubbles.map((b, i) => {
          const color = colorOf(b);
          const active = selected === i;
          const dim = selected !== null && !active;
          const fontSize = (b.lines.length > 3 ? 9.5 : 11) * (vertical ? 1.15 : 1);
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
                  y={(k - (b.lines.length - 1) / 2) * fontSize * 1.1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-text-primary font-mono pointer-events-none"
                  fontSize={fontSize}
                >
                  {n}
                </text>
              ))}
              <text y={b.r - 9} textAnchor="middle" className="font-mono pointer-events-none" style={{ fill: `color-mix(in srgb, ${color}, var(--viz-tone) var(--viz-tone-amt))` }} fontSize="9.5">
                ×{b.projects.length}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-bg-card border border-border-card rounded-2xl shadow-level-2 p-3 sm:p-4 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 mb-2 font-mono">
        <p className="text-[11px] sm:text-xs md:text-sm text-text-primary break-words">
          PCA(n_components=2).fit_transform(skills × projects)
        </p>
        <p className="text-[11px] text-text-secondary">closer = used together · bigger = used more · tap a bubble</p>
      </div>

      {renderMap(mobile, "w-full h-auto md:hidden")}
      {renderMap(tablet, "w-full h-auto hidden md:block lg:hidden")}
      {renderMap(desktop, "w-full h-auto hidden lg:block")}

      <div className="min-h-[56px] mt-2 border-t border-border-card pt-3">
        {current ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-text-secondary mr-1">{current.names.join(", ")} →</span>
            {current.projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="text-xs px-2.5 py-1.5 rounded-md border border-border-card text-text-primary hover:text-electric-blue-400 hover:border-electric-blue-500/40 transition-colors"
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
