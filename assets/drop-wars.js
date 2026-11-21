/* BLUMI Playground — Drop Wars (artillery duel, 10 levels). Loaded only when picked. Mounts into #warsCard. */
(function(){ if(document.getElementById('dw-style')) return; const st=document.createElement('style'); st.id='dw-style'; st.textContent="#warsCard canvas{display:block;width:100%;touch-action:none}\n#warsCard .hud{position:absolute;left:10px;right:10px;top:10px;display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:start;pointer-events:none;color:#fff}\n#warsCard .hp{display:flex;flex-direction:column;gap:5px;padding:8px 10px;border-radius:14px;background:rgba(5,12,35,.55);border:1px solid rgba(160,210,255,.18);backdrop-filter:blur(6px)}\n#warsCard .hp.r{text-align:right}\n#warsCard .hp b{font:700 11px/1 Unbounded,sans-serif;letter-spacing:.06em}\n#warsCard .bar{height:7px;border-radius:9px;background:rgba(255,255,255,.12);overflow:hidden}\n#warsCard .bar i{display:block;height:100%;width:100%;border-radius:9px;transition:width .4s}\n#warsCard .hp.l .bar i{background:linear-gradient(90deg,#5fb4ff,#2f7bff)}\n#warsCard .hp.r .bar i{background:linear-gradient(90deg,#ff6b8b,#ff9ab3);margin-left:auto}\n#warsCard .mid{display:flex;flex-direction:column;align-items:center;gap:5px;padding:7px 10px;border-radius:14px;background:rgba(5,12,35,.55);border:1px solid rgba(160,210,255,.18);backdrop-filter:blur(6px);min-width:92px}\n#warsCard .mid small{font:600 9px/1 Inter,system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:rgba(200,225,255,.75)}\n#warsCard .mid b{font:700 12px/1 Unbounded,sans-serif}\n#warsCard .turn{position:absolute;left:0;right:0;top:74px;text-align:center;pointer-events:none;font:800 13px/1 Unbounded,sans-serif;letter-spacing:.14em;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.6);transition:opacity .3s}\n#warsCard .weap{position:absolute;left:10px;right:10px;bottom:10px;display:flex;gap:8px;justify-content:center;pointer-events:auto}\n#warsCard .wb{appearance:none;border:1px solid rgba(160,210,255,.25);background:rgba(5,12,35,.62);color:#fff;border-radius:14px;padding:8px 12px;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;min-width:84px;backdrop-filter:blur(6px);font-family:inherit}\n#warsCard .wb b{font:700 11px/1 Unbounded,sans-serif}\n#warsCard .wb small{font-size:10.5px;color:rgba(200,225,255,.75)}\n#warsCard .wb.on{background:linear-gradient(135deg,#2f7bff,#0a5cff);border-color:transparent;box-shadow:0 10px 24px -10px rgba(10,92,255,.9)}\n#warsCard .wb:disabled{opacity:.35;cursor:default}\n#warsCard .ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;color:#fff;background:linear-gradient(180deg,rgba(3,10,35,.55),rgba(2,6,20,.8));backdrop-filter:blur(4px);transition:opacity .35s}\n#warsCard .ov.hide{opacity:0;pointer-events:none}\n#warsCard .ov h2{font:800 28px/1.1 Unbounded,sans-serif}\n#warsCard .ov p{margin-top:12px;max-width:360px;font-size:14.5px;line-height:1.55;color:rgba(255,255,255,.9)}\n#warsCard .ov .sc{margin-top:10px;font:800 40px/1 Unbounded,sans-serif}\n#warsCard .ov button{margin-top:22px;appearance:none;border:0;cursor:pointer;padding:15px 34px;border-radius:999px;background:#fff;color:var(--blue);font:800 15px/1 Unbounded,sans-serif;letter-spacing:.04em;box-shadow:0 14px 30px -10px rgba(0,0,0,.35)}\n#warsCard .lvgrid{display:grid;grid-template-columns:repeat(5,40px);gap:8px;margin-top:18px;justify-content:center}\n#warsCard .ov .lvgrid .lv{appearance:none;margin:0;padding:0;width:40px;height:40px;border-radius:12px;border:1px solid rgba(255,255,255,.6);background:#fff;color:#0a5cff;font:800 14px/1 Unbounded,sans-serif;letter-spacing:0;cursor:pointer;display:grid;place-items:center;box-shadow:0 8px 18px -8px rgba(0,0,0,.5)}\n#warsCard .ov .lvgrid .lv.done{background:linear-gradient(135deg,#2f7bff,#0a5cff);border-color:transparent;color:#fff}\n#warsCard .ov .lvgrid .lv.locked{cursor:default;background:rgba(255,255,255,.06);border-color:rgba(160,210,255,.25);color:rgba(200,225,255,.55);box-shadow:none}\n#warsCard .chtabs{display:flex;gap:4px;margin-top:16px;justify-content:center;flex-wrap:nowrap}\n#warsCard .ov .chtabs .ch{appearance:none;margin:0;padding:7px 7px;border-radius:999px;border:1px solid rgba(160,210,255,.3);background:rgba(255,255,255,.06);color:rgba(220,235,255,.85);font:700 10px/1 Unbounded,sans-serif;letter-spacing:.02em;white-space:nowrap;cursor:pointer;box-shadow:none}\n#warsCard .ov .chtabs .ch span{opacity:.6}\n#warsCard .ov{z-index:3}\n#warsCard .ov .chtabs .ch.on{background:#fff;color:#0a5cff;border-color:#fff}\n#warsCard .ov .chtabs .ch:disabled{opacity:.4;cursor:default}\n#warsCard .ov .lvgrid{margin-top:12px}\n#warsCard .ov button.reset{margin-top:12px;padding:11px 22px;background:transparent;color:#fff;border:1px solid rgba(255,255,255,.55);font-size:12px;box-shadow:none}\n#warsCard .ov button[hidden]{display:none}\n#warsCard .ov .how{margin-top:16px;font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.8);max-width:340px}\n#warsCard{background:#050b1f}\n#warsCard .dw-stage{position:relative;margin:0 auto}\n#warsCard .ov > button{color:#0a5cff}\n"; document.head.appendChild(st); })();
const MARKUP="<div class=\"dw-stage\">\n    <canvas data-id=\"cv\" aria-label=\"Drop Wars battlefield\"></canvas>\n    <div class=\"hud\">\n      <div class=\"hp l\"><b>BLUMI <span data-id=\"lives\" style=\"color:#ff6b8b;letter-spacing:.08em\"></span></b><div class=\"bar\"><i data-id=\"hpA\"></i></div></div>\n      <div class=\"mid\"><small>Wind</small><b data-id=\"wind\">0</b><small data-id=\"lvl\">Level 1/30</small></div>\n      <div class=\"hp r\"><b>GLITCH</b><div class=\"bar\"><i data-id=\"hpB\"></i></div></div>\n    </div>\n    <div class=\"turn\" data-id=\"turn\"></div>\n    <div class=\"weap\" data-id=\"weap\">\n      <button class=\"wb on\" data-w=\"0\" type=\"button\"><b>Drop shell</b><small>\u221e</small></button>\n      <button class=\"wb\" data-w=\"1\" type=\"button\"><b>Triple</b><small data-id=\"am1\">x2</small></button>\n      <button class=\"wb\" data-w=\"2\" type=\"button\"><b>Mega drop</b><small data-id=\"am2\">x3</small></button>\n    </div>\n    <div class=\"ov\" data-id=\"ov\">\n      <h2 data-id=\"ovT\">Drop Wars</h2>\n      <div class=\"sc\" data-id=\"ovS\" style=\"display:none\"></div>\n      <p data-id=\"ovP\">BLUMI vs the Glitch. 30 levels across 3 worlds, 3 lives. Beat a level to unlock the next one.</p>\n      <div class=\"chtabs\" data-id=\"chTabs\"></div>\n      <div class=\"lvgrid\" data-id=\"lvGrid\"></div>\n      <button data-id=\"ovB\">Play</button>\n      <button data-id=\"ovR\" class=\"reset\" type=\"button\" hidden>Reset to level 1</button>\n      <div class=\"how\">Drag in any direction to aim (longer drag = more power), release to fire \u00b7 or \u2190 \u2192 \u2191 \u2193 and Space</div>\n    </div>\n</div>";
(() => {
const card=document.getElementById("warsCard");
if(!card || window.BlumiWars) return;
card.innerHTML=MARKUP;
const stage=card.querySelector(".dw-stage");
const $=id=>card.querySelector('[data-id="'+id+'"]');
const cv=$("cv"); let ctx=cv.getContext("2d");
let active=false, raf=0;
const mascot=new Image(); mascot.src="/assets/blumi-mascot-160.webp"; mascot.onerror=()=>{ mascot.onerror=null; mascot.src="assets/blumi-mascot-160.webp"; };
const store={get(k){try{return +localStorage.getItem(k)||0}catch(e){return 0}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const KEY="blumi-best-wars";
const LW=520, LH=660, G=480;
let W=360,H=456,S=.6,DPR=1;
const rnd=(a,b)=>a+Math.random()*(b-a), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let blasts=[], flying=[];
let h=new Float32Array(LW+1), tanks=[], shots=[], parts=[], smoke=[], rings=[], floats=[], trail=[];
let state="menu", turn=0, wind=0, level=1, score=0, weapon=0, ammo=[Infinity,2,3], shake=0, t=0, wait=0, aiPlan=null, aim=null, stars=[], hills=[];

const skyC=document.createElement('canvas'), terC=document.createElement('canvas'); let skyDirty=true, terDirty=true;
function resize(){ skyDirty=terDirty=true; const cw=card.clientWidth||360, maxH=clamp(innerHeight*.74,460,660); S=Math.min(cw/LW,maxH/LH); W=Math.round(LW*S); H=Math.round(LH*S); stage.style.width=W+"px"; DPR=Math.min(2,devicePixelRatio||1); cv.width=W*DPR; cv.height=H*DPR; cv.style.height=H+"px"; }

/* ---------- world ---------- */
function genTerrain(){
  const p=[rnd(0,7),rnd(0,7),rnd(0,7)], base=LH*rnd(.62,.68), amp=rnd(28,48);
  for(let x=0;x<=LW;x++) h[x]=base+amp*Math.sin(x*.011+p[0])+amp*.45*Math.sin(x*.027+p[1])+12*Math.sin(x*.063+p[2]);
  // a hill in the middle so shots must arc
  const hm=rnd(.4,.6)*LW, hh=rnd(50,105)*(typeof LEVELS!=='undefined'&&LV()?LV().hill:1), hw=rnd(60,85);
  for(let x=0;x<=LW;x++) h[x]-=hh*Math.exp(-Math.pow((x-hm)/hw,2));
  for(const tx of [60,LW-60]){ let avg=0; for(let x=tx-22;x<=tx+22;x++) avg+=h[x]; avg/=45; for(let x=tx-26;x<=tx+26;x++){ const k=clamp((26-Math.abs(x-tx))/8,0,1); h[x]=h[x]*(1-k)+avg*k; } }
  for(let x=0;x<=LW;x++) h[x]=clamp(h[x],LH*.32,LH-40);
  stars=Array.from({length:70},()=>[rnd(0,LW),rnd(0,LH*.5),rnd(.5,1.6),rnd(0,6)]);
  hills=[0,1].map(k=>Array.from({length:LW/10+1},(_,i)=>LH*(.42+k*.08)+40*Math.sin(i*.35+k*2+rnd(0,.3))+22*Math.sin(i*.9+k)));
}
const ground=x=>h[clamp(Math.round(x),0,LW)];
function slope(x){ return Math.atan2(ground(x+10)-ground(x-10),20); }
function makeTanks(){
  tanks=[{x:60,y:ground(60),vy:0,hp:100,max:100,ang:-Math.PI/4,pow:430,team:0},
         {x:LW-60,y:ground(LW-60),vy:0,hp:LV().hp,max:LV().hp,ang:-Math.PI*3/4,pow:430,team:1}];
}
function carve(ex,ey,R){ terDirty=true;
  for(let x=Math.floor(ex-R);x<=Math.ceil(ex+R);x++){ if(x<0||x>LW) continue; const dy=Math.sqrt(Math.max(0,R*R-(x-ex)*(x-ex))); const top=ey-dy, bot=ey+dy;
    if(h[x]<top) h[x]=Math.min(LH-8,h[x]+2*dy); else if(h[x]<bot) h[x]=Math.min(LH-8,bot); }
}

/* ---------- physics ---------- */
function muzzle(tk){ const by=tk.y-20; return [tk.x+Math.cos(tk.ang)*28, by+Math.sin(tk.ang)*28]; }
function fire(tk,w){
  const [mx,my]=muzzle(tk), sp=tk.pow;
  const list = w===1 ? [-.09,0,.09] : [0];
  for(const da of list) shots.push({x:mx,y:my,vx:Math.cos(tk.ang+da)*sp,vy:Math.sin(tk.ang+da)*sp,w,owner:tk.team,alive:true,age:0});
  if(w>0) ammo[w]--;
  for(let i=0;i<12;i++){ const a=tk.ang+rnd(-.4,.4),v=rnd(60,200); parts.push({x:mx,y:my,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:rnd(1.5,3),t:0,l:rnd(.2,.45),c:"#dff1ff"}); }
  for(let i=0;i<4;i++) smoke.push({x:mx,y:my,r:rnd(5,9),t:0,l:rnd(.8,1.3),vx:Math.cos(tk.ang)*30+rnd(-10,10),vy:-rnd(10,30)});
  shake=Math.max(shake,.25); state="fly"; updWeap();
}
function hitTank(x,y){ for(const tk of tanks){ if(Math.hypot(x-tk.x,y-(tk.y-14))<24) return tk; } return null; }
function explode(x,y,w,owner){
  const R=w===2?60:w===1?26:36, maxD=w===2?70:w===1?24:42;
  carve(x,y,R*.85);
  rings.push({x,y,r:R,t:0}); shake=Math.max(shake,w===2?1:.55);
  for(let i=0;i<(w===2?60:30);i++){ const a=rnd(Math.PI,2*Math.PI),v=rnd(120,420)*(w===2?1.3:1); parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:rnd(1.5,4),t:0,l:rnd(.6,1.3),c:Math.random()<.5?TH().debris:"#9fd0ff",g:1}); }
  for(let i=0;i<(w===2?14:8);i++) smoke.push({x:x+rnd(-R*.4,R*.4),y:y+rnd(-R*.3,0),r:rnd(10,22)*(w===2?1.4:1),t:0,l:rnd(1.2,2.2),vx:wind*.08+rnd(-12,12),vy:-rnd(14,40)});
  for(const tk of tanks){ const d=Math.hypot(x-tk.x,y-(tk.y-12)); if(d<R+24){ const dmg=Math.round(maxD*(1-clamp((d-8)/(R+24),0,1))); if(dmg>0){ tk.hp=Math.max(0,tk.hp-dmg); if(tk.hp<=0) destroy(tk); floats.push({x:tk.x,y:tk.y-50,txt:"-"+dmg,t:0,c:tk.team?"#ff9ab3":"#9fd0ff"}); if(owner===0&&tk.team===1) score+=dmg; } } }
  hud();
}
function destroy(tk){
  if(tk.dead) return; tk.dead=true; tk.deathT=t;
  // a chain of blasts, then the turret flies off and the wreck keeps burning
  [[0,0,1.25],[.22,-14,.8],[.45,12,.9],[.75,-4,1.5]].forEach(([at,dx,k])=>blasts.push({at:t+at,x:tk.x+dx,y:tk.y-14+rnd(-6,6),k}));
  flying.push({x:tk.x,y:tk.y-22,vx:rnd(-140,140)+(tk.team?-60:60),vy:-rnd(420,540),a:tk.ang,va:rnd(-9,9),team:tk.team,rest:false});
  shake=Math.max(shake,1.1);
}
function boom(x,y,k){
  rings.push({x,y,r:30*k,t:0}); shake=Math.max(shake,.6*k);
  for(let i=0;i<Math.round(34*k);i++){ const a=rnd(0,Math.PI*2),v=rnd(120,460)*k; parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-80,r:rnd(1.5,4.2),t:0,l:rnd(.6,1.4),c:i%3?"#9fd0ff":(i%2?"#eaf6ff":"#2a3a66"),g:1}); }
  for(let i=0;i<Math.round(9*k);i++) smoke.push({x:x+rnd(-14,14),y:y+rnd(-10,4),r:rnd(12,24)*k,t:0,l:rnd(1.6,2.8),vx:wind*.08+rnd(-14,14),vy:-rnd(20,46),dark:1});
}
function updateShots(dt){
  const sub=4, hstep=dt/sub;
  for(const s of shots){ if(!s.alive) continue;
    for(let k=0;k<sub;k++){ s.vx+=wind*hstep; s.vy+=G*hstep; s.x+=s.vx*hstep; s.y+=s.vy*hstep; s.age+=hstep;
      if(s.age>.08 && (s.y>=ground(s.x) || hitTank(s.x,s.y))){ s.alive=false; explode(s.x,Math.min(s.y,ground(s.x)+2),s.w,s.owner); break; }
      if(s.x<-80||s.x>LW+80||s.y>LH+40){ s.alive=false; floats.push({x:clamp(s.x,30,LW-30),y:LH*.35,txt:"Miss",t:0,c:"#c4d6f4"}); break; } }
    if(s.alive) trail.push({x:s.x,y:s.y,t:0});
  }
  shots=shots.filter(s=>s.alive);
}
function simulate(tk,ang,pow,tg){ tg=tg||tanks[0]; // AI preview of a shot
  let [x,y]=[tk.x+Math.cos(ang)*28, tk.y-20+Math.sin(ang)*28], vx=Math.cos(ang)*pow, vy=Math.sin(ang)*pow, a=0;
  for(let i=0;i<900;i++){ const d=1/120; vx+=wind*d; vy+=G*d; x+=vx*d; y+=vy*d; a+=d; if(a>.08&&(y>=ground(x)||(Math.hypot(x-tg.x,y-(tg.y-14))<24))) return [x,y]; if(x<-80||x>LW+80||y>LH+40) return [x,9999]; }
  return [x,y];
}
function planAI(){
  const me=tanks[1], foe=tanks[0]; let best=null;
  for(let deg=30;deg<=75;deg+=3){ const ang=-Math.PI+deg*Math.PI/180*-1; // pointing up-left
    const a=-(Math.PI-deg*Math.PI/180);
    for(let pow=220;pow<=820;pow+=12){ const [x,y]=simulate(me,a,pow); const e=Math.hypot(x-foe.x,(y===9999?400:y)-(foe.y-12)); if(!best||e<best.e) best={a,pow,e}; } }
  const err=Math.max(3.2, LV().err-turn*.2);
  let w=0; if(ammo2.ai[2]>0 && me.hp<me.max*.6 && Math.random()<.4) w=2; else if(ammo2.ai[1]>0 && Math.random()<.3) w=1;
  return {a:best.a+rnd(-err,err)*Math.PI/180, pow:best.pow+rnd(-err,err)*9, w};
}
const ammo2={ai:[Infinity,2,1]};
const LNAMES=["Training Grounds","Moonlit Hills","Windy Ridge","Crater Field","Twin Peaks","Storm Front","Glitch Outpost","Deep Valley","Night Siege","Night Core",
 "Frozen Gate","Ice Shelf","Snowdrift","Aurora Ridge","Frost Canyon","Blizzard Line","Glacier Pass","Crystal Caves","Polar Siege","Frost Core",
 "Static Plains","Pixel Dunes","Corrupted Ridge","Null Valley","Neon Ruins","Data Storm","Broken Grid","Void Peaks","Glitch Throne","Glitch Core"];
