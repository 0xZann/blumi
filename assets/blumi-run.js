/* BLUMI Playground — Blumi Run (side-scrolling runner). Loaded only when picked. Mounts into #runCard.
   Shares the .ga-* styles injected by glitch-invasion.js; injects them itself if that file isn't loaded. */
(() => {
  const card = document.getElementById("runCard");
  if (!card || window.BlumiRun) return;
  if (!document.getElementById("ga-style")) {
    const st = document.createElement("style"); st.id = "ga-style";
    st.textContent = `
.ga-card{position:relative;background:#050b1f;overflow:hidden;user-select:none;-webkit-user-select:none}
.ga-card canvas{display:block;width:100%;touch-action:none}
.ga-hud{position:absolute;left:12px;right:12px;top:12px;display:flex;justify-content:space-between;align-items:flex-start;pointer-events:none;color:#fff}
.ga-chip{display:inline-flex;align-items:baseline;gap:7px;padding:8px 13px;border-radius:999px;background:rgba(5,12,35,.45);border:1px solid rgba(160,210,255,.25);backdrop-filter:blur(6px);font:800 15px/1 var(--font-display,Unbounded),Unbounded,sans-serif}
.ga-chip small{font:700 9.5px/1 Inter,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.75}
.ga-chip .hearts{color:#ff6b8b;letter-spacing:.1em}
.ga-r{display:flex;gap:8px;align-items:center}
.ga-pause{pointer-events:auto;cursor:pointer;width:38px;height:34px;display:inline-grid;place-items:center;padding:0;color:#fff}
.ga-pause svg{width:16px;height:16px}
.ga-ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;color:#fff;background:linear-gradient(180deg,rgba(3,10,35,.45),rgba(2,6,20,.8));backdrop-filter:blur(4px);transition:opacity .35s}
.ga-ov.off{opacity:0;pointer-events:none}
.ga-ov h3{font:800 28px/1.1 var(--font-display,Unbounded),Unbounded,sans-serif;margin:0}
.ga-ov .sc{margin-top:10px;font:800 44px/1 var(--font-display,Unbounded),Unbounded,sans-serif}
.ga-ov p{margin:12px 0 0;max-width:360px;font-size:14.5px;line-height:1.55;color:rgba(255,255,255,.9)}
.ga-ov .acts{display:flex;gap:10px;margin-top:22px;flex-wrap:wrap;justify-content:center}
.ga-ov button.ga-b{appearance:none;border:0;cursor:pointer;padding:15px 32px;border-radius:999px;background:#fff;color:#0a5cff;font:800 15px/1 var(--font-display,Unbounded),Unbounded,sans-serif;letter-spacing:.04em;box-shadow:0 14px 30px -10px rgba(0,0,0,.4)}
.ga-ov button.ga-b.g{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.3);box-shadow:none}
.ga-ov .how{margin-top:16px;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.78);max-width:340px}`;
    document.head.appendChild(st);
  }
  card.classList.add("ga-card");
  card.innerHTML = `
    <canvas aria-label="Blumi Run"></canvas>
    <div class="ga-hud" aria-hidden="true">
      <span class="ga-chip"><small>Score</small><b data-x="score">0</b></span>
      <span class="ga-r">
        <span class="ga-chip"><small>Drops</small><b data-x="drops">0</b></span>
        <span class="ga-chip"><span class="hearts" data-x="lives"></span></span>
        <button class="ga-chip ga-pause" type="button" data-x="pause" aria-label="Pause"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg></button>
      </span>
    </div>
    <div class="ga-ov" data-x="ov">
      <h3 data-x="title">Blumi Run</h3>
      <div class="sc" data-x="final" hidden></div>
      <p data-x="how">BLUMI never stops running. Jump over glitch spikes, clear the gaps and collect every drop. It keeps getting faster.</p>
      <div class="acts"><button class="ga-b" type="button" data-x="play">Run</button><button class="ga-b g" type="button" data-x="quit" hidden>End game</button></div>
      <div class="how">Tap to jump, tap again in the air to double jump · or Space / ↑</div>
    </div>`;
  const X = k => card.querySelector(`[data-x="${k}"]`);
  const cv = card.querySelector("canvas"); const ctx = cv.getContext("2d");
  const mascot = new Image(); mascot.src = "/assets/blumi-mascot-160.webp"; mascot.onerror = () => { mascot.onerror = null; mascot.src = "assets/blumi-mascot-160.webp"; };
  const store = { get(k){ try { return +localStorage.getItem(k) || 0; } catch(e){ return 0; } }, set(k, v){ try { localStorage.setItem(k, v); } catch(e){} } };
  const KEY = "blumi-best-run";
  const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = n => n.toLocaleString("en-US");
  let W = 380, H = 480, DPR = 1, active = false, raf = 0, last = 0, BASE = 380;
  function resize(){ const w = card.clientWidth || 380; W = w; H = Math.round(clamp(Math.min(innerHeight * .7, w * 1.15), 430, 600)); DPR = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); cv.style.height = H + "px"; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); BASE = H - 92; }
  const rr = (x, y, w, h, r) => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); };
  const glow = (x, y, r, rgb, a) => { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
  function tile(x, y, s, tilt){ // original mascot tile, uniform scale (same look as Catch the Drops)
    ctx.save(); ctx.translate(x, y); ctx.rotate(tilt);
    rr(-s/2, -s/2, s, s, s * .28); ctx.fillStyle = "#2f7bff"; ctx.fill();
    ctx.save(); rr(-s/2, -s/2, s, s, s * .28); ctx.clip(); if (mascot.complete && mascot.naturalWidth) ctx.drawImage(mascot, -s/2, -s/2, s, s); ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1.5; rr(-s/2 + .75, -s/2 + .75, s - 1.5, s - 1.5, s * .28); ctx.stroke(); ctx.restore();
  }
  function dropShape(x, y, s, gold){ const g = ctx.createLinearGradient(0, y - s, 0, y + s); if (gold){ g.addColorStop(0, "#fff3c2"); g.addColorStop(1, "#ffc21a"); } else { g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#7cc1ff"); }
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y - s); ctx.bezierCurveTo(x + s * .9, y - s * .1, x + s * .75, y + s * .8, x, y + s * .8); ctx.bezierCurveTo(x - s * .75, y + s * .8, x - s * .9, y - s * .1, x, y - s); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.beginPath(); ctx.ellipse(x - s * .25, y + s * .1, s * .12, s * .22, -.4, 0, 7); ctx.fill(); }
  function spikes(x, y, w, t){ glow(x + w / 2, y - 10, w * .9, "255,107,139", .3); ctx.fillStyle = "#1a1f3d"; ctx.beginPath(); ctx.moveTo(x, y); const n = Math.max(2, Math.round(w / 14));
    for (let i = 0; i <= n; i++){ const sx = x + i * w / n; ctx.lineTo(sx, i % 2 ? y - 26 - Math.sin(t * 6 + i) * 2 : y - 6); } ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#ff6b8b"; ctx.lineWidth = 2; ctx.stroke(); }
  function drone(x, y, r, t){ glow(x, y, r * 2, "255,107,139", .38); ctx.save(); ctx.translate(x, y); ctx.rotate(t * 3); ctx.fillStyle = "#1a1f3d"; ctx.beginPath();
    for (let i = 0; i < 16; i++){ const a = i / 16 * Math.PI * 2, q = i % 2 ? r * .72 : r; ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#ff6b8b"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#ff6b8b"; ctx.fillRect(-r * .35, -1.8, r * .7, 3.6); ctx.fillRect(-1.8, -r * .35, 3.6, r * .7); ctx.restore(); }

  /* ---------- world ---------- */
  let P, segs, obs, drops, items, parts, floats, dist, speed, endX, score, dcount, lives, t, shake, state = "menu", paused = false;
  function reset(){
    P = { x: W * .24, y: BASE - 20, vy: 0, jumps: 0, onGround: true, inv: 0, shield: 0, magnet: 0, tilt: 0, run: 0 };
    segs = [{ x0: -200, x1: W * 1.4, y: BASE }]; obs = []; drops = []; items = []; parts = []; floats = [];
    dist = 0; speed = 250; endX = W * 1.4; score = 0; dcount = 0; lives = 3; t = 0; shake = 0; hud();
    while (endX < W * 3) gen();
  }
  function hud(){ X("score").textContent = fmt(score); X("drops").textContent = dcount; X("lives").textContent = "♥".repeat(Math.max(0, lives)); }
  function arc(x0, x1, y0, h, n, gold){ for (let i = 0; i < n; i++){ const u = n === 1 ? .5 : i / (n - 1); drops.push({ x: x0 + (x1 - x0) * u, y: y0 - Math.sin(u * Math.PI) * h, gold: gold && i === Math.floor(n / 2) }); } }
  function gen(){
    const diff = clamp(dist / 9000, 0, 1);
    // gap
    const prev = segs[segs.length - 1];
    let gap = Math.random() < .25 + diff * .4 ? rnd(80, 120 + diff * 70) : 0;
    const x0 = endX + gap, len = rnd(360, 700) - diff * 120;
    const y = clamp(prev.y + (Math.random() < .35 ? (Math.random() < .5 ? -46 : 46) : 0), BASE - 92, BASE);
    if (gap) arc(endX + 6, x0 - 6, Math.min(prev.y, y) - 50, 60, 5, Math.random() < .3);
    segs.push({ x0, x1: x0 + len, y });
    // obstacles along the ground
    let x = x0 + rnd(160, 240);
    while (x < x0 + len - 120){
      const r = Math.random();
      if (r < .45){ const w = Math.random() < .25 + diff * .3 ? 52 : 30; obs.push({ k: "spike", x, y, w }); if (Math.random() < .5) arc(x - 30, x + w + 30, y - 40, 70, 4, false); x += w + rnd(160, 260); }
      else if (r < .7){ const high = Math.random() < .5; obs.push({ k: "drone", x, y: y - (high ? 92 : 44), r: 15, bob: rnd(0, 6), amp: diff > .3 ? rnd(10, 28) : 0 }); if (high) drops.push({ x, y: y - 30 }); else arc(x - 40, x + 40, y - 60, 40, 3, false); x += rnd(200, 300); }
      else { const n = 4 + Math.floor(rnd(0, 4)); for (let i = 0; i < n; i++) drops.push({ x: x + i * 30, y: y - 28 }); x += n * 30 + rnd(120, 200); }
    }
    if (Math.random() < .35){ const px = x0 + rnd(100, len - 220), py = y - rnd(110, 140); segs.push({ x0: px, x1: px + 150, y: py, plat: true }); arc(px + 10, px + 140, py - 26, 10, 5, Math.random() < .4); if (Math.random() < .35) items.push({ x: px + 75, y: py - 60, k: Math.random() < .5 ? "shield" : "magnet" }); }
    endX = x0 + len;
  }
  function groundAt(x, py){ let best = null; for (const s of segs){ if (x + 13 >= s.x0 && x - 13 <= s.x1 && py <= s.y + 18) best = best === null ? s.y : Math.min(best, s.y); } return best; }
  function burst(x, y, col, n){ for (let i = 0; i < n; i++){ const a = rnd(0, 7), v = rnd(60, 220); parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, r: rnd(1.5, 3.5), t: 0, l: rnd(.3, .7), c: col }); } }
  function hurt(fell){
    if (P.inv > 0 && !fell) return;
    if (P.shield > 0 && !fell){ P.shield = 0; P.inv = 1; burst(P.x, P.y, "#bfe2ff", 16); return; }
    lives--; hud(); shake = 1; burst(P.x, P.y, "#ff6b8b", 22); if (navigator.vibrate) try { navigator.vibrate(40); } catch(e){}
    if (lives <= 0){ over(); return; }
    P.inv = 1.8;
    if (fell){ const nxt = segs.find(s => !s.plat && s.x1 > dist + P.x + 60) || segs[segs.length - 1]; const wx = Math.max(nxt.x0 + 40, dist + P.x); dist = wx - P.x; P.y = nxt.y - 160; P.vy = 0; P.jumps = 1; }
  }
  function jump(){ if (state !== "play" || paused) return; if (P.onGround || P.jumps < 2){ P.vy = P.onGround ? -660 : -600; P.jumps = P.onGround ? 1 : 2; P.onGround = false; burst(P.x - 10, P.y + 18, "rgba(220,240,255,.9)", 6); } }

  function update(dt){
    t += dt; shake = Math.max(0, shake - dt * 1.8);
    speed = Math.min(560, 250 + dist / 40); const v = speed * dt; dist += v; score = Math.floor(dist / 10) + dcount * 5;
    P.inv = Math.max(0, P.inv - dt); P.shield = Math.max(0, P.shield - dt); P.magnet = Math.max(0, P.magnet - dt);
    P.vy += 1900 * dt; const ny = P.y + P.vy * dt; const wx = dist + P.x;
    const g = groundAt(wx, P.y + 20);
    if (g !== null && P.vy >= 0 && ny + 20 >= g){ if (!P.onGround && P.vy > 300) burst(P.x, g, "rgba(200,230,255,.8)", 8); P.y = g - 20; P.vy = 0; P.onGround = true; P.jumps = 0; }
    else { P.y = ny; P.onGround = false; }
    P.tilt += ((P.onGround ? Math.sin(t * 18) * .04 : clamp(P.vy / 1600, -.3, .35)) - P.tilt) * Math.min(1, dt * 12);
    if (P.y > H + 40) hurt(true);
    // collisions
    for (const o of obs){ const ox = o.x - dist;
      if (o.k === "spike"){ if (P.x + 13 > ox + 4 && P.x - 13 < ox + o.w - 4 && P.y + 18 > o.y - 22) hurt(false); }
      else { const oy = o.y + Math.sin(t * 3 + o.bob) * o.amp; if (Math.hypot(P.x - ox, P.y - oy) < o.r + 15) { if (P.vy > 200 && P.y < oy - 8){ o.dead = true; P.vy = -520; P.jumps = 1; score += 20; dcount += 2; floats.push({ x: P.x, y: P.y - 30, txt: "Stomp +10", t: 0 }); burst(ox, oy, "#ff6b8b", 18); hud(); } else hurt(false); } }
    }
    obs = obs.filter(o => !o.dead && o.x - dist > -120);
    for (const d of drops){ let dx = d.x - dist; if (P.magnet > 0 && Math.abs(dx - P.x) < 160){ d.x += (dist + P.x - d.x) * Math.min(1, dt * 6); d.y += (P.y - d.y) * Math.min(1, dt * 6); dx = d.x - dist; }
      if (Math.hypot(dx - P.x, d.y - P.y) < 26){ d.got = true; dcount += d.gold ? 10 : 1; if (d.gold) floats.push({ x: P.x, y: P.y - 30, txt: "+10", t: 0 }); burst(dx, d.y, d.gold ? "#ffd36a" : "#bfe2ff", 5); hud(); } }
    drops = drops.filter(d => !d.got && d.x - dist > -60);
    for (const it of items){ if (Math.hypot(it.x - dist - P.x, it.y - P.y) < 30){ it.got = true; if (it.k === "shield"){ P.shield = 12; floats.push({ x: P.x, y: P.y - 30, txt: "Shield", t: 0 }); } else { P.magnet = 8; floats.push({ x: P.x, y: P.y - 30, txt: "Magnet", t: 0 }); } } }
    items = items.filter(it => !it.got && it.x - dist > -60);
    segs = segs.filter(s => s.x1 - dist > -300);
    while (endX < dist + W * 2.5) gen();
    for (const p of parts){ p.t += dt; p.x += p.vx * dt - v; p.y += p.vy * dt; p.vy += 500 * dt; } parts = parts.filter(p => p.t < p.l);
    for (const f of floats) f.t += dt; floats = floats.filter(f => f.t < .9);
    X("score").textContent = fmt(score);
  }

  function hills(sp, base, amp, col, k){ ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-10, H); for (let x = -10; x <= W + 10; x += 10){ const u = (x + dist * sp) * k; ctx.lineTo(x, base + Math.sin(u) * amp + Math.sin(u * 2.7 + 1) * amp * .35); } ctx.lineTo(W + 10, H); ctx.fill(); }
  function draw(){
    ctx.save();
    if (shake){ const k = shake * shake; ctx.translate(k * Math.sin(t * 31) * 7, k * Math.cos(t * 27) * 6); }
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0a2a7a"); g.addColorStop(.55, "#2f7bff"); g.addColorStop(1, "#9fd0ff"); ctx.fillStyle = g; ctx.fillRect(-20, -20, W + 40, H + 40);
    glow(W * .78, H * .2, H * .45, "255,255,255", .35); ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.beginPath(); ctx.arc(W * .78, H * .2, 26, 0, 7); ctx.fill();
    for (let i = 0; i < 6; i++){ const cw = 110 + (i % 3) * 50, x = ((i * 210 - dist * .12) % (W + cw * 2) + W + cw * 2) % (W + cw * 2) - cw, y = H * (.12 + (i % 3) * .08); ctx.fillStyle = "rgba(255,255,255,.22)"; ctx.beginPath(); ctx.ellipse(x, y, cw * .5, 15, 0, 0, 7); ctx.ellipse(x + cw * .2, y - 10, cw * .3, 13, 0, 0, 7); ctx.fill(); }
    // far drop-city
    for (let i = 0; i < 14; i++){ const bw = 34 + (i * 13) % 30, bh = 60 + (i * 37) % 90, x = ((i * 70 - dist * .22) % (W + 140) + W + 140) % (W + 140) - 70, y = BASE - 40 - bh;
      ctx.fillStyle = "rgba(10,60,180,.35)"; rr(x, y, bw, bh + 60, [bw / 2, bw / 2, 4, 4]); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.18)"; for (let wy = y + 18; wy < y + bh; wy += 16) ctx.fillRect(x + bw / 2 - 3, wy, 6, 6); }
    hills(.35, BASE - 20, 22, "rgba(10,50,150,.45)", .01); hills(.55, BASE + 6, 14, "rgba(8,40,120,.55)", .014);
    // ground and platforms
    for (const s of segs){ const x0 = s.x0 - dist, x1 = s.x1 - dist; if (x1 < -20 || x0 > W + 20) continue;
      if (s.plat){ ctx.fillStyle = "#e8f3ff"; rr(x0, s.y, x1 - x0, 16, 8); ctx.fill(); ctx.fillStyle = "#9fd0ff"; rr(x0, s.y + 10, x1 - x0, 6, 3); ctx.fill(); continue; }
      const gg = ctx.createLinearGradient(0, s.y, 0, H); gg.addColorStop(0, "#1f5fe0"); gg.addColorStop(1, "#0a2a7a"); ctx.fillStyle = gg; rr(x0, s.y, x1 - x0, H - s.y + 20, [10, 10, 0, 0]); ctx.fill();
      ctx.fillStyle = "#e8f3ff"; rr(x0, s.y - 4, x1 - x0, 10, 5); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.12)"; for (let x = Math.ceil((x0 + dist) / 40) * 40 - dist; x < x1 - 10; x += 40) ctx.fillRect(x, s.y + 22, 20, 4); }
    for (const it of items){ const x = it.x - dist, y = it.y + Math.sin(t * 4) * 4; if (it.k === "shield"){ glow(x, y, 24, "124,193,255", .5); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.stroke(); } else { glow(x, y, 24, "255,214,110", .5); ctx.strokeStyle = "#ffd36a"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, 10, Math.PI, 0); ctx.stroke(); } }
    for (const d of drops){ const x = d.x - dist; if (x < -20 || x > W + 20) continue; dropShape(x, d.y + Math.sin(t * 4 + d.x * .02) * 3, d.gold ? 12 : 9, d.gold); }
    for (const o of obs){ const x = o.x - dist; if (x < -60 || x > W + 60) continue; if (o.k === "spike") spikes(x, o.y, o.w, t); else drone(x, o.y + Math.sin(t * 3 + o.bob) * o.amp, o.r, t); }
    // speed lines
    ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 2; for (let i = 0; i < 6; i++){ const y = (i * 71 + 30) % (H * .7), len = 30 + speed * .12, x = W - ((t * speed * 1.6 + i * 157) % (W + len)); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y); ctx.stroke(); }
    for (const p of parts){ ctx.globalAlpha = 1 - p.t / p.l; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); } ctx.globalAlpha = 1;
    if (P){ ctx.fillStyle = "rgba(0,20,80,.25)"; const gy = groundAt(dist + P.x, P.y + 20); if (gy !== null){ ctx.beginPath(); ctx.ellipse(P.x, gy, 18, 4, 0, 0, 7); ctx.fill(); }
      if (P.magnet > 0) glow(P.x, P.y, 70, "255,214,110", .18);
      if (!(P.inv > 0 && Math.floor(P.inv * 14) % 2 === 0)) tile(P.x, P.y - (P.onGround ? Math.abs(Math.sin(t * 14)) * 3 : 0), 40, P.tilt);
      if (P.shield > 0){ ctx.strokeStyle = `rgba(255,255,255,${.55 + .3 * Math.sin(t * 8)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(P.x, P.y, 31, 0, 7); ctx.stroke(); } }
    ctx.textAlign = "center"; for (const f of floats){ ctx.globalAlpha = 1 - f.t / .9; ctx.fillStyle = "#fff"; ctx.font = "800 14px Unbounded,sans-serif"; ctx.fillText(f.txt, f.x, f.y - f.t * 40); } ctx.globalAlpha = 1;
    if (state === "play" && dist < 260){ ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.font = "800 15px Unbounded,sans-serif"; ctx.fillText("Tap to jump", W / 2, H * .38); }
    ctx.restore();
  }
  function overlay(title, txt, final, play, quit){ X("title").textContent = title; X("how").textContent = txt; X("final").hidden = final == null; if (final != null) X("final").textContent = fmt(final); X("play").textContent = play; X("quit").hidden = !quit; X("ov").classList.remove("off"); }
  function start(){ reset(); state = "play"; paused = false; X("ov").classList.add("off"); last = 0; }
  function over(){ state = "over"; const best = store.get(KEY); if (score > best) store.set(KEY, score); setTimeout(() => overlay("Game over", (score > best && score > 0 ? "New best score! " : "Best: " + fmt(Math.max(best, score)) + ". ") + dcount + " drops collected.", score, "Run again", false), 600); }
  function setPause(on){ if (state !== "play") return; paused = on; if (on) overlay("Paused", fmt(score) + " points · " + lives + " lives left", null, "Resume", true); else X("ov").classList.add("off"); last = 0; }
  X("play").addEventListener("click", () => { if (state === "play" && paused) setPause(false); else start(); });
  X("quit").addEventListener("click", () => { paused = false; over(); });
  X("pause").addEventListener("click", () => setPause(true));
  cv.addEventListener("pointerdown", e => { if (state !== "play" || paused) return; e.preventDefault(); jump(); });
  addEventListener("keydown", e => { if (!active || state !== "play") return; if ([" ", "ArrowUp", "w", "W"].includes(e.key)){ e.preventDefault(); if (!e.repeat) jump(); } if (e.key === "p" || e.key === "Escape") setPause(!paused); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) setPause(true); });
  function loop(ts){ if (!active){ raf = 0; return; } const dt = last ? Math.min(.033, (ts - last) / 1000) : 0; last = ts; if (state === "play" && !paused) update(dt); else t += dt; draw(); raf = requestAnimationFrame(loop); }
  new IntersectionObserver(([en]) => { if (!active) return; if (en.isIntersecting){ if (!raf){ last = 0; raf = requestAnimationFrame(loop); } } else { if (state === "play" && !paused) setPause(true); cancelAnimationFrame(raf); raf = 0; } }).observe(card);
  addEventListener("resize", () => { if (active) resize(); });
  window.BlumiRun = { show(){ active = true; resize(); if (!P){ reset(); state = "menu"; } if (!raf){ last = 0; raf = requestAnimationFrame(loop); } }, hide(){ if (state === "play" && !paused) setPause(true); active = false; cancelAnimationFrame(raf); raf = 0; },
    _s: () => ({ state, score, lives, dist: Math.round(dist), drops: dcount }), _w: () => ({ P, obs, segs, dist, speed }), _jump: jump, _start: start };
})();
