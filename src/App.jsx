import { useState, useEffect, useRef } from "react";

const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

const CELLS = [
  {
    idx: 0, name: "Blog Writer", sub: "AUTO", color: "#ff8855",
    wA: "rgba(200,184,154,0.18)", wB: "rgba(168,144,112,0.15)",
    fl: "rgba(139,111,71,0.22)", fl2: "rgba(122,96,64,0.3)",
    rug: "rgba(26,58,107,0.45)", rug2: "rgba(14,36,72,0.5)",
    trim: "#d4af6a", sofa: "rgba(139,58,42,0.5)", frame: "rgba(107,76,42,0.6)",
    systemPrompt: "You are the Blog Writer AI for Anthony's Money OS. You write complete SEO-optimized blog posts that rank on Google and earn affiliate commissions. When Anthony gives you a niche, keyword, and affiliate program, write a full 1200-word blog post with: a compelling headline, engaging intro, 4-5 sections with subheadings, affiliate product recommendations naturally embedded, and a strong CTA. Tell Anthony exactly where to publish and which links to insert. Be specific and make it copy-paste ready.",
    inputLabel: "Your niche, target keyword, and affiliate program",
    inputPlaceholder: "e.g. Budget laptops, best budget laptops 2026, Amazon Associates",
    description: "Writes full SEO articles with affiliate links. Post and earn commissions 24/7.",
  },
  {
    idx: 1, name: "Video Factory", sub: "ACTIVE", color: "#cc55ff",
    wA: "rgba(154,136,192,0.18)", wB: "rgba(122,104,160,0.15)",
    fl: "rgba(90,72,112,0.22)", fl2: "rgba(74,56,96,0.3)",
    rug: "rgba(45,26,74,0.45)", rug2: "rgba(30,16,53,0.5)",
    trim: "#c090ff", sofa: "rgba(74,40,120,0.5)", frame: "rgba(58,24,104,0.6)",
    systemPrompt: "You are the Video Factory AI for Anthony's Money OS. You write viral faceless YouTube video scripts that earn AdSense and affiliate income. When Anthony gives you a topic and audience, write a complete script with: a powerful 5-second hook, engaging narration in clear sections, smooth transitions, and a strong CTA with affiliate mention. Also suggest the video title, thumbnail text, and best tags. Make it ready to paste into ElevenLabs for voiceover.",
    inputLabel: "Video topic, target audience, and desired length",
    inputPlaceholder: "e.g. Top 5 AI tools for students, college students, 8 minutes",
    description: "Writes faceless YouTube scripts. Record with AI voice, post, earn AdSense.",
  },
  {
    idx: 2, name: "Newsletter HQ", sub: "ACTIVE", color: "#00dd88",
    wA: "rgba(122,170,138,0.18)", wB: "rgba(90,136,104,0.15)",
    fl: "rgba(58,96,80,0.22)", fl2: "rgba(44,78,64,0.3)",
    rug: "rgba(10,56,40,0.45)", rug2: "rgba(6,34,24,0.5)",
    trim: "#44ffaa", sofa: "rgba(26,90,64,0.5)", frame: "rgba(10,56,40,0.6)",
    systemPrompt: "You are the Newsletter HQ AI for Anthony's Money OS. You write engaging weekly email newsletters that grow audiences and earn sponsorship and affiliate income. When Anthony gives you a niche and topic, write a complete newsletter with: a catchy subject line, warm personal opener, 400-600 words of valuable content, a product recommendation with affiliate context, and a friendly sign-off. Make it feel human and conversational. Also tell Anthony the best time to send it and how to grow his list.",
    inputLabel: "Your newsletter niche and this week's topic",
    inputPlaceholder: "e.g. AI tools niche, Top 3 free AI tools that save hours every week",
    description: "Writes weekly emails. Grow your list, charge sponsors, earn affiliate income.",
  },
  {
    idx: 3, name: "Website Builder", sub: "ACTIVE", color: "#00ccff",
    wA: "rgba(122,154,184,0.18)", wB: "rgba(90,120,152,0.15)",
    fl: "rgba(48,72,88,0.22)", fl2: "rgba(36,56,72,0.3)",
    rug: "rgba(10,40,64,0.45)", rug2: "rgba(6,26,42,0.5)",
    trim: "#44ddff", sofa: "rgba(26,64,96,0.5)", frame: "rgba(10,40,72,0.6)",
    systemPrompt: "You are the Website Builder AI for Anthony's Money OS. You design complete affiliate websites that generate passive income. When Anthony gives you a niche or business idea, provide: a full site structure with all pages listed, complete homepage copy, about page copy, top 5 affiliate products to promote with why they convert, SEO strategy for the first 90 days, and step-by-step instructions to set it up free on WordPress or Carrd. Make it specific and actionable.",
    inputLabel: "Your website niche or business idea",
    inputPlaceholder: "e.g. Budget home office setups for remote workers",
    description: "Builds complete affiliate sites. Drive traffic and earn commissions passively.",
  },
  {
    idx: 4, name: "Peter Trade Bot", sub: "SIGNAL", color: "#ffcc00",
    wA: "rgba(200,184,122,0.18)", wB: "rgba(168,152,88,0.15)",
    fl: "rgba(139,112,64,0.22)", fl2: "rgba(122,96,48,0.3)",
    rug: "rgba(58,40,0,0.45)", rug2: "rgba(38,28,0,0.5)",
    trim: "#ffe066", sofa: "rgba(106,72,0,0.5)", frame: "rgba(74,48,0,0.6)",
    systemPrompt: "You are Peter, Anthony's personal AI swing trading analyst. You analyze US equity options for swing trades 2-10 day holds. When Anthony gives you a ticker and market conditions, run your full 10-factor analysis: trend alignment 20pt, volume confirmation 20pt, news sentiment 15pt, RSI+MACD 15pt, risk/reward 15pt, no catalyst landmines 10pt, IV environment 5pt. Only present trades scoring 80+. Give position size based on 300 dollar account. Always state bull case, bear case, entry, stop loss, and target. Address Anthony by name. Never force a trade.",
    inputLabel: "Ticker to analyze and current market conditions",
    inputPlaceholder: "e.g. NVDA - market is bullish, SPY above 50 EMA, VIX at 16",
    description: "Generates swing trade signals with full analysis. You approve or skip.",
    isPeter: true,
  },
];

const SECTORS = [
  { id: "pnl", label: "P&L Tracker", icon: "💰", color: "#a855f7", angle: 0, desc: "Total earned across all cells. Log income and track milestones." },
  { id: "knowledge", label: "Knowledge Base", icon: "🧠", color: "#ff8855", angle: 51.4, desc: "What each cell has learned. Best topics, niches, and strategies." },
  { id: "briefing", label: "Daily Briefing", icon: "📋", color: "#00dd88", angle: 102.8, desc: "Today's top priority per cell. What to focus on right now." },
  { id: "memory", label: "Cell Memory", icon: "💾", color: "#00ccff", angle: 154.2, desc: "Every output ever produced. Full history log per cell." },
  { id: "radar", label: "Opportunity Radar", icon: "📡", color: "#ffcc00", angle: 205.6, desc: "Trending topics and market signals. What to act on today." },
  { id: "improvement", label: "Improvement Log", icon: "📈", color: "#ff3d8a", angle: 257, desc: "What the brain has changed. Patterns getting better over time." },
  { id: "status", label: "System Status", icon: "⚡", color: "#ffffff", angle: 308.4, desc: "All 5 cells live status. Run counts and last active times." },
];

