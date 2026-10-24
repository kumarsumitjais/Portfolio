import { PageTransition } from "@/components/layout/PageTransition";

// The root template doesn't re-mount between a list and its detail pages
// (same top-level segment), so this one animates those navigations.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
