/* BLUMI Playground — Glitch Breaker (brick breaker). Loaded only when picked. Mounts into #breakCard. */
(() => {
  const card = document.getElementById("breakCard");
  if (!card || window.BlumiBreaker) return;
  if (!document.getElementById("gx-style")) { const st = document.createElement("style"); st.id = "gx-style"; st.textContent = ".gx-card{position:relative;background:#050b1f;overflow:hidden;user-select:none;-webkit-user-select:none}\n.gx-card canvas{display:block;width:100%;touch-action:none}\n.gx-hud{position:absolute;left:12px;right:12px;top:12px;display:flex;justify-content:space-between;align-items:flex-start;pointer-events:none;color:#fff}\n.gx-chip{display:inline-flex;align-items:baseline;gap:7px;padding:8px 13px;border-radius:999px;background:rgba(5,12,35,.55);border:1px solid rgba(160,210,255,.22);backdrop-filter:blur(6px);font:800 15px/1 var(--font-display,Unbounded),Unbounded,sans-serif}\n.gx-chip small{font:700 9.5px/1 Inter,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.75}\n.gx-chip .hearts{color:#ff6b8b;letter-spacing:.1em}\n.gx-r{display:flex;gap:8px;align-items:center}\n.gx-pause{pointer-events:auto;cursor:pointer;width:38px;height:34px;display:inline-grid;place-items:center;padding:0;color:#fff}\n.gx-pause svg{width:16px;height:16px}\n.gx-ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;color:#fff;background:linear-gradient(180deg,rgba(3,10,35,.55),rgba(2,6,20,.82));backdrop-filter:blur(4px);transition:opacity .35s}\n.gx-ov.off{opacity:0;pointer-events:none}\n.gx-ov h3{font:800 28px/1.1 var(--font-display,Unbounded),Unbounded,sans-serif;margin:0}\n.gx-ov .sc{margin-top:10px;font:800 44px/1 var(--font-display,Unbounded),Unbounded,sans-serif}\n.gx-ov .sc[hidden]{display:none}\n.gx-ov p{margin:12px 0 0;max-width:360px;font-size:14.5px;line-height:1.55;color:rgba(255,255,255,.9)}\n.gx-ov .acts{display:flex;gap:10px;margin-top:22px;flex-wrap:wrap;justify-content:center}\n.gx-ov button.gx-b{appearance:none;border:0;cursor:pointer;padding:15px 32px;border-radius:999px;background:#fff;color:#0a5cff;font:800 15px/1 var(--font-display,Unbounded),Unbounded,sans-serif;letter-spacing:.04em;box-shadow:0 14px 30px -10px rgba(0,0,0,.35)}\n.gx-ov button.gx-b.g{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.3);box-shadow:none}\n.gx-ov button[hidden]{display:none}\n.gx-ov .how{margin-top:16px;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.78);max-width:340px}\n"; document.head.appendChild(st); }
  card.classList.add("gx-card");
  card.innerHTML = `
    <canvas aria-label="Glitch Breaker"></canvas>
    <div class="gx-hud" aria-hidden="true">
      <span class="gx-chip"><small>Score</small><b data-x="score">0</b></span>
      <span class="gx-r">
        <span class="gx-chip"><small>Level</small><b data-x="level">1</b></span>
        <span class="gx-chip"><span class="hearts" data-x="lives"></span></span>
        <button class="gx-chip gx-pause" type="button" data-x="pause" aria-label="Pause"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg></button>
      </span>
    </div>
    <div class="gx-ov" data-x="ov">
      <h3 data-x="title">Glitch Breaker</h3>
      <div class="sc" data-x="final" hidden></div>
      <p data-x="how">Bounce the drop and smash the Glitch wall. Catch power-ups for multi-ball, a wider paddle and lasers. Every 5 levels the Glitch Core fights back.</p>
      <div class="acts"><button class="gx-b" type="button" data-x="play">Play</button><button class="gx-b g" type="button" data-x="quit" hidden>End game</button></div>
      <div class="how">Drag to move · tap to launch · or ← → and Space</div>
    </div>`;
  const X = k => card.querySelector(`[data-x="${k}"]`);
  const cv = card.querySelector("canvas"); const ctx = cv.getContext("2d");
  const mascot = new Image(); mascot.src = "/assets/blumi-mascot-160.webp"; mascot.onerror = () => { mascot.onerror = null; mascot.src = "assets/blumi-mascot-160.webp"; };
  const store = { get(k){ try { return +localStorage.getItem(k) || 0; } catch(e){ return 0; } }, set(k, v){ try { localStorage.setItem(k, v); } catch(e){} } };
  const KEY = "blumi-best-breaker";
  const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = n => n.toLocaleString("en-US");
  let W = 380, H = 560, DPR = 1, active = false, raf = 0, last = 0;
  let state = "menu", paused = false, t = 0, shake = 0, flash = 0;
  let pad, balls = [], bricks = [], caps = [], lasers = [], shots = [], parts = [], floats = [], boss = null;
  let score = 0, level = 1, lives = 3, combo = 0, banner = null, clearT = -1, stars = [];

  function resize(){
    const w = card.clientWidth || 380; const oldW = W; W = w; H = Math.round(clamp(Math.min(innerHeight * .74, w * 1.45), 460, 680)); DPR = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); cv.style.height = H + "px"; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (!stars.length) for (let i = 0; i < 70; i++) stars.push({ x: Math.random(), y: Math.random(), z: Math.random() });
    if (pad){ pad.y = H - 58; pad.x = clamp(pad.x * W / oldW, 0, W); }
  }
  const BASEW = () => Math.min(104, W * .27);
  function speed(){ return Math.min(600, 390 + level * 14) * (pad.slow > 0 ? .72 : 1); }
  function hud(){ X("score").textContent = fmt(score); X("level").textContent = level; X("lives").textContent = "♥".repeat(Math.max(0, lives)); }
  function say(txt){ banner = { txt, t: 0 }; }

  /* ---------- levels ---------- */
  function makeLevel(n){
    bricks = []; caps = []; lasers = []; shots = []; boss = null;
    const cols = 8, gap = 6, bw = (W - 24 - gap * (cols - 1)) / cols, bh = 20, top = 86;
    if (n % 5 === 0){
      boss = { x: W / 2, y: top + 70, r: 34, hp: 24 + n * 5, max: 24 + n * 5, t: 0, fire: 2, hit: 0 };
      for (let k = 0; k < 10; k++) bricks.push({ orbit: k / 10 * Math.PI * 2, x: 0, y: 0, w: 30, h: 16, hp: 2, max: 2, pw: k % 5 === 0 });
      for (let c = 0; c < cols; c++) if (c % 2 === 0) bricks.push({ x: 12 + c * (bw + gap), y: top + 190, w: bw, h: bh, hp: 1, max: 1, pw: c === 4 });
      say("LEVEL " + n + " · GLITCH CORE"); return;
    }
    const rows = Math.min(4 + Math.floor(n / 2), 8), pat = (n - 1) % 4;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++){
      let on = true;
      if (pat === 1) on = (r + c) % 2 === 0 || r === 0;
      if (pat === 2) on = Math.abs(c - 3.5) <= r * .7 + .5;
      if (pat === 3) on = r % 2 === 0 || c === 0 || c === cols - 1;
      if (!on) continue;
      const steel = n >= 4 && r === rows - 1 && (c === 1 || c === cols - 2);
      const hp = steel ? 99 : clamp(1 + Math.floor((rows - 1 - r) / 3) + Math.floor((n - 1) / 4), 1, 3);
      bricks.push({ x: 12 + c * (bw + gap), y: top + r * (bh + gap), w: bw, h: bh, hp, max: hp, steel, pw: !steel && Math.random() < .13 });
    }
    say("LEVEL " + n);
  }
  function newBall(){ balls = [{ x: pad.x, y: pad.y - 22, vx: 0, vy: 0, r: 7, stuck: true, trail: [] }]; }
  function reset(){
    pad = { x: W / 2, y: H - 58, w: BASEW(), tw: BASEW(), wide: 0, laser: 0, slow: 0, shrink: 0, lt: 0, tilt: 0, tx: W / 2 };
    score = 0; level = 1; lives = 3; combo = 0; parts = []; floats = []; shake = 0; clearT = -1;
    makeLevel(level); newBall(); hud();
  }
  function launch(){ for (const b of balls) if (b.stuck){ b.stuck = false; const a = -Math.PI / 2 + rnd(-.35, .35), s = speed(); b.vx = Math.cos(a) * s; b.vy = Math.sin(a) * s; } }

  function burst(x, y, n, col, v){ for (let i = 0; i < n; i++){ const a = rnd(0, 7), s = rnd(60, v || 260); parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: rnd(1.5, 3.6), t: 0, l: rnd(.35, .8), c: Math.random() < .5 ? col : "#ffffff" }); } }
  function hitBrick(br){
    if (br.steel){ burst(br.x + br.w / 2, br.y + br.h / 2, 4, "#9fb3d9", 120); return; }
    br.hp--; br.hit = .1;
    if (br.hp <= 0){ br.dead = true; combo++; const pts = Math.round(10 * br.max * (1 + Math.min(combo, 10) * .25)); score += pts;
      floats.push({ x: br.x + br.w / 2, y: br.y, txt: combo >= 3 ? "+" + pts + " x" + combo : "+" + pts, t: 0 });
      burst(br.x + br.w / 2, br.y + br.h / 2, 14, br.max >= 3 ? "#ff3d9a" : br.max === 2 ? "#a78bff" : "#ff6b8b"); shake = Math.max(shake, .18);
      if (br.pw){ const kinds = ["multi", "wide", "laser", "slow", "life"], w = [30, 25, 20, 15, 10]; let r = rnd(0, 100), k = 0; while (r > w[k]){ r -= w[k]; k++; } if (kinds[k] === "life" && lives >= 5) k = 0;
        caps.push({ x: br.x + br.w / 2, y: br.y + br.h / 2, k: kinds[k], t: 0 }); }
      hud(); }
  }
  function power(k){
    const names = { multi: "Multi-ball", wide: "Wide paddle", laser: "Lasers", slow: "Slow-mo", life: "+1 life" };
    floats.push({ x: pad.x, y: pad.y - 40, txt: names[k], t: 0, big: true }); flash = .4;
    if (k === "multi"){ const add = []; for (const b of balls){ if (b.stuck) continue; for (const da of [-.45, .45]){ const a = Math.atan2(b.vy, b.vx) + da, s = Math.hypot(b.vx, b.vy); add.push({ x: b.x, y: b.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: 7, stuck: false, trail: [] }); } } balls.push(...add.slice(0, 8)); }
    if (k === "wide") pad.wide = 12;
    if (k === "laser") pad.laser = 9;
    if (k === "slow"){ pad.slow = 8; for (const b of balls){ const s = Math.hypot(b.vx, b.vy) || 1; b.vx *= speed() / s; b.vy *= speed() / s; } }
    if (k === "life"){ lives = Math.min(5, lives + 1); hud(); }
  }
  function circRect(b, x, y, w, h){ const cx = clamp(b.x, x, x + w), cy = clamp(b.y, y, y + h), dx = b.x - cx, dy = b.y - cy; return dx * dx + dy * dy <= b.r * b.r ? { dx, dy, cx, cy } : null; }

  /* ---------- update ---------- */
  function update(dt){
    t += dt; shake = Math.max(0, shake - dt * 2); flash = Math.max(0, flash - dt * 2);
    if (banner){ banner.t += dt; if (banner.t > 1.6) banner = null; }
    for (const k of ["wide", "laser", "slow", "shrink"]) pad[k] = Math.max(0, pad[k] - dt);
    pad.tw = BASEW() * (pad.wide > 0 ? 1.5 : 1) * (pad.shrink > 0 ? .65 : 1); pad.w += (pad.tw - pad.w) * Math.min(1, dt * 10);
    const ox = pad.x; pad.x += (pad.tx - pad.x) * Math.min(1, dt * 22); pad.x = clamp(pad.x, pad.w / 2, W - pad.w / 2); pad.tilt += (clamp((pad.x - ox) / dt / 2400, -.18, .18) - pad.tilt) * Math.min(1, dt * 10);
    if (pad.laser > 0){ pad.lt -= dt; if (pad.lt <= 0){ pad.lt = .26; for (const o of [-pad.w / 2 + 8, pad.w / 2 - 8]) lasers.push({ x: pad.x + o, y: pad.y - 8 }); } }
    for (const l of lasers){ l.y -= 760 * dt;
      for (const br of bricks){ if (br.dead) continue; if (l.x > br.x && l.x < br.x + br.w && l.y > br.y && l.y < br.y + br.h){ l.gone = true; hitBrick(br); break; } }
      if (!l.gone && boss && Math.hypot(l.x - boss.x, l.y - boss.y) < boss.r){ l.gone = true; hurtBoss(1); } }
    lasers = lasers.filter(l => !l.gone && l.y > -10);
    if (boss){ boss.t += dt; boss.hit = Math.max(0, boss.hit - dt); boss.x = W / 2 + Math.sin(boss.t * .8) * (W / 2 - 70);
      boss.fire -= dt; if (boss.fire <= 0){ boss.fire = Math.max(.9, 2 - level * .05); const a = Math.atan2(pad.y - boss.y, pad.x - boss.x); for (const o of [-.12, .12]) shots.push({ x: boss.x, y: boss.y + 20, vx: Math.cos(a + o) * 230, vy: Math.sin(a + o) * 230 }); }
      for (const br of bricks) if (br.orbit !== undefined && !br.dead){ const a = br.orbit + boss.t * 1.2; br.x = boss.x + Math.cos(a) * 66 - br.w / 2; br.y = boss.y + Math.sin(a) * 52 - br.h / 2; } }
    for (const s of shots){ s.x += s.vx * dt; s.y += s.vy * dt; if (Math.abs(s.x - pad.x) < pad.w / 2 + 6 && Math.abs(s.y - pad.y) < 12){ s.gone = true; pad.shrink = 3.5; shake = .7; burst(s.x, s.y, 14, "#ff6b8b"); floats.push({ x: pad.x, y: pad.y - 40, txt: "Glitched!", t: 0, big: true }); } }
    shots = shots.filter(s => !s.gone && s.y < H + 20);
    // balls (substeps to avoid tunnelling)
    for (const b of balls){
      if (b.stuck){ b.x = pad.x; b.y = pad.y - 22; continue; }
      const steps = Math.ceil(Math.hypot(b.vx, b.vy) * dt / 4);
      for (let s = 0; s < steps && !b.out; s++){
        const d = dt / steps; b.x += b.vx * d; b.y += b.vy * d;
        if (b.x < b.r){ b.x = b.r; b.vx = Math.abs(b.vx); } if (b.x > W - b.r){ b.x = W - b.r; b.vx = -Math.abs(b.vx); } if (b.y < b.r + 4){ b.y = b.r + 4; b.vy = Math.abs(b.vy); }
        if (b.y > H + 20){ b.out = true; break; }
        // paddle
        const top = pad.y - 9;
        if (b.vy > 0 && b.y + b.r >= top && b.y < pad.y + 6 && Math.abs(b.x - pad.x) <= pad.w / 2 + b.r){
          const off = clamp((b.x - pad.x) / (pad.w / 2), -1, 1), a = -Math.PI / 2 + off * 1.05, sp = speed();
          b.vx = Math.cos(a) * sp; b.vy = Math.sin(a) * sp; b.y = top - b.r; combo = 0; pad.bump = .15; burst(b.x, top, 5, "#bfe2ff", 140); }
        // bricks
        for (const br of bricks){ if (br.dead) continue; const c = circRect(b, br.x, br.y, br.w, br.h); if (!c) continue;
          if (Math.abs(c.dx) > Math.abs(c.dy)) { b.vx = Math.sign(c.dx || -b.vx) * Math.abs(b.vx); b.x = c.cx + Math.sign(c.dx || 1) * (b.r + .5); }
          else { b.vy = Math.sign(c.dy || -b.vy) * Math.abs(b.vy); b.y = c.cy + Math.sign(c.dy || 1) * (b.r + .5); }
          hitBrick(br); break; }
        if (boss){ const dx = b.x - boss.x, dy = b.y - boss.y, dd = Math.hypot(dx, dy); if (dd < boss.r + b.r){ const nx = dx / dd, ny = dy / dd, dot = b.vx * nx + b.vy * ny; if (dot < 0){ b.vx -= 2 * dot * nx; b.vy -= 2 * dot * ny; } b.x = boss.x + nx * (boss.r + b.r + .5); b.y = boss.y + ny * (boss.r + b.r + .5); hurtBoss(2); } }
      }
      // keep the ball from going too flat
      if (!b.stuck){ const sp = Math.hypot(b.vx, b.vy); if (Math.abs(b.vy) < sp * .28){ b.vy = Math.sign(b.vy || -1) * sp * .28; b.vx = Math.sign(b.vx) * Math.sqrt(sp * sp - b.vy * b.vy); } }
      b.trail.push([b.x, b.y]); if (b.trail.length > 10) b.trail.shift();
    }
    balls = balls.filter(b => !b.out);
    if (!balls.length && state === "play" && clearT < 0){ lives--; hud(); shake = 1; flash = .6; combo = 0;
      if (lives <= 0){ gameOver(); return; } pad.wide = pad.laser = pad.slow = 0; newBall(); say(lives === 1 ? "LAST LIFE" : lives + " LIVES LEFT"); }
    bricks = bricks.filter(b => !b.dead);
    for (const c of caps){ c.t += dt; c.y += 150 * dt; if (Math.abs(c.x - pad.x) < pad.w / 2 + 14 && Math.abs(c.y - pad.y) < 18){ c.got = true; power(c.k); } }
    caps = caps.filter(c => !c.got && c.y < H + 20);
    for (const b of bricks) if (b.hit) b.hit = Math.max(0, b.hit - dt);
    pad.bump = Math.max(0, (pad.bump || 0) - dt);
    if (clearT < 0 && !boss && !bricks.some(b => !b.steel)){ clearT = 0; score += 100 * level; hud(); say("LEVEL " + level + " CLEARED"); flash = .7; for (const b of balls) b.out = true; balls = []; }
    if (clearT >= 0){ clearT += dt; if (clearT > 1.6){ clearT = -1; level++; hud(); makeLevel(level); newBall(); } }
  }
  function hurtBoss(n){ if (!boss) return; boss.hp -= n; boss.hit = .08; burst(boss.x, boss.y, 4, "#ff6b8b", 160);
    if (boss.hp <= 0){ const bx = boss.x, by = boss.y; score += 400 + level * 40; floats.push({ x: bx, y: by, txt: "+" + (400 + level * 40), t: 0, big: true });
      for (let k = 0; k < 4; k++) burst(bx + rnd(-30, 30), by + rnd(-20, 20), 30, "#ff6b8b", 360); shake = 1.2; flash = 1; boss = null; for (const b of bricks) b.dead = true; hud(); } }
  function stepFx(dt){
    for (const p of parts){ p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .97; p.vy = p.vy * .97 + 300 * dt; } parts = parts.filter(p => p.t < p.l);
    for (const f of floats) f.t += dt; floats = floats.filter(f => f.t < 1);
  }

  /* ---------- draw ---------- */
  function rr(x, y, w, h, r){ r = Math.max(0, Math.min(r, w / 2, h / 2)); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function glow(x, y, r, rgb, a){ const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function spiky(x, y, r, rot, fill, edge, n, hit){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); for (let i = 0; i < n * 2; i++){ const a = i / (n * 2) * Math.PI * 2, rr2 = i % 2 ? r * .74 : r; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath(); ctx.fillStyle = hit ? "#ffffff" : fill; ctx.fill(); ctx.strokeStyle = edge; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore(); }
  const BRC = { 1: ["#ff9ab3", "#ff6b8b", "#c9375a"], 2: ["#c3b2ff", "#9b7bff", "#5b3fc4"], 3: ["#ff7ac1", "#ff3d9a", "#a81f66"] };
  function brick(b){
    const [hi, mid, lo] = b.steel ? ["#7d8fb8", "#4a5a84", "#26304f"] : BRC[Math.min(3, b.hp)] || BRC[1];
    if (!b.steel) glow(b.x + b.w / 2, b.y + b.h / 2, b.w * .8, "255,90,150", .08);
    const g = ctx.createLinearGradient(0, b.y, 0, b.y + b.h); g.addColorStop(0, hi); g.addColorStop(.5, mid); g.addColorStop(1, lo);
    ctx.fillStyle = b.hit ? "#ffffff" : g; rr(b.x, b.y, b.w, b.h, 6); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.35)"; rr(b.x + 4, b.y + 2.5, b.w - 8, 3.5, 2); ctx.fill();
    if (b.steel){ ctx.fillStyle = "rgba(255,255,255,.35)"; for (const ox of [5, b.w - 5]) { ctx.beginPath(); ctx.arc(b.x + ox, b.y + b.h / 2 + 2, 1.8, 0, 7); ctx.fill(); } }
    else if (b.hp < b.max){ ctx.strokeStyle = "rgba(20,5,30,.55)"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(b.x + b.w * .3, b.y + 2); ctx.lineTo(b.x + b.w * .42, b.y + b.h * .55); ctx.lineTo(b.x + b.w * .34, b.y + b.h - 2); ctx.moveTo(b.x + b.w * .42, b.y + b.h * .55); ctx.lineTo(b.x + b.w * .62, b.y + b.h * .4); ctx.stroke(); }
    if (b.pw){ const cx = b.x + b.w / 2, cy = b.y + b.h / 2 + 1; ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.moveTo(cx, cy - 6); ctx.bezierCurveTo(cx + 5, cy - 1, cx + 4.5, cy + 4.5, cx, cy + 4.5); ctx.bezierCurveTo(cx - 4.5, cy + 4.5, cx - 5, cy - 1, cx, cy - 6); ctx.fill(); }
    if (!b.steel && Math.sin(t * 9 + b.x * .07 + b.y * .1) > .93){ ctx.fillStyle = "rgba(120,230,255,.55)"; ctx.fillRect(b.x + 3, b.y + b.h * .55, b.w - 6, 2); }
  }
  function tile(x, y, s, rot){
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
    ctx.save(); rr(-s / 2, -s / 2, s, s, s * .28); ctx.clip(); ctx.fillStyle = "#2f7bff"; ctx.fillRect(-s / 2, -s / 2, s, s); if (mascot.complete && mascot.naturalWidth) ctx.drawImage(mascot, -s / 2, -s / 2, s, s); ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.5; rr(-s / 2, -s / 2, s, s, s * .28); ctx.stroke(); ctx.restore();
  }
  const CAPC = { multi: ["#5fb4ff", "x3"], wide: ["#7ce6ff", "W"], laser: ["#ff9ab3", "L"], slow: ["#a78bff", "S"], life: ["#ff6b8b", "♥"] };
  function draw(){
    ctx.save();
    if (shake){ const k = shake * shake; ctx.translate(k * (Math.sin(t * 31) * .6 + Math.sin(t * 53 + 1) * .4) * 7, k * (Math.cos(t * 27) * .6 + Math.sin(t * 47) * .4) * 6); }
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0a0520"); g.addColorStop(.5, "#071a4d"); g.addColorStop(1, "#0b2f8a"); ctx.fillStyle = g; ctx.fillRect(-20, -20, W + 40, H + 40);
    glow(W * .2, H * .25, W * .7, "255,90,150", .1); glow(W * .8, H * .75, W * .7, "47,123,255", .22);
    ctx.strokeStyle = "rgba(120,170,255,.06)"; ctx.lineWidth = 1; for (let y = (t * 20) % 32; y < H; y += 32){ ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } for (let x = 0; x < W; x += 32){ ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (const s of stars){ ctx.fillStyle = `rgba(220,235,255,${.2 + s.z * .5})`; ctx.fillRect(s.x * W, (s.y * H + t * (6 + s.z * 14)) % H, 1 + s.z, 1 + s.z); }
    for (const b of bricks) brick(b);
    if (boss){ const r = boss.r; glow(boss.x, boss.y, r * 2.6, "255,107,139", .4); spiky(boss.x, boss.y, r, boss.t * .7, "#140f2a", "#ff6b8b", 16, boss.hit > 0);
      ctx.fillStyle = "#ff6b8b"; ctx.beginPath(); ctx.arc(boss.x, boss.y, r * .34 + Math.sin(boss.t * 6) * 2, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(boss.x, boss.y, r * .13, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.12)"; rr(W * .2, 58, W * .6, 7, 4); ctx.fill(); ctx.fillStyle = "#ff6b8b"; rr(W * .2, 58, W * .6 * Math.max(0, boss.hp / boss.max), 7, 4); ctx.fill(); }
    for (const s of shots){ glow(s.x, s.y, 16, "255,107,139", .5); ctx.fillStyle = "#ffd0da"; ctx.beginPath(); ctx.arc(s.x, s.y, 4.5, 0, 7); ctx.fill(); }
    for (const c of caps){ const [col, txt] = CAPC[c.k], y = c.y + Math.sin(c.t * 6) * 2; glow(c.x, y, 26, "160,215,255", .3); ctx.fillStyle = col; rr(c.x - 17, y - 9, 34, 18, 9); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = "800 11px Unbounded,sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(txt, c.x, y + .5); ctx.textBaseline = "alphabetic"; }
    for (const l of lasers){ glow(l.x, l.y, 12, "255,154,179", .6); ctx.fillStyle = "#ffe3ea"; rr(l.x - 2, l.y - 9, 4, 16, 2); ctx.fill(); }
    for (const b of balls){ b.trail.forEach(([x, y], i) => { ctx.fillStyle = `rgba(160,215,255,${i / b.trail.length * .35})`; ctx.beginPath(); ctx.arc(x, y, b.r * (i / b.trail.length), 0, 7); ctx.fill(); });
      glow(b.x, b.y, 22, "160,215,255", .55); const bg = ctx.createRadialGradient(b.x - 2, b.y - 2, 0, b.x, b.y, b.r); bg.addColorStop(0, "#ffffff"); bg.addColorStop(1, "#7cc1ff"); ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill(); }
    // paddle with BLUMI riding in the middle
    if (pad){ const bump = (pad.bump || 0) / .15 * 3, x = pad.x - pad.w / 2, y = pad.y - 9 + bump;
      glow(pad.x, pad.y + 4, pad.w * .7, pad.shrink > 0 ? "255,107,139" : "95,180,255", .35);
      const pg = ctx.createLinearGradient(0, y, 0, y + 18); pg.addColorStop(0, pad.shrink > 0 ? "#ff9ab3" : "#8fd0ff"); pg.addColorStop(.5, pad.shrink > 0 ? "#ff6b8b" : "#2f7bff"); pg.addColorStop(1, pad.shrink > 0 ? "#a8264c" : "#0a4fe0");
      ctx.fillStyle = pg; rr(x, y, pad.w, 16, 8); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.45)"; rr(x + 8, y + 3, pad.w - 16, 3.5, 2); ctx.fill();
      if (pad.laser > 0){ ctx.fillStyle = "#ffe3ea"; for (const o of [-pad.w / 2 + 8, pad.w / 2 - 8]) { rr(pad.x + o - 3, y - 6, 6, 8, 2); ctx.fill(); } }
      tile(pad.x, y + 4, 28, pad.tilt); }
    for (const p of parts){ ctx.globalAlpha = 1 - p.t / p.l; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); } ctx.globalAlpha = 1;
    ctx.textAlign = "center";
    for (const f of floats){ ctx.globalAlpha = 1 - f.t; ctx.fillStyle = "#fff"; ctx.font = (f.big ? "800 16px" : "700 12px") + " Unbounded,sans-serif"; ctx.fillText(f.txt, clamp(f.x, 60, W - 60), f.y - f.t * 36); } ctx.globalAlpha = 1;
    if (banner){ const k = banner.t, a = k < .3 ? k / .3 : k > 1.2 ? (1.6 - k) / .4 : 1; ctx.globalAlpha = a; ctx.fillStyle = "#fff"; ctx.font = "800 22px Unbounded,sans-serif"; ctx.fillText(banner.txt, W / 2, H * .55 - (1 - Math.min(1, k / .3)) * 20); ctx.globalAlpha = 1; }
    if (state === "play" && balls.some(b => b.stuck) && !banner){ ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.font = "800 14px Unbounded,sans-serif"; ctx.fillText("Tap to launch", W / 2, H * .62); }
    if (flash){ ctx.fillStyle = `rgba(255,255,255,${flash * .2})`; ctx.fillRect(-20, -20, W + 40, H + 40); }
    ctx.restore();
  }

  /* ---------- flow ---------- */
  function overlay(title, txt, final, play, quit){ X("title").textContent = title; X("how").textContent = txt; X("final").hidden = final == null; if (final != null) X("final").textContent = fmt(final); X("play").textContent = play; X("quit").hidden = !quit; X("ov").classList.remove("off"); }
  function start(){ reset(); state = "play"; paused = false; X("ov").classList.add("off"); last = 0; }
  function gameOver(){ state = "over"; const best = store.get(KEY); if (score > best) store.set(KEY, score);
    setTimeout(() => overlay("Game over", (score > best && score > 0 ? "New best score! " : "Best: " + fmt(Math.max(best, score)) + ". ") + "You reached level " + level + ".", score, "Play again", false), 700); }
  function setPause(on){ if (state !== "play") return; paused = on; if (on) overlay("Paused", "Level " + level + " · " + lives + " " + (lives === 1 ? "life" : "lives") + " left", null, "Resume", true); else X("ov").classList.add("off"); last = 0; }
  X("play").addEventListener("click", () => { if (state === "play" && paused) setPause(false); else start(); });
  X("quit").addEventListener("click", () => { paused = false; lives = 0; gameOver(); });
  X("pause").addEventListener("click", () => setPause(true));
  const px = e => { const r = cv.getBoundingClientRect(); return e.clientX - r.left; };
  let dragging = false, offset = 0, downX = 0, moved = false;
  cv.addEventListener("pointerdown", e => { if (state !== "play" || paused) return; e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch(_){} dragging = true; moved = false; downX = px(e); offset = pad.tx - downX; });
  cv.addEventListener("pointermove", e => { if (!dragging || state !== "play") return; const x = px(e); if (Math.abs(x - downX) > 6) moved = true; pad.tx = clamp(x + offset, pad.w / 2, W - pad.w / 2); });
  ["pointerup", "pointercancel"].forEach(ev => cv.addEventListener(ev, () => { if (dragging && !moved && state === "play") launch(); dragging = false; }));
  const keys = {};
  addEventListener("keydown", e => { if (!active || state !== "play") return; if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return; if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault(); if (e.key === " ") launch(); if (e.key === "p" || e.key === "Escape") setPause(!paused); keys[e.key] = 1; });
  addEventListener("keyup", e => { keys[e.key] = 0; });
  document.addEventListener("visibilitychange", () => { if (document.hidden) setPause(true); });
  function loop(ts){ if (!active){ raf = 0; return; }
    const dt = last ? Math.min(.033, (ts - last) / 1000) : 0; last = ts;
    if (state === "play" && !paused){ if (keys.ArrowLeft) pad.tx = clamp(pad.tx - 620 * dt, pad.w / 2, W - pad.w / 2); if (keys.ArrowRight) pad.tx = clamp(pad.tx + 620 * dt, pad.w / 2, W - pad.w / 2); update(dt); }
    else t += dt;
    if (!paused) stepFx(dt);
    draw(); raf = requestAnimationFrame(loop); }
  new IntersectionObserver(([en]) => { if (!active) return; if (en.isIntersecting){ if (!raf){ last = 0; raf = requestAnimationFrame(loop); } } else { if (state === "play" && !paused) setPause(true); cancelAnimationFrame(raf); raf = 0; } }).observe(card);
  addEventListener("resize", () => { if (active) resize(); });
  window.BlumiBreaker = { show(){ active = true; resize(); if (!pad){ reset(); state = "menu"; } if (!raf){ last = 0; raf = requestAnimationFrame(loop); } }, hide(){ if (state === "play" && !paused) setPause(true); active = false; cancelAnimationFrame(raf); raf = 0; },
    _s: () => ({ state, score, level, lives, bricks: bricks.length, balls: balls.length, boss: !!boss }), _pad: () => pad, _balls: () => balls, _launch: launch, _start: start, _level: n => { level = n; makeLevel(n); newBall(); hud(); }, _power: power };
})();
