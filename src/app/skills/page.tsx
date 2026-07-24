import { SkillsSection } from "@/components/sections/Skills";

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
