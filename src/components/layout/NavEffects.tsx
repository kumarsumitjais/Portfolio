"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Site navigation effects. Every in-site navigation goes through here:
//
//  • Blog list ⇄ post: left to React <ViewTransition> (the clicked card expands
//    into the article; the other cards fall away / gather back). See globals.css.
//  • Opening / leaving a project: "data matrix" — tiles ripple out from the click
//    point to cover the screen, the route changes underneath, then they dissolve.
//  • Everything else: "terminal shutter" — panels sweep down while a command such
//    as `cd /skills` types out, the route changes underneath, then they retract.
//
// The cover hides the route swap, so heavy pages never stutter on screen.
// Back (browser back button, or a link to a parent path) reverses each effect.
// Programmatic navigation: dispatch `nav:go` with { href } (command palette).
// Browser back/forward arrives as `nav:back` from the script in app/layout.tsx.

type Style = "shutter" | "tiles";
type Phase = "idle" | "prep" | "cover" | "hold" | "reveal";
type Dir = "forward" | "back";

// Longest stagger + transition (see globals.css), plus a small margin, so the
// route never swaps before the screen is fully covered and the overlay is never
// removed before the last panel/tile has left.
const STAGGER_MS = 170;
// keep in sync with .nav-bar / .nav-tile transitions in globals.css
const COVER_MS: Record<Style, number> = { shutter: 6 * 18 + 220 + 40, tiles: STAGGER_MS + 200 + 40 };
const REVEAL_MS: Record<Style, number> = { shutter: 6 * 18 + 220 + 40, tiles: STAGGER_MS + 220 + 40 };
const MIN_HOLD_MS = 100; // keep the label readable at least this long
const MAX_WAIT_MS = 8000; // never stay covered longer than this

const ACCENT: Record<string, string> = {
  home: "#33d6e0", about: "#a78bfa", projects: "#34d399", project: "#34d399", skills: "#f5b84d",
  blog: "#f472b6", post: "#f472b6", experience: "#2dd4bf", contact: "#fb7185", research: "#5c8cff",
};

const section = (path: string) => {
  const [first, second] = path.split("/").filter(Boolean);
  if (!first) return "home";
  if (second && first === "blog") return "post";
  if (second && first === "projects") return "project";
  return first;
};
const isBlogPair = (from: string, to: string) =>
  (from === "/blog" && to.startsWith("/blog/")) || (from.startsWith("/blog/") && to === "/blog");
const isProject = (p: string) => /^\/projects\/[^/]+/.test(p);
const isParentOf = (to: string, from: string) =>
  to !== "/" && from.replace(/\/$/, "").startsWith(to.replace(/\/$/, "") + "/");

function command(to: string, style: Style) {
  if (style === "tiles") {
    const slug = to.split("/")[2];
    return slug ? `> load_model("${slug}")` : "> model.unload()";
  }
  return `> cd ${to === "/" ? "~" : to}`;
}

interface Run {
  style: Style;
  dir: Dir;
  to: string;
  accent: string;
  label: string;
  origin: { x: number; y: number };
  hot: boolean[]; // which matrix tiles glow (random per run)
}

