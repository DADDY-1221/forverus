// ===== Make it hers: edit this block =====
const CONFIG = {
  name: "Rediet",
  age: 16,
  birth: {year: 2010, month: 11, day: 8, hour: null, minute: 0},   // hour: put her birth hour here (24-hour clock, e.g. 19 for 7 PM) or leave null if unknown
  from: "Your big sibling",
  candles: 8,                  // candles drawn on the cake (1 to 10)
  ending: ["Happy Birthday, Rediet", "With All My Love", "Always & Forever"],
  cards: [                     // one message + one photo per card. Add or remove lines freely.
    {text: "Happy birthday, Rediet! Yes, I made you a whole website. You’re welcome.", photo: "images/photo1.jpg"},
    {text: "I still can’t believe you’re sixteen. When did that happen?!", photo: "images/photo2.jpg"},
    {text: "Thank you for being the one person I can be completely silly with.", photo: "images/photo3.jpg"},
    {text: "Whatever this year brings, I’ve got you. Always.", photo: "images/photo4.jpg"}
  ]
};
// =========================================

const NS = "http://www.w3.org/2000/svg";
const $ = id => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const N = Math.min(Math.max(CONFIG.candles|0 || 1, 1), 10);
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
// [name, symbol, element, start month, start day, trait] (Capricorn last so it wraps over New Year)
const SIGNS = [
  ["Aquarius","♒","Air",1,20,"Original and kind-hearted, you see the world in a way nobody else does."],
  ["Pisces","♓","Water",2,19,"Gentle and creative, you feel everything deeply and turn it into beauty."],
  ["Aries","♈","Fire",3,21,"Bold and full of energy, you go first and light the way for everyone."],
  ["Taurus","♉","Earth",4,20,"Loyal and steady, you love deeply and make everyone feel safe."],
  ["Gemini","♊","Air",5,21,"Curious and funny, you turn every moment into an adventure."],
  ["Cancer","♋","Water",6,21,"Caring and intuitive, you make wherever you are feel like home."],
  ["Leo","♌","Fire",7,23,"Warm and radiant, you were born to shine and you lift everyone with you."],
  ["Virgo","♍","Earth",8,23,"Thoughtful and clever, you notice the little things that matter most."],
  ["Libra","♎","Air",9,23,"Charming and fair, you bring harmony and sparkle wherever you go."],
  ["Scorpio","♏","Water",10,23,"Passionate and fearless, you never do anything halfway."],
  ["Sagittarius","♐","Fire",11,22,"Adventurous and optimistic, you chase big dreams with a huge heart."],
  ["Capricorn","♑","Earth",12,22,"Determined and quietly brave, you build big dreams one step at a time."]
];
function signOf(m, d){ let s = SIGNS[SIGNS.length - 1]; for(const z of SIGNS){ if(m > z[3] || (m === z[3] && d >= z[4])) s = z; } return s; }
const B = CONFIG.birth, SIGN = signOf(B.month, B.day);
const H = B.hour == null ? 0 : B.hour, MI = B.minute || 0;
const pad = n => String(n).padStart(2, "0");
const fmtHour = () => ((B.hour % 12) || 12) + ":" + pad(B.minute) + (B.hour < 12 ? " AM" : " PM");
$("bornLine").textContent = "Turning " + CONFIG.age + "  ·  " + SIGN[1] + " " + SIGN[0] + "  ·  " + B.day + " " + MONTHS[B.month-1] + " " + B.year;
function nextBirthday(){
  const n = new Date();
  let t = new Date(n.getFullYear(), B.month-1, B.day, H, MI);
  if(t < n) t = new Date(n.getFullYear() + 1, B.month-1, B.day, H, MI);
  return t;
}
function cdTick(){
  const n = new Date();
  const today = n.getMonth() + 1 === B.month && n.getDate() === B.day;
  const s = today ? 0 : Math.max(0, Math.floor((nextBirthday() - n) / 1000));
  $("cdD").textContent = pad(Math.floor(s / 86400));
  $("cdH").textContent = pad(Math.floor(s % 86400 / 3600));
  $("cdM").textContent = pad(Math.floor(s % 3600 / 60));
  $("cdS").textContent = pad(s % 60);
  $("cdTitle").innerHTML = (today ? "<em></em>, your day<br>is here!" : "<em></em>, your day<br>is almost here"); $("cdTitle").querySelector("em").textContent = CONFIG.name;
}
cdTick(); setInterval(cdTick, 1000);
function show(id){ document.querySelectorAll(".scene").forEach(s => s.hidden = s.id !== id); scrollTo(0, 0); }

