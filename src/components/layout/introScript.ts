// Startup intro: random data-science / ML expressions drift in from all over the
// screen along wandering paths, converge into a glowing core, a beam bursts out,
// and the page is "blown out" from the centre as the result.
//
// It is an inline script (rendered at the start of <body>, after its placeholder) rather than a React component,
// so it starts drawing before React hydrates and the page never flashes first.
// The real page renders underneath the whole time (no effect on LCP).
// Plays once per browser session (the first page opened); skipped with a click, tap or key,
// for prefers-reduced-motion, lite mode (low-end devices, see app/layout.tsx) and
// automated browsers (crawlers, Lighthouse).
// Styles: #site-intro in app/globals.css.

export const INTRO_SCRIPT = `(function () {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || navigator.webdriver) return;
    if ("lite" in document.documentElement.dataset || sessionStorage.getItem("intro-seen")) return;
    sessionStorage.setItem("intro-seen", "1");
  } catch (e) { return; }

  var TERMS = ["∇J(θ)", "θ − η∇J(θ)", "σ(Wx + b)", "softmax(z)", "Σ yᵢ log ŷᵢ", "‖w‖²", "λ‖θ‖₁", "KL(P ‖ Q)",
    "∂L/∂w", "e^(−γ‖x − x′‖²)", "Attention(Q,K,V)", "QKᵀ/√dₖ", "P(y | x)", "argmax p(y|x)", "ReLU(x)",
    "tanh(hₜ₋₁)", "β₁m + (1 − β₁)g", "μ ± 2σ", "Var[X]", "𝔼[X]", "cov(X, Y)", "R²", "MSE", "H(p)",
    "log p(x)", "∫ p(x) dx", "Wᵀx", "(x − μ)/σ", "F1", "AUC", "precision · recall", "γ max Q(s′,a′)",
    "UΣVᵀ", "eig(Σ)", "PCA(X)", "TF-IDF", "conv(x, k)", "dropout(p)", "LSTM(hₜ)", "1/(1 + e⁻ᶻ)",
    "√(Σ(y − ŷ)²/n)", "P(A|B)P(B)", "∏ p(xᵢ|θ)", "Σᵢ αᵢ yᵢ K(xᵢ, x)", "tr(XᵀX)", "det(Σ)", "LayerNorm(x)",
    "Adam(m̂, v̂)", "BLEU", "embed(t)", "cos(u, v)", "ε ~ 𝒩(0, I)", "z = μ + σ ⊙ ε", "p(x|z)", "√dₖ"];
  var OPS = [" + ", " − ", " × ", " ÷ ", " · ", " ⊗ ", " ∘ ", " ⊕ ", " / "];
  var ENDS = ["= ?", "→ min", "≈ 0", "→ ∞", "∝ 1"];
  var PALETTE = ["#33d6e0", "#5c8cff", "#2e6bff", "#a78bfa", "#8a93a3", "#fbfcfe"];
  function pick(a) { return a[(Math.random() * a.length) | 0]; }
  function expression(small) {
    var n = small ? 1 + (Math.random() < 0.6 ? 1 : 0) : 2 + (Math.random() < 0.45 ? 1 : 0);
    var s = pick(TERMS);
    for (var i = 1; i < n; i++) {
      var t = pick(TERMS);
      s = Math.random() < 0.3 ? "(" + s + ")" + pick(OPS) + t : s + pick(OPS) + t;
    }
    if (Math.random() < 0.25) s += " " + pick(ENDS);
    return s;
  }

  var root = document.documentElement;
  var mono = (getComputedStyle(root).getPropertyValue("--font-jetbrains-mono") || "").trim() || "ui-monospace";

  // The (empty) #site-intro placeholder is rendered by app/layout.tsx right before
  // this script; we only fill and later empty it, so React's tree is never altered.
  var intro = document.getElementById("site-intro");
  if (!intro) return;
  intro.innerHTML = '<canvas></canvas><div class="site-intro-hud"></div><button type="button" class="site-intro-skip" tabindex="-1">skip ↵</button>';
  root.classList.add("intro-playing");

  var canvas = intro.querySelector("canvas");
  var hud = intro.querySelector(".site-intro-hud");
  var ctx = canvas.getContext("2d");
  var W, H, cx, cy, small, ui, density;
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight; cx = W / 2; cy = H / 2;
    small = W < 640;
    ui = Math.min(1, Math.max(0.8, W / 1280));
    density = Math.min(1, Math.max(0.7, (W * H) / (1280 * 720)));
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  addEventListener("resize", resize);

  var T_SPAWN_END = 2000, T_CONVERGE = 2300, T_BEAM = 3050, T_BLOW = 3450, T_END = 4350;
  var tokens = [], energy = 0, elapsed = 0, last = performance.now(), done = false, raf, revealed = false;
  // Adaptive quality: start lighter on low-end devices, drop further if frames are slow.
  var lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  var frameCount = 0, slowFrames = 0;

  // Each expression is rendered once to a small bitmap, then only moved/scaled/faded
  // per frame (much cheaper than re-drawing text every frame).
  function sprite(text, size, color) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var c = document.createElement("canvas"), x = c.getContext("2d");
    var font = size.toFixed(1) + "px " + mono;
    x.font = font;
    var w = Math.ceil(x.measureText(text).width) + 4, h = Math.ceil(size * 1.4);
    c.width = w * dpr; c.height = h * dpr;
    x.scale(dpr, dpr); x.font = font; x.fillStyle = color; x.textBaseline = "middle";
    x.fillText(text, 2, h / 2);
    return { img: c, w: w, h: h };
  }

  function spawn() {
    var x, y;
    if (Math.random() < 0.7) {
      var side = (Math.random() * 4) | 0;
      if (side < 2) { x = side === 0 ? -40 : W + 40; y = Math.random() * H; }
      else { y = side === 2 ? -30 : H + 30; x = Math.random() * W; }
    } else {
      x = Math.random() * W; y = Math.random() * H;
      if (Math.hypot(x - cx, y - cy) < Math.min(W, H) * 0.25) x = x < cx ? x * 0.4 : W - (W - x) * 0.4;
    }
    var a = Math.random() * Math.PI * 2, color;
    tokens.push({ x: x, y: y, vx: Math.cos(a) * 60, vy: Math.sin(a) * 60, heading: a,
      turn: (Math.random() - 0.5) * 6, wobble: 0.6 + Math.random() * 2.2, phase: Math.random() * 10,
      sprite: sprite(expression(small), (11 + Math.random() * 9) * ui, color = pick(PALETTE)),
      color: color, born: elapsed, alpha: 0, trail: [] });
  }

  function frame(now) {
    var dt = Math.min(120, now - last); last = now;   // catch up after stalls (e.g. hydration)
    if (++frameCount > 3 && frameCount < 40 && dt > 28 && ++slowFrames > 6) lowPower = true;
    elapsed += dt;
    var tsec = dt / 1000;

    ctx.fillStyle = "rgba(5,7,10," + (elapsed < T_SPAWN_END ? 0.32 : 0.6) + ")";
    ctx.fillRect(0, 0, W, H);

    if (elapsed < T_SPAWN_END) {
      var n = (34 * (1 - elapsed / T_SPAWN_END) + 6) * density * (lowPower ? 0.55 : 1) * tsec;
      while (n > 0) { if (Math.random() < n) spawn(); n -= 1; }
    }
    var pull = elapsed < T_CONVERGE ? 40 + elapsed * 0.09 : 900 + (elapsed - T_CONVERGE) * 4;

    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (var i = tokens.length - 1; i >= 0; i--) {
      var p = tokens[i];
      var dx = cx - p.x, dy = cy - p.y, dist = Math.hypot(dx, dy) || 1;
      p.turn += (Math.random() - 0.5) * 8 * tsec;
      p.heading += (p.turn + Math.sin(elapsed / 300 * p.wobble + p.phase) * 3) * tsec;
      var wander = elapsed < T_CONVERGE ? 140 : 35;
      p.vx += (Math.cos(p.heading) * wander + (dx / dist) * pull) * tsec;
      p.vy += (Math.sin(p.heading) * wander + (dy / dist) * pull) * tsec;
      var damp = Math.pow(0.35, tsec); p.vx *= damp; p.vy *= damp;
      p.x += p.vx * tsec; p.y += p.vy * tsec;
      p.alpha = Math.min(1, (elapsed - p.born) / 300);
      var near = Math.min(1, dist / (Math.min(W, H) * 0.45));

      if (!lowPower) {
        p.trail.push(p.x, p.y); if (p.trail.length > 16) p.trail.splice(0, 2);
        ctx.strokeStyle = p.color; ctx.globalAlpha = 0.18 * p.alpha; ctx.lineWidth = 1;
        ctx.beginPath();
        for (var k = 0; k < p.trail.length; k += 2) { if (k) ctx.lineTo(p.trail[k], p.trail[k + 1]); else ctx.moveTo(p.trail[k], p.trail[k + 1]); }
        ctx.stroke();
      }

      var sc = 0.35 + 0.65 * near, sp = p.sprite;
      ctx.globalAlpha = p.alpha * sc;
      ctx.drawImage(sp.img, p.x - sp.w * sc / 2, p.y - sp.h * sc / 2, sp.w * sc, sp.h * sc);
      if (dist < 18) { energy += 1; tokens.splice(i, 1); }
    }
    ctx.globalAlpha = 1;

    var e = Math.min(1, energy / (70 * density));
    var coreR = 6 + e * 46 + (elapsed > T_CONVERGE ? (elapsed - T_CONVERGE) * 0.04 : 0);
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3);
    g.addColorStop(0, "rgba(255,255,255," + (0.35 + e * 0.65) + ")");
    g.addColorStop(0.25, "rgba(51,214,224," + (0.25 + e * 0.5) + ")");
    g.addColorStop(1, "rgba(46,107,255,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, coreR * 3, 0, Math.PI * 2); ctx.fill();
    if (elapsed > 600 && elapsed < T_BEAM) {
      ctx.font = "12px " + mono; ctx.fillStyle = "rgba(255,255,255," + (0.4 + e * 0.5) + ")";
      ctx.fillText((Math.random() * 10).toFixed(6), cx, cy + coreR * 2 + 14);
    }

    if (elapsed > T_BEAM) {
      var b = Math.min(1, (elapsed - T_BEAM) / (T_BLOW - T_BEAM));
      ctx.globalCompositeOperation = "lighter";
      var len = Math.max(W, H) * (0.2 + b * 1.2);
      [[2 + b * 6, 1], [18 + b * 40, 0.25]].forEach(function (wa) {
        var w = wa[0], al = wa[1];
        var hb = ctx.createLinearGradient(cx - len, cy, cx + len, cy);
        hb.addColorStop(0, "rgba(51,214,224,0)"); hb.addColorStop(0.5, "rgba(255,255,255," + al + ")"); hb.addColorStop(1, "rgba(51,214,224,0)");
        ctx.fillStyle = hb; ctx.fillRect(cx - len, cy - w / 2, len * 2, w);
        var vb = ctx.createLinearGradient(cx, cy - len, cx, cy + len);
        vb.addColorStop(0, "rgba(46,107,255,0)"); vb.addColorStop(0.5, "rgba(255,255,255," + al * 0.8 + ")"); vb.addColorStop(1, "rgba(46,107,255,0)");
        ctx.fillStyle = vb; ctx.fillRect(cx - w / 4, cy - len, w / 2, len * 2);
      });
      var flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * (0.15 + b * 0.75));
      flash.addColorStop(0, "rgba(255,255,255," + 0.85 * b + ")"); flash.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = flash; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
    }

    var pct = Math.min(100, Math.round(elapsed / T_BEAM * 100));
    var loss = Math.max(0.0001, 2.3 * Math.exp(-elapsed / 700)).toFixed(4);
    hud.textContent = "> evaluating " + (tokens.length + energy) + " expressions\\n> loss " + loss + "   epoch " + Math.min(99, (elapsed / 35) | 0) + "\\n> converging " + pct + "%";

    if (elapsed > T_BLOW) {
      var kk = Math.min(1, (elapsed - T_BLOW) / (T_END - T_BLOW));
      var eased = 1 - Math.pow(1 - kk, 3);
      intro.classList.add("site-intro-blowout");
      intro.style.setProperty("--hole", (eased * 150).toFixed(1) + "%");
      if (!revealed) { revealed = true; root.classList.add("intro-reveal"); }
      if (kk >= 1) return finish();
    }
    raf = requestAnimationFrame(frame);
  }

  function finish() {
    if (done) return; done = true;
    clearTimeout(failsafe);
    cancelAnimationFrame(raf);
    removeEventListener("resize", resize);
    removeEventListener("keydown", finish);
    intro.removeEventListener("pointerdown", finish);
    if (!revealed) root.classList.add("intro-reveal");
    root.classList.remove("intro-playing");
    intro.classList.remove("site-intro-blowout");
    intro.innerHTML = "";
    setTimeout(function () { root.classList.remove("intro-reveal"); }, 1000);
  }
  var failsafe = setTimeout(finish, 7000);   // never longer than this, even on a slow phone
  intro.addEventListener("pointerdown", finish);
  addEventListener("keydown", finish);

  ctx.fillStyle = "#05070a"; ctx.fillRect(0, 0, W, H);
  raf = requestAnimationFrame(frame);
})();`;