const S = 2, CW = 150, CH = 120, RW = 44, RD = 34, RH = 14;

function hx(h) { return { r: parseInt(h.slice(1,3),16), g: parseInt(h.slice(3,5),16), b: parseInt(h.slice(5,7),16) }; }
function rga(h, a) { if (h.startsWith("rgba")) return h; const {r,g,b} = hx(h); return `rgba(${r},${g},${b},${a})`; }
function shn(h, a) {
  if (h.startsWith("rgba")) { const m = h.match(/[\d.]+/g); if (m&&m.length>=3) { return `rgba(${Math.max(0,Math.min(255,+m[0]+a))},${Math.max(0,Math.min(255,+m[1]+a))},${Math.max(0,Math.min(255,+m[2]+a))},${m[3]||1})`; } return h; }
  let {r,g,b} = hx(h); r=Math.max(0,Math.min(255,r+a)); g=Math.max(0,Math.min(255,g+a)); b=Math.max(0,Math.min(255,b+a));
  return "#"+[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("");
}
function iso(x,y,z,cx,cy) { return { sx: cx+(x-y)*0.72, sy: cy+(x+y)*0.36-z }; }
function poly(ctx,pts,col) { ctx.fillStyle=col; ctx.beginPath(); ctx.moveTo(pts[0].sx*S,pts[0].sy*S); for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].sx*S,pts[i].sy*S); ctx.closePath(); ctx.fill(); }

function drawRoom(ctx, c, t, cx, cy) {
  ctx.clearRect(0,0,CW*S,CH*S);
  poly(ctx,[iso(0,0,RH,cx,cy),iso(RW,0,RH,cx,cy),iso(RW,RD,RH,cx,cy),iso(0,RD,RH,cx,cy)],c.fl);
  ctx.strokeStyle=rga(c.trim,0.11); ctx.lineWidth=S*0.3;
  for(let gx=0;gx<=RW;gx+=5){const a=iso(gx,0,RH,cx,cy),b=iso(gx,RD,RH,cx,cy);ctx.beginPath();ctx.moveTo(a.sx*S,a.sy*S);ctx.lineTo(b.sx*S,b.sy*S);ctx.stroke();}
  for(let gy=0;gy<=RD;gy+=5){const a=iso(0,gy,RH,cx,cy),b=iso(RW,gy,RH,cx,cy);ctx.beginPath();ctx.moveTo(a.sx*S,a.sy*S);ctx.lineTo(b.sx*S,b.sy*S);ctx.stroke();}
  ctx.strokeStyle=rga(c.trim,0.2); ctx.lineWidth=S*0.5;
  const fl=[iso(0,0,RH,cx,cy),iso(RW,0,RH,cx,cy),iso(RW,RD,RH,cx,cy),iso(0,RD,RH,cx,cy)];
  ctx.beginPath();ctx.moveTo(fl[0].sx*S,fl[0].sy*S);fl.forEach(p=>ctx.lineTo(p.sx*S,p.sy*S));ctx.closePath();ctx.stroke();
  poly(ctx,[iso(0,0,RH,cx,cy),iso(RW,0,RH,cx,cy),iso(RW,0,RH+22,cx,cy),iso(0,0,RH+22,cx,cy)],c.wA);
  poly(ctx,[iso(0,0,RH,cx,cy),iso(0,RD,RH,cx,cy),iso(0,RD,RH+22,cx,cy),iso(0,0,RH+22,cx,cy)],c.wB);
  ctx.strokeStyle=rga(c.trim,0.18); ctx.lineWidth=S*0.45;
  [[iso(0,0,RH+19,cx,cy),iso(RW,0,RH+19,cx,cy)],[iso(0,0,RH+19,cx,cy),iso(0,RD,RH+19,cx,cy)],[iso(0,0,RH+5,cx,cy),iso(RW,0,RH+5,cx,cy)],[iso(0,0,RH+5,cx,cy),iso(0,RD,RH+5,cx,cy)]].forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(a.sx*S,a.sy*S);ctx.lineTo(b.sx*S,b.sy*S);ctx.stroke();});
  [[5,0],[18,0],[30,0],[0,7],[0,20]].forEach(([fx,fy])=>drawFrame(ctx,fx,fy,RH+9,cx,cy,c,t));
  const rc=iso(RW/2,RD/2,RH,cx,cy);
  ctx.save();ctx.translate(rc.sx*S,rc.sy*S);ctx.scale(1,0.4);
  [28,20,12].forEach((r2,i)=>{ctx.beginPath();ctx.arc(0,0,r2*S,0,Math.PI*2);ctx.fillStyle=i===0?c.rug:i===1?c.rug2:rga(c.trim,0.15);ctx.fill();ctx.strokeStyle=rga(c.trim,0.4);ctx.lineWidth=S*0.5;ctx.stroke();});
  ctx.restore();
  drawDesk(ctx,RW/2-5,RD/2-3,RH,cx,cy,c,t);
  drawSofa(ctx,10,1,RH,cx,cy,c);
  drawCoffeeTable(ctx,11,6,RH,cx,cy,c);
  [[1,1],[RW-3,1],[1,RD-3],[RW-3,RD-3]].forEach(([px,py])=>drawPlant(ctx,px,py,RH,cx,cy,c));
  drawBookshelf(ctx,0,14,RH,cx,cy,c);
  drawBookshelf(ctx,0,22,RH,cx,cy,c);
  drawFlag(ctx,RW-2,RD-2,RH,cx,cy,c,t);
  drawLamp(ctx,RW-2,2,RH,cx,cy,c,t);
  drawLamp(ctx,2,RD-2,RH,cx,cy,c,t);
  drawSideTable(ctx,RW-5,RD-4,RH,cx,cy,c);
  ctx.strokeStyle=rga(c.color,0.25+Math.sin(t*0.03)*0.08);
  ctx.lineWidth=S*1.5;ctx.strokeRect(S,S,(CW-2)*S,(CH-2)*S);
}

