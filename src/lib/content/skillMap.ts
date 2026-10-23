import { getAllProjects } from "./mdx";

// Builds a 2D "skill map": each skill is a vector of which projects use it
// (counted from the MDX content), reduced to 2D with PCA so skills used together
// sit together. Skills with identical vectors are merged into one bubble.

const SKILLS = [
  "Python", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Seaborn",
  "TensorFlow", "Keras", "CNN", "Transfer Learning", "Deep Learning", "Computer Vision",
  "NLP", "NLTK", "TF-IDF", "Classification", "Regression", "Feature Engineering",
  "Random Forest", "Decision Tree", "SVM", "Naive Bayes",
  "LangChain", "LangGraph", "FAISS", "HuggingFace", "RAG", "TypeScript", "Next.js",
];

export interface Bubble {
  names: string[];
  lines: string[]; // label lines (long names wrapped)
  projects: { slug: string; title: string; category: string }[];
  x: number;
  y: number;
  r: number;
}

export interface MapLayout {
  width: number;
  height: number;
  vertical: boolean; // phones: PC1 runs top-to-bottom so the map fits a tall screen
  pad: number;
  scale: number; // bubble size multiplier
}
export const DESKTOP_LAYOUT: MapLayout = { width: 900, height: 520, vertical: false, pad: 90, scale: 1 };
export const TABLET_LAYOUT: MapLayout = { width: 680, height: 600, vertical: false, pad: 70, scale: 0.95 };
export const MOBILE_LAYOUT: MapLayout = { width: 400, height: 760, vertical: true, pad: 50, scale: 0.95 };

// Top-k eigenvectors of a symmetric matrix by power iteration with deflation.
function topEigenvectors(C: number[][], k: number) {
  const n = C.length;
  const M = C.map((row) => [...row]);
  const out: number[][] = [];
  for (let e = 0; e < k; e++) {
    let v = Array.from({ length: n }, (_, i) => 1 + i * 0.01);
    let lambda = 0;
    for (let it = 0; it < 200; it++) {
      const w = M.map((row) => row.reduce((s, x, j) => s + x * v[j], 0));
      const norm = Math.hypot(...w) || 1;
      v = w.map((x) => x / norm);
      lambda = norm;
    }
    out.push(v);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) M[i][j] -= lambda * v[i] * v[j];
  }
  return out;
}

export function buildSkillMap({ width: MAP_W, height: MAP_H, vertical, pad, scale }: MapLayout): Bubble[] {
  const projects = getAllProjects().map((p) => ({
    slug: p.slug,
    title: p.meta.title as string,
    category: (p.meta.category as string) ?? "",
    text: `${p.meta.category ?? ""} ${(p.meta.tags ?? []).join(" ")} ${p.content}`.toLowerCase(),
  }));

  // Skill -> binary project vector, merging skills with identical vectors.
  const groups = new Map<string, { names: string[]; vec: number[] }>();
  for (const skill of SKILLS) {
    const re = new RegExp(`(?<![a-z0-9])${skill.toLowerCase().replace(/[.+]/g, "\\$&")}(?![a-z0-9])`);
    const vec = projects.map((p) => (re.test(p.text) ? 1 : 0));
    if (!vec.some(Boolean)) continue;
    const key = vec.join("");
    const group = groups.get(key);
    if (group) group.names.push(skill);
    else groups.set(key, { names: [skill], vec });
  }
  const rows = [...groups.values()];
  if (rows.length === 0) return [];

  // PCA: center columns, eigen-decompose the covariance, project onto PC1/PC2.
  const P = projects.length;
  const mean = Array.from({ length: P }, (_, j) => rows.reduce((s, r) => s + r.vec[j], 0) / rows.length);
  const X = rows.map((r) => r.vec.map((x, j) => x - mean[j]));
  const C = Array.from({ length: P }, (_, i) =>
    Array.from({ length: P }, (_, j) => X.reduce((s, r) => s + r[i] * r[j], 0))
  );
  const [pc1, pc2] = topEigenvectors(C, 2);
  const coords = X.map((r) => [
    r.reduce((s, x, j) => s + x * pc1[j], 0),
    r.reduce((s, x, j) => s + x * pc2[j], 0),
  ]);

  const xs = coords.map((c) => (vertical ? c[1] : c[0]));
  const ys = coords.map((c) => (vertical ? c[0] : c[1]));
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const bubbles: Bubble[] = rows.map((r, i) => {
    const count = r.vec.reduce((s, x) => s + x, 0);
    // Wrap two-word names onto two lines so labels stay narrow.
    const lines = r.names.flatMap((n) => (n.length > 10 && n.includes(" ") ? n.split(" ") : [n]));
    const longest = Math.max(...lines.map((l) => l.length));
    return {
      names: r.names,
      lines,
      projects: projects.filter((_, j) => r.vec[j]).map(({ slug, title, category }) => ({ slug, title, category })),
      x: pad + ((xs[i] - minX) / (maxX - minX || 1)) * (MAP_W - 2 * pad),
      y: pad + ((ys[i] - minY) / (maxY - minY || 1)) * (MAP_H - 2 * pad),
      // Big enough for its usage count and for its label lines to fit inside.
      // Size follows usage; grows only as much as needed to fit the label.
      r: scale * Math.max(16 + count * 9, longest * 3.3 + 8, lines.length * 6.5 + 12),
    };
  });

  // Push overlapping bubbles apart (keeps the PCA layout, just removes collisions).
  for (let it = 0; it < 300; it++) {
    for (let a = 0; a < bubbles.length; a++) {
      for (let b = a + 1; b < bubbles.length; b++) {
        const A = bubbles[a];
        const B = bubbles[b];
        const dx = B.x - A.x || 0.01;
        const dy = B.y - A.y || 0.01;
        const d = Math.hypot(dx, dy);
        const min = A.r + B.r + 6;
        if (d < min) {
          const push = (min - d) / 2;
          A.x -= (dx / d) * push;
          A.y -= (dy / d) * push;
          B.x += (dx / d) * push;
          B.y += (dy / d) * push;
        }
      }
    }
    for (const B of bubbles) {
      B.x = Math.min(MAP_W - B.r - 4, Math.max(B.r + 4, B.x));
      B.y = Math.min(MAP_H - B.r - 4, Math.max(B.r + 4, B.y));
    }
  }
  return bubbles;
}
