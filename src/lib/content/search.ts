import { getAllProjects, getAllBlogs } from "./mdx";
import { experiences } from "@/content/experience";
import { certifications } from "@/content/certifications";
import { achievements } from "@/content/achievements";
import { skills } from "@/content/skills";
import { education } from "@/content/education";

// Tiny TF-IDF retriever over the site's own content, used to ground Sahayika.
// ponytail: keyword match only, swap for embeddings if paraphrased questions miss too often.

export interface Source {
  title: string;
  href: string;
}

interface Chunk extends Source {
  text: string;
  terms: Map<string, number>;
}

const STOP = new Set(
  "the a an and or of to in on for with is are was were be been it its this that what which who how why when where does do did can could would should his her he she sumit sumit's about tell me you your i my we our from by as at into than then there their them they has have had any some more most also just hi hello hey name thanks thank please ok okay yes no".split(" ")
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/<[^>]+>|!\[[^\]]*\]\([^)]*\)/g, " ")
    .split(/[^a-z0-9+#.]+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ""))
    .map((t) => (t.length > 3 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t)) // naive plural stem
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function toChunks(source: Source, body: string): Chunk[] {
  // Split on headings / blank lines, then merge small pieces up to ~700 chars.
  const parts = body.split(/\n(?=#{1,3} )|\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const merged: string[] = [];
  for (const p of parts) {
    const last = merged[merged.length - 1];
    if (last && last.length + p.length < 700) merged[merged.length - 1] = `${last}\n${p}`;
    else merged.push(p);
  }
  return merged.map((text) => {
    const terms = new Map<string, number>();
    // Title words count in every chunk so "autostream" finds all its chunks.
    for (const t of [...tokenize(source.title), ...tokenize(text)]) terms.set(t, (terms.get(t) ?? 0) + 1);
    return { ...source, text, terms };
  });
}

let index: { chunks: Chunk[]; idf: Map<string, number> } | null = null;

function buildIndex() {
  const chunks: Chunk[] = [];
  for (const p of getAllProjects()) {
    const m = p.meta;
    const head = `${m.title}. ${m.oneLiner ?? ""} Category: ${m.category}. Tags: ${(m.tags ?? []).join(", ")}. ${m.heroMetric ? `${m.heroMetric.label}: ${m.heroMetric.value}.` : ""}`;
    chunks.push(...toChunks({ title: m.title, href: `/projects/${p.slug}` }, `${head}\n\n${p.content}`));
  }
  for (const b of getAllBlogs()) {
    chunks.push(...toChunks({ title: b.meta.title, href: `/blog/${b.slug}` }, `${b.meta.title}\n\n${b.content}`));
  }
  chunks.push(
    ...toChunks(
      { title: "Experience & leadership", href: "/experience" },
      experiences
        .map((e) => `${e.company}: ${e.roles.map((r) => `${r.title} (${r.start} – ${r.end}). ${r.bullets.join(" ")}`).join(" ")}`)
        .join("\n\n")
    ),
    ...toChunks(
      { title: "Certifications", href: "/about" },
      certifications.map((c) => `${c.name} — ${c.issuer}, ${c.date}. Skills: ${c.skills.join(", ")}`).join("\n\n")
    ),
    ...toChunks(
      { title: "Achievements", href: "/about" },
      achievements.map((a) => `${a.title} — ${a.event}, ${a.date}`).join("\n\n")
    ),
    ...toChunks(
      { title: "Education", href: "/about" },
      education.map((e) => Object.values(e).join(" · ")).join("\n\n")
    ),
    ...toChunks(
      { title: "Skills", href: "/skills" },
      Object.values(skills).map((s) => `${s.title}: ${s.items.join(", ")}`).join("\n\n")
    )
  );

  const df = new Map<string, number>();
  for (const c of chunks) for (const t of c.terms.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const idf = new Map<string, number>();
  for (const [t, n] of df) idf.set(t, Math.log(1 + chunks.length / n));
  return { chunks, idf };
}

export function retrieve(query: string, k = 4) {
  index ??= buildIndex();
  const { chunks, idf } = index;
  const q = [...new Set(tokenize(query))];
  const scored = chunks
    .map((c) => ({
      c,
      score: q.reduce((s, t) => s + (c.terms.has(t) ? (1 + Math.log(c.terms.get(t)!)) * idf.get(t)! : 0), 0),
    }))
    .filter((x) => x.score > 1.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
  return {
    searched: chunks.length,
    hits: scored.map(({ c }) => ({ title: c.title, href: c.href, text: c.text.slice(0, 900) })),
  };
}