// twinkling stars
const sc = $("stars"), sx = sc.getContext("2d");
let stars = [];
function sizeStars(){
  sc.width = innerWidth; sc.height = innerHeight;
  stars = Array.from({length: Math.round(innerWidth * innerHeight / 9000)}, () => ({
    x: Math.random()*sc.width, y: Math.random()*sc.height, r: Math.random()*1.4 + .3, p: Math.random()*6.28, s: Math.random()*.02 + .005
  }));
}
sizeStars(); addEventListener("resize", sizeStars);
(function twinkle(){
  sx.clearRect(0, 0, sc.width, sc.height); sx.fillStyle = "#ffe9c8";
  for(const s of stars){ s.p += s.s; sx.globalAlpha = .3 + .7*Math.abs(Math.sin(s.p)); sx.beginPath(); sx.arc(s.x, s.y, s.r, 0, 6.283); sx.fill(); }
  requestAnimationFrame(twinkle);
})();

// ---- cake, candles, microphone (from the earlier version) ----
function el(tag, attrs, parent){
  const e = document.createElementNS(NS, tag);
  for(const k in attrs) e.setAttribute(k, attrs[k]);
  if(parent) parent.appendChild(e);
  return e;
}
const edgeY = x => 190 + 28*Math.sqrt(Math.max(0, 1 - ((x-200)/140)**2));

// frosting drips
[78,108,134,168,232,264,292,322].forEach((x,i) => {
  const len = 12 + ((i*37)%22);
  el("rect",{x:x-8,y:edgeY(x)-6,width:16,height:len+8,rx:8,fill:"url(#frost)"},$("drips"));
});
// strawberries
[92,148,200,252,308].forEach(x => {
  const g = el("g",{transform:`translate(${x},${edgeY(x)-6})`},$("berries"));
  el("path",{d:"M-11 -4 C-12 8 -4 14 0 15 C4 14 12 8 11 -4 C8 -11 -8 -11 -11 -4Z",fill:"#e8283f"},g);
  el("path",{d:"M-11 -4 C-12 8 -4 14 0 15 C4 14 12 8 11 -4 C8 -11 -8 -11 -11 -4Z",fill:"url(#cyl)"},g);
  [[-5,0],[3,-1],[0,6],[-4,7],[6,5]].forEach(([a,b]) => el("ellipse",{cx:a,cy:b,rx:.9,ry:1.5,fill:"#ffe9a8"},g));
  el("path",{d:"M0 -9 L-7 -13 L-2 -7 L0 -14 L2 -7 L7 -13Z",fill:"#2e9e4f"},g);
});

