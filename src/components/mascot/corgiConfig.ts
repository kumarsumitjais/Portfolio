// Corgi companion: frames, timings and behaviour thresholds.
// Frames live in public/mascot/corgi/ (cut from the reaction sheet; see prototypes/corgi-preview/extract.py).
// Change sequences or timings here; the engine (corgiEngine.ts) reads everything from this file.

export const FRAME_SIZE = 128; // every frame is 128×128, feet on the same baseline

/** "idle_001" → /mascot/corgi/idle/idle_001.webp, "emo:love" → /mascot/corgi/emotions/love.webp */
export const frameSrc = (name: string) =>
  name.startsWith("emo:")
    ? `/mascot/corgi/emotions/${name.slice(4)}.webp`
    : `/mascot/corgi/${name.split("_")[0]}/${name}.webp`;

const seq = (prefix: string, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}_${String(from + i).padStart(3, "0")}`);

export interface Anim {
  frames: string[];
  fps?: number;
  loop?: boolean;
  /** frame picked by proximity instead of time */
  scrub?: boolean;
  /** single pose shown for this long (ms) */
  hold?: number;
  /** animation to play when this one ends */
  next?: string;
}

export const ANIM: Record<string, Anim> = {
  idle:   { frames: ["idle_001"], fps: 1, loop: true },
  blink:  { frames: ["idle_001", "idle_003", "idle_003", "idle_001"], fps: 14, next: "idle" },
  fidget: { frames: ["idle_001", "idle_005", "idle_006", "idle_007", "idle_006", "idle_005", "idle_001"], fps: 7, next: "idle" },
  notice: { frames: seq("curious", 1, 7), scrub: true },
  warm:   { frames: seq("happy", 3, 7), scrub: true },
  lift:   { frames: ["happy_006", "happy_007", "emo:excited"], fps: 9 },
  // The sheet's own wave row overlaps and can't be cut cleanly, so the wave alternates the clean paw-up poses.
  wave:   { frames: ["emo:excited", "hold_007", "emo:laugh", "hold_004", "emo:excited", "hold_007", "emo:laugh"], fps: 6 },
  hold:   { frames: ["hold_001", "hold_003", "hold_005", "hold_006"], fps: 3.5, loop: true },
  relax:  { frames: [...seq("away", 1, 7), "idle_001"], fps: 10 },
  sleep:  { frames: ["sleep_006", "sleep_008"], fps: 1.1, loop: true },
  wake:   { frames: ["emo:surprised", "curious_002", "curious_001", "idle_001"], fps: 6 },
};

/** Single-pose reactions (one drawing each on the sheet), triggered with playReaction(name). */
export const REACTIONS = [
  "happy", "excited", "wink", "laugh", "love", "surprised", "confused", "thinking", "sad", "pout", "angry", "shy",
  "scared", "curious", "celebration", "clap", "yes", "no", "follow", "attention", "listening", "loading", "success", "error",
] as const;
export type Reaction = (typeof REACTIONS)[number];
for (const r of REACTIONS) ANIM[`r_${r}`] = { frames: [`emo:${r}`], hold: 1600 };

/** Loaded first; everything else loads once the page is idle. */
export const CORE_ANIMS = ["idle", "blink", "notice", "warm", "lift", "wave", "hold", "relax"];

export const CFG = {
  radius: 300,            // px from the corgi where it starts reacting
  smoothingMs: 140,       // proximity smoothing time constant
  notice: [0.18, 0.1],    // enter / exit (hysteresis)
  warm: [0.48, 0.4],
  greet: 0.82,            // proximity that triggers the wave
  leave: 0.3,             // below this the greeting wraps up and relaxes
  rearm: 0.12,            // must fall below this before greeting again
  cooldownMs: 3500,
  manualHoldMs: 3500,     // greeting triggered by tap/button holds this long
  sleepAfterMs: 45000,
  blinkEvery: [2600, 5200],
  fidgetChance: 0.25,
  scrubStepMs: 70,        // min time between proximity-driven frame changes
  greetings: ["Hey there! 👋", "Hello! 💛", "Hi, I'm happy you're here!"],
  followUp: "Need a hand? Click me to chat with Sahayika ✨",
  bubbleMs: 4200,
};

/** Command another part of the app can send to the corgi (see CorgiCompanion). */
export type CorgiCommand =
  | { cmd: "react"; arg: Reaction }
  | { cmd: "greet" | "idle" | "reset" | "sleep" }
  | { cmd: "override"; arg: number | null }
  | { cmd: "bubble"; arg: boolean };

export const corgi = (detail: CorgiCommand) => window.dispatchEvent(new CustomEvent("corgi:cmd", { detail }));
export const playReaction = (name: Reaction) => corgi({ cmd: "react", arg: name });

export interface CorgiSnapshot {
  state: string;
  anim: string;
  frame: string;
  prox: number;
  source: "cursor" | "slider" | "touch";
}
