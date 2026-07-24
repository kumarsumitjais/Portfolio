import { getAllProjects } from "@/lib/content/mdx";
import { StickyParallaxStack } from "@/components/ui/StickyParallaxStack";

export default function ProjectsPage() {
  const projects = getAllProjects().filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <main className="container mx-auto px-5 md:px-20 py-32 min-h-screen">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-text-primary">
        Projects & Models
      </h1>
      <p className="text-xl text-text-secondary max-w-3xl mb-24">
        A collection of machine learning models, AI agents, and data science solutions built for real-world impact.
      </p>

      {/* Replaced generic grid with the new Sticky Parallax Stack */}
      <StickyParallaxStack projects={projects} />
      
    </main>
  );
}
