import { ViewTransition } from "react";

// Animates page changes (see the view-transition CSS in globals.css).
// Used by templates, which re-mount on navigation, so this ViewTransition exits
// with the old page and enters with the new one. Only client-side navigations
// animate; the first page load renders normally.
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-enter" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-exit" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
