// ============================================================
// FILE: src/app/robots.ts   (new file)
// Next.js auto-serves this as /robots.txt — no extra config needed.
// ============================================================

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Disallow internal Next.js paths + any API routes
        disallow: ["/api/", "/_next/", "/admin/", "/*.json$"],
      },
    ],
    sitemap: "https://www.sumitkumarjaiswal.in/sitemap.xml",
    host: "https://www.sumitkumarjaiswal.in",
  };
}
