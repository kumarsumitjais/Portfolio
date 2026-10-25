"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Terminal, CornerDownLeft } from "lucide-react";

export interface PaletteProject {
  slug: string;
  title: string;
  category: string;
  tags: string[];
}

// Items are plain data; `run` below decides what each one does.
interface Item {
  id: string;
  label: string;
  hint: string;
  href?: string; // internal route
  url?: string; // opens in a new tab
  action?: "train" | "projects" | "ask" | "theme";
  question?: string;
}

// Trains a 2-feature logistic regression on two noisy blobs with plain gradient descent.
// Real math, tiny data, so it finishes in a blink.
function* trainLogReg(epochs = 60, lr = 0.5) {
  let seed = 42;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const gauss = () => Math.sqrt(-2 * Math.log(rand())) * Math.cos(2 * Math.PI * rand());
  const X: [number, number][] = [];
  const y: number[] = [];
  for (let i = 0; i < 200; i++) {
    const label = i % 2;
    X.push([gauss() + (label ? 1.5 : -1.5), gauss() + (label ? 1 : -1)]);
    y.push(label);
  }
  let w0 = 0, w1 = 0, b = 0;
  for (let epoch = 1; epoch <= epochs; epoch++) {
    let g0 = 0, g1 = 0, gb = 0, loss = 0, correct = 0;
    for (let i = 0; i < X.length; i++) {
      const p = 1 / (1 + Math.exp(-(w0 * X[i][0] + w1 * X[i][1] + b)));
      const err = p - y[i];
      g0 += err * X[i][0]; g1 += err * X[i][1]; gb += err;
      loss -= y[i] * Math.log(p + 1e-9) + (1 - y[i]) * Math.log(1 - p + 1e-9);
      if ((p > 0.5 ? 1 : 0) === y[i]) correct++;
    }
    w0 -= (lr * g0) / X.length; w1 -= (lr * g1) / X.length; b -= (lr * gb) / X.length;
    yield { epoch, epochs, loss: loss / X.length, acc: correct / X.length, w: [w0, w1, b] };
  }
}