// candles
let lit = N, micOn = false, micStream = null;
function build(){
  $("candles").innerHTML = "";
  lit = N;
  for(let i=0;i<N;i++){
    const x = N === 1 ? 200 : 105 + i*(190/(N-1));
    const d = (x-200)/100;
    const base = 198 - 14*(1-d*d);
    const top = base - 60;
    const g = el("g",{class:"candle",tabindex:0,role:"button","aria-label":"Blow out candle "+(i+1),transform:`translate(${x},0)`},$("candles"));
    el("rect",{class:"hit",x:-16,y:top-44,width:32,height:base-top+44},g);
    el("rect",{x:-6,y:top,width:12,height:base-top,rx:2,fill:i%2?"url(#stripe2)":"url(#stripe)"},g);
    el("rect",{x:-6,y:top,width:12,height:base-top,rx:2,fill:"url(#cyl)"},g);
    el("ellipse",{cx:0,cy:top,rx:6,ry:2,fill:"#fff",opacity:.8},g);
    el("path",{d:`M0 ${top} L1 ${top-8}`,stroke:"#2b2b2b","stroke-width":1.5,"stroke-linecap":"round"},g);
    el("circle",{class:"glow",cx:0,cy:top-18,r:46,fill:"url(#glowG)"},g);
    const f = el("g",{class:"flame"},g);
    el("path",{d:`M0 ${top-6} C-9 ${top-14} -7 ${top-28} 0 ${top-42} C7 ${top-28} 9 ${top-14} 0 ${top-6}Z`,fill:"url(#flameG)"},f);
    el("ellipse",{cx:0,cy:top-11,rx:2.6,ry:5,fill:"#5aa0ff",opacity:.7},f);
    const out = () => extinguish(g, top);
    g.addEventListener("click", out);
    g.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); out(); } });
    g._top = top;
  }
  setLit();
  $("hint").className = "hint";
  $("hint").textContent = "Close your eyes, make a wish… then blow! (Use your mic, or just tap the candles.)";
  ["song","again"].forEach(k => $(k).hidden = true);
  $("mic").hidden = false;
}
function setLit(){ $("ambient").style.setProperty("--lit", lit/N); }
function extinguish(g, top){
  if(g.classList.contains("out")) return;
  g.classList.add("out");
  el("path",{class:"smoke",d:`M0 ${top-4} q-7 -12 0 -24 t0 -24`},g);
  lit--; setLit();
  if(lit === 0) finish();
  else $("hint").textContent = lit + (lit === 1 ? " candle" : " candles") + " left… keep going!";
}

// microphone blowing
$("mic").addEventListener("click", async () => {
  try{
    micStream = await navigator.mediaDevices.getUserMedia({audio:true});
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const an = ctx.createAnalyser(); an.fftSize = 512;
    ctx.createMediaStreamSource(micStream).connect(an);
    const buf = new Uint8Array(an.fftSize);
    micOn = true; $("mic").hidden = true;
    $("hint").textContent = "Go on… take a deep breath and blow.";
    let loud = 0, tick = 0;
    (function listen(){
      if(!micOn) return;
      an.getByteTimeDomainData(buf);
      let s = 0; for(const v of buf){ const d = (v-128)/128; s += d*d; }
      loud = Math.sqrt(s/buf.length) > 0.1 ? loud+1 : 0;
      if(loud > 5 && ++tick % 9 === 0){
        const on = [...document.querySelectorAll(".candle:not(.out)")];
        if(on.length){ const c = on[Math.floor(Math.random()*on.length)]; extinguish(c, c._top); }
      }
      requestAnimationFrame(listen);
    })();
  }catch(e){
    $("hint").textContent = "The mic isn’t available here, so tap the candles instead.";
    $("mic").hidden = true;
  }
});
function stopMic(){ micOn = false; if(micStream){ micStream.getTracks().forEach(t => t.stop()); micStream = null; } }


