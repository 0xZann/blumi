/* BLUMI Playground — extra mini games: Bubble Hop, Glitch Gates, Bubble Stack.
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
  function player(x, y, s, tilt = 0){
    glow(x, y, s * 1.1, "160,215,255", .55);
    ctx.save(); ctx.translate(x, y); ctx.rotate(tilt);
    if (mascot.complete && mascot.naturalWidth) ctx.drawImage(mascot, -s/2, -s/2, s, s); // same width and height: proportions kept
    else { ctx.fillStyle = "#2f7bff"; rr(-s/2, -s/2, s, s, s * .28); ctx.fill(); }
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

  /* ---------- Bubble Hop ---------- */
  const HOP = {
    key: "blumi-best-hop", title: "Bubble Hop",
    how: "Bounce from bubble to bubble and climb as high as you can. Pink bubbles pop after one bounce, gold ones move. Avoid the glitches and don't fall.",
    ctl: "Hold the left or right side · or use ← →",
    reset(){ this.p = { x: W/2, y: H - 120, vx: 0, vy: -620 }; this.cam = 0; this.top = this.p.y; this.score = 0; this.bonus = 0; this.pads = []; this.items = []; this.dir = 0; this.t = 0;
      this.pads.push({ x: W/2, y: H - 60, w: 110, k: "base" }); let y = H - 60; while (y > -H){ y -= rnd(70, 110); this.addPad(y); } },
    addPad(y){ const h = H - 60 - y, diff = clamp(h / 6000, 0, 1), r = Math.random();
      const k = r < .12 + diff * .2 ? "pop" : r < .2 + diff * .25 ? "move" : "base", w = rnd(70, 100) - diff * 18;
      this.pads.push({ x: rnd(w/2 + 8, W - w/2 - 8), y, w, k, vx: k === "move" ? rnd(50, 90) * (Math.random() < .5 ? -1 : 1) : 0, gone: 0 });
      if (Math.random() < .35) this.items.push({ x: rnd(30, W - 30), y: y - rnd(30, 60), k: "drop" });
      if (h > 700 && Math.random() < .10 + diff * .18) this.items.push({ x: rnd(30, W - 30), y: y - rnd(35, 55), k: "glitch", vx: Math.random() < .4 ? rnd(40, 80) : 0 });
    },
    press(x){ this.dir = x < W/2 ? -1 : 1; }, drag(x){ this.dir = x < W/2 ? -1 : 1; }, release(){ this.dir = 0; },
    keyDown(k){ if (["ArrowLeft","a","A"].includes(k)){ this.dir = -1; return true; } if (["ArrowRight","d","D"].includes(k)){ this.dir = 1; return true; } },
    keyUp(k){ if (["ArrowLeft","a","A","ArrowRight","d","D"].includes(k)) this.dir = 0; },
    update(dt){
      const p = this.p; this.t += dt;
      p.vx += (this.dir * 900 - p.vx * 4.5) * dt; p.x += p.vx * dt; if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      p.vy += 1500 * dt; const prevY = p.y; p.y += p.vy * dt;
      if (p.vy > 0) for (const d of this.pads){ if (d.gone) continue;
        if (prevY + 18 <= d.y - 7 && p.y + 18 >= d.y - 7 && Math.abs(p.x - d.x) < d.w/2 + 12){ p.y = d.y - 25; p.vy = -760; burst(p.x, d.y - this.cam, "rgba(255,255,255,.9)", 6); if (d.k === "pop"){ d.gone = .0001; burst(d.x, d.y - this.cam, "#ff9ab3", 12); } break; } }
      for (const d of this.pads){ if (d.k === "move"){ d.x += d.vx * dt; if (d.x < d.w/2 + 6 || d.x > W - d.w/2 - 6) d.vx *= -1; } if (d.gone) d.gone += dt; }
      for (const it of this.items){ if (it.vx){ it.x += it.vx * dt; if (it.x < 20 || it.x > W - 20) it.vx *= -1; }
        if (!it.got && Math.hypot(it.x - p.x, it.y - p.y) < 28){ if (it.k === "drop"){ it.got = 1; this.bonus += 25; float(it.x, it.y - this.cam, "+25"); burst(it.x, it.y - this.cam, "#bfe2ff", 8); } else return end(); } }
      const target = p.y - H * .42; if (target < this.cam) this.cam += (target - this.cam) * Math.min(1, dt * 8);
      this.top = Math.min(this.top, p.y);
      this.score = Math.max(0, Math.round((H - 120 - this.top) / 10)) + this.bonus;
      let minY = Math.min(...this.pads.map(d => d.y)); while (minY > this.cam - 60 - H){ minY -= rnd(70, 110) + clamp(-minY / 90, 0, 40); this.addPad(minY); }
      this.pads = this.pads.filter(d => d.y < this.cam + H + 60 && !(d.gone > .3)); this.items = this.items.filter(i => i.y < this.cam + H + 60 && !i.got);
      if (p.y - this.cam > H + 40) end();
    },
    draw(){
      bg(this.t, this.cam); ctx.save(); ctx.translate(0, -this.cam);
      for (const d of this.pads) pad(d.x, d.y, d.w, d.k, d.gone ? 1 - d.gone / .3 : 1);
      for (const it of this.items) it.k === "drop" ? drop(it.x, it.y + Math.sin(this.t * 3 + it.x) * 3, 11) : glitch(it.x, it.y, 15, this.t);
      const p = this.p; player(p.x, p.y, 40, clamp(p.vx / 1600, -.25, .25)); ctx.restore();
    }
  };

  /* ---------- Glitch Gates ---------- */
  const GATES = {
    key: "blumi-best-gates", title: "Glitch Gates",
    how: "Tap to float up and slip through the gaps in the glitch walls. Every gate is +1, every gold drop in a gap is +3. It gets faster as you go.",
    ctl: "Tap anywhere · or press Space",
    reset(){ this.p = { x: W * .3, y: H * .45, vy: 0 }; this.walls = []; this.score = 0; this.t = 0; this.spd = 150; this.next = .6; this.started = false; },
    flap(){ this.started = true; this.p.vy = -360; burst(this.p.x - 14, this.p.y + 12, "rgba(255,255,255,.8)", 4); },
    press(){ this.flap(); }, drag(){}, release(){},
    keyDown(k){ if ([" ","ArrowUp","w","W"].includes(k)){ this.flap(); return true; } }, keyUp(){},
    update(dt){
      this.t += dt; const p = this.p;
      if (!this.started){ p.y = H * .45 + Math.sin(this.t * 3) * 8; return; }
      this.spd = Math.min(300, 150 + this.score * 4);
      p.vy += 1050 * dt; p.vy = Math.min(p.vy, 520); p.y += p.vy * dt;
      this.next -= dt; if (this.next <= 0){ const gap = clamp(190 - this.score * 2.2, 128, 190), gy = rnd(80 + gap/2, H - 60 - gap/2); this.walls.push({ x: W + 40, gy, gap, passed: 0, drop: Math.random() < .6 }); this.next = clamp(1.75 - this.score * .012, 1.15, 1.75); }
      for (const w of this.walls){ w.x -= this.spd * dt;
        if (!w.passed && w.x < p.x){ w.passed = 1; this.score++; float(p.x, p.y - 30, "+1"); }
        if (w.drop && Math.abs(w.x - p.x) < 22 && Math.abs(w.gy - p.y) < 26){ w.drop = false; this.score += 3; float(p.x, p.y - 30, "+3"); burst(w.x, w.gy, "#ffe08a", 8); }
        if (Math.abs(w.x - p.x) < 34 && Math.abs(p.y - w.gy) > w.gap/2 - 16) return end(); }
      this.walls = this.walls.filter(w => w.x > -60);
      if (p.y < 16){ p.y = 16; p.vy = Math.max(p.vy, 0); }
      if (p.y > H - 18) end();
    },
    draw(){
      bg(this.t, this.t * 60);
      for (const w of this.walls){
        const top = w.gy - w.gap/2, bot = w.gy + w.gap/2;
        for (let y = top - 18; y > -20; y -= 34) glitch(w.x, y, 15, this.t + y * .01);
        for (let y = bot + 18; y < H + 20; y += 34) glitch(w.x, y, 15, this.t + y * .01);
        if (w.drop) drop(w.x, w.gy + Math.sin(this.t * 4) * 4, 12, true);
      }
      ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(0, H - 8, W, 8);
      const p = this.p; player(p.x, p.y, 40, clamp(p.vy / 900, -.4, .5));
      if (state === "play" && !this.started){ ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.font = "700 14px Unbounded, sans-serif"; ctx.textAlign = "center"; ctx.fillText("Tap to start", W/2, H * .72); }
    }
  };

  /* ---------- Bubble Stack ---------- */
  const STACK = {
    key: "blumi-best-stack", title: "Bubble Stack", SH: 24,
    how: "Tap to drop the sliding bubble block. Whatever hangs over the edge gets cut off. Land it perfectly to keep it whole, and 3 perfects in a row make it grow back.",
    ctl: "Tap anywhere · or press Space",
    reset(){ const w = Math.min(W * .62, 300); this.maxW = w; this.blocks = [{ x: W/2, w, y: H - 70 }]; this.score = 0; this.combo = 0; this.t = 0; this.cam = 0; this.camT = 0; this.debris = []; this.flash = 0; this.spawn(); },
    resize(){ if (this.blocks && state !== "play") this.reset(); },
    spawn(){ const top = this.blocks[this.blocks.length - 1], n = this.blocks.length, dir = n % 2 ? 1 : -1;
      this.cur = { w: top.w, y: top.y - this.SH, x: top.x - dir * W * .55, dir, spd: Math.min(420, 190 + n * 7) }; },
    press(){ this.drop(); }, drag(){}, release(){},
    keyDown(k){ if ([" ","ArrowDown","Enter"].includes(k)){ this.drop(); return true; } }, keyUp(){},
    drop(){ const c = this.cur, top = this.blocks[this.blocks.length - 1]; if (!c) return;
      let dx = c.x - top.x;
      if (Math.abs(dx) < 5){ dx = 0; c.x = top.x; this.combo++; this.flash = .35; burst(c.x, c.y + this.cam, "rgba(255,255,255,.95)", 14);
        float(c.x, c.y + this.cam - 26, this.combo > 1 ? "Perfect ×" + this.combo : "Perfect");
        if (this.combo >= 3 && c.w < this.maxW) c.w = Math.min(this.maxW, c.w + 14); }
      else this.combo = 0;
      const cL = c.x - c.w/2, cR = c.x + c.w/2, L = Math.max(cL, top.x - top.w/2), R = Math.min(cR, top.x + top.w/2), ov = R - L;
      if (ov <= 0){ this.debris.push({ x: c.x, y: c.y, w: c.w, vy: 0, vx: c.dir * 60, r: 0, vr: c.dir * 1.5 }); this.cur = null; return end(); }
      if (dx !== 0){ const a = dx > 0 ? R : cL, b = dx > 0 ? cR : L; this.debris.push({ x: (a + b)/2, y: c.y, w: b - a, vy: 0, vx: Math.sign(dx) * 80, r: 0, vr: Math.sign(dx) * 2 }); }
      const nb = { x: dx === 0 ? c.x : (L + R)/2, w: dx === 0 ? c.w : ov, y: c.y };
      this.blocks.push(nb); this.score += dx === 0 ? 2 : 1; this.spawn();
      this.camT = Math.max(0, (H - 70 - nb.y) - H * .45);
    },
    update(dt){ this.t += dt; this.flash = Math.max(0, this.flash - dt);
      const c = this.cur; if (c){ c.x += c.dir * c.spd * dt; if (c.x > W - c.w/2 + 40 && c.dir > 0) c.dir = -1; if (c.x < c.w/2 - 40 && c.dir < 0) c.dir = 1; }
      this.cam += (this.camT - this.cam) * Math.min(1, dt * 6);
      for (const d of this.debris){ d.vy += 1400 * dt; d.y += d.vy * dt; d.x += d.vx * dt; d.r += d.vr * dt; }
      this.debris = this.debris.filter(d => d.y < H - this.cam + 200);
    },
    pal: [["#ffffff","#cfe8ff"],["#e6f4ff","#9fd0ff"],["#d6ecff","#7cc1ff"],["#c4e3ff","#5fb4ff"],["#b0d8ff","#3d9bff"],["#9fd0ff","#2f7bff"],["#fff3c2","#ffc21a"],["#9fd0ff","#2f7bff"],["#b0d8ff","#3d9bff"],["#c4e3ff","#5fb4ff"],["#d6ecff","#7cc1ff"],["#e6f4ff","#9fd0ff"]],
    slab(x, y, w, i, a = 1, rot = 0){ const h = this.SH, [c1, c2] = this.pal[i % 12], r = Math.min(10, w/2);
      ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot);
      const g = ctx.createLinearGradient(0, -h/2, 0, h/2); g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; rr(-w/2, -h/2, w, h, r); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.7)"; rr(-w/2 + 6, -h/2 + 4, Math.max(0, w * .5 - 6), 3, 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1; rr(-w/2, -h/2, w, h, r); ctx.stroke();
      ctx.restore(); },
    draw(){ bg(this.t, -this.cam * 2);
      ctx.save(); ctx.translate(0, this.cam);
      const from = Math.max(0, this.blocks.length - 40);
      for (let i = from; i < this.blocks.length; i++){ const b = this.blocks[i]; this.slab(b.x, b.y, b.w, i); }
      const top = this.blocks[this.blocks.length - 1];
      if (this.flash){ const k = .35 - this.flash; ctx.strokeStyle = `rgba(255,255,255,${this.flash * 2.5})`; ctx.lineWidth = 3; rr(top.x - top.w/2 - k * 40, top.y - this.SH/2 - k * 20, top.w + k * 80, this.SH + k * 40, 14); ctx.stroke(); }
      for (const d of this.debris) this.slab(d.x, d.y, d.w, this.blocks.length, .9, d.r);
      if (this.cur){ const c = this.cur; this.slab(c.x, c.y, c.w, this.blocks.length); player(c.x, c.y - this.SH/2 - 20, 34, Math.sin(this.t * 6) * .05); }
      else player(top.x, top.y - this.SH/2 - 20, 34);
      ctx.restore();
      if (state === "play" && this.blocks.length < 3){ ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.font = "800 13px Unbounded, sans-serif"; ctx.textAlign = "center"; ctx.fillText("Tap to drop", W/2, H * .2); }
    }
  };

  /* ---------- shell ---------- */
  const GAMES = { hop: HOP, gates: GATES, stack: STACK };
  let game = HOP, state = "menu", paused = false, last = 0, raf = 0, active = false;
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
      game = GAMES[id] || HOP; active = true; parts = []; floats = [];
      resize(); game.reset(); menu(false);
      if (!raf){ last = 0; raf = requestAnimationFrame(step); }
    },
    hide(){ if (state === "play" && !paused) setPause(true); active = false; cancelAnimationFrame(raf); raf = 0; },
    _games: GAMES, _state: () => ({ state, paused, id: Object.keys(GAMES).find(k => GAMES[k] === game), score: game.score })
  };
})();