const WINDY=/Windy|Storm|Blizzard/;
const LEVELS=LNAMES.map((name,i)=>{ const d=i/29, k=i%10;
  return {name, hp:100, err:+(12.5-7*d-k*.12).toFixed(2), wind:+(.5+.8*d+(WINDY.test(name)?.45:0)).toFixed(2), hill:+(.75+.55*d+(k===4||k===7?.15:0)).toFixed(2),
    ai:[Infinity, Math.min(2,Math.floor((i+2)/5)), i<5?0:i<15?1:2]}; });
const CHAPTERS=[{name:"Moonlit Night"},{name:"Frost Lands"},{name:"Glitch Wastes"}];
const THEMES=[
 {sky:["#020617","#071a4d","#123a8c","#1d4fb0"], hills:["#081640","#0b1f52"], ter:["#22345f","#16244a","#0b1430"], line:"124,193,255", vein:"140,180,255", debris:"#2a3a66", moon:"#eaf4ff", glow:"220,238,255"},
 {sky:["#04121f","#0c3352","#1b6a92","#5fb3d6"], hills:["#14456a","#1b5680"], ter:["#4f86ad","#2c5c84","#163754"], line:"240,250,255", vein:"220,240,255", debris:"#9ec6e4", moon:"#ffffff", glow:"200,240,255", snow:true, aurora:true},
 {sky:["#05010f","#1d0838","#46126a","#8a1f6e"], hills:["#170631","#230b45"], ter:["#2a1048","#1a0933","#0a0318"], line:"255,92,200", vein:"120,230,255", debris:"#5a2a80", moon:"#ff5cc8", glow:"255,92,200", glitch:true}];
