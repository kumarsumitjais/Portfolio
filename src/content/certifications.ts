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
    date: "Mar 2025",
    credentialUrl: "#",
    skills: ["Data Analysis"],
    image: "/images/placeholder-certificate.svg"
  },
  {
    name: "Career Essentials in Generative AI",
    issuer: "Microsoft & LinkedIn",
    date: "May 2025",
    credentialUrl: "#",
    skills: ["Generative AI"],
    image: "/images/placeholder-certificate.svg"
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
    credentialUrl: "#",
    skills: ["Vertex AI", "Prompt Engineering"],
    image: "/images/placeholder-certificate.svg"
  },
  {
    name: "Google Analytics Certification",
    issuer: "United Latino Students Association",
    date: "Aug 2025",
    credentialUrl: "#",
    skills: ["Google Analytics"],
    image: "/images/placeholder-certificate.svg"
  },
  {
    name: "Dive Deeper into Google Analytics 4 Data and Reports",
    issuer: "Google",
    date: "Oct 2025",
    credentialUrl: "#",
    skills: ["Google Analytics 4"],
    image: "/images/placeholder-certificate.svg"
  },
  {
    name: "Get Started with Microsoft Data Analytics",
    issuer: "Microsoft",
    date: "Nov 2025",
    credentialUrl: "#",
    skills: ["Microsoft Data Analytics"],
    image: "/images/placeholder-certificate.svg"
  }
];