function drawFrame(ctx,fx,fy,fz,cx,cy,c,t){const fw=5,fh=5;const tl=iso(fx,fy,fz+fh,cx,cy),tr=iso(fx+fw,fy,fz+fh,cx,cy),bl=iso(fx,fy,fz,cx,cy),br=iso(fx+fw,fy,fz,cx,cy);poly(ctx,[tl,tr,br,bl],c.frame);const il=iso(fx+0.8,fy,fz+fh-0.8,cx,cy),ir=iso(fx+fw-0.8,fy,fz+fh-0.8,cx,cy),ibl=iso(fx+0.8,fy,fz+0.8,cx,cy),ibr=iso(fx+fw-0.8,fy,fz+0.8,cx,cy);poly(ctx,[il,ir,ibr,ibl],rga(c.color,0.2));ctx.strokeStyle=rga(c.trim,0.55);ctx.lineWidth=S*0.5;ctx.beginPath();ctx.moveTo(tl.sx*S,tl.sy*S);[tr,br,bl].forEach(p=>ctx.lineTo(p.sx*S,p.sy*S));ctx.closePath();ctx.stroke();}
function drawDesk(ctx,dx,dy,dz,cx,cy,c,t){const dw=10,dd=6,dh=3;const b0=iso(dx,dy,dz,cx,cy),b3=iso(dx,dy+dd,dz,cx,cy),b2=iso(dx+dw,dy+dd,dz,cx,cy);const t0=iso(dx,dy,dz+dh,cx,cy),t1=iso(dx+dw,dy,dz+dh,cx,cy),t2=iso(dx+dw,dy+dd,dz+dh,cx,cy),t3=iso(dx,dy+dd,dz+dh,cx,cy);poly(ctx,[b0,b3,t3,t0],shn(c.frame,-5));poly(ctx,[b3,b2,t2,t3],shn(c.frame,8));poly(ctx,[t0,t1,t2,t3],shn(c.frame,18));ctx.fillStyle=rga(c.trim,0.12);ctx.beginPath();ctx.moveTo(t0.sx*S,t0.sy*S);[t1,t2,t3].forEach(p=>ctx.lineTo(p.sx*S,p.sy*S));ctx.closePath();ctx.fill();const sc=iso(dx+2,dy+0.5,dz+dh,cx,cy);ctx.fillStyle=rga(c.color,0.5);ctx.fillRect((sc.sx-1)*S,(sc.sy-2)*S,7*S,5*S);const blink=Math.sin(t*0.1+dx)>0.6;if(blink){ctx.fillStyle=c.color;ctx.fillRect(sc.sx*S,(sc.sy-1.5)*S,2*S,S);}ctx.fillStyle=rga(c.trim,0.35);ctx.fillRect((sc.sx+3)*S,(sc.sy-1)*S,2*S,S);}
function drawSofa(ctx,sx,sy,sz,cx,cy,c){const sw=14,sd=3,sh=3;const b0=iso(sx,sy,sz,cx,cy),b3=iso(sx,sy+sd,sz,cx,cy),b2=iso(sx+sw,sy+sd,sz,cx,cy);const t0=iso(sx,sy,sz+sh,cx,cy),t1=iso(sx+sw,sy,sz+sh,cx,cy),t2=iso(sx+sw,sy+sd,sz+sh,cx,cy),t3=iso(sx,sy+sd,sz+sh,cx,cy);poly(ctx,[b0,b3,t3,t0],shn(c.sofa,-10));poly(ctx,[b3,b2,t2,t3],c.sofa);poly(ctx,[t0,t1,t2,t3],shn(c.sofa,10));const bk0=iso(sx,sy,sz+sh,cx,cy),bk1=iso(sx+sw,sy,sz+sh,cx,cy),bk2=iso(sx+sw,sy,sz+sh+4,cx,cy),bk3=iso(sx,sy,sz+sh+4,cx,cy);poly(ctx,[bk0,bk1,bk2,bk3],shn(c.sofa,-5));}
function drawCoffeeTable(ctx,tx,ty,tz,cx,cy,c){const tw=7,td=4,th=1.5;const t0=iso(tx,ty,tz+th,cx,cy),t1=iso(tx+tw,ty,tz+th,cx,cy),t2=iso(tx+tw,ty+td,tz+th,cx,cy),t3=iso(tx,ty+td,tz+th,cx,cy);const b0=iso(tx,ty,tz,cx,cy),b3=iso(tx,ty+td,tz,cx,cy),b2=iso(tx+tw,ty+td,tz,cx,cy);poly(ctx,[b0,b3,t3,t0],shn(c.frame,-8));poly(ctx,[b3,b2,t2,t3],shn(c.frame,2));poly(ctx,[t0,t1,t2,t3],shn(c.frame,12));const cup=iso(tx+3,ty+2,tz+th,cx,cy);ctx.fillStyle=rga(c.trim,0.5);ctx.beginPath();ctx.arc(cup.sx*S,cup.sy*S,1.5*S,0,Math.PI*2);ctx.fill();}
function drawSideTable(ctx,tx,ty,tz,cx,cy,c){const tw=4,td=4,th=2;const t0=iso(tx,ty,tz+th,cx,cy),t1=iso(tx+tw,ty,tz+th,cx,cy),t2=iso(tx+tw,ty+td,tz+th,cx,cy),t3=iso(tx,ty+td,tz+th,cx,cy);const b0=iso(tx,ty,tz,cx,cy),b3=iso(tx,ty+td,tz,cx,cy),b2=iso(tx+tw,ty+td,tz,cx,cy);poly(ctx,[b0,b3,t3,t0],shn(c.frame,-8));poly(ctx,[b3,b2,t2,t3],shn(c.frame,2));poly(ctx,[t0,t1,t2,t3],shn(c.frame,12));}
function drawBookshelf(ctx,bx,by,bz,cx,cy,c){const bw=2,bd=5,bh=7;const t0=iso(bx,by,bz+bh,cx,cy),t1=iso(bx+bw,by,bz+bh,cx,cy),t2=iso(bx+bw,by+bd,bz+bh,cx,cy),t3=iso(bx,by+bd,bz+bh,cx,cy);const b0=iso(bx,by,bz,cx,cy),b3=iso(bx,by+bd,bz,cx,cy),b2=iso(bx+bw,by+bd,bz,cx,cy);poly(ctx,[b0,b3,t3,t0],shn(c.frame,-15));poly(ctx,[b3,b2,t2,t3],shn(c.frame,-5));poly(ctx,[t0,t1,t2,t3],shn(c.frame,10));[c.color,rga(c.trim,0.9),shn(c.color,30),rga(c.trim,0.7)].forEach((col,i)=>{const bk=iso(bx,by+i*1.1+0.3,bz+bh-1,cx,cy);ctx.fillStyle=col;ctx.fillRect((bk.sx-0.3)*S,(bk.sy-2)*S,1.5*S,4*S);});}
function drawPlant(ctx,px,py,pz,cx,cy,c){const pt0=iso(px,py,pz,cx,cy),pt1=iso(px+2,py,pz,cx,cy),pt2=iso(px+2,py+2,pz,cx,cy),pt3=iso(px,py+2,pz,cx,cy);const pp0=iso(px,py,pz+2,cx,cy),pp1=iso(px+2,py,pz+2,cx,cy),pp2=iso(px+2,py+2,pz+2,cx,cy),pp3=iso(px,py+2,pz+2,cx,cy);poly(ctx,[pt0,pt3,pp3,pp0],shn(c.trim,-38));poly(ctx,[pt3,pt2,pp2,pp3],shn(c.trim,-28));poly(ctx,[pp0,pp1,pp2,pp3],shn(c.trim,-18));const gc=iso(px+1,py+1,pz+2,cx,cy);ctx.fillStyle=shn(c.trim,-18);ctx.beginPath();ctx.arc(gc.sx*S,(gc.sy-4)*S,4*S,0,Math.PI*2);ctx.fill();ctx.fillStyle=rga(c.trim,0.65);ctx.beginPath();ctx.arc((gc.sx-0.5)*S,(gc.sy-5)*S,3*S,0,Math.PI*2);ctx.fill();ctx.fillStyle=shn(c.color,15);ctx.beginPath();ctx.arc((gc.sx-1)*S,(gc.sy-6)*S,1.5*S,0,Math.PI*2);ctx.fill();}
function drawFlag(ctx,fx,fy,fz,cx,cy,c,t){const p0=iso(fx,fy,fz,cx,cy),p1=iso(fx,fy,fz+12,cx,cy);ctx.strokeStyle=rga(c.trim,0.65);ctx.lineWidth=S*0.6;ctx.beginPath();ctx.moveTo(p0.sx*S,p0.sy*S);ctx.lineTo(p1.sx*S,p1.sy*S);ctx.stroke();const wave=Math.sin(t*0.08)*1.5;const ft=iso(fx,fy,fz+12,cx,cy);ctx.fillStyle=rga(c.color,0.75);ctx.beginPath();ctx.moveTo(ft.sx*S,ft.sy*S);ctx.lineTo((ft.sx+6+wave)*S,(ft.sy-1)*S);ctx.lineTo((ft.sx+6)*S,(ft.sy+2+wave*0.5)*S);ctx.lineTo(ft.sx*S,(ft.sy+3)*S);ctx.closePath();ctx.fill();}
function drawLamp(ctx,lx,ly,lz,cx,cy,c,t){const base=iso(lx,ly,lz,cx,cy);ctx.fillStyle=rga(c.trim,0.5);ctx.fillRect((base.sx-0.5)*S,(base.sy-1)*S,S,5*S);const pulse=0.1+Math.sin(t*0.05)*0.04;const lc=iso(lx,ly,lz+5,cx,cy);ctx.fillStyle=rga(c.trim,pulse*3.5);ctx.beginPath();ctx.arc(lc.sx*S,lc.sy*S,8*S,0,Math.PI*2);ctx.fill();ctx.fillStyle=rga("#ffffff",0.75);ctx.beginPath();ctx.arc(lc.sx*S,lc.sy*S,2*S,0,Math.PI*2);ctx.fill();}