const CH=()=>Math.floor((level-1)/10), TH=()=>THEMES[CH()];
const DONEKEY="blumi-wars-done";
const LKEY="blumi-wars-level"; let lives=3, tab=0; const LV=()=>LEVELS[level-1];

/* ---------- drawing ---------- */
function sky(){
  if(skyDirty){ skyC.width=cv.width; skyC.height=cv.height; const c0=ctx; ctx=skyC.getContext('2d'); ctx.setTransform(DPR*S,0,0,DPR*S,0,0); skyStatic(); ctx=c0; skyDirty=false; }
  ctx.drawImage(skyC,0,0,skyC.width,skyC.height,-12,-12,LW+24,LH+24);
  const T=TH();
  for(const [x,y,r,p] of stars){ if(y>LH*.42) continue; ctx.globalAlpha=.25+.35*Math.sin(t*1.3+p); ctx.fillStyle=T.glitch?(p>3?"#7ce6ff":"#ff8ad8"):"#fff"; if(T.glitch) ctx.fillRect(x-r,y-r,r*2,r*2); else { ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); } } ctx.globalAlpha=1;
  if(T.aurora){ for(let k=0;k<3;k++){ ctx.beginPath(); for(let x=0;x<=LW;x+=10){ const y=70+k*34+18*Math.sin(x*.012+t*.35+k*1.7)+10*Math.sin(x*.031-t*.5+k); x?ctx.lineTo(x,y):ctx.moveTo(x,y); } ctx.strokeStyle=`rgba(${k===1?"120,255,220":"110,200,255"},${.12+.06*Math.sin(t*.8+k)})`; ctx.lineWidth=26-k*6; ctx.stroke(); } }
  if(T.snow){ ctx.fillStyle="rgba(255,255,255,.8)"; for(let i=0;i<70;i++){ const sp=18+(i*37)%30, x=((i*97)+t*(8+i%5*3)+Math.sin(t*.9+i)*12)%(LW+20)-10, y=((i*53)+t*sp)%(LH+20)-10; ctx.globalAlpha=.35+(i%4)*.15; ctx.beginPath(); ctx.arc(x,y,1+(i%3)*.6,0,7); ctx.fill(); } ctx.globalAlpha=1; }
  if(T.glitch){ const q=Math.floor(t*7); for(let i=0;i<3;i++){ const r=Math.sin(q*12.9898+i*78.233)*43758.5453, f=r-Math.floor(r); if(f<.55) continue; const y=(f*9301%1)*LH*.55, hh=2+f*6; ctx.fillStyle=i%2?"rgba(120,230,255,.18)":"rgba(255,92,200,.2)"; ctx.fillRect(-12,y,LW+24,hh); } }
}
function skyStatic(){
  const T=TH(); const g=ctx.createLinearGradient(0,0,0,LH); g.addColorStop(0,T.sky[0]); g.addColorStop(.45,T.sky[1]); g.addColorStop(.75,T.sky[2]); g.addColorStop(1,T.sky[3]); ctx.fillStyle=g; ctx.fillRect(0,0,LW,LH);
  const mx=400,my=T.glitch?140:110, mr=T.glitch?46:24;
  const mg=ctx.createRadialGradient(mx,my,0,mx,my,mr*4.5); mg.addColorStop(0,`rgba(${T.glow},.5)`); mg.addColorStop(1,`rgba(${T.glow},0)`); ctx.fillStyle=mg; ctx.beginPath(); ctx.arc(mx,my,mr*4.5,0,7); ctx.fill();
  if(T.glitch){ // sliced neon sun
    ctx.save(); ctx.beginPath(); ctx.arc(mx,my,mr,0,7); ctx.clip(); const sg=ctx.createLinearGradient(0,my-mr,0,my+mr); sg.addColorStop(0,"#ff8ad8"); sg.addColorStop(1,"#7a3cff"); ctx.fillStyle=sg; ctx.fillRect(mx-mr,my-mr,mr*2,mr*2);
    ctx.fillStyle=T.sky[2]; for(let i=0;i<6;i++){ const y=my+4+i*7; ctx.fillRect(mx-mr,y,mr*2,1.5+i*.9); } ctx.restore();
  } else { ctx.fillStyle=T.moon; ctx.beginPath(); ctx.arc(mx,my,mr,0,7); ctx.fill(); ctx.fillStyle="rgba(150,180,230,.35)"; ctx.beginPath(); ctx.arc(393,104,5,0,7); ctx.arc(409,118,3.5,0,7); ctx.fill(); }
  hills.forEach((row,k)=>{ ctx.fillStyle=T.hills[k]; ctx.beginPath(); ctx.moveTo(0,LH); row.forEach((y,i)=>ctx.lineTo(i*10,y)); ctx.lineTo(LW,LH); ctx.fill();
    if(T.snow){ ctx.strokeStyle=`rgba(235,248,255,${.25+k*.15})`; ctx.lineWidth=2; ctx.beginPath(); row.forEach((y,i)=>i?ctx.lineTo(i*10,y):ctx.moveTo(0,y)); ctx.stroke(); }
    if(T.glitch){ ctx.strokeStyle=`rgba(255,92,200,${.2+k*.15})`; ctx.lineWidth=1.4; ctx.beginPath(); row.forEach((y,i)=>i?ctx.lineTo(i*10,y):ctx.moveTo(0,y)); ctx.stroke(); } });
}
function terrain(){
  if(terDirty){ terC.width=cv.width; terC.height=cv.height; const c0=ctx; ctx=terC.getContext('2d'); ctx.setTransform(DPR*S,0,0,DPR*S,0,0); terrainStatic(); ctx=c0; terDirty=false; }
  ctx.drawImage(terC,0,0,terC.width,terC.height,0,0,LW,LH);
}
function terrainStatic(){
  const T=TH();
  ctx.beginPath(); ctx.moveTo(0,LH); for(let x=0;x<=LW;x+=2) ctx.lineTo(x,h[x]); ctx.lineTo(LW,LH); ctx.closePath();
  const g=ctx.createLinearGradient(0,LH*.35,0,LH); g.addColorStop(0,T.ter[0]); g.addColorStop(.5,T.ter[1]); g.addColorStop(1,T.ter[2]); ctx.fillStyle=g; ctx.fill();
  ctx.save(); ctx.clip();
  if(T.glitch){ ctx.strokeStyle="rgba(120,230,255,.12)"; ctx.lineWidth=1; for(let y=LH*.35;y<LH;y+=18){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(LW,y); ctx.stroke(); } for(let x=0;x<=LW;x+=26){ ctx.beginPath(); ctx.moveTo(x,LH*.35); ctx.lineTo(x,LH); ctx.stroke(); } }
  else for(let k=1;k<9;k++){ ctx.strokeStyle=`rgba(${T.vein},${.05-k*.004})`; ctx.lineWidth=1.2; ctx.beginPath(); for(let x=0;x<=LW;x+=4) ctx.lineTo(x,h[x]+k*16+4*Math.sin(x*.05+k)); ctx.stroke(); }
  for(let i=0;i<90;i++){ const x=(i*67)%LW, y=h[x]+12+((i*131)%220); ctx.fillStyle=T.snow?"rgba(255,255,255,.12)":"rgba(10,20,50,.5)"; ctx.beginPath(); ctx.arc(x,y,1.5+(i%3),0,7); ctx.fill(); }
  ctx.restore();
  if(T.snow){ ctx.beginPath(); for(let x=0;x<=LW;x+=2) ctx.lineTo(x,h[x]+1); for(let x=LW;x>=0;x-=2) ctx.lineTo(x,h[x]+6+2.5*Math.sin(x*.09)); ctx.closePath(); ctx.fillStyle="rgba(245,252,255,.95)"; ctx.fill(); }
  ctx.beginPath(); for(let x=0;x<=LW;x+=2) ctx.lineTo(x,h[x]); ctx.strokeStyle=`rgba(${T.line},.85)`; ctx.lineWidth=2.2; ctx.stroke();
  ctx.strokeStyle=`rgba(${T.line},.18)`; ctx.lineWidth=7; ctx.stroke();
}
function tank(tk){
  const tilt=slope(tk.x)*.9, blue=tk.team===0, dead=tk.hp<=0;
  ctx.save(); ctx.translate(tk.x,tk.y); ctx.rotate(tilt); ctx.scale(1.18,1.18);
  ctx.fillStyle="rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(0,1,26,5,0,0,7); ctx.fill();
  // barrel
  if(!dead){ ctx.save(); ctx.translate(0,-20); ctx.rotate(tk.ang-tilt); const bg=ctx.createLinearGradient(0,-3,0,3); bg.addColorStop(0,blue?"#bfe2ff":"#5a5f80"); bg.addColorStop(1,blue?"#2f7bff":"#1a1f3d");
  ctx.fillStyle=bg; ctx.beginPath(); ctx.roundRect?ctx.roundRect(0,-3,28,6,3):ctx.rect(0,-3,28,6); ctx.fill(); ctx.fillStyle=blue?"#0a5cff":"#ff6b8b"; ctx.fillRect(24,-3.5,5,7); ctx.restore(); }
  // treads
  ctx.fillStyle=dead?"#05070f":"#0a1228"; ctx.beginPath(); ctx.roundRect?ctx.roundRect(-24,-11,48,12,6):ctx.rect(-24,-11,48,12); ctx.fill();
  ctx.fillStyle=dead?"#181c28":"#2a3760"; for(let i=-18;i<=18;i+=9){ ctx.beginPath(); ctx.arc(i,-5,3.6,0,7); ctx.fill(); }
  ctx.strokeStyle="rgba(255,255,255,.12)"; ctx.lineWidth=1; for(let i=-22;i<=22;i+=4){ ctx.beginPath(); ctx.moveTo(i+((t*20*(tk.moving||0))%4),-11); ctx.lineTo(i+((t*20*(tk.moving||0))%4),-9); ctx.stroke(); }
  // hull
  const hg=ctx.createLinearGradient(0,-24,0,-10); hg.addColorStop(0,dead?"#2b303f":(blue?"#5fb4ff":"#3a3f60")); hg.addColorStop(1,dead?"#0c0f18":(blue?"#0a5cff":"#141830"));
  ctx.fillStyle=hg; ctx.beginPath(); ctx.moveTo(-21,-11); ctx.lineTo(-17,-22); ctx.lineTo(17,-22); ctx.lineTo(22,-11); ctx.closePath(); ctx.fill();
  if(!dead){ ctx.fillStyle=blue?"rgba(255,255,255,.35)":"rgba(255,107,139,.6)"; ctx.fillRect(-15,-21,30,2); } else { ctx.fillStyle="rgba(0,0,0,.45)"; ctx.beginPath(); ctx.ellipse(-6,-16,7,3,.3,0,7); ctx.ellipse(8,-14,5,2.4,-.2,0,7); ctx.fill(); }
  // turret dome
  if(!dead){
  const dg=ctx.createRadialGradient(-4,-27,1,0,-22,12); dg.addColorStop(0,blue?"#e6f4ff":"#6a6f90"); dg.addColorStop(1,blue?"#2f7bff":"#1a1f3d");
  ctx.fillStyle=dg; ctx.beginPath(); ctx.arc(0,-21,11,Math.PI,0); ctx.fill();
  if(blue){ const e=13, ex=-e/2, ey=-24-e/2; ctx.beginPath(); ctx.roundRect?ctx.roundRect(ex,ey,e,e,e*.28):ctx.rect(ex,ey,e,e); ctx.fillStyle='#2f7bff'; ctx.fill(); if(mascot.complete&&mascot.naturalWidth){ ctx.save(); ctx.beginPath(); ctx.roundRect?ctx.roundRect(ex,ey,e,e,e*.28):ctx.rect(ex,ey,e,e); ctx.clip(); ctx.drawImage(mascot,ex,ey,e,e); ctx.restore(); } ctx.strokeStyle='rgba(255,255,255,.6)'; ctx.lineWidth=.8; ctx.beginPath(); ctx.roundRect?ctx.roundRect(ex+.4,ey+.4,e-.8,e-.8,e*.28):ctx.rect(ex,ey,e,e); ctx.stroke(); }
  else { ctx.save(); ctx.translate(0,-25); ctx.rotate(t*2); ctx.fillStyle="#ff6b8b"; ctx.beginPath(); for(let i=0;i<10;i++){const a=i/10*Math.PI*2,q=i%2?3:6; ctx.lineTo(Math.cos(a)*q,Math.sin(a)*q);} ctx.fill(); ctx.restore(); }
  }
  if(dead){ const f=.5+.5*Math.sin(t*23+tk.x)*Math.sin(t*9); const fg=ctx.createRadialGradient(0,-16,0,0,-16,26); fg.addColorStop(0,`rgba(190,225,255,${.35+.3*f})`); fg.addColorStop(1,'rgba(60,120,255,0)'); ctx.fillStyle=fg; ctx.beginPath(); ctx.arc(0,-16,26,0,7); ctx.fill(); }
  ctx.restore();
}
function shellDraw(s){ const a=Math.atan2(s.vy,s.vx); const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,14); g.addColorStop(0,"rgba(160,215,255,.75)"); g.addColorStop(1,"rgba(160,215,255,0)"); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(s.x,s.y,14,0,7); ctx.fill();
  ctx.save(); ctx.translate(s.x,s.y); ctx.rotate(a+Math.PI/2); const r=s.w===2?7:4.5; ctx.fillStyle="#eaf6ff"; ctx.beginPath(); ctx.moveTo(0,-r*1.7); ctx.bezierCurveTo(r,-r*.4,r,r,0,r); ctx.bezierCurveTo(-r,r,-r,-r*.4,0,-r*1.7); ctx.fill(); ctx.restore(); }
