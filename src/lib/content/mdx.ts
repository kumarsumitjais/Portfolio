import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "src/content");

export function getProjectSlugs() {
  const projectsDirectory = path.join(contentDirectory, "projects");
  if (!fs.existsSync(projectsDirectory)) return [];
  return fs.readdirSync(projectsDirectory).filter(file => file.endsWith('.mdx'));
}

export function getProjectBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(contentDirectory, "projects", `${realSlug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { slug: realSlug, meta: data, content };
}

export function getAllProjects() {
  const slugs = getProjectSlugs();
  const projects = slugs.map((slug) => getProjectBySlug(slug)).filter(Boolean);
  return projects;
}
