import { experiences } from "@/content/experience";
import { ArrowRight } from "lucide-react";

export default function ExperiencePage() {
  return (
    <main className="container mx-auto px-5 md:px-20 py-32 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-text-primary">
        Experience
      </h1>
      <p className="text-xl text-text-secondary max-w-3xl mb-16">
        My professional journey, roles, and contributions in data science and software engineering.
      </p>

      <div className="space-y-16 max-w-4xl">
        {experiences.map((exp, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="md:w-1/3 flex-shrink-0">
              <div className="sticky top-32">
                <h3 className="text-2xl font-bold text-text-primary mb-1">
                  {exp.title ? `${exp.title}` : exp.company}
                </h3>
                {exp.title && <h4 className="text-lg text-text-secondary">{exp.company}</h4>}
              </div>
            </div>
            
            <div className="md:w-2/3 bg-bg-elevated border border-border-card rounded-2xl p-6 md:p-8">
              <div className="space-y-10">
                {exp.roles.map((role, j) => (
                  <div key={j} className="relative">
                    {exp.roles.length > 1 && j !== exp.roles.length - 1 && (
                      <div className="absolute left-[7px] top-6 bottom-[-40px] w-[2px] bg-border-card" />
                    )}
                    
                    <div className="flex flex-col mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        {exp.roles.length > 1 && (
                          <div className="w-4 h-4 rounded-full border-2 border-electric-blue-500 bg-bg-elevated z-10 flex-shrink-0" />
                        )}
                        <h4 className="text-xl font-bold text-text-primary">{role.title}</h4>
                      </div>
                      <span className={`text-sm font-mono text-electric-blue-400 bg-electric-blue-500/10 px-3 py-1.5 rounded-full w-fit inline-block border border-electric-blue-500/20 ${exp.roles.length > 1 ? 'ml-7' : ''}`}>
                        {role.start} &mdash; {role.end}
                      </span>
                    </div>
                    
                    <ul className={`space-y-3 text-text-secondary ${exp.roles.length > 1 ? 'ml-7' : ''}`}>
                      {role.bullets.map((bullet, k) => (
                        <li key={k} className="flex items-start">
                          <span className="mr-3 text-cyan-400 mt-1 opacity-80 flex-shrink-0">▹</span>
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
