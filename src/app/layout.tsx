import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { CustomCursor } from "@/components/ui/CustomCursor";
import { SahayikaAssistant } from "@/components/ui/SahayikaAssistant";

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
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary font-sans">
        <PersonJsonLd />
        <WebSiteJsonLd />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CustomCursor />
          <Navbar />
          {children}
          <Footer />
          <SahayikaAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
