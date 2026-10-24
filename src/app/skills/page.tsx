import { SkillsSection } from "@/components/sections/Skills";
import { PageTransition } from "@/components/layout/PageTransition";
import { SkillMap } from "@/components/sections/SkillMap";
import { buildSkillMap, DESKTOP_LAYOUT, TABLET_LAYOUT, MOBILE_LAYOUT } from "@/lib/content/skillMap";
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
    <PageTransition kind="skills">
    <main className="pt-0 pb-05 min-h-screen">
      <SkillsSection
        chart={
          <SkillMap
            desktop={{ layout: DESKTOP_LAYOUT, bubbles: buildSkillMap(DESKTOP_LAYOUT) }}
            tablet={{ layout: TABLET_LAYOUT, bubbles: buildSkillMap(TABLET_LAYOUT) }}
            mobile={{ layout: MOBILE_LAYOUT, bubbles: buildSkillMap(MOBILE_LAYOUT) }}
          />
        }
      />
    </main>
    </PageTransition>
  );
}
