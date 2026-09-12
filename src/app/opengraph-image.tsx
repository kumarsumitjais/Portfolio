// ============================================================
// FILE: src/app/opengraph-image.tsx   (new file)
// ⭐ MISSING FROM ANTIGRAVITY PLAN — Auto-generates a professional
//    OG image at /opengraph-image.png using Next.js Edge runtime.
//    No static image file needed. Served automatically by Next.js.
//
// This image appears when your link is shared on:
//   LinkedIn, Twitter/X, WhatsApp, Slack, iMessage, Discord, etc.
// A polished OG image can 3–5× your click-through rate.
// ============================================================

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sumit Kumar Jaiswal – Data Scientist & AI/ML Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #0f1629 50%, #0a192f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          position: "relative",
        }}
      >
        {/* Top: domain + availability badge */}
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <div style={{ color: "#64ffda", fontSize: 18, letterSpacing: "0.1em", fontWeight: 500 }}>
            sumitkumarjaiswal.in
          </div>
          <div
            style={{
              background: "rgba(100,255,218,0.12)",
              border: "1px solid #64ffda",
              color: "#64ffda",
              fontSize: 14,
              padding: "6px 16px",
              borderRadius: 20,
              letterSpacing: "0.05em",
            }}
          >
            ✦ Open to Opportunities
          </div>
        </div>

        {/* Center: Name + title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              color: "#ccd6f6",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Sumit Kumar Jaiswal
          </div>
          <div
            style={{
              color: "#8892b0",
              fontSize: 28,
              fontWeight: 400,
              letterSpacing: "0.01em",
            }}
          >
            Data Scientist & AI/ML Engineer
          </div>
        </div>

        {/* Bottom: stats row */}
        <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
          {[
            { value: "12+", label: "Models Shipped" },
            { value: "94.2%", label: "Avg. Accuracy" },
            { value: "Python · TensorFlow · LangChain", label: "Core Stack" },
          ].map(({ value, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ color: "#64ffda", fontSize: 22, fontWeight: 700 }}>{value}</div>
              <div style={{ color: "#495670", fontSize: 14 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Decorative gradient orb */}
        <div
          style={{
            position: "absolute",
            right: -60,
            top: -60,
            width: 340,
            height: 340,
            background: "radial-gradient(circle, rgba(100,255,218,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
