// BuildBox — curated + live YouTube projects
// To replace a video: paste any YouTube URL into "Add", or edit youtubeId below.

const CURATED = [
  { title:"Python Full Course — Build 12 Projects", channel:"freeCodeCamp", cat:"Coding", level:"Beginner", time:"4h", youtubeId:"rfscVS0vtbw", desc:"Python from zero to projects: automation, APIs, web scraping." },
  { title:"Python for Beginners (Mosh) — Your First App", channel:"Programming with Mosh", cat:"Coding", level:"Beginner", time:"6h", youtubeId:"kqtD5dpn9C8", desc:"Clean, fast Python intro ending with a working automation project." },
  { title:"JavaScript Full Course — Build a Game + App", channel:"freeCodeCamp", cat:"Coding", level:"Beginner", time:"3h", youtubeId:"PkZNo7MFNFg", desc:"JS fundamentals then build Blackjack + a Chrome extension." },
  { title:"JavaScript Mastery — Modern JS Project", channel:"Mosh", cat:"Coding", level:"Beginner", time:"1h", youtubeId:"W6NZfCO5SIk", desc:"Most-watched JS crash course — perfect first portfolio piece." },
  { title:"HTML + CSS Full Course — Portfolio Website", channel:"SuperSimpleDev", cat:"Coding", level:"Beginner", time:"6h", youtubeId:"G3e-cpL7ofc", desc:"Build and style a real YouTube-clone + portfolio site from scratch." },
  { title:"React Full Course — Airbnb Clone Project", channel:"freeCodeCamp", cat:"Coding", level:"Intermediate", time:"8h", youtubeId:"bMknfKXIFA8", desc:"Components, hooks, API calls — ship a full React clone." },
  { title:"Arduino Full Course — Robots, Sensors, LEDs", channel:"freeCodeCamp", cat:"Arduino", level:"Beginner", time:"4h", youtubeId:"nL34z7fhPDc", desc:"Circuits to obstacle-avoiding robot. If embed fails, hit YouTube — replace ID in app.js." },
  { title:"Raspberry Pi Home Server — Self-host Everything", channel:"NetworkChuck", cat:"Raspberry Pi", level:"Intermediate", time:"25m", youtubeId:"", desc:"Turn a Pi into NAS, ad-blocker and media server. Click YouTube to watch top tutorial." },
  { title:"ESP32 Smart Home Display Project", channel:"GreatScott!", cat:"DIY", level:"Intermediate", time:"18m", youtubeId:"", desc:"Click YouTube to find the latest ESP32 build — then + Add it with a real link." },
  { title:"3D Printing — First Functional Print", channel:"Teaching Tech", cat:"3D Printing", level:"Beginner", time:"22m", youtubeId:"", desc:"Calibrate once, then print tools, mounts and robot parts." },
  { title:"Build an AI Chatbot with Python + OpenAI", channel:"Tech With Tim", cat:"AI", level:"Intermediate", time:"1h", youtubeId:"", desc:"Chatbot with memory. Click YouTube for the latest walkthrough." },
  { title:"DIY Obstacle-Avoiding Robot Car", channel:"Maker pick", cat:"DIY", level:"Intermediate", time:"30m", youtubeId:"", desc:"Classic Arduino + ultrasonic sensor build. Search plays the best version." },
];

const CATS = ["All","Coding","Arduino","Raspberry Pi","3D Printing","AI","DIY"];
const LEVELS_RANK = { Beginner:0, Intermediate:1, Advanced:2 };

const $ = id => document.getElementById(id);
const grid=$("grid"), catsEl=$("cats");
let state = { q:"", cat:"All", level:"all", sort:"featured", favOnly:false, showFav:false };
let liveResults = [];
let favs = new Set(JSON.parse(localStorage.getItem("bb_favs")||"[]"));
let custom = JSON.parse(localStorage.getItem("bb_custom")||"[]");
let apiKey = localStorage.getItem("bb_key")||"";

