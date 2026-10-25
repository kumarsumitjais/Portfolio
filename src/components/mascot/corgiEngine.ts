import { ANIM, CFG, CORE_ANIMS, FRAME_SIZE, frameSrc, type CorgiSnapshot, type Reaction } from "./corgiConfig";

// Frame player + behaviour for the corgi, outside React: one requestAnimationFrame loop
// draws preloaded frames to a canvas, so nothing re-renders per frame.
//
// States: idle → notice (curious, scrubbed by proximity) → warm (happier, scrubbed)
//         → lift → wave → hold → relax → idle.   Also sleep / wake and one-off reactions.

type State = "idle" | "notice" | "warm" | "lift" | "wave" | "hold" | "relax" | "sleep" | "wake" | "reaction";

interface Hooks {
  say(text: string): void;
  hide(): void;
  change(s: CorgiSnapshot): void;
}

const pick = <T>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];

export class CorgiEngine {
  private ctx: CanvasRenderingContext2D;
  private imgs = new Map<string, HTMLImageElement>();
  private anim = "idle";
  private i = 0;
  private t0 = 0;
  private onEnd: (() => void) | null = null;
  private drawn: string | null = null;

  private state: State = "idle";
  private prox = 0;
  private raw = 0;
  private ptr: { x: number; y: number } | null = null;
  private touch = false;
  private source: CorgiSnapshot["source"] = "cursor";
  private armed = true;
  private lastGreet = -Infinity;
  private leaving = false;
  private manual = false;
  private holdStart = 0;
  private lastActivity = performance.now();
  private nextBlink = 0;
  private override: number | null = null;
  private centre = { x: 0, y: 0 };
  private measuredAt = 0;

  private raf = 0;
  private last = 0;
  private lastEmit = 0;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private off: (() => void)[] = [];
  private rm = window.matchMedia("(prefers-reduced-motion: reduce)");

  constructor(private canvas: HTMLCanvasElement, private host: HTMLElement, private hooks: Hooks) {
    this.ctx = canvas.getContext("2d")!;
    canvas.width = canvas.height = FRAME_SIZE;

    const core = new Set(CORE_ANIMS.flatMap((a) => ANIM[a].frames));
    const rest = new Set(Object.values(ANIM).flatMap((a) => a.frames).filter((f) => !core.has(f)));
    Promise.all([...core].map((f) => this.load(f))).then(() => {
      if (!this.raf) return; // destroyed while loading
      this.goIdle();
    });
    this.later(() => rest.forEach((f) => this.load(f)), 2500);

    const on = <K extends keyof WindowEventMap>(t: K, fn: (e: WindowEventMap[K]) => void) => {
      window.addEventListener(t, fn, { passive: true });
      this.off.push(() => window.removeEventListener(t, fn));
    };
    on("pointermove", (e) => {
      this.touch = e.pointerType === "touch";
      this.ptr = { x: e.clientX, y: e.clientY };
      this.activity();
    });
    on("pointerdown", (e) => {
      this.touch = e.pointerType === "touch";
      this.activity();
    });
    on("keydown", () => this.activity());
    on("scroll", () => this.activity());
    on("resize", () => this.measure());
    const leave = () => (this.ptr = null);
    document.documentElement.addEventListener("mouseleave", leave);
    this.off.push(() => document.documentElement.removeEventListener("mouseleave", leave));

    this.measure();
    this.raf = requestAnimationFrame(this.loop);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.timers.forEach(clearTimeout);
    this.off.forEach((fn) => fn());
  }

  // ── public API ──
  /** Tap / button: greet regardless of proximity. */
  greet(force = false) {
    const now = performance.now();
    if (!force && (!this.armed || now - this.lastGreet < CFG.cooldownMs)) return;
    this.armed = false;
    this.lastGreet = now;
    this.leaving = false;
    this.manual = force;
    if (this.reduced()) {
      this.setState("hold");
      this.holdStart = now;
      this.play("r_excited", () => {});
      this.hooks.say(pick(CFG.greetings));
      return;
    }
    this.setState("lift");
    this.hop();
    this.play("lift", () => {
      this.setState("wave");
      this.hooks.say(pick(CFG.greetings));
      this.hop();
      this.play("wave", () => {
        if (this.leaving) return this.relax();
        this.setState("hold");
        this.holdStart = performance.now();
        this.play("hold");
        this.later(() => this.state === "hold" && this.hooks.say(CFG.followUp), 1400);
      });
    });
  }

