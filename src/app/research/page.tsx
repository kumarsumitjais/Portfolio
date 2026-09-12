import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research work and publications by Sumit Kumar Jaiswal in AI, machine " +
    "learning, and data science.",
  alternates: { canonical: "https://www.sumitkumarjaiswal.in/research" },
  openGraph: {
    title: "Research | Sumit Kumar Jaiswal",
    description:
      "Exploring the frontiers of ML, NLP, and computer vision through " +
      "research projects and published work.",
    url: "https://www.sumitkumarjaiswal.in/research",
  },
};

export default function ResearchPage() {
  return (
    <main className="container mx-auto px-5 md:px-20 py-32 min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-display font-bold mb-6 text-text-primary">Research</h1>
      <p className="text-xl text-text-secondary max-w-2xl bg-bg-elevated border border-border-card p-8 rounded-2xl">
        My academic research and papers will be published here soon.
      </p>
    </main>
  );
}