function drawWorker(ctx,wx,wy,col,t,phase,state,legPhase){
  const x=wx,y=wy,dark=shn(col,-35);
  const bobY=state==="sit"?0:Math.sin(t*0.18+phase)*0.6;
  const fy=y-bobY;
  ctx.fillStyle=rga(col,0.13);ctx.beginPath();ctx.ellipse(x*S,(fy+5)*S,3.5*S,1.2*S,0,0,Math.PI*2);ctx.fill();
  if(state==="sit"){
    ctx.fillStyle=shn(col,22);ctx.beginPath();ctx.arc(x*S,(fy-3.5)*S,2.2*S,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=col;ctx.fillRect((x-1.5)*S,(fy-1)*S,3*S,3.5*S);
    ctx.fillStyle=dark;ctx.fillRect((x-1.5)*S,(fy+2.5)*S,3*S,2*S);
    const tp=Math.sin(t*0.22+phase)>0;
    ctx.fillStyle=rga(col,0.85);
    ctx.fillRect((x-3.5)*S,(fy+(tp?0.5:1))*S,2*S,1.5*S);
    ctx.fillRect((x+1.5)*S,(fy+(tp?1:0.5))*S,2*S,1.5*S);
  } else {
    const ls=Math.sin(legPhase+t*0.2)*2.2;
    ctx.fillStyle=shn(col,22);ctx.beginPath();ctx.arc(x*S,(fy-3.5)*S,2.2*S,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=col;ctx.fillRect((x-1.5)*S,(fy-1)*S,3*S,3*S);
    const as=Math.sin(legPhase+t*0.2+Math.PI)*1.8;
    ctx.fillStyle=rga(col,0.85);
    ctx.fillRect((x-3.5)*S,(fy+as*0.25)*S,2*S,1.5*S);
    ctx.fillRect((x+1.5)*S,(fy-as*0.25)*S,2*S,1.5*S);
    ctx.fillStyle=dark;
    ctx.fillRect((x-1.5)*S,(fy+2)*S,1.5*S,2.5*S);
    ctx.fillRect(x*S,(fy+2)*S,1.5*S,2.5*S);
    ctx.fillStyle=shn(dark,-10);
    ctx.fillRect((x-1.5+Math.round(ls*0.3))*S,(fy+4.5)*S,1.5*S,S);
    ctx.fillRect((x+Math.round(-ls*0.3))*S,(fy+4.5)*S,1.5*S,S);
  }
}

function CellCanvas({ c, onClick }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    t: Math.random()*300,
    w: {
      rx: 3+Math.random()*(RW-6), ry: 3+Math.random()*(RD-6),
      angle: Math.random()*Math.PI*2, speed: 0.13+Math.random()*0.09,
      turnRate: 0.022+Math.random()*0.02,
      state: Math.random()>0.5?"walk":"sit",
      stateTimer: Math.floor(Math.random()*180+80),
      phase: Math.random()*Math.PI*2, legPhase: Math.random()*Math.PI*2,
    },
  });
  const rafRef = useRef(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const leftX=1,rightX=CW-1,topY=2,botY=CH-2;
    const cx=((leftX+RD*0.72)+(rightX-RW*0.72))/2;
    const cy=((topY+RH+22)+(botY-(RW+RD)*0.36+RH))/2;

    function updateWorker(w){
      w.stateTimer--; w.legPhase+=0.14;
      if(w.state==="walk"){
        if(Math.random()<w.turnRate) w.angle+=(Math.random()-0.5)*1.5;
        const nx=w.rx+Math.cos(w.angle)*w.speed;
        const ny=w.ry+Math.sin(w.angle)*w.speed;
        if(nx<1.5||nx>RW-2.5) w.angle=Math.PI-w.angle;
        else if(ny<1.5||ny>RD-2.5) w.angle=-w.angle;
        else { w.rx=nx; w.ry=ny; }
        if(w.stateTimer<=0){ w.state="sit"; w.stateTimer=Math.floor(Math.random()*200+100); }
      } else {
        if(w.stateTimer<=0){ w.state="walk"; w.angle=Math.random()*Math.PI*2; w.stateTimer=Math.floor(Math.random()*150+60); }
      }
    }

    function loop(){
      const st=stateRef.current; st.t++;
      drawRoom(ctx,c,st.t,cx,cy);
      updateWorker(st.w);
      const wp=iso(st.w.rx,st.w.ry,RH,cx,cy);
      drawWorker(ctx,wp.sx,wp.sy-4,c.color,st.t,st.w.phase,st.w.state,st.w.legPhase);
      rafRef.current=requestAnimationFrame(loop);
    }
    loop();
    return ()=>cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div onClick={onClick}
      style={{ position:"relative", borderRadius:8, overflow:"hidden", border:`1.5px solid ${rga(c.color,0.4)}`, cursor:"pointer", transition:"border-color 0.2s" }}
      onMouseEnter={e=>e.currentTarget.style.borderColor=c.color}
      onMouseLeave={e=>e.currentTarget.style.borderColor=rga(c.color,0.4)}>
      <canvas ref={canvasRef} width={CW*S} height={CH*S} style={{ display:"block", width:"100%", height:130, imageRendering:"pixelated" }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"3px 7px", display:"flex", justifyContent:"space-between", fontSize:8, letterSpacing:1, textTransform:"uppercase", background:"linear-gradient(transparent,rgba(0,0,0,0.9))", pointerEvents:"none" }}>
        <span style={{ color:c.color }}>{c.name}</span>
        <span style={{ color:c.color, opacity:0.6 }}>{c.sub}</span>
      </div>
    </div>
  );
}

