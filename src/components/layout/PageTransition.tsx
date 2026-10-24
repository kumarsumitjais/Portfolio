import { ViewTransition } from "react";

export type PageKind =
  | "home" | "about" | "projects" | "project" | "skills"
  | "blog" | "post" | "experience" | "contact" | "research";

// Each page animates in its own way when you arrive (vt-<kind>-in) and leave
// (vt-<kind>-out). Back navigations get different variants via html[data-nav="back"]
// (set by NavEffects). Keyframes live in globals.css. Only client-side navigations
// animate; the first page load renders normally.
export function PageTransition({ kind, children }: { kind: PageKind; children: React.ReactNode }) {
  return (
    <ViewTransition enter={`vt-${kind}-in`} exit={`vt-${kind}-out`} default="none">
      {children}
    </ViewTransition>
  );
}