export function NavEffects() {
  const router = useRouter();
  const pathname = usePathname();
  const [run, setRun] = useState<Run | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState(0);
  const [grid, setGrid] = useState({ cols: 12, rows: 8 });
  const busy = useRef(false);
  const target = useRef<string | null>(null);
  const holdStart = useRef(0);
  const runId = useRef(0);
  const styleRef = useRef<Style>("shutter");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  // Mark direction for the blog view transitions (html[data-nav="back"] variants).
  const mark = useCallback((dir: Dir) => {
    const html = document.documentElement;
    html.dataset.nav = dir;
    later(() => delete html.dataset.nav, 6000);
  }, [later]);

  const finish = useCallback(() => {
    if (!busy.current) return;
    const style = styleRef.current;
    setPhase("reveal");
    later(() => {
      setPhase("idle");
      setRun(null);
      busy.current = false;
      target.current = null;
      delete document.documentElement.dataset.navStyle;
    }, REVEAL_MS[style]);
  }, [later]);


  const start = useCallback(
    (from: string, to: string, dir: Dir, origin: { x: number; y: number }, navigate: () => void) => {
      if (busy.current) return;
      busy.current = true;
      const id = ++runId.current;
      const style: Style = isProject(to) || isProject(from) ? "tiles" : "shutter";
      styleRef.current = style;
      const sec = section(dir === "back" && style === "tiles" ? from : to);
      const g = innerWidth < 640 ? { cols: 6, rows: 10 } : { cols: 12, rows: 7 };
      setGrid(g);
      const hot = Array.from({ length: g.cols * g.rows }, () => Math.random() < 0.12);
      setRun({ style, dir, to, accent: ACCENT[sec] ?? "#33d6e0", label: command(to, style), origin, hot });
      setTyped(0);
      // Mount in the hidden state first, then switch to "cover" so the CSS transitions run.
      setPhase("prep");
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase("cover")));
      target.current = to;
      // Swap the route once the screen is covered; view transitions are skipped
      // underneath (html[data-nav-style="cover"]) because nothing is visible.
      later(() => {
        document.documentElement.dataset.navStyle = "cover";
        holdStart.current = performance.now();
        setPhase("hold");
        navigate();
      }, COVER_MS[style] + 34);
      later(() => runId.current === id && finish(), COVER_MS[style] + MAX_WAIT_MS);
    },
    [later, finish]
  );

  // Route arrived underneath the cover: reveal (after a short hold for the label).
  useEffect(() => {
    if (phase !== "hold" || !target.current || pathname !== target.current) return;
    const wait = Math.max(0, MIN_HOLD_MS - (performance.now() - holdStart.current));
    const id = setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(finish)), wait);
    return () => clearTimeout(id);
  }, [pathname, phase, finish]);

  // Type the command out while covering.
  useEffect(() => {
    if (!run || phase === "idle" || phase === "prep" || phase === "reveal") return;
    const id = setInterval(() => setTyped((n) => Math.min(run.label.length, n + 1)), 18);
    return () => clearInterval(id);
  }, [run, phase]);

  useEffect(() => {
    // Reduced motion and lite mode (low-end devices, see app/layout.tsx) navigate without a cover.
    const reduce = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || "lite" in document.documentElement.dataset;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      const from = location.pathname;
      const dir: Dir = isParentOf(url.pathname, from) ? "back" : "forward";
      mark(dir);
      if (isBlogPair(from, url.pathname) || reduce()) return; // view transition / plain navigation
      e.preventDefault();
      const href = url.pathname + url.search + url.hash;
      start(from, url.pathname, dir, { x: e.clientX, y: e.clientY }, () => router.push(href));
    };

    const onGo = (e: Event) => {
      const href = (e as CustomEvent<{ href: string }>).detail.href;
      const to = new URL(href, location.href).pathname;
      if (to === location.pathname) return;
      mark("forward");
      if (reduce() || isBlogPair(location.pathname, to)) return router.push(href);
      start(location.pathname, to, "forward", { x: innerWidth / 2, y: innerHeight / 2 }, () => router.push(href));
    };

    // Browser back/forward (see BACK_NAV_SCRIPT in app/layout.tsx): the URL has
    // already changed; re-navigate to it with the "back" variant of the effect.
    const onBack = (e: Event) => {
      (e as CustomEvent<{ handled: boolean }>).detail.handled = true;
      const to = location.pathname;
      const href = to + location.search + location.hash;
      const from = target.current ?? document.documentElement.dataset.route ?? to;
      mark("back");
      if (reduce() || isBlogPair(from, to)) return router.replace(href);
      start(from, to, "back", { x: innerWidth / 2, y: innerHeight / 2 }, () => router.replace(href));
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("nav:go", onGo);
    window.addEventListener("nav:back", onBack);
    const pending = timers.current;
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("nav:go", onGo);
      window.removeEventListener("nav:back", onBack);
      pending.forEach(clearTimeout);
    };
  }, [router, start, mark]);

  // Remember the rendered route, so browser-back can tell where it came from
  // (location already points at the destination when popstate fires).
  useEffect(() => {
    document.documentElement.dataset.route = pathname;
    // Neon palette for this section (globals.css). Changes while a cover is up,
    // so the colours switch together with the transition.
    document.documentElement.dataset.section = pathname.split("/")[1] || "home";
  }, [pathname]);

  if (!run) return null;

  const { cols, rows } = grid;
  const tiles =
    run.style === "tiles"
      ? Array.from({ length: cols * rows }, (_, i) => {
          const cx = ((i % cols) + 0.5) / cols, cy = (Math.floor(i / cols) + 0.5) / rows;
          const ox = run.origin.x / innerWidth, oy = run.origin.y / innerHeight;
          const fromOrigin = Math.hypot(cx - ox, cy - oy);           // cover: ripple from the click
          const fromCentre = Math.hypot(cx - 0.5, cy - 0.5);          // reveal: dissolve from the centre
          const maxFromOrigin = Math.max(Math.hypot(ox, oy), Math.hypot(1 - ox, oy), Math.hypot(ox, 1 - oy), Math.hypot(1 - ox, 1 - oy));
          const coverD = run.dir === "back" ? 1 - fromCentre / 0.71 : fromOrigin / maxFromOrigin; // 0..1
          return {
            cover: Math.round(Math.max(0, coverD) * STAGGER_MS),
            reveal: Math.round((fromCentre / 0.71) * STAGGER_MS),
            hot: run.hot[i],
          };
        })
      : [];
  const bars = innerWidth < 640 ? 4 : 7;

  return (
    <div
      aria-hidden="true"
      className={`nav-cover nav-style-${run.style} nav-${run.dir}`}
      data-phase={phase}
      style={{ "--accent": run.accent, "--cols": cols } as React.CSSProperties}
    >
      {run.style === "shutter" ? (
        <div className="nav-bars">
          {Array.from({ length: bars }, (_, i) => (
            <span key={i} className="nav-bar" style={{ "--i": run.dir === "back" ? bars - 1 - i : i } as React.CSSProperties} />
          ))}
        </div>
      ) : (
        <div className="nav-tiles">
          {tiles.map((t, i) => (
            <span
              key={i}
              className={`nav-tile${t.hot ? " hot" : ""}`}
              style={{ "--d": `${t.cover}ms`, "--r": `${t.reveal}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      )}
      <div className="nav-label">
        <span>{run.label.slice(0, typed)}</span>
        <span className="nav-caret" />
      </div>
    </div>
  );
}
