"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Jupyter-style cells for MDX case studies. Cells fade in as you scroll;
// code cells show "[*]" (running) briefly, then their execution count and output.

const KEYWORDS = /\b(import|from|as|def|return|if|else|elif|for|in|while|print|with|class|try|except|None|True|False|and|or|not|lambda)\b/;
const TOKEN = /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/gm;

function highlight(code: string) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(code.slice(last, i));
    const [text, comment, str, num, word] = m;
    const cls = comment
      ? "text-text-secondary italic"
      : str
        ? "text-amber-700 dark:text-amber-300"
        : num
          ? "text-cyan-700 dark:text-cyan-300"
          : word && KEYWORDS.test(word)
            ? "text-emerald-700 dark:text-emerald-400 font-semibold"
            : null;
    out.push(cls ? <span key={i} className={cls}>{text}</span> : text);
    last = i + text.length;
  }
  out.push(code.slice(last));
  return out;
}

// Fades content in once it has been scrolled to. Checks position on scroll
// rather than relying only on IntersectionObserver, which can miss elements
// skipped by a fast fling or a restored scroll position.
function Reveal({ children, onShow }: { children: ReactNode; onShow?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    const check = () => {
      const r = ref.current?.getBoundingClientRect();
      if (r && r.top < window.innerHeight * 0.92) {
        setShown(true);
        onShow?.();
      }
    };
    const frame = requestAnimationFrame(check);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [shown, onShow]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="group relative"
    >
      {children}
    </motion.div>
  );
}

export function Notebook({ file, kernel, children }: { file: string; kernel: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border-card bg-bg-elevated overflow-hidden not-prose">
      <div className="flex items-center gap-3 border-b border-border-card px-4 py-2.5 font-mono text-xs text-text-secondary">
        <span className="flex gap-1.5" aria-hidden>
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        </span>
        <span className="text-text-primary">{file}</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full border border-emerald-400" /> {kernel}
        </span>
      </div>
      <div className="p-3 md:p-5 space-y-4">{children}</div>
    </div>
  );
}

export function Md({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <div className="md:pl-[4.5rem] px-1 text-text-secondary leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-text-primary [&_h2]:mt-4 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-text-primary [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1 [&_strong]:text-text-primary">
        {children}
      </div>
    </Reveal>
  );
}

export function Cell({
  n,
  code,
  error = false,
  children,
}: {
  n: number;
  code: string;
  error?: boolean;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const [state, setState] = useState<"idle" | "running" | "done">(reduce ? "done" : "idle");

  useEffect(() => {
    if (state !== "running") return;
    const t = setTimeout(() => setState("done"), 650);
    return () => clearTimeout(t);
  }, [state]);

  const label = state === "running" ? "*" : state === "done" ? n : " ";
  const run = useCallback(() => setState((s) => (s === "idle" ? "running" : s)), []);

  return (
    <Reveal onShow={run}>
      <div className="flex gap-2 md:gap-3">
        <div className="hidden md:block w-[3.75rem] shrink-0 pt-2.5 text-right font-mono text-xs text-electric-blue-500 dark:text-electric-blue-400">
          In [{label}]:
        </div>
        <pre className="flex-1 min-w-0 overflow-x-auto rounded-lg border border-border-card bg-bg-base px-4 py-2.5 font-mono text-[13px] leading-relaxed text-text-primary">
          <span className="md:hidden text-electric-blue-500 dark:text-electric-blue-400 select-none">[{label}] </span>
          {highlight(code.trim())}
        </pre>
      </div>
      {children && (
        <motion.div
          initial={false}
          animate={{ opacity: state === "done" ? 1 : 0, height: state === "done" ? "auto" : 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden"
        >
          <div className="flex gap-2 md:gap-3 mt-2">
            <div className={`hidden md:block w-[3.75rem] shrink-0 pt-1 text-right font-mono text-xs ${error ? "text-red-700 dark:text-red-400" : "text-orange-700 dark:text-orange-400"}`}>
              {error ? "" : `Out[${n}]:`}
            </div>
            <div
              className={`flex-1 min-w-0 overflow-x-auto font-mono text-[13px] leading-relaxed [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap ${
                error ? "rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-red-700 dark:text-red-300 whitespace-pre-wrap" : "text-text-secondary"
              }`}
            >
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </Reveal>
  );
}