  playReaction(name: Reaction) {
    if (!ANIM[`r_${name}`]) return;
    this.setState("reaction");
    this.hop();
    this.play(`r_${name}`, () => this.goIdle());
  }

  goIdle() {
    this.setState("idle");
    this.leaving = this.manual = false;
    this.hooks.hide();
    this.play("idle");
    this.scheduleBlink();
  }

  reset() {
    this.override = null;
    this.prox = this.raw = 0;
    this.armed = true;
    this.lastGreet = -Infinity;
    this.goIdle();
  }

  sleep() {
    this.setState("sleep");
    this.hooks.hide();
    this.play(this.reduced() ? "r_happy" : "sleep");
  }

  /** Test hook: fixed proximity (0..1), or null to follow the pointer again. */
  setOverride(v: number | null) {
    this.override = v;
    if (v !== null) this.activity();
  }

  /** Taps: the first greets (no hover on touch screens); a tap within 8 s of a greeting opens the chat. */
  handleTap(): "greeted" | "open" {
    if (this.touch && performance.now() - this.lastGreet > 8000) {
      this.greet(true);
      return "greeted";
    }
    return "open";
  }

  // ── internals ──
  private reduced = () => this.rm.matches;
  private later(fn: () => void, ms: number) {
    this.timers.push(setTimeout(fn, ms));
  }
  private activity() {
    this.lastActivity = performance.now();
  }
  private measure(now = performance.now()) {
    this.measuredAt = now;
    const r = this.host.getBoundingClientRect();
    this.centre = { x: r.left + r.width / 2, y: r.top + r.height * 0.55 };
  }
  private scheduleBlink() {
    const [a, b] = CFG.blinkEvery;
    this.nextBlink = performance.now() + a + Math.random() * (b - a);
  }
  private setState(s: State) {
    this.state = s;
    this.host.classList.toggle("corgi-breathe", (s === "idle" || s === "sleep") && !this.reduced());
    this.emit(true);
  }
  private hop() {
    if (this.reduced()) return;
    this.host.classList.remove("corgi-hop");
    void this.host.offsetWidth; // restart the CSS animation
    this.host.classList.add("corgi-hop");
  }
  private relax() {
    this.manual = false;
    if (this.reduced()) return this.goIdle();
    this.setState("relax");
    this.hooks.hide();
    this.play("relax", () => this.goIdle());
  }
  private wake() {
    this.setState("wake");
    this.hop();
    this.play("wake", () => this.goIdle());
  }

  private load(name: string) {
    if (this.imgs.has(name)) return Promise.resolve();
    const img = new Image();
    img.src = frameSrc(name);
    this.imgs.set(name, img);
    return img.decode().catch(() => console.warn("[corgi] missing frame", name));
  }

  private play(name: string, onEnd?: () => void) {
    this.anim = name;
    this.i = 0;
    this.t0 = performance.now();
    this.onEnd = onEnd ?? null;
    ANIM[name].frames.forEach((f) => this.load(f));
    this.draw();
  }

  private show(frame: string) {
    if (this.drawn === frame) return;
    const img = this.imgs.get(frame);
    if (!img?.complete || !img.naturalWidth) return; // not loaded (yet): keep the previous frame
    this.ctx.clearRect(0, 0, FRAME_SIZE, FRAME_SIZE);
    this.ctx.drawImage(img, 0, 0, FRAME_SIZE, FRAME_SIZE);
    this.drawn = frame;
    this.emit(true);
  }

  private draw() {
    const a = ANIM[this.anim];
    this.show(a.frames[Math.min(this.i, a.frames.length - 1)]);
  }