function aimGuide(){
  const tk=tanks[0]; let [x,y]=muzzle(tk), vx=Math.cos(tk.ang)*tk.pow, vy=Math.sin(tk.ang)*tk.pow;
  ctx.fillStyle="rgba(200,230,255,.85)";
  for(let i=0;i<34;i++){ const d=1/60; for(let k=0;k<2;k++){ vx+=wind*d/2; vy+=G*d/2; x+=vx*d/2; y+=vy*d/2; } if(i%2===0&&i>1){ ctx.globalAlpha=1-i/34; ctx.beginPath(); ctx.arc(x,y,2.2,0,7); ctx.fill(); } }
  ctx.globalAlpha=1;
}
function render(){
  ctx.setTransform(DPR*S,0,0,DPR*S,0,0);
  const sh=shake*shake, sx=sh*(Math.sin(t*31)*.6+Math.sin(t*53+1.3)*.4)*9, sy=sh*(Math.cos(t*27)*.6+Math.sin(t*47+.7)*.4)*7; ctx.translate(sx,sy);
  sky(); terrain();
  for(const s of smoke){ const k=s.t/s.l; ctx.fillStyle=s.dark?`rgba(40,50,80,${(1-k)*.45})`:`rgba(170,190,230,${(1-k)*.22})`; ctx.beginPath(); ctx.arc(s.x,s.y,s.r*(1+k*1.4),0,7); ctx.fill(); }
  for(const tr of trail){ ctx.fillStyle=`rgba(160,215,255,${.5*(1-tr.t/.6)})`; ctx.beginPath(); ctx.arc(tr.x,tr.y,2*(1-tr.t/.6)+.5,0,7); ctx.fill(); }
  tanks.forEach(tank);
  for(const f of flying){ ctx.save(); ctx.translate(f.x,f.y); ctx.rotate(f.rot||0); ctx.scale(1.18,1.18);
    ctx.fillStyle=f.team?"#2a2f4f":"#1f4fb8"; ctx.beginPath(); ctx.arc(0,0,11,Math.PI,0); ctx.fill(); ctx.fillStyle=f.team?"#14182e":"#0d2c70"; ctx.fillRect(0,-3,28,6); ctx.restore(); }
  if(state==="aim") aimGuide();
  shots.forEach(shellDraw);
  for(const r of rings){ const k=r.t/.55; const g=ctx.createRadialGradient(r.x,r.y,0,r.x,r.y,r.r*(1+k)); g.addColorStop(0,`rgba(235,246,255,${(1-k)*.95})`); g.addColorStop(.4,`rgba(120,190,255,${(1-k)*.6})`); g.addColorStop(1,"rgba(40,100,255,0)");
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(r.x,r.y,r.r*(1+k),0,7); ctx.fill(); ctx.strokeStyle=`rgba(200,230,255,${(1-k)*.8})`; ctx.lineWidth=3*(1-k)+.5; ctx.beginPath(); ctx.arc(r.x,r.y,r.r*(.6+k*1.6),0,7); ctx.stroke(); }
  for(const p of parts){ const k=p.t/p.l; ctx.globalAlpha=1-k; ctx.fillStyle=p.c; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fill(); } ctx.globalAlpha=1;
  for(const f of floats){ const k=f.t/1.1; ctx.globalAlpha=1-k; ctx.fillStyle=f.c; ctx.font="800 18px Unbounded,sans-serif"; ctx.textAlign="center"; ctx.fillText(f.txt,f.x,f.y-k*40); } ctx.globalAlpha=1;
}

