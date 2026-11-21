/* BLUMI Playground — Glitch Gates.
   Loaded only when one of these games is picked. Mounts into #extraCard. */
(() => {
  const card = document.getElementById("extraCard");
  if (!card || window.BlumiExtra) return;

  card.innerHTML = `
    <canvas class="xg-cv" tabindex="0" aria-label="BLUMI mini game"></canvas>
    <div class="hud" aria-hidden="true">
      <div class="hud-l"><span class="chip-h"><small>Score</small><b data-x="score">0</b></span></div>
      <div class="hud-r">
        <span class="chip-h"><small>Best</small><b data-x="best">0</b></span>
        <button class="chip-h pause-btn" type="button" data-x="pause" aria-label="Pause"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg></button>
      </div>
    </div>
    <div class="overlay" data-x="ov">
      <h3 data-x="title"></h3>
      <div class="big-score" data-x="final" hidden></div>
      <p data-x="how"></p>
      <div class="actions">
        <button class="btn btn-primary" type="button" data-x="play">Play</button>
        <button class="btn btn-ghost" type="button" data-x="quit" hidden>End game</button>
      </div>
      <p class="xg-ctl" data-x="ctl"></p>
    </div>`;
  const X = k => card.querySelector(`[data-x="${k}"]`);
  const cv = card.querySelector(".xg-cv"), ctx = cv.getContext("2d");
  const mascot = new Image(); mascot.src = "/assets/blumi-mascot-160.webp";
  mascot.onerror = () => { mascot.onerror = null; mascot.src = "assets/blumi-mascot-160.webp"; };
  let W = 360, H = 520;
  const store = { get(k){ try { return +localStorage.getItem(k) || 0; } catch(e){ return 0; } }, set(k, v){ try { localStorage.setItem(k, v); } catch(e){} } };
  const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = n => n.toLocaleString("en-US");

  function resize(){
    const r = cv.getBoundingClientRect(); if (!r.width) return;
    W = r.width; H = r.height; const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (game && game.resize) game.resize();
  }

  /* ---------- drawing helpers (radial glows, no shadowBlur: clean on Android) ---------- */
  function bg(t, shift = 0){
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#4a95ff"); g.addColorStop(.55, "#0a5cff"); g.addColorStop(1, "#0539b8");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = .18; ctx.strokeStyle = "#fff"; ctx.lineWidth = 1;
    for (let i = 0; i < 14; i++){ const x = (i * 97) % W, y = ((i * 173 - shift * .3) % (H + 40) + H + 40) % (H + 40) - 20, r = 3 + (i % 4) * 2; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  function glow(x, y, r, rgb, a = .5){ const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
  function rr(x, y, w, h, r){ ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
  function pad(x, y, w, kind, a = 1){
    ctx.globalAlpha = a; const h = 14;
    const g = ctx.createLinearGradient(0, y - h/2, 0, y + h/2);
    if (kind === "pop"){ g.addColorStop(0, "#ffe0ea"); g.addColorStop(1, "#ff9ab3"); }
    else if (kind === "move"){ g.addColorStop(0, "#fff3c2"); g.addColorStop(1, "#ffc21a"); }
    else { g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#bfe2ff"); }
    ctx.fillStyle = g; rr(x - w/2, y - h/2, w, h, 7); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.8)"; rr(x - w/2 + 6, y - h/2 + 3, w * .45, 3, 2); ctx.fill(); ctx.globalAlpha = 1;
  }
  function drop(x, y, s, gold = false){
    const g = ctx.createLinearGradient(0, y - s, 0, y + s); if (gold){ g.addColorStop(0, "#fff3c2"); g.addColorStop(1, "#ffc21a"); } else { g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#7cc1ff"); }
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y - s); ctx.bezierCurveTo(x + s*.9, y - s*.1, x + s*.75, y + s*.8, x, y + s*.8); ctx.bezierCurveTo(x - s*.75, y + s*.8, x - s*.9, y - s*.1, x, y - s); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.beginPath(); ctx.ellipse(x - s*.25, y + s*.1, s*.12, s*.22, -.4, 0, 7); ctx.fill();
  }
  function glitch(x, y, r, t){
    glow(x, y, r * 2.1, "255,107,139", .45);
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * 2);
    ctx.fillStyle = "#1a1f3d"; ctx.beginPath();
    for (let i = 0; i < 16; i++){ const a = i / 16 * Math.PI * 2, q = i % 2 ? r * .72 : r; ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q); }
    ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#ff6b8b"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#ff6b8b"; ctx.fillRect(-r*.35, -1.5, r*.7, 3); ctx.fillRect(-1.5, -r*.35, 3, r*.7);
    ctx.restore();
  }
  function player(x, y, s, tilt = 0, sq = 0){
    glow(x, y, s * 1.15, "160,215,255", .55);
    ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(1 + sq, 1 - sq);
    const r = s / 2;
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.clip();
    if (mascot.complete && mascot.naturalWidth) ctx.drawImage(mascot, -r * 1.16, -r * 1.16, r * 2.32, r * 2.32); // same width and height: proportions kept
    else { ctx.fillStyle = "#2f7bff"; ctx.fillRect(-r, -r, s, s); }
    const sh = ctx.createLinearGradient(0, -r, 0, r); sh.addColorStop(0, "rgba(255,255,255,.28)"); sh.addColorStop(.45, "rgba(255,255,255,0)"); sh.addColorStop(1, "rgba(0,30,120,.25)");
    ctx.fillStyle = sh; ctx.fillRect(-r, -r, s, s);
    ctx.restore();
    ctx.lineWidth = Math.max(1.5, r * .1); ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.beginPath(); ctx.arc(0, 0, r - ctx.lineWidth / 2, 0, 7); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.beginPath(); ctx.ellipse(-r * .42, -r * .5, r * .2, r * .11, -.6, 0, 7); ctx.fill();
    ctx.restore();
  }
  let parts = [], floats = [];
  const burst = (x, y, col, n = 10) => { for (let i = 0; i < n; i++){ const a = rnd(0, 7), v = rnd(60, 200); parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: rnd(.35, .7), t: 0, col }); } };
  const float = (x, y, txt) => floats.push({ x, y, txt, t: 0 });
  function fx(dt, oy = 0){
    ctx.save(); ctx.translate(0, oy);
    for (let i = parts.length - 1; i >= 0; i--){ const p = parts[i]; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 300 * dt; if (p.t > p.l){ parts.splice(i, 1); continue; }
      ctx.globalAlpha = 1 - p.t / p.l; ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 7); ctx.fill(); }
    for (let i = floats.length - 1; i >= 0; i--){ const f = floats[i]; f.t += dt; if (f.t > .8){ floats.splice(i, 1); continue; }
      ctx.globalAlpha = 1 - f.t / .8; ctx.fillStyle = "#fff"; ctx.font = "700 15px Unbounded, sans-serif"; ctx.textAlign = "center"; ctx.fillText(f.txt, f.x, f.y - f.t * 40); }
    ctx.globalAlpha = 1; ctx.restore();
  }

  /* ---------- Glitch Gates ---------- */
  const GATES = {
    key: "blumi-best-gates", title: "Glitch Gates",
    how: "Tap to float up and slip through the gaps in the glitch walls. Every gate is +1, a close call is +2, every gold drop is +3. Later the walls start to move.",
    ctl: "Tap anywhere · or press Space",
    reset(){ this.p = { x: W * .28, y: H * .45, vy: 0, sq: 0 }; this.walls = []; this.score = 0; this.t = 0; this.dist = 0; this.spd = 165; this.next = .5; this.started = false; this.trail = []; this.dead = 0; this.flash = 0; this.shake = 0; },
    flap(){ if (this.dead) return; this.started = true; this.p.vy = -370; this.p.sq = .18; for (let i = 0; i < 5; i++) this.trail.push({ x: this.p.x - 16, y: this.p.y + rnd(-8, 8), r: rnd(3, 6), t: 0, vx: -rnd(40, 90) }); },
    press(){ this.flap(); }, drag(){}, release(){},
    keyDown(k){ if ([" ","ArrowUp","w","W"].includes(k)){ this.flap(); return true; } }, keyUp(){},
    gapAt(w){ return w.gy + (w.mv ? Math.sin(this.t * w.mf + w.ph) * w.mv : 0); },
    update(dt){
      this.t += dt; const p = this.p; this.flash = Math.max(0, this.flash - dt * 2); this.shake = Math.max(0, this.shake - dt * 1.8);
      p.sq += (0 - p.sq) * Math.min(1, dt * 10);
      for (const b of this.trail){ b.t += dt; b.x += b.vx * dt; b.y -= 20 * dt; } this.trail = this.trail.filter(b => b.t < .7);
      if (this.dead){ this.dead += dt; p.vy += 1300 * dt; p.y = Math.min(H - 30, p.y + p.vy * dt); if (this.dead > .9) end(); return; }
      if (!this.started){ p.y = H * .45 + Math.sin(this.t * 3) * 8; this.dist += 60 * dt; return; }
      this.spd = Math.min(310, 165 + this.score * 3.2); this.dist += this.spd * dt;
      p.vy += 1080 * dt; p.vy = Math.min(p.vy, 540); p.y += p.vy * dt;
      this.next -= dt;
      if (this.next <= 0){
        const gap = clamp(196 - this.score * 2, 132, 196), gy = rnd(90 + gap/2, H - 70 - gap/2);
        const mv = this.score >= 12 && Math.random() < Math.min(.6, (this.score - 10) * .04) ? rnd(24, 48) : 0;
        this.walls.push({ x: W + 50, gy: clamp(gy, 90 + gap/2 + mv, H - 70 - gap/2 - mv), gap, passed: 0, drop: Math.random() < .55, mv, mf: rnd(1.4, 2.4), ph: rnd(0, 6), close: 0 });
        this.next = clamp(1.7 - this.score * .012, 1.12, 1.7);
      }
      const PW = 66, R = 18;
      for (const w of this.walls){ w.x -= this.spd * dt; const gy = this.gapAt(w), top = gy - w.gap/2, bot = gy + w.gap/2;
        if (Math.abs(w.x - p.x) < PW/2 + R){
          if (p.y - R < top || p.y + R > bot){ return this.crash(); }
          const m = Math.min(p.y - R - top, bot - p.y - R); if (m < 12) w.close = 1;
        }
        if (!w.passed && w.x + PW/2 < p.x - R){ w.passed = 1; const bonus = w.close ? 2 : 1; this.score += bonus; float(p.x, p.y - 34, w.close ? "+2 Close!" : "+1"); if (w.close) this.flash = .5; }
        if (w.drop && Math.abs(w.x - p.x) < 24 && Math.abs(gy - p.y) < 28){ w.drop = false; this.score += 3; float(p.x, p.y - 34, "+3"); burst(w.x, gy, "#ffe08a", 12); }
      }
      this.walls = this.walls.filter(w => w.x > -90);
      if (p.y < 18){ p.y = 18; p.vy = Math.max(p.vy, 0); }
      if (p.y > H - 46) this.crash();
    },
    crash(){ if (this.dead) return; this.dead = .0001; this.shake = 1; this.p.vy = -260; burst(this.p.x, this.p.y, "#ff6b8b", 18); burst(this.p.x, this.p.y, "#bfe2ff", 14); if (navigator.vibrate) try { navigator.vibrate(30); } catch(e){} },
    sky(){
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#071a4d"); g.addColorStop(.55, "#0a5cff"); g.addColorStop(1, "#4a95ff"); ctx.fillStyle = g; ctx.fillRect(-20, -20, W + 40, H + 40);
      const m = ctx.createRadialGradient(W * .8, H * .18, 0, W * .8, H * .18, H * .5); m.addColorStop(0, "rgba(200,230,255,.45)"); m.addColorStop(1, "rgba(200,230,255,0)"); ctx.fillStyle = m; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.beginPath(); ctx.arc(W * .8, H * .18, 16, 0, 7); ctx.fill();
      for (let i = 0; i < 26; i++){ const x = ((i * 97 - this.dist * .05) % (W + 20) + W + 20) % (W + 20) - 10, y = (i * 53) % (H * .45); ctx.globalAlpha = .3 + .3 * Math.sin(this.t * 1.5 + i); ctx.fillStyle = "#fff"; ctx.fillRect(x, y, 2, 2); } ctx.globalAlpha = 1;
      // clouds
      for (let i = 0; i < 5; i++){ const cw = 120 + (i % 3) * 50, x = ((i * 230 - this.dist * .18) % (W + cw * 2) + W + cw * 2) % (W + cw * 2) - cw, y = H * (.2 + (i % 3) * .1);
        ctx.fillStyle = "rgba(255,255,255,.10)"; ctx.beginPath(); ctx.ellipse(x, y, cw * .5, 16, 0, 0, 7); ctx.ellipse(x + cw * .2, y - 10, cw * .3, 14, 0, 0, 7); ctx.fill(); }
      // far hills and near hills (parallax)
      const hill = (sp, base, amp, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-10, H); for (let x = -10; x <= W + 10; x += 8){ const u = (x + this.dist * sp) * .012; ctx.lineTo(x, base + Math.sin(u) * amp + Math.sin(u * 2.3 + 1) * amp * .4); } ctx.lineTo(W + 10, H); ctx.fill(); };
      hill(.25, H * .72, 26, "rgba(10,40,130,.45)"); hill(.45, H * .8, 18, "rgba(8,30,100,.55)");
    },
    pillar(x, y1, y2, capDown){
      const PW = 66, h = y2 - y1; if (h <= 0) return;
      const g = ctx.createLinearGradient(x - PW/2, 0, x + PW/2, 0); g.addColorStop(0, "#141830"); g.addColorStop(.5, "#252b52"); g.addColorStop(1, "#0c1024");
      ctx.fillStyle = g; ctx.fillRect(x - PW/2, y1, PW, h);
      // scanlines that drift
      ctx.save(); ctx.beginPath(); ctx.rect(x - PW/2, y1, PW, h); ctx.clip();
      for (let yy = y1 + ((this.t * 40) % 12); yy < y2; yy += 12){ ctx.fillStyle = "rgba(255,107,139,.08)"; ctx.fillRect(x - PW/2, yy, PW, 2); }
      for (let k = 0; k < 3; k++){ const gy = y1 + ((k * 73 + Math.floor(this.t * 6) * 37) % Math.max(1, h)); ctx.fillStyle = "rgba(124,193,255,.25)"; ctx.fillRect(x - PW/2 + ((k * 19 + Math.floor(this.t * 8) * 11) % (PW - 20)), gy, 18, 3); }
      ctx.restore();
      ctx.fillStyle = "#ff6b8b"; ctx.fillRect(x - PW/2, y1, 3, h); ctx.fillRect(x + PW/2 - 3, y1, 3, h);
      // spiky cap facing the gap
      const cy = capDown ? y2 : y1, dir = capDown ? 1 : -1;
      glow(x, cy, 46, "255,107,139", .35);
      ctx.fillStyle = "#1a1f3d"; ctx.fillRect(x - PW/2 - 6, capDown ? cy - 12 : cy, PW + 12, 12);
      ctx.fillStyle = "#ff6b8b"; ctx.fillRect(x - PW/2 - 6, capDown ? cy - 2 : cy, PW + 12, 2);
      ctx.fillStyle = "#1a1f3d"; ctx.beginPath(); for (let i = 0; i <= 6; i++){ const sx = x - PW/2 - 6 + i * (PW + 12) / 6; ctx.lineTo(sx, cy + (i % 2 ? 9 : 0) * dir); } ctx.lineTo(x + PW/2 + 6, cy); ctx.closePath(); ctx.fill();
    },
    draw(){
      ctx.save();
      if (this.shake){ const k = this.shake * this.shake; ctx.translate(k * Math.sin(this.t * 31) * 8, k * Math.cos(this.t * 27) * 6); }
      this.sky();
      for (const w of this.walls){ const gy = this.gapAt(w); this.pillar(w.x, -20, gy - w.gap/2, true); this.pillar(w.x, gy + w.gap/2, H - 40, false); if (w.drop) drop(w.x, gy + Math.sin(this.t * 4) * 4, 12, true); }
      // ground
      const gg = ctx.createLinearGradient(0, H - 40, 0, H); gg.addColorStop(0, "#0a3fb5"); gg.addColorStop(1, "#06267a"); ctx.fillStyle = gg; ctx.fillRect(-20, H - 40, W + 40, 60);
      ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(-20, H - 40, W + 40, 2);
      ctx.fillStyle = "rgba(255,255,255,.12)"; for (let x = -((this.dist) % 28); x < W; x += 28) ctx.fillRect(x, H - 30, 14, 3);
      for (const b of this.trail){ ctx.globalAlpha = 1 - b.t / .7; ctx.strokeStyle = "rgba(220,240,255,.9)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.stroke(); } ctx.globalAlpha = 1;
      const p = this.p; if (!(this.dead > .5)) player(p.x, p.y, 40, clamp(p.vy / 900, -.45, .55), p.sq);
      if (this.flash){ ctx.fillStyle = `rgba(255,255,255,${this.flash * .25})`; ctx.fillRect(0, 0, W, H); }
      ctx.restore();
      if (state === "play" && !this.started){ ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.font = "800 15px Unbounded, sans-serif"; ctx.textAlign = "center"; ctx.fillText("Tap to start", W/2, H * .72); }
    }
  };

  /* ---------- shell ---------- */
  const GAMES = { gates: GATES };
  let game = GATES, state = "menu", paused = false, last = 0, raf = 0, active = false;
  const hud = () => { X("score").textContent = fmt(game.score || 0); X("best").textContent = fmt(store.get(game.key)); };
  function menu(over){
    X("title").textContent = over ? "Game over" : game.title;
    X("final").hidden = !over; X("final").textContent = fmt(game.score || 0);
    const best = store.get(game.key);
    X("how").textContent = over ? (game.score > 0 && game.score >= best ? "New best score!" : "Best: " + fmt(best)) : game.how;
    X("play").textContent = over ? "Play again" : "Play"; X("quit").hidden = true; X("ctl").textContent = game.ctl;
    X("ov").hidden = false; card.classList.remove("playing"); hud();
  }
  function start(){ parts = []; floats = []; game.reset(); state = "play"; paused = false; X("ov").hidden = true; card.classList.add("playing"); last = 0; hud(); cv.focus({ preventScroll: true }); }
  function end(){ if (state !== "play") return; state = "over"; if (game.score > store.get(game.key)) store.set(game.key, game.score); setTimeout(() => { if (state === "over") menu(true); }, 350); }
  function setPause(on){ if (state !== "play") return; paused = on;
    if (on){ X("title").textContent = "Paused"; X("final").hidden = true; X("how").textContent = game.title; X("play").textContent = "Resume"; X("quit").hidden = false; X("ctl").textContent = ""; X("ov").hidden = false; card.classList.remove("playing"); }
    else { X("ov").hidden = true; card.classList.add("playing"); last = 0; } }
  X("play").addEventListener("click", () => { if (state === "play" && paused) setPause(false); else start(); });
  X("quit").addEventListener("click", () => { paused = false; end(); });
  X("pause").addEventListener("click", () => setPause(true));
  const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener("pointerdown", e => { if (state !== "play" || paused) return; e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch(_){} game.press(...pos(e)); });
  cv.addEventListener("pointermove", e => { if (state === "play" && !paused && e.buttons) game.drag(...pos(e)); });
  ["pointerup", "pointercancel"].forEach(ev => cv.addEventListener(ev, () => { if (state === "play") game.release(); }));
  window.addEventListener("keydown", e => {
    if (!active || state !== "play") return;
    if (e.key === "p" || e.key === "P" || e.key === "Escape"){ setPause(!paused); e.preventDefault(); return; }
    if (paused) return;
    if (game.keyDown(e.key)) e.preventDefault();
  });
  window.addEventListener("keyup", e => { if (active && state === "play") game.keyUp(e.key); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) setPause(true); last = 0; });
  window.addEventListener("resize", () => { if (active) resize(); });

  function step(ts){
    const dt = last ? Math.min(.033, (ts - last) / 1000) : 0; last = ts;
    if (state === "play" && !paused){ game.update(dt); X("score").textContent = fmt(game.score); }
    else if (state !== "play"){ game.t = (game.t || 0) + dt; }
    game.draw(); fx(paused ? 0 : dt);
    raf = requestAnimationFrame(step);
  }
  // only draw while the card is on screen
  new IntersectionObserver(([en]) => {
    if (en.isIntersecting && active){ if (!raf){ last = 0; raf = requestAnimationFrame(step); } }
    else { if (state === "play" && !paused) setPause(true); cancelAnimationFrame(raf); raf = 0; }
  }).observe(card);

  window.BlumiExtra = {
    show(id){
      if (state === "play"){ state = "menu"; paused = false; }
      game = GAMES[id] || GATES; active = true; parts = []; floats = [];
      resize(); game.reset(); menu(false);
      if (!raf){ last = 0; raf = requestAnimationFrame(step); }
    },
    hide(){ if (state === "play" && !paused) setPause(true); active = false; cancelAnimationFrame(raf); raf = 0; },
    _games: GAMES, _state: () => ({ state, paused, id: Object.keys(GAMES).find(k => GAMES[k] === game), score: game.score })
  };
})();
