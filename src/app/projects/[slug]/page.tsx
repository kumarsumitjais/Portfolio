import { getProjectBySlug, getAllProjects } from "@/lib/content/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.filter((p): p is NonNullable<typeof p> => p !== null).map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  
  if (!project) {
    return notFound();
  }

  // Custom components for MDX
  const components = {
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="text-2xl font-bold mt-12 mb-4 text-text-primary border-b border-border-card pb-2" {...props} />,
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-xl font-bold mt-8 mb-4 text-text-primary" {...props} />,
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="text-text-secondary leading-relaxed mb-6" {...props} />,
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="list-disc pl-5 mb-6 text-text-secondary space-y-2" {...props} />,
    strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="font-bold text-text-primary" {...props} />,
  };

  return (
    <main className="container mx-auto px-5 md:px-20 py-32 min-h-screen">
      <Link href="/projects" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-electric-blue-500 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
      </Link>
      
      <header className="mb-16 pb-12 border-b border-border-card">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-electric-blue-500/10 text-electric-blue-400 text-sm font-medium rounded-md border border-electric-blue-500/20">
            {project.meta.category}
          </span>
          {project.meta.tags?.map((tag: string) => (
            <span key={tag} className="px-3 py-1 bg-border-card/50 text-text-secondary text-sm font-medium rounded-md">
              {tag}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-text-primary tracking-tight">
          {project.meta.title}
        </h1>
        
        <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mb-8 leading-relaxed">
          {project.meta.oneLiner}
        </p>
        
        <div className="flex flex-wrap items-center gap-8 text-sm">
          <div>
            <p className="text-text-secondary mb-1 uppercase tracking-wider text-xs font-bold">Role</p>
            <p className="font-medium text-text-primary">{project.meta.role}</p>
          </div>
          <div>
            <p className="text-text-secondary mb-1 uppercase tracking-wider text-xs font-bold">Timeline</p>
            <p className="font-medium text-text-primary">{project.meta.startDate} — {project.meta.endDate}</p>
          </div>
          {project.meta.heroMetric && (
            <div>
              <p className="text-text-secondary mb-1 uppercase tracking-wider text-xs font-bold">{project.meta.heroMetric.label}</p>
              <p className="font-bold text-electric-blue-500">{project.meta.heroMetric.value}</p>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <article className="col-span-1 lg:col-span-8">
          <MDXRemote source={project.content} components={components} />
        </article>
        
        {/* Right Rail Table of Contents Placeholder */}
        <aside className="col-span-1 lg:col-span-4 hidden lg:block">
          <div className="sticky top-32 p-6 bg-bg-elevated border border-border-card rounded-2xl">
            <h3 className="font-bold text-text-primary mb-4 text-sm uppercase tracking-wider">In this case study</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="hover:text-electric-blue-500 transition-colors cursor-pointer">Problem</li>
              <li className="hover:text-electric-blue-500 transition-colors cursor-pointer">Architecture</li>
              <li className="hover:text-electric-blue-500 transition-colors cursor-pointer">Key Features</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