/* ---------- flow ---------- */
function hud(){
  $("hpA").style.width=(tanks[0]?tanks[0].hp/tanks[0].max*100:100)+"%"; $("hpB").style.width=(tanks[1]?tanks[1].hp/tanks[1].max*100:100)+"%";
  $("wind").textContent=(wind===0?"0":(wind>0?"→ ":"← ")+Math.abs(Math.round(wind/10))); $("lvl").textContent="Level "+level+"/"+LEVELS.length; $("lives").innerHTML="♥".repeat(Math.max(0,lives))+'<span style="opacity:.3">'+"♥".repeat(Math.max(0,3-lives))+"</span>";
}
function updWeap(){ card.querySelectorAll(".wb").forEach(b=>{ const w=+b.dataset.w; b.classList.toggle("on",w===weapon); b.disabled=state!=="aim"||ammo[w]<=0; }); $("am1").textContent="x"+ammo[1]; $("am2").textContent="x"+ammo[2]; }
function banner(txt){ const el=$("turn"); el.textContent=txt; el.style.opacity=1; clearTimeout(banner.t); banner.t=setTimeout(()=>el.style.opacity=0,1300); }
function newWind(){ wind=Math.round(rnd(-1,1)*60*LV().wind); }
function unlocked(){ return clamp(store.get(LKEY)||1,1,LEVELS.length); }
function startBattle(lv){
  level=lv;
  genTerrain(); skyDirty=terDirty=true; makeTanks(); shots=[]; parts=[]; smoke=[]; rings=[]; floats=[]; trail=[]; blasts=[]; flying=[];
  ammo=[Infinity,2,3]; ammo2.ai=LV().ai.slice(); weapon=0; turn=0; newWind(); state="aim"; hud(); updWeap(); $("ov").classList.add("hide"); banner((level%10===1&&level>1?"NEW WORLD · ":"")+"LEVEL "+level+" · "+LV().name.toUpperCase());
}
function showMenu(){
  state="menu"; $("ovT").textContent="Drop Wars"; $("ovS").style.display="none";
  const done=store.get(DONEKEY)>0;
  $("ovP").textContent=done?"All 30 levels cleared. Replay any level, or reset and climb again.":"Beat each level to unlock the next one. You have "+lives+" "+(lives===1?"life":"lives")+" for this run.";
  tab=Math.floor((unlocked()-1)/10); levelGrid(); $("ovB").textContent="Play level "+unlocked(); $("ovB").onclick=()=>startBattle(unlocked());
  $("ovR").hidden=!done; $("ovR").onclick=e=>{ e.stopPropagation(); store.set(LKEY,1); store.set(DONEKEY,0); lives=3; score=0; showMenu(); };
  $("ov").classList.remove("hide");
}
function levelGrid(){
  const g=$("lvGrid"), tb=$("chTabs"), u=unlocked(); g.innerHTML=""; tb.innerHTML="";
  CHAPTERS.forEach((C,ci)=>{ const b=document.createElement("button"); b.type="button"; b.className="ch"+(ci===tab?" on":""); b.disabled=ci*10+1>u; b.innerHTML='<span>'+(ci*10+1)+"–"+(ci*10+10)+'</span> '+C.name.split(" ")[0];
    b.title=C.name; b.onclick=e=>{ e.stopPropagation(); tab=ci; levelGrid(); }; tb.appendChild(b); });
  for(let n=tab*10+1;n<=tab*10+10;n++){ const L=LEVELS[n-1], b=document.createElement("button"); b.type="button"; b.className="lv"+(n<=u?"":" locked")+(n<u||store.get(DONEKEY)>0?" done":""); b.disabled=n>u;
    b.innerHTML=n>u?'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>':String(n);
    b.title=n+" · "+L.name; b.setAttribute("aria-label","Level "+n+(n>u?" (locked)":""));
    b.onclick=e=>{ e.stopPropagation(); if(n<=u) startBattle(n); }; g.appendChild(b); }
}
function nextTurn(){
  if(tanks[1].hp<=0){ state="won"; score+=250*level; const last=level>=LEVELS.length; if(!last) store.set(LKEY,Math.max(unlocked(),level+1)); else store.set(DONEKEY,1); const best=store.get(KEY); if(score>best) store.set(KEY,score);
    setTimeout(()=>{ if(state!=="won") return; $("ovS").style.display="block"; $("ovS").textContent=score.toLocaleString("en-US");
      $("ovR").hidden=!last; $("ovR").onclick=e=>{ e.stopPropagation(); store.set(LKEY,1); store.set(DONEKEY,0); lives=3; score=0; showMenu(); };
      if(last){ $("ovT").textContent="All 30 levels cleared"; $("ovP").textContent="The Glitch Core is down. BLUMI rules every world. Reset to start again from level 1."; $("ovB").textContent="Back to levels"; $("ovB").onclick=()=>{ lives=3; score=0; showMenu(); }; }
      else if(level%10===0){ const nc=CHAPTERS[level/10]; $("ovT").textContent="World "+(level/10)+" cleared"; $("ovP").textContent="New world unlocked: "+nc.name+". Level "+(level+1)+" · "+LEVELS[level].name+"."; $("ovB").textContent="Enter "+nc.name; $("ovB").onclick=()=>startBattle(level+1); }
      else { $("ovT").textContent="Level "+level+" cleared"; $("ovP").textContent="Level "+(level+1)+" · "+LEVELS[level].name+" is unlocked."; $("ovB").textContent="Next level"; $("ovB").onclick=()=>startBattle(level+1); }
      tab=CH(); if(last) tab=2; else if(level%10===0) tab=Math.floor(level/10); levelGrid(); $("ov").classList.remove("hide"); },2600); return; }
  if(tanks[0].hp<=0){ state="lost"; lives--; hud();
    setTimeout(()=>{ if(state!=="lost") return; $("ovS").style.display="block"; $("ovS").textContent=score.toLocaleString("en-US");
      $("ovR").hidden=true; if(lives>0){ $("ovT").textContent="Tank destroyed"; $("ovP").textContent=lives+" "+(lives===1?"life":"lives")+" left. Try level "+level+" again."; $("ovB").textContent="Retry level "+level; $("ovB").onclick=()=>startBattle(level); }
      else { const best=store.get(KEY); if(score>best) store.set(KEY,score); $("ovT").textContent="Game over"; $("ovP").textContent=(score>best&&score>0?"New best score! ":"Best: "+Math.max(best,score).toLocaleString("en-US")+". ")+"Your unlocked levels are saved."; $("ovB").textContent="New run"; $("ovB").onclick=()=>{ lives=3; score=0; showMenu(); }; }
      levelGrid(); $("ov").classList.remove("hide"); },2600); return; }
  turn++; newWind(); hud();
  if(turn%2===1){ state="ai"; aiPlan=planAI(); wait=1.1; banner("GLITCH IS AIMING"); }
  else { state="aim"; banner("YOUR TURN"); }
  updWeap();
}

