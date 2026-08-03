export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  skills: string[];
  image?: string;
}

export const certifications: Certification[] = [
  {
    name: "AI-ML with Data Science Workshop",
    issuer: "IIT Ropar",
    date: "Feb 2024",
    credentialUrl: "#",
    skills: ["AI/ML", "Data Science"],
    image: "/images/placeholder-certificate.svg"
  },
  {
    name: "Career Essentials in Data Analysis",
    issuer: "Microsoft & LinkedIn",
    date: "May 2025",
    credentialUrl: "https://www.linkedin.com/learning/certificates/12c590f4c10c1a2838fd17c2cbebf21423f672147d9f8ae4a4e0d41099d52ab9?trk=share_certificate",
    skills: ["Data Analysis", "Power BI"],
    image: "/images/data-analysis-certificate.png"
  },
  {
    name: "Career Essentials in Generative AI",
    issuer: "Microsoft & LinkedIn",
    date: "Jul 2025",
    credentialUrl: "https://www.linkedin.com/learning/certificates/ef31d3b9bfe2877c5de7f6225818dc029a10a73c9c8f06ab35af0aa98378e56c?trk=share_certificate",
    skills: ["Generative AI", "LLMs"],
    image: "/images/gen-ai-certificate.png"
  },
  {
    name: "Data Analytics Job Simulation",
    issuer: "Deloitte Australia (Forage)",
    date: "Jun 2025",
    credentialUrl: "#",
    skills: ["Data Analytics"],
    image: "/images/placeholder-certificate.svg"
  },
  {
    name: "Prompt Design in Vertex AI Skill Badge",
    issuer: "Google",
    date: "Jul 2025",
    credentialUrl: "https://www.credly.com/badges/3604951a-9236-4a10-9723-dd8ba51a771e/public_url",
    skills: ["Vertex AI", "Prompt Engineering"],
    image: "/images/vertex-ai-certificate.png"
  },
  {
    name: "Google Analytics Certification",
    issuer: "Google",
    date: "Aug 2025",
    credentialUrl: "https://skillshop.credential.net/8ff9efa7-4ebe-4e81-81a5-243031e6d4bf#acc.03CZTzek",
    skills: ["Google Analytics"],
    image: "/images/google-analytics-cert.png"
  },
  {
    name: "Google Analytics Certification (2026)",
    issuer: "Google",
    date: "Aug 2026",
    credentialUrl: "https://skillshop.credential.net/1bbbdff8-13ff-4d8d-8e6d-c81349621d28#acc.xMdArZIJ",
    skills: ["Google Analytics"],
    image: "/images/google-analytics-cert.png"
  },
  {
    name: "Dive Deeper into Google Analytics 4 Data and Reports",
    issuer: "Google",
    date: "Oct 2025",
    credentialUrl: "https://skillshop.credential.net/0xa9323aae73b2b63d4b86fba3c01bce74517398651d4913c1b2dd789c9d1f8a3a",
    skills: ["Google Analytics 4"],
    image: "/images/ga4-dive-deeper.png"
  },
  {
    name: "Get Started with Microsoft Data Analytics",
    issuer: "Microsoft",
    date: "Nov 2025",
    credentialUrl: "https://learn.microsoft.com/api/achievements/share/en-us/SumitKumarJaiswal-2838/ZDPYB4Y2?sharingId=E67784636435445D",
    skills: ["Microsoft Data Analytics"],
    image: "/images/microsoft-data-analytics-cert.png"
  }
];
