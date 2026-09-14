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
    <main className="pt-0 pb-05 min-h-screen">
      <SkillsSection />
    </main>
  );
}