card.querySelectorAll(".wb").forEach(b=>b.addEventListener("click",e=>{ e.stopPropagation(); const w=+b.dataset.w; if(state==="aim"&&ammo[w]>0){ weapon=w; updWeap(); } }));
// aiming: drag direction = shot direction, drag length = power
const pt=e=>{ const r=cv.getBoundingClientRect(); return [(e.clientX-r.left)/S,(e.clientY-r.top)/S]; };
const aimT={a:-Math.PI/4,p:430};
cv.addEventListener("pointerdown",e=>{ if(state!=="aim") return; aimT.a=tanks[0].ang; aimT.p=tanks[0].pow; e.preventDefault(); try{cv.setPointerCapture(e.pointerId)}catch(_){} aim={s:pt(e),a0:tanks[0].ang,p0:tanks[0].pow,moved:false}; });
cv.addEventListener("pointermove",e=>{ if(state!=="aim"||!aim) return; const [x,y]=pt(e), dx=x-aim.s[0], dy=y-aim.s[1], L=Math.hypot(dx,dy); if(L<8) return; aim.moved=true;
  aimT.a=clamp(Math.atan2(dy,dx),-Math.PI+.05,-.05); aimT.p=clamp(180+L*3.2,180,820); });
cv.addEventListener("pointerup",()=>{ if(state==="aim"&&aim&&aim.moved){ tanks[0].ang=aimT.a; tanks[0].pow=aimT.p; fire(tanks[0],weapon); } aim=null; });
const keys={}; addEventListener("keydown",e=>{ if(!active||state!=="aim") return; if(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName)) return; if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," "].includes(e.key)) e.preventDefault(); keys[e.key]=1; if(e.key===" ") fire(tanks[0],weapon); });
addEventListener("keyup",e=>{ keys[e.key]=0; });

