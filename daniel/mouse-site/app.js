const MICE = [
  { name:"Logitech G Pro X Superlight 2", brand:"Logitech G", game:["CS2","Valorant"], shape:"Symmetrical", weight:60, sensor:"HERO2 32K", polling:"2K (8K dongle)", pros:["m0NESY","ZywOo","TenZ"], price:159, rating:4.9, glow:"#ff465544", best:"All-round pro standard", grip:"Claw / Fingertip" },
  { name:"Razer Viper V3 Pro", brand:"Razer", game:["Valorant","CS2"], shape:"Symmetrical", weight:55, sensor:"Focus Pro 35K", polling:"8K", pros:["Derke","zekken","NiKo"], price:149, rating:4.9, glow:"#0ff0b344", best:"Flicks + tracking", grip:"Claw / Fingertip" },
  { name:"Razer DeathAdder V3 Pro", brand:"Razer", game:["CS2","Valorant"], shape:"Ergo-right", weight:63, sensor:"Focus Pro 30K", polling:"4K/8K", pros:["s1mple-era ergo fans"], price:149, rating:4.8, glow:"#3dff8844", best:"Palm grip comfort", grip:"Palm" },
  { name:"ZOWIE EC2-CW", brand:"ZOWIE", game:["CS2"], shape:"Ergo-right", weight:72, sensor:"3370", polling:"1K", pros:["ropz","broky-style"], price:149, rating:4.7, glow:"#ffc94d44", best:"CS2 spray control", grip:"Palm / Claw" },
  { name:"Pulsar X2V2", brand:"Pulsar", game:["Valorant","CS2"], shape:"Symmetrical", weight:53, sensor:"XS-1 32K", polling:"4K", pros:["VCT controller mains"], price:99, rating:4.7, glow:"#7c8cff44", best:"Budget ultralight", grip:"Fingertip / Claw" },
  { name:"VAXEE XE-S Wireless", brand:"VAXEE", game:["Valorant","CS2"], shape:"Symmetrical", weight:65, sensor:"3395", polling:"1K", pros:["aspas-style"], price:129, rating:4.6, glow:"#ff7a1844", best:"Pure aim, no software", grip:"Claw" },
  { name:"Logitech G703 HERO", brand:"Logitech G", game:["CS2"], shape:"Ergonomic", weight:95, sensor:"HERO 25K", polling:"1K", pros:["shox-era palm"], price:99, rating:4.5, glow:"#8b93b844", best:"Big-hand palm", grip:"Palm" },
  { name:"Razer Cobra Pro", brand:"Razer", game:["Valorant"], shape:"Symmetrical", weight:77, sensor:"Focus Pro 30K", polling:"4K", pros:["flex / IGL picks"], price:129, rating:4.5, glow:"#ff465544", best:"Small-hand claw", grip:"Claw" },
];
const $ = id => document.getElementById(id);
let fGame="All", fSort="pro", fShape="All";

$("brandTrack").innerHTML = [...Array(2)].fill(["LOGITECH G","RAZER","ZOWIE","VAXEE","PULSAR","FINALMOUSE","LAMZU","WLMOUSE"].map(b=>`<span>◆ ${b}</span>`).join("")).join("");

function stars(r){ return "★".repeat(Math.round(r)) + `<span style="color:var(--mut)"> ${r}</span>`; }

function render(){
  let list=[...MICE];
  if(fGame!=="All") list = fGame==="Both" ? list.filter(m=>m.game.length>1) : list.filter(m=>m.game.includes(fGame));
  if(fShape!=="All") list=list.filter(m=>m.shape===fShape);
  if(fSort==="light") list.sort((a,b)=>a.weight-b.weight);
  if(fSort==="cheap") list.sort((a,b)=>a.price-b.price);
  if(fSort==="pro") list.sort((a,b)=>b.rating-a.rating);
  $("count").textContent=`— ${list.length} mice`;
  $("grid").innerHTML=list.map((m,i)=>`
    <article class="card">
      <div class="art" style="--glow:${m.glow}"><div class="mini"></div></div>
      <div><span class="game-tag ${m.game.length>1?"hot":""}">${m.game.join(" + ")}</span></div>
      <h3>${m.name}</h3>
      <div class="stars">${stars(m.rating)}</div>
      <div class="specs"><span class="spec">${m.weight}g</span><span class="spec">${m.sensor}</span><span class="spec">${m.shape}</span></div>
      <div class="pros">◉ ${m.pros.join(" • ")}</div>
      <div class="buy"><span class="price">$${m.price}</span><button class="btn small" onclick="buy('${m.name}')">Buy →</button></div>
    </article>`).join("");
  $("table").querySelector("tbody").innerHTML=list.map(m=>`<tr><td><b>${m.name}</b><br/><span style="color:var(--mut)">${m.brand}</span></td><td>${m.weight}g</td><td>${m.sensor}</td><td>${m.polling}</td><td>${m.shape}</td><td>${m.best}</td><td><b>$${m.price}</b></td></tr>`).join("");
}
document.querySelectorAll("#gamePills .pill").forEach(b=>b.onclick=()=>{document.querySelectorAll("#gamePills .pill").forEach(x=>x.classList.remove("active"));b.classList.add("active");fGame=b.dataset.game;render();});
$("shape").onchange=e=>{fShape=e.target.value;render();};
$("sort").onchange=e=>{fSort=e.target.value;render();};

$("proCards").innerHTML=[
  ["CS2 riflers","Superlight 2 • Viper V3 Pro • EC2-CW","Low eDPI, stable mid-weight, big mousepads."],
  ["Valorant duelists","Viper V3 Pro • Pulsar X2V2 • Superlight 2","Ultralight + 4K/8K polling for micro-adjusts."],
  ["Palm-grip anchors","DeathAdder V3 Pro • EC2-CW • G703","Ergo-right shells for long prac blocks."],
  ["No-software purists","VAXEE XE-S • ZOWIE EC-CW","Plug-and-play, driverless, tournament-proof."],
].map(p=>`<div class="pro-card"><b>${p[0]}</b><span>${p[1]}</span><span>${p[2]}</span></div>`).join("");

let g="CS2", grip="Claw", hand="M";
const pick=(id,fn)=>document.querySelectorAll("#"+id+" .pill").forEach(b=>b.onclick=()=>{document.querySelectorAll("#"+id+" .pill").forEach(x=>x.classList.remove("active"));b.classList.add("active");fn(b.dataset.v);});
pick("fGame",v=>g=v); pick("fGrip",v=>grip=v); pick("fHand",v=>hand=v);
$("findBtn").onclick=()=>{
  let m;
  if(grip==="Palm"||hand==="L") m = g==="CS2" ? MICE[3] : MICE[2];
  else if(grip==="Fingertip"||hand==="S") m = g==="Valorant" ? MICE[4] : MICE[1];
  else m = MICE[0];
  $("findResult").innerHTML=`<div class="game-tag hot">${g} • ${grip}</div><h3>${m.name}</h3><p class="muted">${m.weight}g • ${m.sensor} • ${m.best}. Pairs with ~${g==="CS2"?"800":"280"} eDPI to start.</p><button class="btn small" onclick="buy('${m.name}')">Buy $${m.price} →</button>`;
};
function buy(n){ const t=$("toast"); t.textContent=`${n} added to cart ✓ (demo)`; t.hidden=false; setTimeout(()=>t.hidden=true,2200); }
$("mail").onsubmit=e=>{e.preventDefault();e.target.reset();const t=$("toast");t.textContent="Sheet sent — check your inbox ✓";t.hidden=false;setTimeout(()=>t.hidden=true,2500);};
render();
