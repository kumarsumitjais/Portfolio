import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { BackgroundEquations } from "@/components/ui/BackgroundEquations";
import { ExperienceSection } from "@/components/sections/Experience";
import { SkillsSection } from "@/components/sections/Skills";
import { StickyParallaxStack } from "@/components/ui/StickyParallaxStack";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getAllProjects } from "@/lib/content/mdx";

export default function Home() {
  const featuredProjects = getAllProjects().slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[720px] flex items-center">
        {/* Abstract background gradient (aurora) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-electric-blue-500/10 blur-[120px] mix-blend-screen" />
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] mix-blend-screen" />
          <BackgroundEquations />
        </div>

        <div className="container mx-auto px-5 md:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (Content) */}
          <div className="col-span-1 lg:col-span-7 flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-electric-blue-500/30 bg-electric-blue-500/10 text-electric-blue-500 text-sm font-medium mb-6">
              AI / ML Engineer &middot; Data Scientist
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.05] mb-6 text-text-primary">
              Behind Every Great Prediction Is an <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue-500 to-cyan-400">Even Better Question.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed">
              I build the models behind the metrics that matter, turning raw data into production-grade intelligence that scales.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/projects"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-electric-blue-500 text-white rounded-xl font-medium hover:bg-electric-blue-400 hover:-translate-y-1 hover:shadow-level-3 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              >
                View Projects <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-graphite-500/30 text-text-primary rounded-xl font-medium hover:border-electric-blue-400 hover:bg-electric-blue-500/5 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              >
                Download Resume <Download className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Right Column (Three.js Placeholder) */}
          <div className="col-span-1 lg:col-span-5 hidden lg:block relative h-[500px] w-full">
            <div className="absolute inset-0 bg-bg-elevated/50 border border-border-card rounded-3xl backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-dashed border-electric-blue-500/50 flex items-center justify-center mb-6 animate-[spin_10s_linear_infinite]">
                <div className="w-16 h-16 rounded-full border border-cyan-400/50 flex items-center justify-center animate-[spin_5s_linear_infinite_reverse]">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(91,76,255,0.8)]" />
                </div>
              </div>
              <p className="text-sm font-mono text-text-secondary text-center max-w-[200px]">
                [ Neural Network Canvas rendering here ]
              </p>
            </div>
            
            {/* Stat Chips Placeholder */}
            <div className="absolute top-10 -left-6 bg-bg-card border border-border-card shadow-level-3 rounded-xl px-4 py-3 backdrop-blur-md flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Avg. Model Accuracy</span>
                <span className="text-lg font-mono font-bold text-text-primary">94.2%</span>
              </div>
            </div>
            
            <div className="absolute bottom-20 -right-6 bg-bg-card border border-border-card shadow-level-3 rounded-xl px-4 py-3 backdrop-blur-md flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Models Shipped</span>
                <span className="text-lg font-mono font-bold text-text-primary">12+</span>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Featured Projects Section */}
      <ScrollReveal delay={0.1}>
        <section className="py-20 bg-bg-base border-t border-border-card">
          <div className="container mx-auto px-5 md:px-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">
                  Selected Work
                </h2>
                <p className="text-text-secondary max-w-xl">
                  A selection of my recent data science models and intelligent systems.
                </p>
              </div>
              <Link href="/projects" className="inline-flex items-center text-sm font-medium text-electric-blue-500 hover:text-electric-blue-400 mt-4 md:mt-0 transition-colors">
                View all projects <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Replaced generic grid with Sticky Parallax Stack */}
            <div className="mt-8">
              <StickyParallaxStack projects={featuredProjects.filter((p): p is NonNullable<typeof p> => p !== null)} />
            </div>
          </div>
        </section>
      </ScrollReveal>
      
      {/* Skills & Experience */}
      <ScrollReveal delay={0.2}>
        <SkillsSection teaser={true} />
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <ExperienceSection />
      </ScrollReveal>
      
    </div>
  );
}