function thumb(p){ return p.youtubeId ? `https://i.ytimg.com/vi/${p.youtubeId}/hqdefault.jpg` : ""; }
function ytUrl(p){ return p.youtubeId ? `https://www.youtube.com/watch?v=${p.youtubeId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(p.title)}`; }
function allProjects(){ return [...custom, ...liveResults, ...CURATED]; }

function renderCats(){
  catsEl.innerHTML="";
  CATS.forEach(c=>{
    const b=document.createElement("button");
    b.className="pill"+(state.cat===c?" active":"");
    b.textContent=c;
    b.onclick=()=>{state.cat=c;render();};
    catsEl.appendChild(b);
  });
}

function filtered(){
  let list=allProjects();
  if(state.q){
    const q=state.q.toLowerCase();
    list=list.filter(p=>(p.title+" "+p.channel+" "+p.desc+" "+p.cat).toLowerCase().includes(q));
  }
  if(state.cat!=="All") list=list.filter(p=>p.cat===state.cat);
  if(state.level!=="all") list=list.filter(p=>p.level===state.level);
  if(state.favOnly) list=list.filter(p=>favs.has(p.youtubeId||p.title));
  if(state.sort==="easiest") list=[...list].sort((a,b)=>(LEVELS_RANK[a.level]??9)-(LEVELS_RANK[b.level]??9));
  if(state.sort==="az") list=[...list].sort((a,b)=>a.title.localeCompare(b.title));
  return list;
}

function render(){
  renderCats();
  const list=filtered();
  $("statTotal").textContent=allProjects().length;
  $("statLive").textContent=liveResults.length;
  $("favCount").textContent=favs.size;
  grid.innerHTML="";
  if(!list.length){ grid.innerHTML="<p style='color:var(--muted)'>No projects found. Try another search or clear filters.</p>"; return; }
  list.forEach(p=>{
    const key=p.youtubeId||p.title;
    const card=document.createElement("article");
    card.className="card";
    card.innerHTML=`
      <div class="thumb">
        ${p.youtubeId?`<img loading="lazy" src="${thumb(p)}" onerror="this.style.display='none'" alt="">`:""}
        <span class="badge">${p.cat}</span>
        ${p.live?`<span class="live">LIVE</span>`:""}
        <span class="dur">${p.time||""}</span>
      </div>
      <div class="body">
        <h3>${escapeHtml(p.title)}</h3>
        <div class="meta">${escapeHtml(p.channel||"YouTube")} • ${escapeHtml(p.level||"")}</div>
        <div class="desc">${escapeHtml(p.desc||"")}</div>
        <div class="tags"><span class="tag lvl-${p.level}">${p.level}</span><span class="tag">${p.cat}</span></div>
        <div class="actions">
          <button class="watch">▶ Watch</button>
          <a class="yt" href="${ytUrl(p)}" target="_blank">YouTube</a>
          <button class="save ${favs.has(key)?"on":""}">★</button>
        </div>
      </div>`;
    card.querySelector(".watch").onclick=()=>openVideo(p);
    card.querySelector(".save").onclick=e=>{toggleFav(key);e.target.classList.toggle("on");};
    grid.appendChild(card);
  });
}

