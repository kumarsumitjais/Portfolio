"use client";

import { useEffect, useRef, useState } from "react";
import { REACTIONS, corgi, frameSrc, playReaction, type CorgiSnapshot } from "@/components/mascot/corgiConfig";

// Test bench for the corgi companion. Drives the real floating corgi (bottom-right)
// through "corgi:cmd" events and shows its live state from "corgi:state".

const STEPS = [
  ["idle", "Idle"], ["notice", "Notices"], ["warm", "Getting happy"], ["lift", "Lifts paw"], ["wave", "Waves"],
  ["hold", "Holds"], ["relax", "Relaxes"], ["sleep", "Sleep"], ["reaction", "Reaction"],
] as const;

export function CorgiLab() {
  const [snap, setSnap] = useState<CorgiSnapshot | null>(null);
  const [override, setOverride] = useState(false);
  const [value, setValue] = useState(0);
  const [bubble, setBubble] = useState(true);
  const replay = useRef(0);

  useEffect(() => {
    const on = (e: Event) => setSnap((e as CustomEvent<CorgiSnapshot>).detail);
    window.addEventListener("corgi:state", on);
    return () => {
      window.removeEventListener("corgi:state", on);
      cancelAnimationFrame(replay.current);
      corgi({ cmd: "override", arg: null });
    };
  }, []);

  const applySlider = (on: boolean, v = value) => {
    setOverride(on);
    corgi({ cmd: "override", arg: on ? v : null });
  };

  // far → near → hold → far, so the whole proximity path plays on its own
  const runReplay = () => {
    cancelAnimationFrame(replay.current);
    corgi({ cmd: "reset" });
    const keys: [number, number][] = [[0, 0], [700, 0], [1500, 0.3], [2300, 0.6], [2900, 0.9], [7600, 0.9], [8000, 0.1], [9800, 0]];
    const t0 = performance.now();
    const step = () => {
      const t = performance.now() - t0;
      let v = 0;
      for (let k = 1; k < keys.length; k++) {
        if (t <= keys[k][0]) {
          const [ta, va] = keys[k - 1], [tb, vb] = keys[k];
          v = va + (vb - va) * ((t - ta) / (tb - ta));
          break;
        }
      }
      setValue(v);
      applySlider(true, v);
      if (t < keys[keys.length - 1][0]) replay.current = requestAnimationFrame(step);
      else applySlider(false, 0);
    };
    replay.current = requestAnimationFrame(step);
  };

  const btn = "px-3 py-1.5 rounded-lg text-sm border border-border-card bg-bg-card hover:border-electric-blue-400 transition-colors";

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-border-card bg-bg-elevated p-5">
          <h2 className="text-xs uppercase tracking-wider text-text-secondary mb-3">Live state</h2>
          <p className="font-mono text-sm leading-relaxed">
            state: <b className="text-electric-blue-400">{snap?.state ?? "…"}</b> · animation: <b className="text-electric-blue-400">{snap?.anim ?? "…"}</b>
            <br />
            frame: <b className="text-electric-blue-400">{snap?.frame || "…"}</b>
            <br />
            proximity: <b className="text-electric-blue-400">{(snap?.prox ?? 0).toFixed(2)}</b> · source: <b className="text-electric-blue-400">{snap?.source ?? "…"}</b>
          </p>
          <div className="mt-3 h-2 rounded bg-bg-card border border-border-card overflow-hidden">
            <div className="h-full bg-gradient-to-r from-electric-blue-500 to-cyan-400" style={{ width: `${(snap?.prox ?? 0) * 100}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {STEPS.map(([k, label]) => (
              <span
                key={k}
                className={`font-mono text-[11px] px-2 py-0.5 rounded-md border ${snap?.state === k ? "bg-electric-blue-500 border-electric-blue-500 text-white" : "border-border-card text-text-secondary"}`}
              >
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border-card bg-bg-elevated p-5">
          <h2 className="text-xs uppercase tracking-wider text-text-secondary mb-3">Test controls</h2>
          <label className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" checked={override} onChange={(e) => applySlider(e.target.checked)} /> Use slider instead of the cursor
          </label>
          <div className="flex items-center gap-3 text-sm text-text-secondary mb-4">
            far
            <input
              type="range" min={0} max={1} step={0.01} value={value} aria-label="Proximity"
              onChange={(e) => { setValue(+e.target.value); applySlider(true, +e.target.value); }}
              className="flex-1 accent-cyan-400"
            />
            close
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={`${btn} !bg-electric-blue-500 !border-electric-blue-500 text-white`} onClick={() => corgi({ cmd: "greet" })}>Play greeting</button>
            <button className={btn} onClick={() => corgi({ cmd: "idle" })}>Play idle</button>
            <button className={btn} onClick={runReplay}>Replay full sequence</button>
            <button className={btn} onClick={() => { cancelAnimationFrame(replay.current); setValue(0); setOverride(false); corgi({ cmd: "reset" }); }}>Reset to idle</button>
            <button className={btn} onClick={() => corgi({ cmd: "sleep" })}>Sleep</button>
          </div>
          <label className="flex items-center gap-2 text-sm mt-4">
            <input type="checkbox" checked={bubble} onChange={(e) => { setBubble(e.target.checked); corgi({ cmd: "bubble", arg: e.target.checked }); }} /> Speech bubble
          </label>
        </section>
      </div>

      <section className="rounded-2xl border border-border-card bg-bg-elevated p-5">
        <h2 className="text-xs uppercase tracking-wider text-text-secondary mb-3">Reactions · playReaction(name)</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2">
          {REACTIONS.map((r) => (
            <button key={r} onClick={() => playReaction(r)} className="flex flex-col items-center gap-0.5 py-2 rounded-xl border border-border-card bg-bg-card hover:border-electric-blue-400 text-xs transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={frameSrc(`emo:${r}`)} alt="" width={56} height={56} />
              {r}
            </button>
          ))}
        </div>
        <p className="text-sm text-text-secondary mt-3">Each reaction is one drawing from the sheet, shown with a small hop.</p>
      </section>
    </div>
  );
}
