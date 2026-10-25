"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { CFG, frameSrc, type CorgiCommand, type CorgiSnapshot } from "./corgiConfig";
import { CorgiEngine } from "./corgiEngine";

// The floating corgi that opens the Corgi chat assistant. Behaviour lives in corgiEngine.ts;
// other code can talk to it with corgi({ cmd }) / playReaction(name) from corgiConfig.ts,
// and listen to "corgi:state" events (used by the /lab/corgi test page).

export function CorgiCompanion({ onOpen }: { onOpen: () => void }) {
  const hostRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const engineRef = useRef<CorgiEngine | null>(null);

  useEffect(() => {
    // Start once the page has loaded and gone idle, so the corgi never competes with
    // the page's own first render (a static first frame shows until then).
    let cleanup = () => {};
    const start = () => {
    const bubble = bubbleRef.current!;
    let bubbleOn = true;
    let hideTimer: ReturnType<typeof setTimeout>;
    const hide = () => bubble.removeAttribute("data-show");
    const engine = new CorgiEngine(canvasRef.current!, hostRef.current!, {
      say(text) {
        if (!bubbleOn) return;
        textRef.current!.textContent = text;
        bubble.setAttribute("data-show", "true");
        clearTimeout(hideTimer);
        hideTimer = setTimeout(hide, CFG.bubbleMs);
      },
      hide,
      change: (s: CorgiSnapshot) => window.dispatchEvent(new CustomEvent("corgi:state", { detail: s })),
    });
    engineRef.current = engine;

    const onCmd = (e: Event) => {
      const c = (e as CustomEvent<CorgiCommand>).detail;
      if (c.cmd === "react") engine.playReaction(c.arg);
      else if (c.cmd === "greet") engine.greet(true);
      else if (c.cmd === "idle") engine.goIdle();
      else if (c.cmd === "reset") engine.reset();
      else if (c.cmd === "sleep") engine.sleep();
      else if (c.cmd === "override") engine.setOverride(c.arg);
      else if (c.cmd === "bubble") {
        bubbleOn = c.arg;
        if (!bubbleOn) hide();
      }
    };
    window.addEventListener("corgi:cmd", onCmd);
    cleanup = () => {
      window.removeEventListener("corgi:cmd", onCmd);
      clearTimeout(hideTimer);
      engine.destroy();
      engineRef.current = null;
    };
    };
    const idle = (fn: () => void) =>
      "requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 1200);
    let handle: number | ReturnType<typeof setTimeout> | undefined;
    const schedule = () => (handle = idle(start));
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if ("cancelIdleCallback" in window && typeof handle === "number") cancelIdleCallback(handle);
      clearTimeout(handle as ReturnType<typeof setTimeout>);
      cleanup();
    };
  }, []);

  const onClick = (e: React.MouseEvent) => {
    // keyboard activation (detail 0) always opens; touch: first tap greets
    if (e.detail !== 0 && engineRef.current?.handleTap() === "greeted") return;
    onOpen();
  };

  return (
    <div className="corgi-dock fixed bottom-1 right-2 sm:bottom-2 sm:right-4 z-50 flex items-end pointer-events-none">
      <button
        ref={hostRef}
        type="button"
        onClick={onClick}
        aria-label="Chat with Corgi, Sumit's AI assistant"
        className="corgi-btn pointer-events-auto relative w-[88px] h-[88px] sm:w-[108px] sm:h-[108px] rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 [-webkit-tap-highlight-color:transparent]"
      >
        <span aria-hidden className="absolute left-[30%] right-[30%] bottom-2.5 h-2 rounded-[50%] bg-black/25 dark:bg-black/40 blur-[3px]" />
        <canvas
          ref={canvasRef}
          aria-hidden
          className="relative block w-full h-full bg-contain bg-no-repeat"
          style={{ backgroundImage: `url(${frameSrc("idle_001")})` }}
        />
      </button>
      <div
        ref={bubbleRef}
        role="status"
        aria-live="polite"
        className="corgi-bubble absolute right-9 bottom-[84px] sm:right-16 sm:bottom-[104px] w-max max-w-[min(240px,calc(100vw-48px))] pl-3.5 pr-8 py-2 rounded-2xl rounded-br-sm bg-bg-elevated text-text-primary border border-border-card shadow-xl text-[13px] leading-snug font-medium"
      >
        <span ref={textRef} />
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => bubbleRef.current?.removeAttribute("data-show")}
          className="absolute top-1.5 right-1.5 p-0.5 rounded text-text-secondary hover:text-text-primary"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
