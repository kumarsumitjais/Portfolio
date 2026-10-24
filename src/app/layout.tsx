import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SahayikaAssistant } from "@/components/ui/SahayikaAssistant";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { NavEffects } from "@/components/layout/NavEffects";
import { INTRO_SCRIPT } from "@/components/layout/introScript";
import { getAllProjects } from "@/lib/content/mdx";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

import { PersonJsonLd, WebSiteJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sumitkumarjaiswal.in"),
  title: {
    default: "Sumit Kr. Jaiswal | Data Scientist & AI/ML Engineer",
    template: "%s | Sumit Kr. Jaiswal",
  },
  description:
    "Sumit Kumar Jaiswal is a Data Scientist & AI/ML Engineer from India. " +
    "Building production ML models, LLM agents & computer vision systems with Python, TensorFlow, and LangChain.",
  keywords: [
    "Sumit Kumar Jaiswal",
    "Sumit Jaiswal",
    "Data Scientist India",
    "AI ML Engineer portfolio",
    "Machine Learning engineer",
    "ML expert",
    "AI expert",
    "LLM engineer India",
    "Python developer",
    "TensorFlow developer",
    "LangChain LangGraph",
    "NLP engineer",
    "Computer vision engineer",
    "Predictive modeling",
    "AI portfolio",
    "hire data scientist India",
    "ML model deployment",
  ],
  authors: [
    {
      name: "Sumit Kumar Jaiswal",
      url: "https://www.sumitkumarjaiswal.in",
    },
  ],
  creator: "Sumit Kumar Jaiswal",
  publisher: "Sumit Kumar Jaiswal",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.sumitkumarjaiswal.in",
    siteName: "Sumit Kumar Jaiswal",
    title: "Sumit Kr. Jaiswal | Data Scientist & AI/ML Engineer",
    description:
      "12+ production ML models shipped. LLM agents, computer vision & predictive systems. " +
      "Open to freelance & full-time opportunities.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Sumit Kumar Jaiswal – Data Scientist & AI/ML Engineer",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sumit Kr. Jaiswal | Data Scientist & AI/ML Engineer",
    description:
      "12+ production ML models shipped. LLM agents, CV & predictive systems. Open to opportunities.",
    images: ["/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.sumitkumarjaiswal.in",
  },
  verification: {
    google: "3aHWIL7Dx1Hm5a5oFuaB4zjaUgnX1OTy4RmqsI5t5Jg",
  },
  category: "technology",
};

// React skips view-transition animations for updates made during a browser
// back/forward (popstate) event. This runs before Next.js's own popstate handler,
// stops it, and hands the navigation to NavEffects, which replays it as a normal
// (animated) router navigation. If nothing handles it, the original event is
// re-dispatched to Next.js unchanged, so the back button can never break.
const BACK_NAV_SCRIPT = `(function () {
  var replaying = false;
  window.addEventListener("popstate", function (e) {
    if (replaying || !e.state || !e.state.__NA || !document.startViewTransition) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.stopImmediatePropagation();
    var state = e.state;
    setTimeout(function () {
      var detail = { handled: false };
      window.dispatchEvent(new CustomEvent("nav:back", { detail: detail }));
      if (!detail.handled) {
        replaying = true;
        window.dispatchEvent(new PopStateEvent("popstate", { state: state }));
        replaying = false;
      }
    }, 0);
  });
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Must run before Next.js registers its popstate handler; see BACK_NAV_SCRIPT. */}
        <script dangerouslySetInnerHTML={{ __html: BACK_NAV_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary font-sans">
        {/* Startup intro: an empty placeholder filled by the inline script below,
            which runs before hydration so the page never flashes first. */}
        <div id="site-intro" aria-hidden="true" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: "" }} />
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        <PersonJsonLd />
        <WebSiteJsonLd />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <NavEffects />
          {/* Pages render their own <main>; each page wraps itself in a <PageTransition>. */}
          <div className="page-shell flex-grow pt-24">{children}</div>
          <Footer />
          <SahayikaAssistant />
          <CommandPalette
            projects={getAllProjects().map((p) => ({
              slug: p.slug,
              title: p.meta.title,
              category: p.meta.category ?? "",
              tags: p.meta.tags ?? [],
            }))}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