  /** Proximity picks the frame; steps one frame at a time with hysteresis so it never flickers. */
  private scrub(name: string, t: number) {
    const n = ANIM[name].frames.length;
    if (this.anim !== name) {
      this.anim = name;
      this.i = Math.round(t * (n - 1));
    }
    const target = t * (n - 1);
    const now = performance.now();
    if (Math.abs(target - this.i) > 0.65 && now - this.t0 > CFG.scrubStepMs) {
      this.i += Math.sign(target - this.i);
      this.t0 = now;
    }
    this.draw();
  }

  private step(now: number) {
    const a = ANIM[this.anim];
    if (a.scrub) return;
    if (a.hold) {
      if (now - this.t0 > a.hold) this.finish();
      return;
    }
    const i = Math.floor(((now - this.t0) / 1000) * (a.fps ?? 8));
    if (i >= a.frames.length) {
      if (a.loop) {
        this.t0 = now;
        this.i = 0;
      } else return this.finish();
    } else this.i = i;
    this.draw();
  }

  private finish() {
    const cb = this.onEnd;
    this.onEnd = null;
    const next = ANIM[this.anim].next;
    if (cb) cb();
    else if (next) this.play(next);
  }

  private emit(force = false) {
    const now = performance.now();
    if (!force && now - this.lastEmit < 100) return;
    this.lastEmit = now;
    this.hooks.change({ state: this.state, anim: this.anim, frame: this.drawn ?? "", prox: this.prox, source: this.source });
  }

  private loop = (now: number) => {
    const dt = Math.min(100, now - (this.last || now));
    this.last = now;
    this.tick(now, dt);
    this.raf = requestAnimationFrame(this.loop);
  };

  private tick(now: number, dt: number) {
    if (this.override !== null) {
      this.raw = this.override;
      this.source = "slider";
    } else if (this.ptr && !this.touch) {
      const d = Math.hypot(this.ptr.x - this.centre.x, this.ptr.y - this.centre.y);
      this.raw = 1 - Math.pow(Math.min(1, d / CFG.radius), 1.6); // ease: rises faster near the corgi
      this.raw = Math.max(0, this.raw);
      this.source = "cursor";
    } else {
      this.raw = 0;
      this.source = this.touch ? "touch" : "cursor";
    }
    if (now - this.measuredAt > 500) this.measure(now); // the dock can move (entry animation, resize)
    this.prox += (this.raw - this.prox) * (1 - Math.exp(-dt / CFG.smoothingMs));
    const p = this.prox;
    if (p < CFG.rearm) this.armed = true;
    this.emit();

    switch (this.state) {
      case "idle":
        if (this.reduced()) {
          if (p > CFG.greet) this.greet();
        } else if (p > CFG.notice[0]) {
          this.setState("notice");
          break;
        }
        if (now - this.lastActivity > CFG.sleepAfterMs) {
          this.sleep();
          break;
        }
        if (now > this.nextBlink && this.anim === "idle" && !this.reduced()) {
          this.play(Math.random() < CFG.fidgetChance ? "fidget" : "blink");
          this.scheduleBlink();
        }
        break;
      case "notice":
        if (p < CFG.notice[1]) this.goIdle();
        else if (p > CFG.warm[0]) this.setState("warm");
        else this.scrub("notice", Math.min(1, (p - CFG.notice[1]) / (CFG.warm[0] - CFG.notice[1])));
        break;
      case "warm":
        if (p < CFG.warm[1]) this.setState("notice");
        else if (p > CFG.greet && this.armed && now - this.lastGreet > CFG.cooldownMs) this.greet();
        else this.scrub("warm", Math.min(1, (p - CFG.warm[1]) / (CFG.greet - CFG.warm[1])));
        break;
      case "lift":
      case "wave":
        if (p < CFG.leave && !this.manual) this.leaving = true; // finish this wave, then relax
        break;
      case "hold":
        if (this.manual ? now - this.holdStart > CFG.manualHoldMs : p < CFG.leave) this.relax();
        break;
      case "sleep":
        if (now - this.lastActivity < 200) {
          if (this.reduced()) this.goIdle();
          else this.wake();
        }
        break;
    }
    if (this.state !== "notice" && this.state !== "warm") this.step(now);
  }
}
