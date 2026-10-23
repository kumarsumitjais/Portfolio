import Link from "next/link";
import { getAllProjects } from "@/lib/content/mdx";

// Skills ranked by how many project case studies use them, drawn like
// scikit-learn's feature_importances_ plot. Counts come from the MDX content.
const SKILLS = [
  "Python", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Seaborn",
  "TensorFlow", "Keras", "CNN", "Transfer Learning", "Deep Learning", "Computer Vision",
  "NLP", "NLTK", "TF-IDF", "Classification", "Regression", "Feature Engineering",
  "Random Forest", "Decision Tree", "SVM", "Naive Bayes",
  "LangChain", "LangGraph", "FAISS", "HuggingFace", "RAG", "TypeScript", "Next.js",
];
const TOP = 14;

export function SkillEvidence() {
  const projects = getAllProjects().map((p) => ({
    slug: p.slug,
    title: p.meta.title as string,
    text: `${p.meta.category ?? ""} ${(p.meta.tags ?? []).join(" ")} ${p.content}`.toLowerCase(),
  }));

  const ranked = SKILLS.map((skill) => {
    const pattern = new RegExp(`(?<![a-z0-9])${skill.toLowerCase().replace(/[.+]/g, "\$&")}(?![a-z0-9])`);
    return { skill, used: projects.filter((p) => pattern.test(p.text)) };
  })
    .filter((s) => s.used.length > 0)
    .sort((a, b) => b.used.length - a.used.length || a.skill.localeCompare(b.skill));

  const shown = ranked.slice(0, TOP);
  const max = shown[0]?.used.length ?? 1;

  return (
    <div className="w-full max-w-4xl mx-auto bg-bg-card border border-border-card rounded-2xl shadow-level-2 p-5 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6 font-mono">
        <p className="text-sm text-text-primary">
          model.feature_importances_
          <span className="text-text-secondary"> # skills ranked by projects that use them</span>
        </p>
        <p className="text-xs text-text-secondary">{projects.length} case studies · click a bar</p>
      </div>

      <ul className="space-y-1.5">
        {shown.map(({ skill, used }) => (
          <li key={skill}>
            <details className="group">
              <summary className="flex items-center gap-3 cursor-pointer list-none rounded-md px-1 py-1 hover:bg-electric-blue-500/5 [&::-webkit-details-marker]:hidden">
                <span className="w-32 md:w-40 shrink-0 text-right font-mono text-xs md:text-sm text-text-secondary group-open:text-text-primary">
                  {skill}
                </span>
                <span className="flex-1 h-5 rounded-sm bg-border-card/40 overflow-hidden">
                  <span
                    className="block h-full rounded-sm bg-gradient-to-r from-electric-blue-500 to-cyan-400 transition-[width] duration-700"
                    style={{ width: `${(used.length / max) * 100}%` }}
                  />
                </span>
                <span className="w-20 shrink-0 font-mono text-xs text-text-secondary">
                  {used.length} project{used.length === 1 ? "" : "s"}
                </span>
              </summary>
              <div className="ml-[8.75rem] md:ml-[10.75rem] mt-1 mb-2 flex flex-wrap gap-2">
                {used.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="text-xs px-2.5 py-1 rounded-md border border-border-card text-text-secondary hover:text-electric-blue-400 hover:border-electric-blue-500/40 transition-colors"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </details>
          </li>
        ))}
      </ul>

      {ranked.length > TOP && (
        <p className="mt-4 font-mono text-xs text-text-secondary">
          + {ranked.slice(TOP).map((s) => s.skill).join(", ")}
        </p>
      )}
    </div>
  );
}
