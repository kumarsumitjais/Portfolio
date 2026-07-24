export interface Achievement {
  title: string;
  event: string;
  date: string;
  image?: string;
  blogUrl?: string;
}

export const achievements: Achievement[] = [
  {
    title: "1st Prize – Hackathon, Yuva Fest",
    event: "Lamrin Tech Skills University",
    date: "2023",
    image: "/images/placeholder-medal.svg"
  },
  {
    title: "Runner-up – University Level Ideathon",
    event: "LTSU",
    date: "Sept 2024",
    image: "/images/placeholder-certificate.svg"
  },
  {
    title: "Runner-up – Web Development Competition (Byte Battle)",
    event: "PTU Jalandhar",
    date: "2024",
    image: "/images/placeholder-certificate.svg"
  },
  {
    title: "Participation – National Level Hackathon, IBM ICE",
    event: "KARE, Madurai",
    date: "2024",
    image: "/images/placeholder-certificate.svg"
  },
  {
    title: "1st Prize – Skit, Inquilab Festival",
    event: "Nawanshahr",
    date: "2024",
    image: "/images/placeholder-medal.svg"
  },
  {
    title: "1st Prize – Ideathon, 54th ISTE National Annual Convention & Yuva Kaushal Utsav",
    event: "ISTE",
    date: "2025",
    image: "/images/placeholder-medal.svg"
  },
  {
    title: "2nd Runner-up – Ideathon cum Internal Hackathon SIH 2025",
    event: "Lamrin Tech Skills University Punjab",
    date: "Oct 2025",
    image: "/images/placeholder-medal.svg"
  }
];
