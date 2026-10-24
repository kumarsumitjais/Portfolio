import { getBlogBySlug, getAllBlogs } from "@/lib/content/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";
import { BlogPostingJsonLd } from "@/components/JsonLd";

export async function generateStaticParams() {
  const blogs = getAllBlogs();
  return blogs.filter((p): p is NonNullable<typeof p> => p !== null).map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) return { title: "Post Not Found" };
  const url = `https://www.sumitkumarjaiswal.in/blog/${slug}`;
  return {
    title: blog.meta.title,
    description: blog.meta.oneLiner,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${blog.meta.title} | Sumit Kr. Jaiswal`,
      description: blog.meta.oneLiner,
      url,
      publishedTime: blog.meta.date,
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  
  if (!blog) {
    return notFound();
  }

  // Custom components for MDX
  const components = {
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-text-primary" {...props} />,
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-xl font-bold mt-8 mb-4 text-text-primary" {...props} />,
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="text-text-secondary text-lg leading-relaxed mb-6" {...props} />,
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="list-disc pl-5 mb-6 text-text-secondary text-lg space-y-2" {...props} />,
    strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="font-bold text-text-primary" {...props} />,
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img className="w-full rounded-2xl mb-4 mt-8 shadow-level-1 border border-border-card" {...props} />,
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className="text-electric-blue-400 hover:text-electric-blue-300 underline underline-offset-4" {...props} />,
  };

  return (
    <>
    <BlogPostingJsonLd
      title={blog.meta.title}
      description={blog.meta.oneLiner ?? ""}
      url={`https://www.sumitkumarjaiswal.in/blog/${slug}`}
      datePublished={blog.meta.date}
    />
    <main className="container mx-auto px-5 md:px-20 pt-8 pb-20 md:py-32 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" transitionTypes={["nav-back"]} className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-electric-blue-500 dark:hover:text-electric-blue-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Link>
        
        <header className="mb-12 pb-12 border-b border-border-card">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="flex items-center gap-1.5 text-text-secondary text-sm font-mono">
              <Calendar className="w-4 h-4" />
              {new Date(blog.meta.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            {blog.meta.category && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-electric-blue-500/10 text-electric-blue-400 text-sm font-medium rounded-md border border-electric-blue-500/20">
                <Tag className="w-3.5 h-3.5" />
                {blog.meta.category}
              </span>
            )}
          </div>
          
          <ViewTransition name={`blog-title-${slug}`} share="morph">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-text-primary tracking-tight leading-tight">
              {blog.meta.title}
            </h1>
          </ViewTransition>
          
          <p className="text-xl md:text-2xl text-text-secondary leading-relaxed">
            {blog.meta.oneLiner}
          </p>

          {blog.meta.tags && (
            <div className="flex flex-wrap gap-2 mt-8">
              {blog.meta.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1.5 bg-border-card/50 text-text-secondary text-sm font-medium rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <article className="prose-electric">
          <MDXRemote source={blog.content} components={components} />
        </article>
      </div>
    </main>
    </>
  );
}