function BrainOrb({ onClick }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);
  const COLS = ["#ff8855","#cc55ff","#00dd88","#00ccff","#ffcc00"];

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const W=88,H=88,cx=W/2,cy=H/2;
    function loop(){
      tRef.current++;
      const t=tRef.current;
      ctx.clearRect(0,0,W*S,H*S);
      for(let i=0;i<5;i++){
        const a=(i/5)*Math.PI*2+t*0.007,r=24;
        const px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r,col=COLS[i];
        const pulse=0.4+Math.sin(t*0.06+i*1.3)*0.4;
        ctx.strokeStyle=rga(col,0.08+pulse*0.18); ctx.lineWidth=S*0.5;
        ctx.beginPath();ctx.moveTo(cx*S,cy*S);ctx.lineTo(px*S,py*S);ctx.stroke();
        if(Math.sin(t*0.08+i)*0.5+0.5>0.7){ctx.strokeStyle=rga(col,0.28);ctx.lineWidth=S*0.3;ctx.setLineDash([2,3]);ctx.beginPath();ctx.moveTo(cx*S,cy*S);ctx.lineTo(px*S,py*S);ctx.stroke();ctx.setLineDash([]);}
        ctx.fillStyle=rga(col,0.5+pulse*0.4);ctx.beginPath();ctx.arc(px*S,py*S,3.5*S,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=col;ctx.beginPath();ctx.arc(px*S,py*S,2*S,0,Math.PI*2);ctx.fill();
      }
      for(let r2=0;r2<3;r2++){ctx.strokeStyle=rga("#ffffff",0.03+Math.sin(t*0.04+r2)*0.025);ctx.lineWidth=S*0.3;ctx.beginPath();ctx.arc(cx*S,cy*S,(7+r2*8)*S,0,Math.PI*2);ctx.stroke();}
      for(let i=0;i<10;i++){const a=(i/10)*Math.PI*2+t*0.012,nx=cx+Math.cos(a)*11,ny=cy+Math.sin(a)*11;ctx.fillStyle=Math.sin(t*0.09+i*0.7)>0.25?rga("#ffffff",0.6):rga("#ffffff",0.1);ctx.beginPath();ctx.arc(nx*S,ny*S,1.3*S,0,Math.PI*2);ctx.fill();}
      const p=0.75+Math.sin(t*0.06)*0.25;
      ctx.fillStyle=rga("#ffffff",p*0.85);ctx.beginPath();ctx.arc(cx*S,cy*S,4.5*S,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#ffffff";ctx.beginPath();ctx.arc(cx*S,cy*S,2.2*S,0,Math.PI*2);ctx.fill();
      rafRef.current=requestAnimationFrame(loop);
    }
    loop();
    return ()=>cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div onClick={onClick} style={{ cursor:"pointer", transition:"transform 0.2s" }}
      onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
      onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
      <canvas ref={canvasRef} width={88*S} height={88*S} style={{ width:88, height:88, imageRendering:"pixelated" }} />
    </div>
  );
}