// bunting and warm floating lights
(function(){
  const g = $("flags"), cols = ["#ff7f61","#ffcf6b","#fff1dc","#e8697a","#ffb08a"];
  for(let i = 0; i < 11; i++){
    const t = .05 + i*.09, x = 400*t, y = 8*(1-t)**2 + 112*t*(1-t) + 8*t*t;
    el("polygon",{points:`${x-15},${y-1} ${x+15},${y-1} ${x},${y+36}`,fill:cols[i % cols.length]},g);
  }
  const b = document.createElement("div"); b.className = "bokeh"; b.setAttribute("aria-hidden","true");
  for(let i = 0; i < 10; i++){
    const e = document.createElement("i"), s = 40 + Math.random()*110;
    e.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;top:${Math.random()*100}%;opacity:${.25 + Math.random()*.4};animation-delay:-${Math.random()*14}s;animation-duration:${10 + Math.random()*10}s`;
    b.appendChild(e);
  }
  document.body.prepend(b);
})();

// ---- scene 1: code rain and countdown ----
function runRain(){
  show("rainScene");
  const c = $("rain"), g = c.getContext("2d"); c.width = innerWidth; c.height = innerHeight;
  const fs = 18, drops = Array.from({length: Math.floor(c.width/fs)}, () => Math.random()*-40), chars = "01♥✦";
  let on = true;
  (function draw(){
    if(!on) return;
    g.fillStyle = "rgba(10,6,20,.12)"; g.fillRect(0, 0, c.width, c.height); g.font = fs + "px monospace";
    drops.forEach((y, i) => {
      g.fillStyle = Math.random() < .04 ? "#fff3d6" : "#ffa86b";
      g.fillText(chars[Math.floor(Math.random()*chars.length)], i*fs, y*fs);
      drops[i] = (y*fs > c.height && Math.random() > .975) ? 0 : y + 1;
    });
    requestAnimationFrame(draw);
  })();
  const words = ["3", "2", "1", "HAPPY", "BIRTHDAY", "TO", CONFIG.name.toUpperCase()];
  const t = $("rainText"); let i = 0;
  (function next(){
    if(i < words.length){
      t.textContent = words[i++]; t.classList.remove("pulse"); void t.offsetWidth; t.classList.add("pulse");
      setTimeout(next, 950);
    } else setTimeout(() => { on = false; toCake(); }, 1200);
  })();
}
$("go").addEventListener("click", () => show("giftScene"));
$("giftbox").addEventListener("click", function(){
  if(this.classList.contains("open")) return;
  try{ actx = new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); }catch(e){}
  this.classList.add("open");
  setTimeout(runRain, reduce ? 0 : 1300);
});

// ---- scene 2: the cake ----
function toCake(){
  show("cakeScene");
  $("sub").innerHTML = "Sweet " + CONFIG.age + ". Make a wish, <em></em>."; $("sub").querySelector("em").textContent = CONFIG.name;
  build();
}
function finish(){
  stopMic();
  $("hint").className = "hint done";
  $("hint").textContent = "Wish made. Happy birthday, " + CONFIG.name + " ♥";
  $("mic").hidden = true;
  setTimeout(() => {
    if(!reduce) confetti();
    playSong();
    $("song").hidden = false; $("again").hidden = false; $("gift").hidden = false;
    $("gift").scrollIntoView({behavior: reduce ? "auto" : "smooth", block: "center"});
  }, 900);
}
$("song").addEventListener("click", playSong);
$("again").addEventListener("click", () => { $("gift").hidden = true; build(); });

// ---- scene 3: message cards with photos ----
let ci = 0;
function showCard(){
  const c = CONFIG.cards[ci], box = $("cardsBox");
  box.classList.remove("rise"); void box.offsetWidth; box.classList.add("rise");
  $("cardText").textContent = c.text;
  const im = $("cardImg"); im.style.display = ""; im.onerror = () => { im.style.display = "none"; }; im.src = c.photo;
  $("next").textContent = ci < CONFIG.cards.length - 1 ? "Next ♥" : "Her stars ✨";
}
$("gift").addEventListener("click", () => { ci = 0; show("cardsScene"); showCard(); });
$("next").addEventListener("click", () => { if(ci < CONFIG.cards.length - 1){ ci++; showCard(); } else showZodiac(); });

// ---- scene 4: photos fly into a heart ----
function showHeart(){
  show("heartScene");
  const h = $("heart"); h.innerHTML = "";
  const n = 24;
  for(let i = 0; i < n; i++){
    const t = i / n * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t);
    const d = document.createElement("div"); d.className = "tile";
    d.style.left = (50 + x*2.7) + "%"; d.style.top = (44 - y*2.6) + "%";
    d.style.setProperty("--r", ((i*53) % 25 - 12) + "deg");
    d.style.transitionDelay = (i*80) + "ms"; d.style.animationDelay = (i % 6 * .3) + "s";
    const im = new Image(); im.alt = ""; im.src = CONFIG.cards[i % CONFIG.cards.length].photo; im.onerror = () => im.remove();
    d.appendChild(im); h.appendChild(d);
    setTimeout(() => d.classList.add("in"), 60);
  }
  $("endFrom").textContent = "";
  cycleEnding();
}
// ---- zodiac scene ----
function showZodiac(){
  show("zodiacScene");
  $("zSym").textContent = SIGN[1]; $("zName").textContent = SIGN[0];
  $("zEl").textContent = SIGN[2] + " sign";
  $("zTrait").textContent = SIGN[5];
  $("fDay").textContent = B.day; $("fMonth").textContent = MONTHS[B.month-1];
  $("fYear").textContent = B.year;
  if(B.hour == null){
    $("fHourLbl").textContent = "Weekday";
    $("fHour").textContent = new Date(B.year, B.month-1, B.day).toLocaleDateString("en-US", {weekday: "long"});
  } else {
    $("fHourLbl").textContent = "Hour"; $("fHour").textContent = fmtHour();
  }
}
$("toHeart").addEventListener("click", showHeart);
// closing words, one after another
function cycleEnding(){
  const el = $("endTitle"); let i = 0;
  (function step(){
    el.classList.remove("rise"); void el.offsetWidth; el.classList.add("rise");
    el.textContent = CONFIG.ending[i];
    if(i < CONFIG.ending.length - 1){ i++; setTimeout(step, 2600); }
    else $("endFrom").textContent = "With love, " + CONFIG.from;
  })();
}
$("replay").addEventListener("click", () => location.reload());

// happy birthday melody (WebAudio)
let actx = null;
function playSong(){
  try{
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const F = {G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99};
    const seq = [["G4",.75],["G4",.25],["A4",1],["G4",1],["C5",1],["B4",2],["G4",.75],["G4",.25],["A4",1],["G4",1],["D5",1],["C5",2],
      ["G4",.75],["G4",.25],["G5",1],["E5",1],["C5",1],["B4",1],["A4",1],["F5",.75],["F5",.25],["E5",1],["C5",1],["D5",1],["C5",2]];
    let t = actx.currentTime + .1; const beat = .42;
    seq.forEach(([n,b]) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = "triangle"; o.frequency.value = F[n];
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.18,t+.03);
      g.gain.exponentialRampToValueAtTime(.001,t+b*beat);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t+b*beat+.05);
      t += b*beat;
    });
  }catch(e){}
}

// confetti
const cv = $("fx"), cx = cv.getContext("2d");
function size(){ cv.width = innerWidth; cv.height = innerHeight; }
size(); addEventListener("resize", size);
function confetti(){
  const cols = ["#ff7f61","#ffcf6b","#fff1dc","#e8697a","#ffb08a"];
  const ps = Array.from({length:170}, () => ({
    x: innerWidth/2 + (Math.random()-.5)*160, y: innerHeight*.4,
    vx: (Math.random()-.5)*15, vy: -Math.random()*15-4, s: Math.random()*8+5,
    r: Math.random()*6, vr: (Math.random()-.5)*.4, c: cols[Math.floor(Math.random()*cols.length)]
  }));
  let t = 0;
  (function frame(){
    cx.clearRect(0,0,cv.width,cv.height);
    ps.forEach(p => {
      p.vy += .3; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.r += p.vr;
      cx.save(); cx.translate(p.x,p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2); cx.restore();
    });
    if(++t < 240) requestAnimationFrame(frame); else cx.clearRect(0,0,cv.width,cv.height);
  })();
}
