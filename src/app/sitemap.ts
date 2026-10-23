// ============================================================
// FILE: src/app/sitemap.ts   (new file)
// Next.js auto-serves this as /sitemap.xml — no extra config needed.
// ============================================================

import { MetadataRoute } from "next";
import { getAllProjects, getAllBlogs } from "@/lib/content/mdx";

// Slugs come from the MDX content files, so new projects and posts are listed automatically.
const PROJECT_SLUGS = getAllProjects().map((p) => p.slug);
const BLOG_SLUGS = getAllBlogs().map((b) => b.slug);

const BASE_URL = "https://www.sumitkumarjaiswal.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Static pages ─────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: now,
      changeFrequency: "weekly",   // high — you add projects often
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/skills`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/research`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",   // high — fresh content hub
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/experience`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  // ── Dynamic project pages ─────────────────────────────────────
  const projectRoutes: MetadataRoute.Sitemap = PROJECT_SLUGS.map((slug) => ({
    url: `${BASE_URL}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.88,   // individual case studies rank well
  }));

  // ── Dynamic blog posts ────────────────────────────────────────
  const blogRoutes: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.82,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
