export interface Achievement {
  title: string;
  event: string;
  date: string;
  image?: string;
  blogUrl?: string;
}

export const achievements: Achievement[] = [
  {
    title: "2nd Runner-up – Ideathon cum Internal Hackathon SIH 2025",
    event: "Lamrin Tech Skills University Punjab",
    date: "Sept 2025",
    image: "/images/blog/sih-hackathon/sih-team-photo-1.jpeg",
    blogUrl: "/blog/sih-internal-hackathon-2025"
  },
  {
    title: "1st Prize – Ideathon, 54th ISTE National Annual Convention & Yuva Kaushal Utsav",
    event: "Indian Society for Technical Education (ISTE) & Lamrin Tech Skills University Punjab",
    date: "Feb 2025",
    image: "/images/blog/iste-event/iste-team-photo-20260811244481.jpeg",
    blogUrl: "/blog/iste-54th-annual-convention-ideathon-2025"
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
    date: "March 2024",
    image: "/images/blog/byte-battle/image1.jpg",
    blogUrl: "/blog/byte-battle-hackathon-humsafar"
  },
  {
    title: "1st Prize – Hackathon, Yuva Fest",
    event: "Lamrin Tech Skills University",
    date: "2023",
    image: "/images/placeholder-medal.svg"
  },
  {
    title: "Participation – National Level Hackathon, IBM ICE",
    event: "KARE, Madurai",
    date: "2023",
    image: "/images/placeholder-certificate.svg"
  },
  {
    title: "1st Prize – Skit, Inquilab Festival",
    event: "Nawanshahr",
    date: "2023",
    image: "/images/placeholder-medal.svg"
  }
];
