# Sumit Jaiswal — AI & Data Science Portfolio

Personal portfolio built with Next.js (App Router), Tailwind CSS v4, Framer Motion and MDX.
Includes **Sahayika**, a Gemini-powered chat assistant.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment (`.env.local`)

| Variable | Used by |
| --- | --- |
| `GEMINI_API_KEY` | `src/app/api/chat` — Sahayika assistant |
| `GOOGLE_SHEETS_WEBHOOK_URL` | `src/app/api/lead` — lead capture |

## Structure

```
src/
  app/                 routes (about, blog, contact, experience, projects, research, skills)
    api/chat           Sahayika assistant endpoint
    api/lead           lead capture → Google Sheets webhook
  components/
    layout/            Navbar, Footer, theme
    sections/          page sections (Experience, Skills)
    ui/                visual widgets
  content/
    blog/*.mdx         hackathon / event write-ups
    projects/*.mdx     project case studies
    *.ts               structured data (skills, experience, education, certifications, achievements)
  lib/                 MDX loader, utils
public/
  images/              profile, certificates, blog and project images
  resume.pdf
```

Add a project or blog post by dropping an `.mdx` file into `src/content/projects` or `src/content/blog`.