export function CommandPalette({ projects }: { projects: PaletteProject[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, []);

  // Mounting fresh on every open resets the query, selection and training log.
  return open ? <Palette projects={projects} onClose={() => setOpen(false)} /> : null;
}

function Palette({ projects, onClose }: { projects: PaletteProject[]; onClose: () => void }) {
  const [query, setQuery] = useState(">");
  const [active, setActive] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const close = onClose;

  const train = () => {
    if (timer.current) clearInterval(timer.current);
    const run = trainLogReg();
    setLog(["$ python train.py --model logistic_regression --data blobs(n=200)"]);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = () => {
      const r = run.next();
      if (r.done) {
        if (timer.current) clearInterval(timer.current);
        setLog((l) => [...l, "✓ converged. Gradient descent, written in ~25 lines of TypeScript, running in your browser."]);
        return false;
      }
      const s = r.value;
      if (s.epoch % 10 === 0 || s.epoch === 1) {
        setLog((l) => [
          ...l,
          `epoch ${String(s.epoch).padStart(2)}/${s.epochs}  loss ${s.loss.toFixed(4)}  acc ${(s.acc * 100).toFixed(1)}%` +
            (s.epoch === s.epochs ? `  w=[${s.w.map((v) => v.toFixed(2)).join(", ")}]` : ""),
        ]);
      }
      return true;
    };
    if (reduce) while (step());
    else timer.current = setInterval(step, 40);
  };

  const items: Item[] = (() => {
    const raw = query.trim();
    const q = raw.replace(/^>\s*/, "").toLowerCase();

    const projectsMatch = q.match(/^projects?\s*(.*)$/);
    if (projectsMatch) {
      const term = projectsMatch[1].trim();
      const list = projects.filter(
        (p) =>
          !term ||
          p.category.toLowerCase().includes(term) ||
          p.title.toLowerCase().includes(term) ||
          p.tags.some((t) => t.toLowerCase().includes(term))
      );
      return list.map((p) => ({
        id: `project-${p.slug}`,
        label: p.title,
        hint: p.category,
        href: `/projects/${p.slug}`,
      }));
    }

    // Match on the raw text so the question keeps its original casing.
    const askMatch = raw.replace(/^>\s*/, "").match(/^ask\s+(.+)$/i);
    const commands: Item[] = [
      { id: "train", label: ">train", hint: "train a model in your browser", action: "train" },
      { id: "projects", label: ">projects nlp", hint: "filter projects by category or tag", action: "projects" },
      {
        id: "ask",
        label: askMatch ? `>ask ${askMatch[1]}` : ">ask <question>",
        hint: "ask Corgi",
        action: "ask",
        question: askMatch?.[1],
      },
      { id: "resume", label: ">resume", hint: "open resume (PDF)", url: "/resume.pdf" },
      { id: "contact", label: ">contact", hint: "get in touch", href: "/contact" },
      { id: "github", label: ">github", hint: "github.com/kumarsumitjais", url: "https://github.com/kumarsumitjais" },
      { id: "theme", label: ">theme", hint: `switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`, action: "theme" },
      ...[
        ["home", "/"], ["about", "/about"], ["projects", "/projects"], ["skills", "/skills"],
        ["experience", "/experience"], ["blog", "/blog"], ["contact", "/contact"],
      ].map(([name, href]) => ({ id: `go-${name}`, label: `go ${name}`, hint: href, href })),
    ];
    if (askMatch) return commands.filter((c) => c.id === "ask");
    return commands.filter((c) => !q || c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q));
  })();

  const run = (item: Item) => {
    if (item.action === "train") return train();
    if (item.action === "projects") { setQuery(">projects nlp"); setActive(0); return; }
    if (item.action === "ask") window.dispatchEvent(new CustomEvent("sahayika:open", { detail: { question: item.question } }));
    if (item.action === "theme") setTheme(resolvedTheme === "dark" ? "light" : "dark");
    if (item.url) window.open(item.url, "_blank", "noopener");
    if (item.href) window.dispatchEvent(new CustomEvent("nav:go", { detail: { href: item.href } }));
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && items[active]) { e.preventDefault(); run(items[active]); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm px-4 pt-[15vh]" onMouseDown={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border-card bg-bg-elevated shadow-2xl font-mono"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border-card px-4">
          <Terminal className="w-4 h-4 text-electric-blue-500 dark:text-electric-blue-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            autoFocus
            onKeyDown={onKeyDown}
            placeholder=">train, >projects nlp, >resume, >contact…"
            className="w-full bg-transparent py-4 text-sm text-text-primary placeholder:text-text-secondary outline-none"
            aria-label="Command"
          />
          <kbd className="hidden sm:block text-[10px] text-text-secondary border border-border-card rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        <ul className="max-h-[50vh] overflow-y-auto py-2" role="listbox">
          {items.length === 0 && <li className="px-4 py-3 text-sm text-text-secondary">No matches. Try &gt;projects, &gt;train or &gt;ask …</li>}
          {items.map((item, i) => (
            <li
              key={item.id}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => run(item)}
              className={`flex items-center justify-between gap-4 px-4 py-2.5 text-sm cursor-pointer ${
                i === active ? "bg-electric-blue-500/10 text-text-primary" : "text-text-secondary"
              }`}
            >
              <span className="shrink-0 max-w-[65%] truncate">{item.label}</span>
              <span className="flex items-center gap-2 min-w-0 text-xs text-text-secondary">
                <span className="truncate">{item.hint}</span>
                {i === active && <CornerDownLeft className="w-3 h-3 shrink-0" />}
              </span>
            </li>
          ))}
        </ul>

        {log.length > 0 && (
          <pre className="max-h-56 overflow-y-auto border-t border-border-card bg-bg-base px-4 py-3 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400 whitespace-pre-wrap">
            {log.join("\n")}
          </pre>
        )}
      </div>
    </div>
  );
}
