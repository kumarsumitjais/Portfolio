import { SkillsSection } from "@/components/sections/Skills";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Technical skills of Sumit Kumar Jaiswal: Python, TensorFlow, LangChain, " +
    "Scikit-learn, FAISS, Pandas, NumPy, MySQL, Git, and more.",
  alternates: { canonical: "https://www.sumitkumarjaiswal.in/skills" },
  openGraph: {
    title: "Technical Skills | Sumit Kumar Jaiswal",
    description:
      "Full stack of tools: Python · TensorFlow · LangChain · Scikit-learn · " +
      "FAISS · NLP · Computer Vision · SQL.",
    url: "https://www.sumitkumarjaiswal.in/skills",
  },
};

export default function SkillsPage() {
  return (
    <main className="container mx-auto px-5 md:px-20 py-32 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-display font-bold mb-12 text-text-primary">
        Skills & Tech Stack
      </h1>
      <div className="bg-bg-base -mx-5 md:-mx-20">
        <SkillsSection />
      </div>
    </main>
  );
}
