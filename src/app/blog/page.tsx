import { getAllBlogs } from "@/lib/content/mdx";
import Link from "next/link";
import { ArrowRight, Calendar, Tag } from "lucide-react";

export default function BlogPage() {
  const blogs = getAllBlogs();

  return (
    <main className="container mx-auto px-5 md:px-20 py-32 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-text-primary">Blog & Writings</h1>
          <p className="text-xl text-text-secondary">
            Thoughts on data science, engineering, hackathons, and everything in between.
          </p>
        </header>

        {blogs.length === 0 ? (
          <div className="bg-bg-elevated border border-border-card p-12 rounded-2xl text-center">
            <h3 className="text-xl font-bold text-text-primary mb-2">No posts yet</h3>
            <p className="text-text-secondary">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {blogs.map((blog) => (
              <Link 
                key={blog.slug} 
                href={`/blog/${blog.slug}`}
                className="block group bg-bg-card hover:bg-bg-elevated border border-border-card hover:border-electric-blue-500/50 rounded-2xl p-6 md:p-8 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-xs font-mono text-text-secondary mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(blog.meta.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {blog.meta.category && (
                        <span className="flex items-center gap-1 text-electric-blue-400">
                          <Tag className="w-3 h-3" />
                          {blog.meta.category}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-electric-blue-400 transition-colors">
                      {blog.meta.title}
                    </h2>
                    
                    <p className="text-text-secondary leading-relaxed mb-6">
                      {blog.meta.oneLiner}
                    </p>

                    {blog.meta.tags && (
                      <div className="flex flex-wrap gap-2 mb-6 md:mb-0">
                        {blog.meta.tags.map((tag: string) => (
                          <span key={tag} className="px-2.5 py-1 bg-border-card/30 text-text-secondary text-xs rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="hidden md:flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-full bg-electric-blue-500/10 text-electric-blue-500 group-hover:bg-electric-blue-500 group-hover:text-black transition-all">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  {/* Mobile read more */}
                  <div className="md:hidden flex items-center gap-2 text-electric-blue-400 text-sm font-medium">
                    Read article <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
