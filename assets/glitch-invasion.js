/* BLUMI Playground — Glitch Invasion (vertical shooter). Loaded only when picked. Mounts into #invCard. */
(() => {
  const card = document.getElementById("invCard");
  if (!card || window.BlumiInvasion) return;
  if (!document.getElementById("ga-style")) {
    const st = document.createElement("style"); st.id = "ga-style";
    st.textContent = `
.ga-card{position:relative;background:#050b1f;overflow:hidden;user-select:none;-webkit-user-select:none}
.ga-card canvas{display:block;width:100%;touch-action:none}
.ga-hud{position:absolute;left:12px;right:12px;top:12px;display:flex;justify-content:space-between;align-items:flex-start;pointer-events:none;color:#fff}
.ga-chip{display:inline-flex;align-items:baseline;gap:7px;padding:8px 13px;border-radius:999px;background:rgba(5,12,35,.55);border:1px solid rgba(160,210,255,.22);backdrop-filter:blur(6px);font:800 15px/1 var(--font-display,Unbounded),Unbounded,sans-serif}
.ga-chip small{font:700 9.5px/1 Inter,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.75}
.ga-chip .hearts{color:#ff6b8b;letter-spacing:.1em}
.ga-r{display:flex;gap:8px;align-items:center}
.ga-pause{pointer-events:auto;cursor:pointer;width:38px;height:34px;display:inline-grid;place-items:center;padding:0;color:#fff}
.ga-pause svg{width:16px;height:16px}
.ga-ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;color:#fff;background:linear-gradient(180deg,rgba(3,10,35,.5),rgba(2,6,20,.82));backdrop-filter:blur(4px);transition:opacity .35s}
.ga-ov.off{opacity:0;pointer-events:none}
.ga-ov h3{font:800 28px/1.1 var(--font-display,Unbounded),Unbounded,sans-serif;margin:0}
.ga-ov .sc{margin-top:10px;font:800 44px/1 var(--font-display,Unbounded),Unbounded,sans-serif}
.ga-ov p{margin:12px 0 0;max-width:360px;font-size:14.5px;line-height:1.55;color:rgba(255,255,255,.9)}
.ga-ov .acts{display:flex;gap:10px;margin-top:22px;flex-wrap:wrap;justify-content:center}
.ga-ov button.ga-b{appearance:none;border:0;cursor:pointer;padding:15px 32px;border-radius:999px;background:#fff;color:#0a5cff;font:800 15px/1 var(--font-display,Unbounded),Unbounded,sans-serif;letter-spacing:.04em;box-shadow:0 14px 30px -10px rgba(0,0,0,.4)}
.ga-ov button.ga-b.g{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.3);box-shadow:none}
.ga-ov .how{margin-top:16px;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.78);max-width:340px}
.ga-boss{position:absolute;left:50%;top:58px;transform:translateX(-50%);width:62%;pointer-events:none;opacity:0;transition:opacity .4s}
.ga-boss b{display:block;text-align:center;font:800 11px/1 var(--font-display,Unbounded),Unbounded,sans-serif;letter-spacing:.18em;color:#ffb3c1;margin-bottom:6px}
.ga-boss .bar{height:8px;border-radius:9px;background:rgba(255,255,255,.12);overflow:hidden}
.ga-boss .bar i{display:block;height:100%;background:linear-gradient(90deg,#ff6b8b,#ff9ab3);transition:width .2s}`;
    document.head.appendChild(st);
  }
  card.classList.add("ga-card");
  card.innerHTML = `
    <canvas aria-label="Glitch Invasion"></canvas>
    <div class="ga-hud" aria-hidden="true">
      <span class="ga-chip"><small>Score</small><b data-x="score">0</b></span>
      <span class="ga-r">
        <span class="ga-chip"><small>Wave</small><b data-x="wave">1</b></span>
        <span class="ga-chip"><span class="hearts" data-x="lives"></span></span>
        <button class="ga-chip ga-pause" type="button" data-x="pause" aria-label="Pause"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg></button>
      </span>
    </div>
    <div class="ga-boss" data-x="boss"><b>GLITCH CORE</b><div class="bar"><i data-x="bossHp"></i></div></div>
    <div class="ga-ov" data-x="ov">
      <h3 data-x="title">Glitch Invasion</h3>
      <div class="sc" data-x="final" hidden></div>
      <p data-x="how">The Glitch is coming in waves. Slide to move, BLUMI shoots on its own. Grab power-ups, dodge the pink shots, and take down the Glitch Core every 5 waves.</p>
      <div class="acts"><button class="ga-b" type="button" data-x="play">Play</button><button class="ga-b g" type="button" data-x="quit" hidden>End game</button></div>
      <div class="how">Drag left and right · or ← → (hold Space to focus)</div>
    </div>`;
  const X = k => card.querySelector(`[data-x="${k}"]`);
  const cv = card.querySelector("canvas"); let ctx = cv.getContext("2d");
  const mascot = new Image(); mascot.src = "/assets/blumi-mascot-160.webp"; mascot.onerror = () => { mascot.onerror = null; mascot.src = "assets/blumi-mascot-160.webp"; };
  const store = { get(k){ try { return +localStorage.getItem(k) || 0; } catch(e){ return 0; } }, set(k, v){ try { localStorage.setItem(k, v); } catch(e){} } };
  const KEY = "blumi-best-invasion";
  const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = n => n.toLocaleString("en-US");
  let W = 380, H = 560, DPR = 1, active = false, raf = 0, last = 0;
  function resize(){ const w = card.clientWidth || 380; W = w; H = Math.round(clamp(Math.min(innerHeight * .74, w * 1.45), 460, 680)); DPR = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); cv.style.height = H + "px"; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); starsInit(); if (P) P.y = H - 70; }

  /* ---------- helpers ---------- */
  const rr = (x, y, w, h, r) => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); };
  const glow = (x, y, r, rgb, a) => { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
  function tile(x, y, s, tilt, blink){ // original mascot tile, uniform scale (same look as Catch the Drops)
    if (blink) return; ctx.save(); ctx.translate(x, y); ctx.rotate(tilt);
    rr(-s/2, -s/2, s, s, s * .28); ctx.fillStyle = "#2f7bff"; ctx.fill();
    ctx.save(); rr(-s/2, -s/2, s, s, s * .28); ctx.clip(); if (mascot.complete && mascot.naturalWidth) ctx.drawImage(mascot, -s/2, -s/2, s, s); ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1.5; rr(-s/2 + .75, -s/2 + .75, s - 1.5, s - 1.5, s * .28); ctx.stroke(); ctx.restore();
  }
  function spiky(x, y, r, t, body = "#1a1f3d", edge = "#ff6b8b", spikes = 16, hit = 0){
    glow(x, y, r * 2.2, "255,107,139", .5);
    ctx.save(); ctx.translate(x, y); ctx.rotate(t);
    if (hit > 0) ctx.fillStyle = "#ffffff"; else { const g = ctx.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, "#5a3a78"); g.addColorStop(.6, body); g.addColorStop(1, "#0b0818"); ctx.fillStyle = g; } ctx.beginPath();
    for (let i = 0; i < spikes; i++){ const a = i / spikes * Math.PI * 2, q = i % 2 ? r * .72 : r; ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q); }
    ctx.closePath(); ctx.fill(); ctx.strokeStyle = edge; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.fillStyle = edge; ctx.fillRect(-r * .35, -1.8, r * .7, 3.6); ctx.fillRect(-1.8, -r * .35, 3.6, r * .7);
    ctx.restore();
  }

  /* ---------- state ---------- */
  let P = null, bullets = [], eb = [], foes = [], items = [], parts = [], floats = [], stars = [];
  let state = "menu", paused = false, score = 0, wave = 0, lives = 3, t = 0, shake = 0, waveT = 0, spawnQ = [], boss = null, banner = null, focus = false;
  function starsInit(){ stars = Array.from({ length: 110 }, () => ({ x: rnd(0, W), y: rnd(0, H), z: rnd(.2, 1) })); }
  function reset(){ P = { x: W / 2, tx: W / 2, y: H - 70, fire: 0, inv: 0, dbl: 0, shield: 0, tilt: 0 }; bullets = []; eb = []; foes = []; items = []; parts = []; floats = []; score = 0; wave = 0; lives = 3; shake = 0; boss = null; spawnQ = []; nextWave(); hud(); }
  function hud(){ X("score").textContent = fmt(score); X("wave").textContent = wave; X("lives").textContent = "♥".repeat(Math.max(0, lives)); }
  function say(txt){ banner = { txt, t: 0 }; }
  function nextWave(){
    wave++; waveT = 0; hud();
    if (wave % 5 === 0){ boss = { x: W / 2, y: -90, ty: 130, hp: 60 + wave * 14, max: 60 + wave * 14, r: 52, t: 0, fire: 1.2, hit: 0, phase: 0 }; X("boss").style.opacity = 1; say("WAVE " + wave + " · GLITCH CORE"); return; }
    say("WAVE " + wave);
    const n = 6 + Math.min(14, wave * 2), kinds = ["drone"]; if (wave >= 2) kinds.push("zig"); if (wave >= 3) kinds.push("gunner"); if (wave >= 4) kinds.push("brute");
    for (let i = 0; i < n; i++){ const k = kinds[Math.floor(Math.random() * kinds.length)]; spawnQ.push({ at: .9 + i * clamp(.62 - wave * .03, .28, .62), k, x: rnd(.12, .88) }); }
  }
  function spawn(s){
    const base = { x: s.x * W, y: -30, k: s.k, t: rnd(0, 6), hit: 0, fire: rnd(1.2, 2.4) };
    const spd = 78 + wave * 8;
    if (s.k === "drone") Object.assign(base, { r: 15, hp: 1, vy: spd + 20, pts: 10 });
    if (s.k === "zig") Object.assign(base, { r: 14, hp: 1, vy: spd + 10, amp: rnd(50, 90), pts: 15 });
    if (s.k === "gunner") Object.assign(base, { r: 18, hp: 3, vy: spd * .6, stop: rnd(H * .18, H * .4), pts: 30 });
    if (s.k === "brute") Object.assign(base, { r: 26, hp: 6, vy: spd * .45, pts: 60 });
    foes.push(base);
  }
  function boom(x, y, n, col){ for (let i = 0; i < n; i++){ const a = rnd(0, 7), v = rnd(60, 280); parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: rnd(1.5, 3.8), t: 0, l: rnd(.35, .8), c: Math.random() < .5 ? col : "#ffffff" }); } }
  function hitPlayer(){
    if (P.inv > 0) return;
    if (P.shield > 0){ P.shield = 0; P.inv = .8; boom(P.x, P.y, 18, "#9fd0ff"); return; }
    lives--; hud(); P.inv = 2; shake = 1; boom(P.x, P.y, 26, "#ff6b8b"); if (navigator.vibrate) try { navigator.vibrate(40); } catch(e){}
    if (lives <= 0) gameOver();
  }
  function drop(x, y){ const r = Math.random(); if (r < .12) items.push({ x, y, k: "dbl", t: 0 }); else if (r < .17) items.push({ x, y, k: "heart", t: 0 }); else if (r < .22) items.push({ x, y, k: "shield", t: 0 }); }

  /* ---------- update ---------- */
  function update(dt){
    t += dt; waveT += dt; shake = Math.max(0, shake - dt * 1.8);
    if (banner){ banner.t += dt; if (banner.t > 1.6) banner = null; }
    // player
    const sp = focus ? 380 : 900; const dx = P.tx - P.x; P.x += clamp(dx, -sp * dt, sp * dt); P.tilt += ((clamp(dx / 120, -.25, .25)) - P.tilt) * Math.min(1, dt * 10);
    P.x = clamp(P.x, 24, W - 24); P.inv = Math.max(0, P.inv - dt); P.dbl = Math.max(0, P.dbl - dt); P.shield = Math.max(0, P.shield - dt);
    P.fire -= dt; if (P.fire <= 0){ P.fire = focus ? .12 : .17;
      const shots = P.dbl > 0 ? [-10, 0, 10] : [-6, 6];
      for (const o of shots) bullets.push({ x: P.x + o, y: P.y - 24, vx: o * (P.dbl > 0 ? 6 : 0), vy: -720 }); }
    for (const b of bullets){ b.x += b.vx * dt; b.y += b.vy * dt; } bullets = bullets.filter(b => b.y > -20 && b.x > -20 && b.x < W + 20);
    // spawns
    for (const s of spawnQ){ if (!s.done && waveT >= s.at){ s.done = true; spawn(s); } } spawnQ = spawnQ.filter(s => !s.done);
    // foes
    for (const f of foes){ f.t += dt; f.hit = Math.max(0, f.hit - dt);
      if (f.k === "zig"){ f.y += f.vy * dt; f.x += Math.cos(f.t * 3) * f.amp * dt * 3; }
      else if (f.k === "gunner"){ if (f.y < f.stop) f.y += f.vy * dt; else f.x += Math.sin(f.t * 1.3) * 60 * dt; f.fire -= dt; if (f.fire <= 0 && f.y > 0){ f.fire = clamp(1.9 - wave * .09, .75, 1.9); const a = Math.atan2(P.y - f.y, P.x - f.x); eb.push({ x: f.x, y: f.y, vx: Math.cos(a) * 230, vy: Math.sin(a) * 230, r: 6 }); } if (f.t > 14) f.y += f.vy * dt * 2; }
      else f.y += f.vy * dt;
      if (f.k === "brute"){ f.fire -= dt; if (f.fire <= 0 && f.y > 20){ f.fire = 2.4; for (const a of [-.3, 0, .3]) eb.push({ x: f.x, y: f.y + 20, vx: Math.sin(a) * 200, vy: Math.cos(a) * 200, r: 7 }); } }
      f.x = clamp(f.x, 16, W - 16);
      if (Math.hypot(f.x - P.x, f.y - P.y) < f.r + 16){ f.hp = 0; f.dead = true; boom(f.x, f.y, 16, "#ff6b8b"); hitPlayer(); }
    }
    // bullets vs foes
    for (const b of bullets){ if (b.hit) continue;
      for (const f of foes){ if (f.dead) continue; if (Math.hypot(b.x - f.x, b.y - f.y) < f.r + 4){ b.hit = true; f.hp--; f.hit = .08; if (f.hp <= 0){ f.dead = true; score += f.pts; floats.push({ x: f.x, y: f.y, txt: "+" + f.pts, t: 0 }); boom(f.x, f.y, f.k === "brute" ? 30 : 16, "#ff6b8b"); shake = Math.max(shake, f.k === "brute" ? .5 : .15); drop(f.x, f.y); hud(); } break; } }
      if (!b.hit && boss && boss.y > 0 && Math.hypot(b.x - boss.x, b.y - boss.y) < boss.r){ b.hit = true; boss.hp--; boss.hit = .06; X("bossHp").style.width = (boss.hp / boss.max * 100) + "%";
        if (boss.hp <= 0){ score += 500 + wave * 40; floats.push({ x: boss.x, y: boss.y, txt: "+" + (500 + wave * 40), t: 0 }); for (let k = 0; k < 4; k++) setTimeout(() => boom(boss ? boss.x + rnd(-40, 40) : W/2, boss ? boss.y + rnd(-30, 30) : 120, 30, "#ff6b8b"), k * 140); boom(boss.x, boss.y, 60, "#ff6b8b"); shake = 1.2; items.push({ x: boss.x, y: boss.y, k: "heart", t: 0 }); X("boss").style.opacity = 0; boss = null; hud(); } } }
    bullets = bullets.filter(b => !b.hit);
    foes = foes.filter(f => !f.dead && f.y < H + 40);
    // boss
    if (boss){ boss.t += dt; boss.hit = Math.max(0, boss.hit - dt); boss.y += (boss.ty - boss.y) * Math.min(1, dt * 1.5); boss.x = W / 2 + Math.sin(boss.t * .7) * W * .28;
      boss.fire -= dt; if (boss.fire <= 0 && boss.y > 60){ boss.phase++; const n = 10 + Math.min(10, wave);
        if (boss.phase % 3 === 0){ const a = Math.atan2(P.y - boss.y, P.x - boss.x); for (const o of [-.18, -.06, .06, .18]) eb.push({ x: boss.x, y: boss.y, vx: Math.cos(a + o) * 260, vy: Math.sin(a + o) * 260, r: 7 }); boss.fire = .9; }
        else { for (let i = 0; i < n; i++){ const a = i / n * Math.PI * 2 + boss.t; eb.push({ x: boss.x, y: boss.y, vx: Math.cos(a) * 170, vy: Math.sin(a) * 170, r: 6 }); } boss.fire = clamp(1.6 - wave * .03, .9, 1.6); } } }
    // enemy bullets
    for (const b of eb){ b.x += b.vx * dt; b.y += b.vy * dt; if (Math.hypot(b.x - P.x, b.y - P.y) < b.r + 12){ b.gone = true; hitPlayer(); } }
    eb = eb.filter(b => !b.gone && b.y < H + 20 && b.y > -40 && b.x > -40 && b.x < W + 40);
    // items
    for (const it of items){ it.t += dt; it.y += 90 * dt; if (Math.hypot(it.x - P.x, it.y - P.y) < 30){ it.got = true;
        if (it.k === "dbl"){ P.dbl = 8; floats.push({ x: it.x, y: it.y, txt: "Triple shot", t: 0 }); }
        if (it.k === "heart"){ lives = Math.min(5, lives + 1); floats.push({ x: it.x, y: it.y, txt: "+1 life", t: 0 }); hud(); }
        if (it.k === "shield"){ P.shield = 10; floats.push({ x: it.x, y: it.y, txt: "Shield", t: 0 }); } } }
    items = items.filter(it => !it.got && it.y < H + 30);
    for (const p of parts){ p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .98; p.vy *= .98; } parts = parts.filter(p => p.t < p.l);
    for (const f of floats) f.t += dt; floats = floats.filter(f => f.t < .9);
    if (!boss && spawnQ.length === 0 && foes.length === 0 && waveT > 1.5){ score += wave * 20; hud(); nextWave(); }
  }

  /* ---------- draw ---------- */
  function draw(){
    ctx.save();
    if (shake){ const k = shake * shake; ctx.translate(k * (Math.sin(t * 31) * .6 + Math.sin(t * 53 + 1) * .4) * 7, k * (Math.cos(t * 27) * .6 + Math.sin(t * 47) * .4) * 6); }
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#020617"); g.addColorStop(.6, "#061a52"); g.addColorStop(1, "#0b2f8a"); ctx.fillStyle = g; ctx.fillRect(-20, -20, W + 40, H + 40);
    glow(W * .25, H * .3, W * .6, "47,123,255", .22); glow(W * .85, H * .15, W * .5, "255,107,139", .08);
    const sp = state === "play" && !paused ? 1 : .25;
    for (const s of stars){ s.y += (40 + s.z * 220) * sp * (1 / 60); if (s.y > H){ s.y = -4; s.x = rnd(0, W); } ctx.fillStyle = `rgba(220,235,255,${.25 + s.z * .6})`; ctx.fillRect(s.x, s.y, 1 + s.z * 1.4, 1 + s.z * (state === "play" ? 6 : 1.4)); }
    for (const it of items){ const y = it.y + Math.sin(it.t * 4) * 3;
      if (it.k === "heart"){ glow(it.x, y, 22, "255,107,139", .4); ctx.fillStyle = "#ff6b8b"; ctx.font = "800 22px Unbounded,sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("♥", it.x, y + 1); }
      else if (it.k === "shield"){ glow(it.x, y, 22, "124,193,255", .45); ctx.strokeStyle = "#bfe2ff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(it.x, y, 11, 0, 7); ctx.stroke(); }
      else { glow(it.x, y, 22, "255,214,110", .45); ctx.fillStyle = "#ffd36a"; ctx.beginPath(); ctx.moveTo(it.x, y - 12); ctx.bezierCurveTo(it.x + 10, y - 2, it.x + 9, y + 9, it.x, y + 9); ctx.bezierCurveTo(it.x - 9, y + 9, it.x - 10, y - 2, it.x, y - 12); ctx.fill(); } }
    ctx.textBaseline = "alphabetic";
    for (const f of foes){
      if (f.k === "brute") spiky(f.x, f.y, f.r, f.t * .8, "#251a3d", "#ff6b8b", 22, f.hit);
      else if (f.k === "gunner"){ spiky(f.x, f.y, f.r, -f.t * 2, "#1a1f3d", "#ff9ab3", 12, f.hit); ctx.fillStyle = "#ff6b8b"; ctx.beginPath(); ctx.arc(f.x, f.y, 4, 0, 7); ctx.fill(); }
      else spiky(f.x, f.y, f.r, f.t * 3, "#1a1f3d", "#ff6b8b", f.k === "zig" ? 10 : 16, f.hit);
    }
    if (boss){ const r = boss.r; glow(boss.x, boss.y, r * 2.4, "255,107,139", .4); spiky(boss.x, boss.y, r, boss.t * .6, "#140f2a", "#ff6b8b", 28, boss.hit);
      ctx.fillStyle = "#ff6b8b"; ctx.beginPath(); ctx.arc(boss.x, boss.y, r * .3 + Math.sin(boss.t * 6) * 2, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(boss.x, boss.y, r * .12, 0, 7); ctx.fill(); }
    for (const b of eb){ glow(b.x, b.y, b.r * 2.6, "255,107,139", .5); ctx.fillStyle = "#ffd0da"; ctx.beginPath(); ctx.arc(b.x, b.y, b.r * .6, 0, 7); ctx.fill(); }
    for (const b of bullets){ glow(b.x, b.y, 10, "160,215,255", .55); ctx.fillStyle = "#eaf6ff"; rr(b.x - 2.5, b.y - 9, 5, 16, 3); ctx.fill(); }
    for (const p of parts){ ctx.globalAlpha = 1 - p.t / p.l; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); } ctx.globalAlpha = 1;
    if (P){
      glow(P.x, P.y + 22, 26, "124,193,255", .5 + .2 * Math.sin(t * 30));
      tile(P.x, P.y, 40, P.tilt, P.inv > 0 && Math.floor(P.inv * 14) % 2 === 0);
      if (P.shield > 0){ ctx.strokeStyle = `rgba(191,226,255,${.5 + .3 * Math.sin(t * 8)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(P.x, P.y, 32, 0, 7); ctx.stroke(); }
    }
    ctx.textAlign = "center";
    for (const f of floats){ ctx.globalAlpha = 1 - f.t / .9; ctx.fillStyle = "#fff"; ctx.font = "700 14px Unbounded,sans-serif"; ctx.fillText(f.txt, f.x, f.y - f.t * 40); } ctx.globalAlpha = 1;
    if (banner){ const k = banner.t, a = k < .3 ? k / .3 : k > 1.2 ? (1.6 - k) / .4 : 1; ctx.globalAlpha = a; ctx.fillStyle = "#fff"; ctx.font = "800 22px Unbounded,sans-serif"; ctx.fillText(banner.txt, W / 2, H * .42 - (1 - Math.min(1, k / .3)) * 20); ctx.globalAlpha = 1; }
    ctx.restore();
  }

  /* ---------- flow ---------- */
  function overlay(title, txt, final, play, quit){ X("title").textContent = title; X("how").textContent = txt; X("final").hidden = final == null; if (final != null) X("final").textContent = fmt(final); X("play").textContent = play; X("quit").hidden = !quit; X("ov").classList.remove("off"); }
  function start(){ reset(); state = "play"; paused = false; X("ov").classList.add("off"); last = 0; }
  function gameOver(){ state = "over"; X("boss").style.opacity = 0; const best = store.get(KEY); if (score > best) store.set(KEY, score);
    setTimeout(() => overlay("Game over", (score > best && score > 0 ? "New best score! " : "Best: " + fmt(Math.max(best, score)) + ". ") + "You reached wave " + wave + ".", score, "Play again", false), 700); }
  function setPause(on){ if (state !== "play") return; paused = on; if (on) overlay("Paused", "Wave " + wave + " · " + lives + " lives left", null, "Resume", true); else X("ov").classList.add("off"); last = 0; }
  X("play").addEventListener("click", () => { if (state === "play" && paused) setPause(false); else start(); });
  X("quit").addEventListener("click", () => { paused = false; lives = 0; gameOver(); });
  X("pause").addEventListener("click", () => setPause(true));
  const px = e => { const r = cv.getBoundingClientRect(); return e.clientX - r.left; };
  let dragging = false, offset = 0;
  cv.addEventListener("pointerdown", e => { if (state !== "play" || paused) return; e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch(_){} dragging = true; offset = P.x - px(e); });
  cv.addEventListener("pointermove", e => { if (dragging && state === "play") P.tx = clamp(px(e) + offset, 24, W - 24); });
  ["pointerup", "pointercancel"].forEach(ev => cv.addEventListener(ev, () => { dragging = false; }));
  const keys = {};
  addEventListener("keydown", e => { if (!active || state !== "play") return; if (["ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault(); if (e.key === "p" || e.key === "Escape") setPause(!paused); keys[e.key] = 1; });
  addEventListener("keyup", e => { keys[e.key] = 0; });
  document.addEventListener("visibilitychange", () => { if (document.hidden) setPause(true); });
  function loop(ts){ if (!active){ raf = 0; return; }
    const dt = last ? Math.min(.033, (ts - last) / 1000) : 0; last = ts;
    if (state === "play" && !paused){ focus = !!keys[" "]; if (keys.ArrowLeft) P.tx = clamp(P.x - 60, 24, W - 24); if (keys.ArrowRight) P.tx = clamp(P.x + 60, 24, W - 24); if (!keys.ArrowLeft && !keys.ArrowRight && !dragging && (keys.ArrowLeft === 0 || keys.ArrowRight === 0)) P.tx = P.tx; update(dt); }
    else t += dt;
    draw(); raf = requestAnimationFrame(loop); }
  new IntersectionObserver(([en]) => { if (!active) return; if (en.isIntersecting){ if (!raf){ last = 0; raf = requestAnimationFrame(loop); } } else { if (state === "play" && !paused) setPause(true); cancelAnimationFrame(raf); raf = 0; } }).observe(card);
  addEventListener("resize", () => { if (active) resize(); });
  window.BlumiInvasion = { show(){ active = true; resize(); if (!P){ reset(); state = "menu"; } if (!raf){ last = 0; raf = requestAnimationFrame(loop); } }, hide(){ if (state === "play" && !paused) setPause(true); active = false; cancelAnimationFrame(raf); raf = 0; },
    _s: () => ({ state, score, wave, lives, boss: !!boss }), _p: () => P, _start: start };
})();