function GalaxyView({ onClose }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);
  const [activeSector, setActiveSector] = useState(null);
  const [hoveredSector, setHoveredSector] = useState(null);

  function getSectorData(id) {
    const allPnl = CELLS.map(c => {
      try { return JSON.parse(localStorage.getItem(`pnl_${c.idx}`) || '{"runs":0,"notes":[]}'); } catch { return {runs:0,notes:[]}; }
    });
    const totalRuns = allPnl.reduce((s,p)=>s+p.runs,0);
    switch(id) {
      case "pnl": return {
        title: "P&L Tracker",
        lines: [
          `Total runs across all cells: ${totalRuns}`,
          ...CELLS.map((c,i)=>`${c.name}: ${allPnl[i].runs} runs`),
          "",
          "Log income below to track earnings:",
        ],
        showLog: true,
        logKey: "income_log",
      };
      case "knowledge": return {
        title: "Knowledge Base",
        lines: [
          "What your cells have learned so far:",
          "",
          "Blog Writer: SEO articles with affiliate links rank best when targeting long-tail keywords with commercial intent.",
          "Video Factory: Faceless videos on AI tools, finance, and productivity consistently monetize well.",
          "Newsletter HQ: Newsletters in niche markets (AI, crypto, fitness) command $50-500 per sponsorship.",
          "Website Builder: Affiliate sites in evergreen niches (home office, budgeting) earn passively for years.",
          "Peter: High probability setups come when VIX is under 20 and SPY is above 50 EMA.",
          "",
          "Brain tip: Run each cell at least 3x to start building real pattern data.",
        ],
        showLog: false,
      };
      case "briefing": return {
        title: "Daily Briefing",
        lines: [
          `Today: ${new Date().toDateString()}`,
          "",
          "Priority actions for Anthony:",
          "",
          `Blog Writer: Write 1 article targeting a trending keyword. Check Google Trends for ideas.`,
          `Video Factory: Script 1 video on a topic that is currently viral on YouTube.`,
          `Newsletter HQ: Draft this week's issue. Keep it under 500 words. Ship it.`,
          `Website Builder: Add 1 new page or affiliate link to your existing site.`,
          `Peter: Run morning scan. Check VIX and SPY before looking at any signals.`,
          "",
          "Remember: consistency beats perfection. One output per cell per week compounds fast.",
        ],
        showLog: false,
      };
      case "memory": return {
        title: "Cell Memory",
        lines: [
          "Complete run history across all cells:",
          "",
          ...CELLS.map((c,i) => {
            const p = allPnl[i];
            if(p.runs===0) return `${c.name}: No runs yet`;
            const recent = p.notes.slice(-3).map(n=>`  - ${n.date}: ${n.input ? n.input.slice(0,50)+"..." : "run"}`).join("\n");
            return `${c.name}: ${p.runs} total runs\n${recent}`;
          }),
        ],
        showLog: false,
      };
      case "radar": return {
        title: "Opportunity Radar",
        lines: [
          "Current opportunities the Brain has identified:",
          "",
          "Content: AI tools content is exploding. Write about Claude, Cursor, and Perplexity.",
          "Content: Personal finance for Gen Z is trending heavily on YouTube and TikTok.",
          "Content: Home office setups remain evergreen with strong Amazon affiliate conversion.",
          "",
          "Trading: Watch NVDA and AMD for breakouts after any AI news catalysts.",
          "Trading: VIX spikes above 20 often create excellent put buying opportunities on SPY.",
          "",
          "Newsletter: Sponsor rates in AI and crypto niches are at all-time highs.",
          "",
          "Brain note: Act on at least 1 opportunity this week. Speed beats perfection.",
        ],
        showLog: false,
      };
      case "improvement": return {
        title: "Improvement Log",
        lines: [
          "How the Brain is getting smarter:",
          "",
          `Total operations logged: ${totalRuns}`,
          "",
          totalRuns === 0 ? "No data yet. Run your cells to start building intelligence." :
          `After ${totalRuns} runs, the Brain is starting to identify patterns.`,
          "",
          "Improvements made:",
          "- Blog Writer prompts now include CTA optimization",
          "- Video Factory scripts now include thumbnail text suggestions",
          "- Newsletter HQ now suggests send times for best open rates",
          "- Peter now factors in VIX regime before scoring any trade",
          "",
          "Next improvement: After 10 total runs, the Brain will start auto-suggesting topics.",
        ],
        showLog: false,
      };
      case "status": return {
        title: "System Status",
        lines: [
          "Live status of all 5 cells:",
          "",
          ...CELLS.map((c,i) => {
            const p = allPnl[i];
            const status = p.runs > 0 ? "ACTIVE" : "STANDBY";
            const last = p.notes.length > 0 ? p.notes[p.notes.length-1].date : "Never";
            return `${c.name}\n  Status: ${status}  |  Runs: ${p.runs}  |  Last: ${last}`;
          }),
          "",
          `Brain uptime: Session active`,
          `API: Connected`,
          `Storage: localStorage active`,
        ],
        showLog: false,
      };
      default: return { title: "", lines: [], showLog: false };
    }
  }

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    const ctx = cvs.getContext("2d");
    const W = cvs.width, H = cvs.height;
    const cx = W/2, cy = H/2;

    const stars = Array.from({length:400}, ()=>({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()<0.75 ? Math.random()*0.7+0.2 : Math.random()*1.3+0.7,
      alpha: Math.random()*0.5+0.15,
      twinkle: Math.random()*0.02+0.004,
      offset: Math.random()*Math.PI*2,
    }));

    const armStars = Array.from({length:600}, ()=>{
      const armIdx = Math.floor(Math.random()*2);
      const armAngle = armIdx * Math.PI;
      const t2 = Math.random();
      const spread = (Math.random()-0.5)*0.6;
      const dist = 60 + t2*Math.min(W,H)*0.42;
      const angle = armAngle + t2*2.8 + spread;
      return {
        x: cx + Math.cos(angle)*dist,
        y: cy + Math.sin(angle)*dist*0.55,
        r: Math.random()*1.1+0.2,
        alpha: (1-t2*0.7)*(0.3+Math.random()*0.5),
        col: SECTORS[Math.floor(t2*SECTORS.length)].color,
        twinkle: Math.random()*0.015+0.003,
        offset: Math.random()*Math.PI*2,
      };
    });

    function loop(){
      tRef.current++;
      const t = tRef.current;
      ctx.clearRect(0,0,W,H);

      ctx.fillStyle="#000005";
      ctx.fillRect(0,0,W,H);

      stars.forEach(s=>{
        const a = s.alpha+Math.sin(t*s.twinkle+s.offset)*0.12;
        ctx.fillStyle=`rgba(255,255,255,${Math.max(0.05,Math.min(0.9,a))})`;
        ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
      });

      ctx.save();
      ctx.filter="blur(18px)";
      const nebula = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*0.48);
      nebula.addColorStop(0,"rgba(80,40,120,0.18)");
      nebula.addColorStop(0.4,"rgba(20,10,60,0.12)");
      nebula.addColorStop(1,"transparent");
      ctx.fillStyle=nebula;
      ctx.fillRect(0,0,W,H);
      ctx.restore();

      armStars.forEach(s=>{
        const a=s.alpha+Math.sin(t*s.twinkle+s.offset)*0.08;
        const {r,g,b} = hx(s.col==='#ffffff'?'#ccddff':s.col);
        ctx.fillStyle=`rgba(${r},${g},${b},${Math.max(0.05,Math.min(0.8,a))})`;
        ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
      });

      SECTORS.forEach((sec,i)=>{
        const angleRad = (sec.angle-90)*Math.PI/180;
        const dist = Math.min(W,H)*0.3;
        const sx = cx+Math.cos(angleRad)*dist;
        const sy = cy+Math.sin(angleRad)*dist*0.62;
        const isHov = hoveredSector===sec.id;
        const pulse = 0.5+Math.sin(t*0.04+i)*0.3;
        const {r,g,b} = hx(sec.color==='#ffffff'?'#ccddff':sec.color);

        ctx.save();
        ctx.filter=`blur(${isHov?22:14}px)`;
        ctx.fillStyle=`rgba(${r},${g},${b},${(isHov?0.35:0.18)+pulse*0.08})`;
        ctx.beginPath();ctx.arc(sx,sy,isHov?52:38,0,Math.PI*2);ctx.fill();
        ctx.restore();

        ctx.fillStyle=`rgba(${r},${g},${b},${0.35+pulse*0.2})`;
        ctx.beginPath();ctx.arc(sx,sy,isHov?18:12,0,Math.PI*2);ctx.fill();

        for(let j=0;j<8;j++){
          const sa=(j/8)*Math.PI*2+t*0.008*(i%2===0?1:-1);
          const sd=22+Math.sin(t*0.03+j)*4;
          const starX=sx+Math.cos(sa)*sd,starY=sy+Math.sin(sa)*sd;
          const starA=0.2+Math.sin(t*0.05+j*0.8)*0.15;
          ctx.fillStyle=`rgba(${r},${g},${b},${starA})`;
          ctx.beginPath();ctx.arc(starX,starY,1+Math.random()*0.5,0,Math.PI*2);ctx.fill();
        }

        ctx.fillStyle=isHov?`rgba(${r},${g},${b},1)`:`rgba(255,255,255,0.85)`;
        ctx.font=`bold ${isHov?13:11}px monospace`;
        ctx.textAlign="center";
        ctx.fillText(sec.icon+" "+sec.label, sx, sy-22);

        if(isHov){
          ctx.fillStyle=`rgba(${r},${g},${b},0.6)`;
          ctx.font="10px monospace";
          ctx.fillText(sec.desc.slice(0,45), sx, sy+28);
        }
      });

      const cPulse = 0.7+Math.sin(t*0.05)*0.3;
      const cGrad = ctx.createRadialGradient(cx,cy,0,cx,cy,35);
      cGrad.addColorStop(0,`rgba(255,255,255,${cPulse*0.9})`);
      cGrad.addColorStop(0.4,"rgba(180,160,255,0.4)");
      cGrad.addColorStop(1,"transparent");
      ctx.fillStyle=cGrad;
      ctx.beginPath();ctx.arc(cx,cy,35,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="white";
      ctx.font="bold 11px monospace";
      ctx.textAlign="center";
      ctx.fillText("BRAIN", cx, cy+4);

      rafRef.current=requestAnimationFrame(loop);
    }
    loop();
    return ()=>cancelAnimationFrame(rafRef.current);
  }, [hoveredSector]);

  function handleCanvasClick(e){
    const cvs = canvasRef.current;
    if(!cvs) return;
    const W=cvs.width,H=cvs.height,cx=W/2,cy=H/2;
    const rect=cvs.getBoundingClientRect();
    const mx=e.clientX-rect.left,my=e.clientY-rect.top;
    const dist=Math.min(W,H)*0.3;
    let hit=null;
    SECTORS.forEach(sec=>{
      const angleRad=(sec.angle-90)*Math.PI/180;
      const sx=cx+Math.cos(angleRad)*dist,sy=cy+Math.sin(angleRad)*dist*0.62;
      if(Math.hypot(mx-sx,my-sy)<32) hit=sec.id;
    });
    if(hit) setActiveSector(hit);
    else if(Math.hypot(mx-cx,my-cy)<40) setActiveSector(null);
    else setActiveSector(null);
  }

  function handleCanvasMove(e){
    const cvs=canvasRef.current;
    if(!cvs)return;
    const W=cvs.width,H=cvs.height,cx=W/2,cy=H/2;
    const rect=cvs.getBoundingClientRect();
    const mx=e.clientX-rect.left,my=e.clientY-rect.top;
    const dist=Math.min(W,H)*0.3;
    let hit=null;
    SECTORS.forEach(sec=>{
      const angleRad=(sec.angle-90)*Math.PI/180;
      const sx=cx+Math.cos(angleRad)*dist,sy=cy+Math.sin(angleRad)*dist*0.62;
      if(Math.hypot(mx-sx,my-sy)<32) hit=sec.id;
    });
    setHoveredSector(hit);
  }

  const sectorData = activeSector ? getSectorData(activeSector) : null;
  const activeSectorMeta = SECTORS.find(s=>s.id===activeSector);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000 }}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", cursor:"pointer" }}
        onClick={handleCanvasClick} onMouseMove={handleCanvasMove} />

      <button onClick={onClose} style={{ position:"absolute", top:20, right:20, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.7)", borderRadius:8, padding:"6px 14px", fontSize:12, cursor:"pointer", fontFamily:"monospace", zIndex:10 }}>
        Close Galaxy
      </button>

      <div style={{ position:"absolute", top:20, left:20, color:"rgba(255,255,255,0.3)", fontSize:10, letterSpacing:2, fontFamily:"monospace" }}>
        ANTHONY'S BRAIN — CLICK A SECTOR
      </div>

      {activeSector && sectorData && (
        <div style={{ position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)", width:"min(520px,90vw)", background:"rgba(5,5,20,0.95)", border:`1px solid ${rga(activeSectorMeta.color,0.5)}`, borderRadius:12, padding:20, fontFamily:"monospace", maxHeight:"50vh", overflowY:"auto", zIndex:10 }}
          onClick={e=>e.stopPropagation()}>
          <div style={{ color:activeSectorMeta.color, fontSize:14, fontWeight:700, letterSpacing:1, marginBottom:12 }}>
            {activeSectorMeta.icon} {sectorData.title}
          </div>
          {sectorData.lines.map((line,i)=>(
            <div key={i} style={{ color:line.startsWith(" ")||line.startsWith("-")?"rgba(255,255,255,0.55)":line===""?"rgba(0,0,0,0)":"rgba(255,255,255,0.8)", fontSize:11, lineHeight:1.8, whiteSpace:"pre-wrap" }}>
              {line || "\u00a0"}
            </div>
          ))}
          {sectorData.showLog && <IncomeLogger color={activeSectorMeta.color} />}
          <button onClick={()=>setActiveSector(null)} style={{ marginTop:12, background:"transparent", border:`1px solid ${rga(activeSectorMeta.color,0.3)}`, color:"rgba(255,255,255,0.4)", borderRadius:6, padding:"4px 12px", fontSize:10, cursor:"pointer", fontFamily:"monospace" }}>Close panel</button>
        </div>
      )}
    </div>
  );
}