function escapeHtml(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function toggleFav(k){ favs.has(k)?favs.delete(k):favs.add(k); localStorage.setItem("bb_favs",JSON.stringify([...favs])); $("favCount").textContent=favs.size; if(state.favOnly)render(); }
function toast(m){ const t=$("toast"); t.textContent=m; t.hidden=false; setTimeout(()=>t.hidden=true,2200); }

// Modal
let current=null;
function openVideo(p){
  current=p;
  if(!p.youtubeId){ window.open(ytUrl(p),"_blank"); toast("No embed — opened YouTube search"); return; }
  $("player").src=`https://www.youtube-nocookie.com/embed/${p.youtubeId}?autoplay=1&rel=0`;
  $("mTitle").textContent=p.title;
  $("mMeta").textContent=`${p.channel||""} • ${p.cat} • ${p.level} • ${p.time||""}`;
  $("mDesc").textContent=p.desc||"";
  $("mLink").href=ytUrl(p);
  $("modal").hidden=false;
}
$("modalClose").onclick=()=>{$("modal").hidden=true;$("player").src="";};
$("modal").addEventListener("click",e=>{if(e.target.id==="modal"){$("modal").hidden=true;$("player").src="";}});
$("mSave").onclick=()=>{ if(current){toggleFav(current.youtubeId||current.title); render(); toast("Saved ★");}};

// Search + filters
let debounce;
$("search").addEventListener("input",e=>{
  clearTimeout(debounce);
  debounce=setTimeout(()=>{state.q=e.target.value.trim(); render(); liveSearch(state.q);},400);
});
$("searchBtn").onclick=()=>{state.q=$("search").value.trim(); render(); liveSearch(state.q);};
$("difficulty").onchange=e=>{state.level=e.target.value;render();};
$("sort").onchange=e=>{state.sort=e.target.value;render();};
$("favOnly").onchange=e=>{state.favOnly=e.target.checked;render();};
$("favToggle").onclick=()=>{state.favOnly=!state.favOnly;$("favOnly").checked=state.favOnly;render();};

// Settings
$("settingsBtn").onclick=()=>{$("settings").hidden=false;$("apiKey").value=apiKey;};
$("heroApiBtn").onclick=()=>{$("settings").hidden=false;$("apiKey").value=apiKey;};
$("settingsClose").onclick=()=>$("settings").hidden=true;
$("saveKey").onclick=()=>{apiKey=$("apiKey").value.trim();localStorage.setItem("bb_key",apiKey);$("settings").hidden=true;toast(apiKey?"API connected":""); if(state.q) liveSearch(state.q);};
$("clearKey").onclick=()=>{apiKey="";localStorage.removeItem("bb_key");$("apiKey").value="";liveResults=[];$("liveNote").hidden=true;render();};

// Add
$("addBtn").onclick=()=>$("addModal").hidden=false;
$("addClose").onclick=()=>$("addModal").hidden=true;
$("fSave").onclick=()=>{
  const title=$("fTitle").value.trim(), url=$("fUrl").value.trim();
  if(!title||!url) return toast("Add title + YouTube URL");
  const id=parseId(url);
  if(!id) return toast("Could not find video ID in URL");
  custom.unshift({title, youtubeId:id, channel:"My pick", cat:$("fCat").value, level:$("fLevel").value, time:$("fTime").value||"—", desc:$("fDesc").value||""});
  localStorage.setItem("bb_custom",JSON.stringify(custom));
  $("addModal").hidden=true; ["fTitle","fUrl","fTime","fDesc"].forEach(i=>$(i).value="");
  render(); toast("Project added ✓");
};
function parseId(u){
  const m=String(u).match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m?m[1]:(/^[A-Za-z0-9_-]{11}$/.test(u.trim())?u.trim():null);
}

// Live YouTube search
async function liveSearch(q){
  const note=$("liveNote");
  if(!apiKey||!q){ if(!q){liveResults=[];note.hidden=true;render();} return; }
  note.hidden=false; note.textContent="Searching YouTube live…";
  try{
    const r=await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(q+" project tutorial build")}&key=${apiKey}`);
    const j=await r.json();
    if(j.error) throw new Error(j.error.message);
    liveResults=(j.items||[]).map(it=>({
      title:it.snippet.title, channel:it.snippet.channelTitle,
      cat:guessCat(it.snippet.title+it.snippet.description),
      level:"Intermediate", time:"▶", youtubeId:it.id.videoId,
      desc:it.snippet.description.slice(0,140), live:true
    }));
    note.textContent=`Live from YouTube: ${liveResults.length} results for “${q}”`;
    render();
  }catch(e){ note.textContent="Live search failed: "+e.message; }
}
function guessCat(t){
  t=t.toLowerCase();
  if(/arduino|esp32|sensor/.test(t)) return "Arduino";
  if(/raspberry|pi pico/.test(t)) return "Raspberry Pi";
  if(/3d print|ender|prusa/.test(t)) return "3D Printing";
  if(/ai|gpt|llm|chatbot/.test(t)) return "AI";
  if(/react|python|javascript|html|css|web|app|game/.test(t)) return "Coding";
  return "DIY";
}

render();
