// ============================================================
// FILE: src/components/JsonLd.tsx   (new file)
// ⭐ MISSING FROM ANTIGRAVITY PLAN — This is what gets you into
//    Google's Knowledge Panel and rich search results.
//
// USAGE in src/app/layout.tsx:
//   import { PersonJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
//   ...
//   <body>
//     <PersonJsonLd />
//     <WebSiteJsonLd />
//     {children}
//   </body>
// ============================================================

// ── 1. Person Schema ─────────────────────────────────────────
// Tells Google *exactly* who you are → triggers Knowledge Panel
export function PersonJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sumit Kumar Jaiswal",
    url: "https://www.sumitkumarjaiswal.in",
    jobTitle: "Data Scientist & AI/ML Engineer",
    description:
      "Data Scientist and AI/ML Engineer from India specializing in production " +
      "ML models, LLM agents, computer vision, and predictive analytics.",
    image: "https://www.sumitkumarjaiswal.in/opengraph-image.png",
    sameAs: [
      "https://github.com/kumarsumitjais",
      "https://linkedin.com/in/sumit-kr-jaiswal-4979132ba",
      // Add more: Twitter, Google Scholar, Kaggle, etc.
    ],
    knowsAbout: [
      "Machine Learning",
      "Data Science",
      "Artificial Intelligence",
      "Python Programming",
      "TensorFlow",
      "LangChain",
      "LangGraph",
      "Natural Language Processing",
      "Computer Vision",
      "Deep Learning",
      "Predictive Modeling",
      "FAISS",
      "RAG Systems",
      "Scikit-learn",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "LTSU – Lucknow Technological State University", // update with full name
    },
    nationality: {
      "@type": "Country",
      name: "India",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── 2. WebSite Schema ─────────────────────────────────────────
// Enables Google to show a search box for your site in results
export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sumit Kumar Jaiswal",
    url: "https://www.sumitkumarjaiswal.in",
    description:
      "Portfolio of Sumit Kumar Jaiswal, Data Scientist & AI/ML Engineer from India.",
    author: {
      "@type": "Person",
      name: "Sumit Kumar Jaiswal",
    },
    inLanguage: "en-IN",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── 3. Project / SoftwareApplication Schema ───────────────────
// Use this inside each project's page.tsx for rich project results
// USAGE: <ProjectJsonLd project={projectData} />
interface ProjectJsonLdProps {
  name: string;
  description: string;
  url: string;
  datePublished: string; // ISO format: "2024-06-01"
  technologies: string[];
  accuracy?: string;     // e.g. "94%"
}

export function ProjectJsonLd({
  name,
  description,
  url,
  datePublished,
  technologies,
  accuracy,
}: ProjectJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description: accuracy ? `${description} Accuracy: ${accuracy}.` : description,
    url,
    datePublished,
    applicationCategory: "DataApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Person",
      name: "Sumit Kumar Jaiswal",
      url: "https://www.sumitkumarjaiswal.in",
    },
    programmingLanguage: technologies,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── 4. BlogPosting Schema ─────────────────────────────────────
// Use this inside each blog post's page.tsx
// Makes your blog posts eligible for Google's "Top Stories" carousel
interface BlogPostingJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  imageUrl?: string;
}

export function BlogPostingJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  imageUrl,
}: BlogPostingJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    image: imageUrl || "https://www.sumitkumarjaiswal.in/opengraph-image.png",
    author: {
      "@type": "Person",
      name: "Sumit Kumar Jaiswal",
      url: "https://www.sumitkumarjaiswal.in",
    },
    publisher: {
      "@type": "Person",
      name: "Sumit Kumar Jaiswal",
      logo: {
        "@type": "ImageObject",
        url: "https://www.sumitkumarjaiswal.in/opengraph-image.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: "en-IN",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