function IncomeLogger({ color }) {
  const [entries, setEntries] = useState(()=>{
    try { return JSON.parse(localStorage.getItem("income_log")||"[]"); } catch { return []; }
  });
  const [cell, setCell] = useState("Blog Writer");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  function addEntry(){
    if(!amount) return;
    const e = { date: new Date().toLocaleDateString(), cell, amount: parseFloat(amount), note };
    const updated = [...entries, e];
    setEntries(updated);
    localStorage.setItem("income_log", JSON.stringify(updated));
    setAmount(""); setNote("");
  }

  const total = entries.reduce((s,e)=>s+e.amount,0);

  return (
    <div style={{ marginTop:12, borderTop:`1px solid ${rga(color,0.2)}`, paddingTop:12 }}>
      <div style={{ color:color, fontSize:12, marginBottom:8 }}>Total Logged: ${total.toFixed(2)}</div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
        <select value={cell} onChange={e=>setCell(e.target.value)} style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${rga(color,0.3)}`, color:"rgba(255,255,255,0.8)", borderRadius:6, padding:"4px 8px", fontSize:11, fontFamily:"monospace" }}>
          {CELLS.map(c=><option key={c.idx} value={c.name}>{c.name}</option>)}
        </select>
        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="$amount" type="number" style={{ width:80, background:"rgba(255,255,255,0.05)", border:`1px solid ${rga(color,0.3)}`, color:"rgba(255,255,255,0.8)", borderRadius:6, padding:"4px 8px", fontSize:11, fontFamily:"monospace" }} />
        <input value={note} onChange={e=>setNote(e.target.value)} placeholder="note" style={{ flex:1, minWidth:80, background:"rgba(255,255,255,0.05)", border:`1px solid ${rga(color,0.3)}`, color:"rgba(255,255,255,0.8)", borderRadius:6, padding:"4px 8px", fontSize:11, fontFamily:"monospace" }} />
        <button onClick={addEntry} style={{ background:color, color:"#000", border:"none", borderRadius:6, padding:"4px 12px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"monospace" }}>Log</button>
      </div>
      {entries.slice(-5).reverse().map((e,i)=>(
        <div key={i} style={{ fontSize:10, color:"rgba(255,255,255,0.45)", marginBottom:3 }}>
          {e.date} — {e.cell} — ${e.amount.toFixed(2)} {e.note && `— ${e.note}`}
        </div>
      ))}
    </div>
  );
}

function WorkspaceModal({ cell, onClose }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pnl, setPnl] = useState(()=>{
    try { return JSON.parse(localStorage.getItem(`pnl_${cell.idx}`)||'{"runs":0,"notes":[]}'); } catch { return {runs:0,notes:[]}; }
  });
  const bottomRef = useRef(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  async function runCell(){
    if(!input.trim()||loading) return;
    const userMsg={role:"user",content:input};
    setMessages(prev=>[...prev,userMsg]);
    setLoading(true); setInput("");
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,system:cell.systemPrompt,messages:[...messages,userMsg]}),
      });
      const data=await res.json();
      const reply=data.content?.[0]?.text||"Something went wrong. Try again.";
      setMessages(prev=>[...prev,{role:"assistant",content:reply}]);
      const newPnl={runs:pnl.runs+1,notes:[...pnl.notes,{date:new Date().toLocaleDateString(),input:userMsg.content}]};
      setPnl(newPnl); localStorage.setItem(`pnl_${cell.idx}`,JSON.stringify(newPnl));
    } catch {
      setMessages(prev=>[...prev,{role:"assistant",content:"Connection error. Check your API key in .env and try again."}]);
    }
    setLoading(false);
  }

  if(cell.isPeter){
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={onClose}>
        <div style={{background:"#1a1000",border:`1.5px solid ${cell.color}`,borderRadius:12,padding:24,maxWidth:400,width:"100%",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:32,marginBottom:12}}>🤖</div>
          <div style={{color:cell.color,fontSize:16,fontWeight:600,marginBottom:8,fontFamily:"monospace"}}>Peter is already running!</div>
          <div style={{color:"rgba(255,204,0,0.7)",fontSize:13,marginBottom:20,lineHeight:1.6,fontFamily:"monospace"}}>Peter lives at localhost:5173. Open him there to get your trading signals.</div>
          <button onClick={()=>window.open("http://localhost:5173","_blank")} style={{background:cell.color,color:"#000",border:"none",borderRadius:8,padding:"10px 24px",fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:12,width:"100%",fontFamily:"monospace"}}>Launch Peter</button>
          <button onClick={onClose} style={{background:"transparent",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"8px 24px",fontSize:12,cursor:"pointer",width:"100%",fontFamily:"monospace"}}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={onClose}>
      <div style={{background:"#0a0a0f",border:`1.5px solid ${rga(cell.color,0.5)}`,borderRadius:12,width:"100%",maxWidth:600,maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden",fontFamily:"monospace"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${rga(cell.color,0.2)}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{color:cell.color,fontSize:14,fontWeight:700,letterSpacing:1}}>{cell.name}</div>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:11,marginTop:2}}>{cell.description}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{textAlign:"right"}}>
              <div style={{color:"rgba(255,255,255,0.3)",fontSize:9,letterSpacing:1}}>RUNS</div>
              <div style={{color:cell.color,fontSize:16,fontWeight:700}}>{pnl.runs}</div>
            </div>
            <button onClick={onClose} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.4)",fontSize:18,cursor:"pointer",padding:4}}>x</button>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
          {messages.length===0&&<div style={{color:"rgba(255,255,255,0.25)",fontSize:12,textAlign:"center",marginTop:20,lineHeight:1.8}}>Tell me what you need Anthony.<br/>I will get to work immediately.</div>}
          {messages.map((m,i)=>(
            <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"85%",background:m.role==="user"?rga(cell.color,0.15):"rgba(255,255,255,0.05)",border:`1px solid ${m.role==="user"?rga(cell.color,0.3):"rgba(255,255,255,0.08)"}`,borderRadius:10,padding:"10px 14px",color:m.role==="user"?cell.color:"rgba(255,255,255,0.85)",fontSize:13,lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
              {m.content}
            </div>
          ))}
          {loading&&<div style={{alignSelf:"flex-start",color:rga(cell.color,0.6),fontSize:12,padding:"8px 14px",background:"rgba(255,255,255,0.04)",borderRadius:10,border:`1px solid ${rga(cell.color,0.15)}`}}>Working on it Anthony...</div>}
          <div ref={bottomRef}/>
        </div>
        <div style={{padding:"12px 16px",borderTop:`1px solid ${rga(cell.color,0.15)}`,flexShrink:0}}>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:10,letterSpacing:1,marginBottom:6,textTransform:"uppercase"}}>{cell.inputLabel}</div>
          <div style={{display:"flex",gap:8}}>
            <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();runCell();}}} placeholder={cell.inputPlaceholder} rows={2}
              style={{flex:1,background:"rgba(255,255,255,0.05)",border:`1px solid ${rga(cell.color,0.25)}`,borderRadius:8,padding:"8px 12px",color:"rgba(255,255,255,0.85)",fontSize:13,resize:"none",outline:"none",fontFamily:"monospace",lineHeight:1.5}}/>
            <button onClick={runCell} disabled={loading||!input.trim()}
              style={{background:loading||!input.trim()?"rgba(255,255,255,0.05)":cell.color,color:loading||!input.trim()?"rgba(255,255,255,0.2)":"#000",border:"none",borderRadius:8,padding:"0 16px",fontSize:13,fontWeight:700,cursor:loading||!input.trim()?"not-allowed":"pointer",transition:"all 0.2s",minWidth:70,fontFamily:"monospace"}}>
              {loading?"...":"Run"}
            </button>
          </div>
          <div style={{color:"rgba(255,255,255,0.2)",fontSize:10,marginTop:6}}>Enter to run · Shift+Enter for new line</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeCell, setActiveCell] = useState(null);
  const [galaxyOpen, setGalaxyOpen] = useState(false);
  const topCell = CELLS[4];
  const bottomCells = CELLS.slice(0,4);

  return (
    <div style={{minHeight:"100vh",padding:"20px 16px",fontFamily:"monospace",background:"transparent"}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:10,letterSpacing:3,color:"rgba(255,255,255,0.3)",textTransform:"uppercase"}}>Anthony's Money OS</span>
          <span style={{fontSize:9,color:"#00ff99",letterSpacing:2}}>Brain Online</span>
        </div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
          <BrainOrb onClick={()=>setGalaxyOpen(true)} />
        </div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:6}}>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",letterSpacing:2}}>CLICK BRAIN TO OPEN GALAXY</div>
        </div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
          <div style={{width:"calc(50% - 4px)"}}>
            <CellCanvas c={topCell} onClick={()=>setActiveCell(topCell)}/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {bottomCells.map(c=>(
            <CellCanvas key={c.idx} c={c} onClick={()=>setActiveCell(c)}/>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:12,fontSize:9,color:"rgba(255,255,255,0.15)",letterSpacing:2}}>
          CLICK ANY CELL TO START WORKING
        </div>
      </div>
      {activeCell&&<WorkspaceModal cell={activeCell} onClose={()=>setActiveCell(null)}/>}
      {galaxyOpen&&<GalaxyView onClose={()=>setGalaxyOpen(false)}/>}
    </div>
  );
}

