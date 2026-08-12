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
  const projects = slugs.map((slug) => getProjectBySlug(slug)).filter((p): p is NonNullable<typeof p> => p !== null);
  return projects;
}

export function getBlogSlugs() {
  const blogsDirectory = path.join(contentDirectory, "blog");
  if (!fs.existsSync(blogsDirectory)) return [];
  return fs.readdirSync(blogsDirectory).filter(file => file.endsWith('.mdx'));
}

export function getBlogBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(contentDirectory, "blog", `${realSlug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { slug: realSlug, meta: data, content };
}

export function getAllBlogs() {
  const slugs = getBlogSlugs();
  const blogs = slugs.map((slug) => getBlogBySlug(slug)).filter((b): b is NonNullable<typeof b> => b !== null);
  // Sort blogs by date descending
  return blogs.sort((a, b) => {
    if (a.meta.date && b.meta.date) {
      return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
    }
    return 0;
  });
}
