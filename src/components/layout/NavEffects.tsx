"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Tags <html> with the direction (data-nav="forward" | "back") and destination
// section (data-nav-to) of the navigation that is about to happen, so the
// view-transition CSS in globals.css can pick per-page and back-specific
// animations, and colour the light streak under the header.
//
// Back = browser back/forward button, or a link to a parent path
// (e.g. /blog/post -> /blog). Everything else is forward.

const section = (path: string) => {
  const [first, second] = path.split("/").filter(Boolean);
  if (!first) return "home";
  if (second && (first === "blog" || first === "projects")) return first === "blog" ? "post" : "project";
  return first;
};

export function NavEffects() {
  const router = useRouter();

  useEffect(() => {
    const html = document.documentElement;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const mark = (dir: "forward" | "back", to: string) => {
      html.dataset.nav = dir;
      html.dataset.navTo = section(to);
      clearTimeout(timer);
      // Kept long enough to cover a slow page load plus the transition; every
      // navigation re-marks, so it can't leak into the next one.
      timer = setTimeout(() => {
        delete html.dataset.nav;
        delete html.dataset.navTo;
      }, 6000);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      const here = location.pathname.replace(/\/$/, "");
      const isParent = url.pathname !== "/" && here.startsWith(url.pathname.replace(/\/$/, "") + "/");
      mark(isParent ? "back" : "forward", url.pathname);
    };

    const onPop = () => mark("back", location.pathname);
    // Browser back/forward, intercepted by the script in app/layout.tsx: the URL has
    // already changed, so re-navigate to it as a normal (animated) transition.
    const onBack = (e: Event) => {
      (e as CustomEvent<{ handled: boolean }>).detail.handled = true;
      mark("back", location.pathname);
      router.replace(location.pathname + location.search + location.hash);
    };
    // Programmatic navigations (command palette) announce themselves.
    const onIntent = (e: Event) => mark("forward", (e as CustomEvent<string>).detail);

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    window.addEventListener("nav:intent", onIntent);
    window.addEventListener("nav:back", onBack);
    return () => {
      window.removeEventListener("nav:back", onBack);
      window.removeEventListener("nav:intent", onIntent);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      clearTimeout(timer);
    };
  }, [router]);

  // The streak only shows during a view transition (see .nav-streak in globals.css).
  return <div aria-hidden="true" className="nav-streak" />;
}
