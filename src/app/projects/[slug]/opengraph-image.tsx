import { ImageResponse } from "next/og";
import { getProjectBySlug, getAllProjects } from "@/lib/content/mdx";

// Per-project share card: the project's headline result, big, so it reads in a feed.
export const alt = "Project case study by Sumit Kumar Jaiswal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const meta = project?.meta ?? {};
  const metric = meta.heroMetric as { label: string; value: string } | undefined;
  const tags = ((meta.tags as string[]) ?? []).slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #0f1629 55%, #0a192f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", color: "#64ffda", fontSize: 20 }}>
          <div style={{ display: "flex" }}>sumitkumarjaiswal.in/projects</div>
          <div
            style={{
              display: "flex",
              border: "1px solid #2E6BFF",
              color: "#5C8CFF",
              padding: "6px 16px",
              borderRadius: 20,
              fontSize: 18,
            }}
          >
            {(meta.category as string) ?? "Project"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 18 }}>
            <div style={{ display: "flex", color: "#ccd6f6", fontSize: 58, fontWeight: 700, lineHeight: 1.1 }}>
              {(meta.title as string) ?? "Project"}
            </div>
            <div style={{ display: "flex", color: "#8892b0", fontSize: 26, lineHeight: 1.35 }}>
              {(meta.oneLiner as string) ?? ""}
            </div>
          </div>
          {metric && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 280,
                padding: "32px 28px",
                borderRadius: 28,
                background: "rgba(46,107,255,0.12)",
                border: "1px solid rgba(92,140,255,0.4)",
              }}
            >
              <div style={{ display: "flex", color: "#64ffda", fontSize: metric.value.length > 8 ? 44 : 84, fontWeight: 800, textAlign: "center" }}>
                {metric.value}
              </div>
              <div style={{ display: "flex", color: "#8892b0", fontSize: 20, marginTop: 8, textTransform: "uppercase", letterSpacing: 2 }}>
                {metric.label}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {tags.map((t) => (
              <div key={t} style={{ display: "flex", color: "#a8b2d1", fontSize: 18, padding: "6px 14px", borderRadius: 8, background: "rgba(255,255,255,0.06)" }}>
                {t}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", color: "#ccd6f6", fontSize: 22, fontWeight: 600 }}>Sumit Kumar Jaiswal</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