let last=0;
function loop(ts){ if(!active){ raf=0; return; } const dt=Math.min(.033,(ts-last)/1000||0); last=ts; t+=dt;
  if(state==="aim"&&aim&&aim.moved){ const tk=tanks[0]; tk.ang+=(aimT.a-tk.ang)*Math.min(1,dt*20); tk.pow+=(aimT.p-tk.pow)*Math.min(1,dt*20); }
  if(state==="aim"){ const tk=tanks[0]; if(keys.ArrowLeft) tk.ang=clamp(tk.ang-1.2*dt,-Math.PI+.05,-.05); if(keys.ArrowRight) tk.ang=clamp(tk.ang+1.2*dt,-Math.PI+.05,-.05); if(keys.ArrowUp) tk.pow=clamp(tk.pow+260*dt,180,820); if(keys.ArrowDown) tk.pow=clamp(tk.pow-260*dt,180,820); }
  if(state==="ai"){ const me=tanks[1]; me.ang+=(aiPlan.a-me.ang)*Math.min(1,dt*4); me.pow+=(aiPlan.pow-me.pow)*Math.min(1,dt*4); wait-=dt; if(wait<=0){ me.ang=aiPlan.a; me.pow=aiPlan.pow; const w=aiPlan.w; if(w>0) ammo2.ai[w]--; const [mx,my]=muzzle(me); for(const da of (w===1?[-.09,0,.09]:[0])) shots.push({x:mx,y:my,vx:Math.cos(me.ang+da)*me.pow,vy:Math.sin(me.ang+da)*me.pow,w,owner:1,alive:true,age:0}); shake=Math.max(shake,.25); state="fly"; } }
  if(state==="fly"||state==="settle"){ updateShots(dt); if(shots.length===0&&state==="fly"){ state="settle"; wait=.9; } }
  // tanks fall onto the ground after craters
  for(const tk of tanks){ const g=ground(tk.x); if(tk.y<g-.5){ tk.vy+=G*1.2*dt; tk.y=Math.min(g,tk.y+tk.vy*dt); if(tk.y>=g){ if(tk.vy>240){ const d=Math.round((tk.vy-240)/18); tk.hp=Math.max(0,tk.hp-d); if(tk.hp<=0) destroy(tk); if(d>0) floats.push({x:tk.x,y:tk.y-50,txt:"-"+d,t:0,c:"#c4d6f4"}); hud(); } tk.vy=0; } } else { tk.y=g; tk.vy=0; } }
  if(state==="settle"){ wait-=dt; if(wait<=0&&!tanks.some(tk=>tk.y<ground(tk.x)-.5)) nextTurn(); }
  for(const b of blasts){ if(!b.done&&t>=b.at){ b.done=true; boom(b.x,b.y,b.k); } } blasts=blasts.filter(b=>!b.done);
  for(const f of flying){ if(f.rest) continue; f.vy+=G*dt; f.x+=f.vx*dt; f.y+=f.vy*dt; f.rot=(f.rot||0)+f.va*dt; if(f.y>ground(f.x)-6){ f.y=ground(f.x)-6; if(Math.abs(f.vy)>120){ f.vy*=-.35; f.vx*=.55; f.va*=.5; } else { f.vy=0; f.vx*=.8; if(Math.abs(f.vx)<5){ f.rest=true; } } } }
  for(const tk of tanks){ if(tk.dead && Math.random()<dt*14) smoke.push({x:tk.x+rnd(-10,10),y:tk.y-22,r:rnd(7,13),t:0,l:rnd(1.6,2.6),vx:wind*.1+rnd(-6,6),vy:-rnd(26,46),dark:1}); }
  for(const p of parts){ p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=(p.g?G:200)*dt; if(p.g&&p.y>ground(p.x)){ p.y=ground(p.x); p.vy*=-.3; p.vx*=.6; } } parts=parts.filter(p=>p.t<p.l);
  for(const s of smoke){ s.t+=dt; s.x+=s.vx*dt; s.y+=s.vy*dt; } smoke=smoke.filter(s=>s.t<s.l);
  for(const r of rings) r.t+=dt; rings=rings.filter(r=>r.t<.55);
  for(const tr of trail) tr.t+=dt; trail=trail.filter(tr=>tr.t<.6);
  for(const f of floats) f.t+=dt; floats=floats.filter(f=>f.t<1.1);
  shake=Math.max(0,shake-dt*1.6);
  render(); raf=requestAnimationFrame(loop); }
addEventListener("resize",()=>{ if(active) resize(); });
level=1; genTerrain(); skyDirty=terDirty=true; makeTanks(); hud(); updWeap(); showMenu();
new IntersectionObserver(([en])=>{ if(!active) return; if(en.isIntersecting){ if(!raf){ last=0; raf=requestAnimationFrame(loop); } } else { cancelAnimationFrame(raf); raf=0; } }).observe(card);
window.BlumiWars={ show(){ active=true; resize(); if(!raf){ last=0; raf=requestAnimationFrame(loop); } }, hide(){ active=false; cancelAnimationFrame(raf); raf=0; aim=null; } };
window.__wars={get state(){return state},get tanks(){return tanks},fire:(a,p)=>{tanks[0].ang=a;tanks[0].pow=p;aimT.a=a;aimT.p=p;fire(tanks[0],weapon)},setWeapon:w=>{weapon=w}};
})();
