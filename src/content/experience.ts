export interface ExperienceRole {
  title: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface Experience {
  company: string;
  title?: string;
  roles: ExperienceRole[];
}

export const experiences: Experience[] = [
  {
    company: "VIVIDH (Social Media Club), USET, LTSU",
    title: "Founding Member",
    roles: [
      {
        title: "Editor & Proofreader",
        start: "May 2025",
        end: "Present",
        bullets: [
          "Editing and proofreading content for official posts.",
          "Ensuring accuracy, clarity, and consistency."
        ]
      },
      {
        title: "Content Writer",
        start: "Jan 2024",
        end: "May 2025",
        bullets: [
          "Created content for university social media.",
          "Contributed to establishing club structure and guidelines."
        ]
      }
    ]
  },
  {
    company: "NSS (USET Department)",
    roles: [
      {
        title: "Student Coordinator",
        start: "Jan 2025",
        end: "Jan 2026",
        bullets: [
          "Coordinating NSS activities and student participation.",
          "Managing communication and event execution."
        ]
      }
    ]
  },
  {
    company: "SRIJANAM Organizing Committee, USET, LTSU",
    roles: [
      {
        title: "Head of Finance",
        start: "2024",
        end: "2025",
        bullets: [
          "Managed budgeting and financial planning for fest events.",
          "Oversaw expense tracking and fund allocation."
        ]
      }
    ]
  },
  {
    company: "Cultural Club, USET, LTSU",
    roles: [
      {
        title: "Treasurer",
        start: "2024",
        end: "Present",
        bullets: [
          "Handled club finances and budgeting.",
          "Supported event planning and logistics."
        ]
      }
    ]
  },
  {
    company: "Coding Nexus Club (Coding Club), USET, LTSU",
    roles: [
      {
        title: "Member",
        start: "2023",
        end: "Present",
        bullets: [
          "Participated in coding workshops and competitions.",
          "Engaged in peer learning and technical activities."
        ]
      }
    ]
  }
];
