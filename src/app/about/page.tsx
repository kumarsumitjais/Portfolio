import { education } from "@/content/education";
import { certifications } from "@/content/certifications";
import { achievements } from "@/content/achievements";
import Image from "next/image";
import { OrbitalInfographic } from "@/components/ui/OrbitalInfographic";
import { ComputingPipeline } from "@/components/ui/ComputingPipeline";
import { FeatureMatrix } from "@/components/ui/FeatureMatrix";
export default function AboutPage() {
  return (
    <main className="container mx-auto px-5 md:px-20 py-32 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* Left Column - Sticky Profile */}
        <div className="col-span-1 lg:col-span-4">
          <div className="sticky top-32">
            <div className="relative w-full aspect-square max-w-[360px] mx-auto lg:mx-0 rounded-3xl overflow-hidden mb-8 border border-border-card bg-bg-elevated p-2 shadow-level-1">
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <Image src="/images/profile-new.jpg" alt="Sumit Kumar Jaiswal" fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover object-top" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-2 text-center lg:text-left">Sumit Kumar Jaiswal</h1>
            <p className="text-text-secondary mb-8 text-center lg:text-left text-lg">Data Science & Machine Learning Specialist</p>

            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-4 bg-electric-blue-500 text-white font-medium rounded-xl hover:bg-electric-blue-400 transition-colors w-full text-center shadow-lg shadow-electric-blue-500/25">
              Download Full Resume
            </a>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="col-span-1 lg:col-span-8 space-y-24">

          <section>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-text-primary">About Me</h2>
            <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed text-lg">
              <p>
                I am a Final year B.Tech CSE student specializing in Data Science & Machine Learning,
                with hands-on experience in predictive modelling, NLP, and applied AI agent development (LLMs, RAG, LangChain/LangGraph).
              </p>
              <p>
                My objective is to leverage my skills in business intelligence, data structures & algorithms, analytics,
                and data visualization to build intelligent systems that solve real-world problems.
                I have a proven track record of organizational abilities honed through leading student-led initiatives.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-10 text-text-primary">Education</h2>
            <div className="space-y-6">
              {education.map((edu, i) => (
                <div key={i} className="bg-bg-elevated border border-border-card rounded-2xl p-6 hover:border-electric-blue-500/30 transition-colors shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-text-primary">{edu.degree}</h3>
                    <span className="text-sm font-mono text-electric-blue-400 bg-electric-blue-500/10 px-3 py-1.5 rounded-full w-fit mt-2 md:mt-0 border border-electric-blue-500/20">
                      {edu.dates}
                    </span>
                  </div>
                  <h4 className="text-lg text-text-secondary mb-2">{edu.institution}</h4>
                  {edu.gpa && <p className="text-sm text-text-secondary font-medium">{edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-10 text-text-primary">Certifications</h2>
            <FeatureMatrix items={certifications} />
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-2 text-text-primary">Achievements & Extracurriculars</h2>
            <p className="text-text-secondary mb-10">Processed timeline of significant milestones and awards.</p>
            <ComputingPipeline items={achievements} />
          </section>

        </div>
      </div>
    </main>
  );
}
