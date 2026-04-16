import { useState, useEffect, useRef } from "react";

// ── PÓLKA Brand System ────────────────────────────────────────────────────────
const B = {
  // Backgrounds
  bg:        "#F4F2ED",
  bgWarm:    "#ECEAE3",
  card:      "#FFFFFF",

  // Brand Navy/Blue gradient
  navy:      "#152060",
  blue:      "#2040B0",
  blueLight: "#2D52C8",
  bluePale:  "#EEF2FF",
  blueMid:   "#6880D0",

  // Amber/Gold accent
  amber:     "#E8C84A",
  gold:      "#D4A017",
  goldPale:  "#FDF6DC",

  // Mint/Green accent
  mint:      "#6DBF67",
  grass:     "#4CAF50",
  mintPale:  "#EDFAEC",

  // Neutrals
  text:      "#0E1428",
  mid:       "#525A7A",
  faint:     "#9AA0BC",
  border:    "#E2E0D8",

  // Shadows
  shadow:    "0 2px 16px rgba(21,32,96,.08)",
  shadowMd:  "0 8px 40px rgba(21,32,96,.13)",
  shadowLg:  "0 16px 60px rgba(21,32,96,.18)",
};

const FD = "'Georgia','Times New Roman',serif";
const FB = "-apple-system,'Helvetica Neue',sans-serif";

// Google review URL (Place ID: ChIJ0cniXfClUQ0RIxI6MlDNK8Y)
const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJ0cniXfClUQ0RIxI6MlDNK8Y";
// Apps Script — sustituir por tu URL real
const SHEET_URL = "https://script.google.com/macros/s/AKfycbyR5xS9XJNwVNnz6lEWaLDcLq3BDnFipfawFkeChMO-a8qC0KoPPbYh6EH7B3Ly_EU94w/exec";

// ── SVG Icon System — Squircle 3D ceramic-lacquer ─────────────────────────────
// Shared squircle container
function Squircle({ size=56, children, glow=false, pale=false }) {
  return (
    <div style={{
      width:`${size}px`, height:`${size}px`,
      borderRadius:`${size*0.28}px`,
      background: pale ? B.bluePale : "#fff",
      boxShadow: glow
        ? `0 4px 20px rgba(32,64,176,.25), 0 1px 4px rgba(21,32,96,.12)`
        : `0 3px 14px rgba(21,32,96,.13), 0 1px 3px rgba(21,32,96,.08)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      flexShrink:0,
    }}>{children}</div>
  );
}

// Prize icon — ceramic plate with gradient
function IconPlate({ size=32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <radialGradient id="plate" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#4060D0"/>
          <stop offset="100%" stopColor="#152060"/>
        </radialGradient>
        <radialGradient id="plateShine" cx="30%" cy="25%" r="40%">
          <stop offset="0%" stopColor="rgba(255,255,255,.45)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <ellipse cx="16" cy="17" rx="13" ry="12" fill="url(#plate)"/>
      <ellipse cx="16" cy="17" rx="13" ry="12" fill="url(#plateShine)"/>
      <ellipse cx="16" cy="17" rx="9" ry="8" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1"/>
      <ellipse cx="12" cy="13" rx="3" ry="2" fill="rgba(255,255,255,.25)"/>
    </svg>
  );
}

function IconGift({ size=32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="giftBox" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D52C8"/>
          <stop offset="100%" stopColor="#152060"/>
        </linearGradient>
        <linearGradient id="giftRib" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0D060"/>
          <stop offset="100%" stopColor="#D4A017"/>
        </linearGradient>
      </defs>
      <rect x="6" y="14" width="20" height="13" rx="2" fill="url(#giftBox)"/>
      <rect x="6" y="10" width="20" height="5" rx="1.5" fill="#2040B0"/>
      <rect x="14.5" y="10" width="3" height="17" fill="url(#giftRib)"/>
      <rect x="6" y="13" width="20" height="2.5" fill="url(#giftRib)"/>
      <path d="M16 10 C16 10 12 6 11 8 C10 10 14 10 16 10 C16 10 20 10 21 8 C22 6 16 10 16 10Z" fill="url(#giftRib)"/>
      <ellipse cx="11" cy="12" rx="2" ry="1.2" fill="rgba(255,255,255,.15)"/>
    </svg>
  );
}

function IconStar({ size=32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="starG" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#F0D060"/>
          <stop offset="100%" stopColor="#C48010"/>
        </linearGradient>
        <filter id="starGlow">
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d="M16 4L19.1 12.1L28 12.9L21.5 18.7L23.6 27.4L16 22.8L8.4 27.4L10.5 18.7L4 12.9L12.9 12.1L16 4Z"
        fill="url(#starG)" filter="url(#starGlow)"/>
      <path d="M16 6L18.6 13L26 13.7L20.4 18.7L22.2 26L16 22.1" fill="rgba(255,255,255,.2)"/>
    </svg>
  );
}

function IconTicket({ size=28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <defs>
        <linearGradient id="tickG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4060D0"/>
          <stop offset="100%" stopColor="#152060"/>
        </linearGradient>
      </defs>
      <rect x="2" y="8" width="24" height="12" rx="3" fill="url(#tickG)"/>
      <circle cx="8" cy="14" r="2.5" fill="rgba(255,255,255,.15)"/>
      <circle cx="20" cy="14" r="2.5" fill="rgba(255,255,255,.15)"/>
      <rect x="10" y="11" width="8" height="6" rx="1.5" fill="rgba(255,255,255,.2)"/>
      <line x1="8" y1="8" x2="8" y2="8" stroke="none"/>
      <path d="M2 12 C4 12 4 16 2 16" stroke="rgba(255,255,255,.3)" strokeWidth="1" fill="none"/>
      <path d="M26 12 C24 12 24 16 26 16" stroke="rgba(255,255,255,.3)" strokeWidth="1" fill="none"/>
      <rect x="12" y="13" width="4" height="2" rx="1" fill="#E8C84A"/>
    </svg>
  );
}

function IconPin({ size=32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="pinG" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#3050C0"/>
          <stop offset="100%" stopColor="#152060"/>
        </linearGradient>
      </defs>
      <path d="M16 3C11.6 3 8 6.6 8 11C8 17 16 29 16 29C16 29 24 17 24 11C24 6.6 20.4 3 16 3Z" fill="url(#pinG)"/>
      <circle cx="16" cy="11" r="4" fill="rgba(255,255,255,.25)"/>
      <circle cx="14.5" cy="9.5" r="1.5" fill="rgba(255,255,255,.4)"/>
    </svg>
  );
}

function IconLeaf({ size=28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <defs>
        <linearGradient id="leafG" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#7DCF72"/>
          <stop offset="100%" stopColor="#3A9E35"/>
        </linearGradient>
      </defs>
      <path d="M14 4C14 4 22 6 22 14C22 19 18 23 14 24C14 24 6 22 6 14C6 8 14 4 14 4Z" fill="url(#leafG)"/>
      <path d="M14 24 L14 10" stroke="rgba(255,255,255,.4)" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M14 18 C11 16 8 14 8 14" stroke="rgba(255,255,255,.3)" strokeWidth="1" strokeLinecap="round"/>
      <path d="M14 14 C17 12 20 11 20 11" stroke="rgba(255,255,255,.3)" strokeWidth="1" strokeLinecap="round"/>
      <ellipse cx="10" cy="10" rx="2" ry="1.5" transform="rotate(-20 10 10)" fill="rgba(255,255,255,.2)"/>
    </svg>
  );
}

function IconCheck({ size=36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <defs>
        <linearGradient id="checkG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4060D0"/>
          <stop offset="100%" stopColor="#152060"/>
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="17" fill="url(#checkG)"/>
      <circle cx="18" cy="18" r="17" fill="url(#checkShine)" opacity=".3"/>
      <path d="M10 18L15.5 24L26 12" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      <ellipse cx="13" cy="12" rx="4" ry="2.5" fill="rgba(255,255,255,.15)" transform="rotate(-20 13 12)"/>
      <defs>
        <radialGradient id="checkShine" cx="30%" cy="25%" r="50%">
          <stop offset="0%" stopColor="white"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

// ── Prize data ────────────────────────────────────────────────────────────────
const PREMIOS_DIRECTOS = [
  { id:"pincho",   Icon:()=><IconPlate size={28}/>, title:"x1 Pincho gratis",      desc:"1,90€ · Lun–Jue · Mín. 15€",        prob:.40, days:21, sorteo:2 },
  { id:"postre",   Icon:()=><IconPlate size={28}/>, title:"x1 Postre de la casa",   desc:"Válido mediodía · Mín. 2 personas",  prob:.28, days:30, sorteo:1 },
  { id:"txakoli",  Icon:()=><IconStar size={26}/>,  title:"x1 Copa de txakoli",     desc:"De bienvenida · Próxima reserva",    prob:.20, days:30, sorteo:1 },
  { id:"desc",     Icon:()=><IconGift size={26}/>,  title:"10% próxima visita",     desc:"Lun–Jue · Mín. 25€ · 21 días",      prob:.12, days:21, sorteo:1 },
];
const SORTEOS = [
  { id:"cena",  Icon:()=><IconPlate size={28}/>, title:"Cena para 2 en POLKA",      desc:"Valor 80€ · Sorteo último viernes" },
  { id:"hotel", Icon:()=><IconPin size={28}/>,   title:"1 noche hotel boutique",    desc:"Donostia · Sorteo último domingo" },
  { id:"cesta", Icon:()=><IconLeaf size={24}/>,  title:"Cesta gourmet vasca",       desc:"Valor 60€ · Sorteo mensual" },
];

function pickPrize(pool=PREMIOS_DIRECTOS) {
  let r = Math.random(), acc = 0;
  for (const p of pool) { acc += p.prob; if (r < acc) return p; }
  return pool[pool.length - 1];
}
function mkCode() { return Math.random().toString(36).toUpperCase().slice(2, 8); }
function expDate(days) {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toLocaleDateString("es-ES", { day:"numeric", month:"long", year:"numeric" });
}

// ── Confetti — brand colors ───────────────────────────────────────────────────
function Confetti({ active }) {
  const cvs = useRef(null);
  const raf  = useRef(null);
  const pts  = useRef([]);
  useEffect(() => {
    if (!active) return;
    const c = cvs.current; if (!c) return;
    c.width = window.innerWidth; c.height = window.innerHeight;
    const cols = [B.blue, B.blueLight, B.navy, B.amber, B.gold, B.mint, "#FFFFFF", B.bluePale];
    pts.current = Array.from({ length: 90 }, () => ({
      x: Math.random()*c.width, y: -10-Math.random()*50,
      r: 3+Math.random()*5, color: cols[Math.floor(Math.random()*cols.length)],
      vx:(Math.random()-.5)*3, vy:2+Math.random()*3,
      rot:Math.random()*360, vr:(Math.random()-.5)*5,
      shape:Math.random()>.5?"rect":"circle",
    }));
    function draw() {
      const ctx=c.getContext("2d"); ctx.clearRect(0,0,c.width,c.height);
      pts.current=pts.current.filter(p=>p.y<c.height+20);
      for(const p of pts.current){
        p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle=p.color;
        if(p.shape==="rect") ctx.fillRect(-p.r,-p.r/2,p.r*2,p.r);
        else{ctx.beginPath();ctx.arc(0,0,p.r,0,Math.PI*2);ctx.fill();}
        ctx.restore();
      }
      if(pts.current.length>0) raf.current=requestAnimationFrame(draw);
    }
    raf.current=requestAnimationFrame(draw);
    return()=>cancelAnimationFrame(raf.current);
  },[active]);
  return <canvas ref={cvs} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:99}}/>;
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Btn({ label, onClick, variant="primary", disabled=false, icon=null, small=false }) {
  const v = {
    primary: { bg:disabled?B.border:B.blue, color:disabled?B.faint:"#fff", border:"none",
               shadow:disabled?"none":`0 4px 16px rgba(32,64,176,.35)` },
    ghost:   { bg:"transparent", color:B.blue, border:`1.5px solid ${B.blue}`, shadow:"none" },
    soft:    { bg:B.bluePale, color:B.blue, border:"none", shadow:"none" },
    white:   { bg:B.card, color:B.text, border:`1px solid ${B.border}`, shadow:B.shadow },
    amber:   { bg:`linear-gradient(135deg,${B.amber},${B.gold})`, color:B.navy, border:"none",
               shadow:`0 4px 16px rgba(212,160,23,.35)` },
  }[variant]||{};
  return (
    <button onClick={disabled?undefined:onClick} style={{
      width:"100%", padding:small?"11px 16px":"15px 20px",
      borderRadius:"14px", background:v.bg, color:v.color,
      border:v.border||"none", boxShadow:v.shadow||"none",
      fontSize:small?"13px":"15px", fontWeight:"600", fontFamily:FB,
      cursor:disabled?"default":"pointer", letterSpacing:"-.01em",
      transition:"all .18s", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
    }}>{icon}{label}</button>
  );
}

function Header({ onReset, lang, setLang }) {
  return (
    <div style={{padding:"20px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div>
        <div style={{fontFamily:FD,fontSize:"22px",fontWeight:700,color:B.navy,letterSpacing:".06em"}}>PÓLKA</div>
        <div style={{fontFamily:FB,fontSize:"9px",color:B.faint,letterSpacing:".22em",marginTop:"1px"}}>SAN SEBASTIÁN</div>
      </div>
      <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
        {["ES","EN"].map(l=>(
          <button key={l} onClick={()=>setLang(l.toLowerCase())} style={{
            padding:"4px 10px",borderRadius:"20px",fontFamily:FB,fontSize:"11px",fontWeight:"600",
            background:lang===l.toLowerCase()?B.blue:"transparent",
            color:lang===l.toLowerCase()?"#fff":B.faint,
            border:lang===l.toLowerCase()?"none":`1px solid ${B.border}`,
            cursor:"pointer",transition:"all .15s",
          }}>{l}</button>
        ))}
        <button onClick={onReset} style={{padding:"4px 10px",borderRadius:"20px",fontFamily:FB,fontSize:"11px",background:"transparent",border:`1px solid ${B.border}`,color:B.faint,cursor:"pointer"}}>↺</button>
      </div>
    </div>
  );
}

function Dots({ step }) {
  return (
    <div style={{display:"flex",gap:"5px",justifyContent:"center",padding:"14px 0 2px"}}>
      {[1,2,3,4].map(i=>(
        <div key={i} style={{width:i===step?"24px":"7px",height:"7px",borderRadius:"4px",background:i<=step?B.blue:B.border,transition:"all .3s"}}/>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// STEP 1 — Prize catalogue
// ════════════════════════════════════════════════════════════════════════════
function Step1({ lang, premios=PREMIOS_DIRECTOS, sorteos=SORTEOS, onNext }) {
  const [tab, setTab] = useState("directos");
  const es = lang==="es";
  return (
    <div style={{padding:"26px 20px 0"}}>
      {/* Hero */}
      <div style={{textAlign:"center",marginBottom:"24px"}}>
        <div style={{display:"inline-flex",marginBottom:"16px"}}>
          <Squircle size={64} glow>
            <IconGift size={36}/>
          </Squircle>
        </div>
        <h1 style={{fontFamily:FD,fontSize:"24px",fontWeight:400,color:B.text,margin:"0 0 8px",lineHeight:1.25}}>
          {es?"Premios que puedes ganar":"Prizes you can win"}
        </h1>
        <p style={{fontFamily:FB,fontSize:"13px",color:B.mid,margin:0}}>
          {es?"1 participación por cada 25€ de consumo":"1 entry per every 25€ spent"}
        </p>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",background:B.bgWarm,borderRadius:"12px",padding:"3px",marginBottom:"16px"}}>
        {[["directos",es?"Premios directos":"Direct prizes"],["sorteos",es?"Sorteos":"Prize draws"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{
            flex:1,padding:"9px 4px",borderRadius:"9px",fontFamily:FB,fontSize:"12px",
            fontWeight:tab===k?"700":"500",
            background:tab===k?B.card:"transparent",
            color:tab===k?B.navy:B.mid,
            border:"none",cursor:"pointer",
            boxShadow:tab===k?B.shadow:"none",transition:"all .2s",
          }}>{l}</button>
        ))}
      </div>

      {/* List */}
      <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"24px"}}>
        {tab==="directos" ? premios.map(p=>(
          <div key={p.id} style={{background:B.card,borderRadius:"14px",padding:"13px 16px",boxShadow:B.shadow,display:"flex",alignItems:"center",gap:"12px"}}>
            <Squircle size={46}><p.Icon/></Squircle>
            <div style={{flex:1}}>
              <div style={{fontFamily:FB,fontSize:"13px",fontWeight:"600",color:B.text,marginBottom:"2px"}}>{p.title}</div>
              <div style={{fontFamily:FB,fontSize:"11px",color:B.mid}}>{p.desc}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
              <IconTicket size={20}/>
              <span style={{fontFamily:FB,fontSize:"10px",fontWeight:"700",color:B.navy}}>×{p.sorteo}</span>
            </div>
          </div>
        )) : sorteos.map(s=>(
          <div key={s.id} style={{background:B.card,borderRadius:"14px",padding:"13px 16px",boxShadow:B.shadow,display:"flex",alignItems:"center",gap:"12px"}}>
            <Squircle size={46}><s.Icon/></Squircle>
            <div style={{flex:1}}>
              <div style={{fontFamily:FB,fontSize:"13px",fontWeight:"600",color:B.text,marginBottom:"2px"}}>{s.title}</div>
              <div style={{fontFamily:FB,fontSize:"11px",color:B.mid}}>{s.desc}</div>
            </div>
            <span style={{background:B.bluePale,color:B.blue,fontSize:"10px",fontWeight:"700",fontFamily:FB,padding:"3px 8px",borderRadius:"6px"}}>SORTEO</span>
          </div>
        ))}
      </div>

      <Btn label={es?"Participar →":"Enter →"} onClick={onNext}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// STEP 2 — Scratch
// ════════════════════════════════════════════════════════════════════════════
function Step2({ lang, prize, setPrize, premios=PREMIOS_DIRECTOS, participaciones, onNext }) {
  const cvs=useRef(null), drawing=useRef(false);
  const [revealed,setRevealed]=useState(false);
  const [fading,setFading]=useState(false);
  const [confetti,setConfetti]=useState(false);
  const [badge,setBadge]=useState(false);
  const es=lang==="es";

  useEffect(()=>{
    setPrize(pickPrize(premios));
    const c=cvs.current; if(!c) return;
    const ctx=c.getContext("2d");
    const g=ctx.createLinearGradient(0,0,c.width,c.height);
    g.addColorStop(0,"#2D52C8"); g.addColorStop(1,"#152060");
    ctx.fillStyle=g; ctx.fillRect(0,0,c.width,c.height);
    // ceramic texture
    for(let x=0;x<c.width;x+=18) for(let y=0;y<c.height;y+=18){
      ctx.fillStyle="rgba(255,255,255,.04)";
      ctx.fillRect(x,y,9,9);
    }
    ctx.fillStyle="rgba(255,255,255,.85)";
    ctx.font="bold 14px -apple-system,sans-serif"; ctx.textAlign="center";
    ctx.fillText(es?"RASCA AQUÍ":"SCRATCH HERE",c.width/2,c.height/2-6);
    ctx.font="11px -apple-system,sans-serif"; ctx.fillStyle="rgba(255,255,255,.45)";
    ctx.fillText(es?"desliza el dedo":"swipe your finger",c.width/2,c.height/2+12);
  },[]);

  function scratch(e){
    if(revealed) return;
    const c=cvs.current; if(!c) return;
    const ctx=c.getContext("2d");
    const rect=c.getBoundingClientRect();
    const sx=c.width/rect.width,sy=c.height/rect.height;
    const cx=e.touches?e.touches[0].clientX:e.clientX;
    const cy=e.touches?e.touches[0].clientY:e.clientY;
    ctx.globalCompositeOperation="destination-out";
    ctx.beginPath(); ctx.arc((cx-rect.left)*sx,(cy-rect.top)*sy,34,0,Math.PI*2); ctx.fill();
    const d=ctx.getImageData(0,0,c.width,c.height).data;
    let t=0; for(let i=3;i<d.length;i+=4) if(d[i]<128) t++;
    if(t/(c.width*c.height)>.52){
      setFading(true);
      setTimeout(()=>{setRevealed(true);setFading(false);setConfetti(true);setBadge(true);setTimeout(()=>setConfetti(false),3000);},320);
    }
  }

  return (
    <div style={{padding:"20px 20px 0"}}>
      <Confetti active={confetti}/>
      {badge&&(
        <div style={{
          background:`linear-gradient(135deg,${B.blue},${B.navy})`,
          borderRadius:"14px",padding:"12px 16px",
          display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px",
          boxShadow:`0 6px 24px rgba(32,64,176,.3)`,
          animation:"popIn .4s cubic-bezier(.34,1.56,.64,1)",
        }}>
          <Squircle size={36} pale><IconTicket size={20}/></Squircle>
          <span style={{fontFamily:FB,fontSize:"13px",fontWeight:"700",color:"#fff"}}>
            +{participaciones} {es?"participaciones para el sorteo":"entries for the draw"}
          </span>
        </div>
      )}

      <p style={{fontFamily:FB,fontSize:"10px",color:B.faint,letterSpacing:".14em",textAlign:"center",margin:"0 0 14px"}}>
        {es?"TU PREMIO DIRECTO":"YOUR DIRECT PRIZE"}
      </p>

      {/* Scratch card */}
      <div style={{position:"relative",borderRadius:"20px",overflow:"hidden",boxShadow:B.shadowLg,marginBottom:"16px"}}>
        {prize&&(
          <div style={{background:B.card,padding:"38px 24px",textAlign:"center",minHeight:"172px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            <div style={{marginBottom:"14px"}}>
              <Squircle size={64} glow><prize.Icon/></Squircle>
            </div>
            <div style={{fontFamily:FD,fontSize:"22px",color:B.text,marginBottom:"6px"}}>{prize.title}</div>
            <div style={{fontFamily:FB,fontSize:"13px",color:B.blue,fontWeight:"600"}}>{prize.desc}</div>
          </div>
        )}
        {!revealed&&(
          <canvas ref={cvs} width={400} height={172}
            style={{position:"absolute",inset:0,width:"100%",height:"100%",touchAction:"none",cursor:"crosshair",opacity:fading?0:1,transition:"opacity .32s"}}
            onMouseDown={()=>drawing.current=true}
            onMouseUp={()=>drawing.current=false}
            onMouseMove={e=>drawing.current&&scratch(e)}
            onTouchStart={scratch}
            onTouchMove={e=>{e.preventDefault();scratch(e);}}
          />
        )}
      </div>

      {revealed&&prize&&(
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          <div style={{background:B.card,borderRadius:"13px",padding:"13px 16px",boxShadow:B.shadow,borderLeft:`3px solid ${B.blue}`}}>
            <div style={{fontFamily:FB,fontSize:"12px",color:B.mid,lineHeight:1.55}}>{prize.desc}</div>
          </div>
          <Btn label={es?"Reclamar mi premio →":"Claim my prize →"} onClick={onNext}/>
        </div>
      )}
      {!revealed&&(
        <p style={{textAlign:"center",fontFamily:FB,fontSize:"12px",color:B.faint,margin:"10px 0 0"}}>
          ↑ {es?"Rasca para revelar tu premio":"Scratch to reveal your prize"}
        </p>
      )}
      <style>{`@keyframes popIn{from{opacity:0;transform:scale(.92) translateY(-10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// STEP 3 — Data form
// ════════════════════════════════════════════════════════════════════════════
function Step3({ lang, prize, code, name, setName, email, setEmail, onNext }) {
  const exp=prize?.days?expDate(prize.days):null;
  const valid=name.trim().length>1;
  const es=lang==="es";

  return (
    <div style={{padding:"20px 20px 0"}}>
      {/* Prize card */}
      <div style={{background:B.card,borderRadius:"20px",overflow:"hidden",marginBottom:"14px",boxShadow:B.shadowMd}}>
        {/* Navy gradient header */}
        <div style={{background:`linear-gradient(135deg,${B.blue} 0%,${B.navy} 100%)`,padding:"24px 20px 20px",textAlign:"center"}}>
          <div style={{display:"inline-flex",marginBottom:"12px"}}>
            <Squircle size={60} pale>{prize&&<prize.Icon/>}</Squircle>
          </div>
          <div style={{fontFamily:FD,fontSize:"20px",color:"#fff",marginBottom:"4px"}}>{prize?.title}</div>
          <div style={{fontFamily:FB,fontSize:"12px",color:"rgba(255,255,255,.65)",marginBottom:"18px"}}>{prize?.desc}</div>
          {/* Code */}
          <div style={{background:"rgba(255,255,255,.1)",borderRadius:"12px",padding:"13px",backdropFilter:"blur(8px)"}}>
            <div style={{fontFamily:"'SF Mono','Courier New',monospace",fontSize:"27px",fontWeight:"700",color:B.amber,letterSpacing:".22em"}}>{code}</div>
            <div style={{fontFamily:FB,fontSize:"9px",color:"rgba(255,255,255,.4)",marginTop:"4px",letterSpacing:".1em"}}>
              {es?"CÓDIGO · MUESTRA AL PERSONAL":"CODE · SHOW TO STAFF"}
            </div>
          </div>
          {exp&&<div style={{fontFamily:FB,fontSize:"10px",color:"rgba(255,255,255,.35)",marginTop:"10px"}}>
            {es?`Caduca el ${exp}`:`Expires ${exp}`}
          </div>}
        </div>
        {/* Amber sorteo strip */}
        <div style={{padding:"12px 18px",background:B.goldPale,display:"flex",alignItems:"center",gap:"8px"}}>
          <IconTicket size={20}/>
          <span style={{fontFamily:FB,fontSize:"12px",color:B.navy,fontWeight:"600"}}>
            +{prize?.sorteo||1} {es?"participaciones en el sorteo":"entries for the draw"}
          </span>
        </div>
        {/* Conditions */}
        <div style={{padding:"12px 18px",borderTop:`1px solid ${B.border}`}}>
          <div style={{fontFamily:FB,fontSize:"12px",color:B.mid,lineHeight:1.5}}>{prize?.desc}</div>
        </div>
      </div>

      {/* Form */}
      <div style={{background:B.card,borderRadius:"16px",overflow:"hidden",boxShadow:B.shadow,marginBottom:"12px"}}>
        <div style={{padding:"13px 16px 0"}}>
          <div style={{fontFamily:FB,fontSize:"9px",color:B.faint,letterSpacing:".14em"}}>
            {es?"RECIBIR PREMIO POR EMAIL":"RECEIVE PRIZE BY EMAIL"}
          </div>
        </div>
        <div style={{padding:"8px 16px 0",borderBottom:`1px solid ${B.border}`}}>
          <div style={{fontFamily:FB,fontSize:"9px",color:B.faint,marginBottom:"3px"}}>{es?"NOMBRE *":"NAME *"}</div>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder={es?"Tu nombre":"Your name"}
            style={{width:"100%",padding:"0 0 12px",border:"none",background:"transparent",fontFamily:FB,fontSize:"16px",color:B.text,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{padding:"8px 16px 14px"}}>
          <div style={{fontFamily:FB,fontSize:"9px",color:B.faint,marginBottom:"3px"}}>{es?"EMAIL (opcional)":"EMAIL (optional)"}</div>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com"
            style={{width:"100%",padding:0,border:"none",background:"transparent",fontFamily:FB,fontSize:"16px",color:B.text,outline:"none",boxSizing:"border-box"}}/>
        </div>
      </div>

      <p style={{fontFamily:FB,fontSize:"11px",color:B.faint,textAlign:"center",margin:"0 0 13px",lineHeight:1.4}}>
        {es?"Muestra esta pantalla al personal al llegar":"Show this screen to staff on arrival"}
      </p>
      <Btn label={es?"Continuar →":"Continue →"} onClick={onNext} disabled={!valid}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// STEP 4 — Review
// ════════════════════════════════════════════════════════════════════════════
function Step4({ lang, name, prize, code, email, stars, setStars, feedback, setFeedback, done, setDone }) {
  const [sending,setSending]=useState(false);
  const positive=stars>=4;
  const firstName=name?name.split(" ")[0]:null;
  const es=lang==="es";

  async function submitAndReview() {
    setSending(true);
    try {
      await fetch(SHEET_URL,{
        method:"POST",
        body:JSON.stringify({
          nombre:name, email, premio:prize?.title,
          codigo:code, estrellas:stars, feedback, lang,
        }),
      });
    } catch(e){ console.log("Sheet error",e); }
    setSending(false);
    setDone(true);
    window.open(GOOGLE_REVIEW_URL,"_blank");
  }

  async function submitOnly() {
    setSending(true);
    try {
      await fetch(SHEET_URL,{
        method:"POST",
        body:JSON.stringify({
          nombre:name, email, premio:prize?.title,
          codigo:code, estrellas:stars, feedback, lang,
        }),
      });
    } catch(e){ console.log("Sheet error",e); }
    setSending(false);
    setDone(true);
  }

  if(done){
    return (
      <div style={{padding:"44px 20px 0",textAlign:"center"}}>
        <div style={{display:"inline-flex",marginBottom:"20px"}}>
          <Squircle size={80} glow><IconCheck size={44}/></Squircle>
        </div>
        <h2 style={{fontFamily:FD,fontSize:"24px",fontWeight:400,color:B.text,margin:"0 0 10px"}}>
          {firstName?(es?`¡Hasta pronto, ${firstName}!`:`See you soon, ${firstName}!`):(es?"¡Hasta pronto!":"See you soon!")}
        </h2>
        <p style={{fontFamily:FB,fontSize:"14px",color:B.mid,margin:"0 0 30px",lineHeight:1.5}}>
          {es?"Eres parte de la familia POLKA.\nTe esperamos pronto.":"You're part of the POLKA family.\nSee you soon."}
        </p>
        <div style={{background:B.goldPale,borderRadius:"14px",padding:"14px 16px",marginBottom:"20px",display:"flex",gap:"12px",alignItems:"center",textAlign:"left"}}>
          <Squircle size={40}><IconTicket size={22}/></Squircle>
          <div style={{fontFamily:FB,fontSize:"12px",color:B.navy,fontWeight:"600",lineHeight:1.4}}>
            {es?"Recibirás tu premio y participaciones por email":"You'll receive your prize and entries by email"}
          </div>
        </div>
        <div style={{fontFamily:FB,fontSize:"14px",fontWeight:"700",color:B.blue,letterSpacing:".06em",marginBottom:"6px"}}>#POLKADONOSTIA</div>
        <div style={{fontFamily:FB,fontSize:"12px",color:B.faint}}>Fermín Calbetón, 4 · Parte Vieja · Donostia</div>
      </div>
    );
  }

  return (
    <div style={{padding:"20px 20px 0"}}>
      {/* Google card */}
      <div style={{background:B.card,borderRadius:"20px",overflow:"hidden",boxShadow:B.shadowMd,marginBottom:"14px"}}>
        <div style={{background:`linear-gradient(135deg,${B.blue},${B.navy})`,padding:"13px 18px",display:"flex",alignItems:"center",gap:"10px"}}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M21.35 11.1H12v2.8h5.35c-.24 1.26-1 2.33-2.1 3.04v2.52h3.4C20.65 17.52 21.8 14.8 21.8 12c0-.54-.16-1.06-.45-2.6z" fill="#fff"/>
            <path d="M12 22c2.7 0 4.97-.9 6.63-2.44l-3.4-2.52c-.9.6-2.04.96-3.23.96-2.48 0-4.58-1.68-5.34-3.94H3.1v2.6C4.74 19.96 8.14 22 12 22z" fill="#fff"/>
            <path d="M6.66 14.06A5.94 5.94 0 0 1 6.34 12c0-.72.13-1.42.32-2.06V7.34H3.1A10 10 0 0 0 2 12c0 1.6.38 3.12 1.1 4.46l3.56-2.4z" fill="#fff"/>
            <path d="M12 6.1c1.4 0 2.65.48 3.64 1.42l2.72-2.72C16.96 3.26 14.7 2.4 12 2.4 8.14 2.4 4.74 4.44 3.1 7.54l3.56 2.4C7.42 7.68 9.52 6.1 12 6.1z" fill="#fff"/>
          </svg>
          <div style={{fontFamily:FB,fontSize:"13px",fontWeight:"600",color:"#fff"}}>POLKA San Sebastián</div>
        </div>
        <div style={{padding:"20px"}}>
          {firstName&&<p style={{fontFamily:FB,fontSize:"13px",color:B.mid,margin:"0 0 14px"}}>{firstName}, {es?"¿cómo fue tu experiencia?":"how was your experience?"}</p>}
          <div style={{marginBottom:"16px"}}>
            <div style={{fontFamily:FB,fontSize:"9px",color:B.faint,letterSpacing:".1em",marginBottom:"8px"}}>{es?"VALORACIÓN GENERAL":"OVERALL RATING"}</div>
            <div style={{display:"flex",gap:"6px"}}>
              {[1,2,3,4,5].map(n=>(
                <button key={n} onClick={()=>setStars(n)} style={{background:"none",border:"none",cursor:"pointer",padding:"2px",fontSize:n<=stars?"37px":"30px",filter:n<=stars?"none":"grayscale(1) opacity(.22)",transform:n<=stars?"scale(1.08)":"scale(1)",transition:"all .15s"}}>★</button>
              ))}
            </div>
          </div>
          {stars>0&&positive&&(
            <div style={{marginBottom:"16px"}}>
              {[["Comida","🍽"],["Servicio","👤"],["Ambiente","✨"]].map(([cat,icon])=>(
                <div key={cat} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${B.border}`}}>
                  <div style={{fontFamily:FB,fontSize:"13px",color:B.text}}><span style={{marginRight:"6px"}}>{icon}</span>{cat}</div>
                  <div style={{display:"flex",gap:"2px"}}>{[1,2,3,4,5].map(n=><span key={n} style={{fontSize:"17px",color:B.amber}}>★</span>)}</div>
                </div>
              ))}
            </div>
          )}
          {stars>0&&(
            <textarea value={feedback} onChange={e=>setFeedback(e.target.value)} rows={3}
              placeholder={positive?(es?"Comparte detalles de tu experiencia...":"Share details of your experience..."):(es?"¿Qué podríamos haber hecho mejor?":"What could we have done better?")}
              style={{width:"100%",padding:"11px",borderRadius:"10px",border:`1px solid ${B.border}`,background:B.bg,fontFamily:FB,fontSize:"14px",color:B.text,resize:"none",outline:"none",boxSizing:"border-box"}}/>
          )}
        </div>
      </div>

      {stars>0&&positive&&(
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          <Btn label={sending?(es?"Enviando...":"Sending..."):(es?"Publicar en Google":"Post on Google")}
            onClick={submitAndReview} disabled={sending}
            icon={<svg width="15" height="15" viewBox="0 0 24 24"><path d="M21.35 11.1H12v2.8h5.35c-.24 1.26-1 2.33-2.1 3.04v2.52h3.4C20.65 17.52 21.8 14.8 21.8 12c0-.54-.16-1.06-.45-2.6z" fill="#fff"/><path d="M12 22c2.7 0 4.97-.9 6.63-2.44l-3.4-2.52c-.9.6-2.04.96-3.23.96-2.48 0-4.58-1.68-5.34-3.94H3.1v2.6C4.74 19.96 8.14 22 12 22z" fill="#fff"/><path d="M6.66 14.06A5.94 5.94 0 0 1 6.34 12c0-.72.13-1.42.32-2.06V7.34H3.1A10 10 0 0 0 2 12c0 1.6.38 3.12 1.1 4.46l3.56-2.4z" fill="#fff"/><path d="M12 6.1c1.4 0 2.65.48 3.64 1.42l2.72-2.72C16.96 3.26 14.7 2.4 12 2.4 8.14 2.4 4.74 4.44 3.1 7.54l3.56 2.4C7.42 7.68 9.52 6.1 12 6.1z" fill="#fff"/></svg>}
          />
          <div style={{display:"flex",gap:"8px"}}>
            {[["TripAdvisor","https://tripadvisor.com"],["Instagram","https://instagram.com/polkasansebastian"]].map(([p,url])=>(
              <button key={p} onClick={()=>{submitOnly();window.open(url,"_blank");}} style={{flex:1,padding:"12px",borderRadius:"13px",background:B.card,border:`1px solid ${B.border}`,color:B.text,fontSize:"13px",fontWeight:"600",fontFamily:FB,cursor:"pointer",boxShadow:B.shadow}}>{p}</button>
            ))}
          </div>
          <div style={{background:B.goldPale,borderRadius:"11px",padding:"11px 14px",display:"flex",gap:"10px",alignItems:"center"}}>
            <Squircle size={32}><IconTicket size={18}/></Squircle>
            <span style={{fontFamily:FB,fontSize:"12px",color:B.navy,fontWeight:"500"}}>{es?"Al publicar tu reseña entras en el sorteo extra":"Posting your review enters you into the extra draw"}</span>
          </div>
          <button onClick={submitOnly} style={{background:"none",border:"none",fontFamily:FB,fontSize:"12px",color:B.faint,cursor:"pointer",textDecoration:"underline",padding:"4px"}}>
            {es?"Omitir reseña":"Skip review"}
          </button>
        </div>
      )}

      {stars>0&&!positive&&(
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          <div style={{background:B.card,borderRadius:"13px",padding:"14px 16px",boxShadow:B.shadow}}>
            <div style={{fontFamily:FB,fontSize:"13px",fontWeight:"600",color:B.text,marginBottom:"3px"}}>{es?"Queremos mejorar":"We want to do better"}</div>
            <div style={{fontFamily:FB,fontSize:"12px",color:B.mid}}>{es?"Tu opinión llega directamente a la dirección":"Your feedback goes straight to management"}</div>
          </div>
          <Btn label={sending?(es?"Enviando...":"Sending..."):(es?"Enviar y terminar →":"Send & finish →")} onClick={submitOnly} disabled={sending}/>
        </div>
      )}

      {stars===0&&(
        <div style={{textAlign:"center",marginTop:"8px"}}>
          <button onClick={submitOnly} style={{background:"none",border:"none",fontFamily:FB,fontSize:"13px",color:B.faint,cursor:"pointer",textDecoration:"underline"}}>{es?"Omitir":"Skip"}</button>
        </div>
      )}
    </div>
  );
}



// ════════════════════════════════════════════════════════════════════════════
// PREMIOS EDITOR — panel visual para gestionar premios sin tocar código
// ════════════════════════════════════════════════════════════════════════════
function PremiosEditor({ premios, setPremios, sorteos=SORTEOS, setSorteos, onClose }) {
  const [editIdx, setEditIdx] = useState(null);
  const [draft, setDraft] = useState(null);
  const [editorTab, setEditorTab] = useState("directos");
  const [editSorteoIdx, setEditSorteoIdx] = useState(null);
  const [sortDraft, setSortDraft] = useState(null);

  function startEdit(i) {
    setEditIdx(i);
    setDraft({...premios[i]});
  }

  function saveEdit() {
    const updated = [...premios];
    updated[editIdx] = draft;
    setPremios(updated);
    setEditIdx(null);
    setDraft(null);
  }

  function cancelEdit() {
    setEditIdx(null);
    setDraft(null);
  }

  const totalProb = premios.reduce((s,p) => s + p.prob, 0);

  return (
    <div style={{position:"fixed",inset:0,background:B.bg,zIndex:500,overflowY:"auto",fontFamily:FB}}>
      <div style={{maxWidth:"430px",margin:"0 auto",padding:"24px 20px 80px"}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
          <div>
            <div style={{fontFamily:FD,fontSize:"20px",fontWeight:700,color:B.navy}}>Gestión de Premios</div>
            <div style={{fontSize:"11px",color:B.faint,marginTop:"2px"}}>Toca un premio para editarlo</div>
          </div>
          <button onClick={onClose} style={{background:B.card,border:`1px solid ${B.border}`,color:B.mid,fontSize:"18px",width:"40px",height:"40px",borderRadius:"50%",cursor:"pointer",boxShadow:B.shadow}}>✕</button>
        </div>

        {/* Tab switcher */}
        {editIdx === null && (
          <div style={{display:"flex",background:B.bgWarm,borderRadius:"12px",padding:"3px",marginBottom:"16px"}}>
            {[["directos","Premios Directos"],["sorteos","Sorteos"]].map(([k,l])=>(
              <button key={k} onClick={()=>setEditorTab(k)} style={{
                flex:1,padding:"9px 4px",borderRadius:"9px",fontFamily:FB,fontSize:"12px",
                fontWeight:editorTab===k?"700":"500",
                background:editorTab===k?B.card:"transparent",
                color:editorTab===k?B.navy:B.mid,
                border:"none",cursor:"pointer",
                boxShadow:editorTab===k?B.shadow:"none",transition:"all .2s",
              }}>{l}</button>
            ))}
          </div>
        )}

        {/* Prize list */}
        {editIdx === null ? (
          <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"20px"}}>
            {premios.map((p,i) => (
              <div key={p.id} onClick={() => startEdit(i)} style={{
                background:B.card,borderRadius:"16px",padding:"16px",
                boxShadow:B.shadow,border:`1px solid ${B.border}`,
                cursor:"pointer",display:"flex",gap:"12px",alignItems:"center",
                transition:"all .15s",
              }}>
                <Squircle size={46}><p.Icon/></Squircle>
                <div style={{flex:1}}>
                  <div style={{fontFamily:FB,fontSize:"13px",fontWeight:"700",color:B.navy,marginBottom:"3px"}}>{p.title}</div>
                  <div style={{fontFamily:FB,fontSize:"11px",color:B.mid,marginBottom:"4px"}}>{p.desc}</div>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    <div style={{height:"4px",width:"80px",background:B.border,borderRadius:"2px"}}>
                      <div style={{width:`${p.prob*100}%`,height:"100%",background:B.blue,borderRadius:"2px"}}/>
                    </div>
                    <span style={{fontSize:"11px",color:B.blue,fontWeight:"600"}}>{Math.round(p.prob*100)}%</span>
                  </div>
                </div>
                <div style={{fontSize:"18px",color:B.faint}}>›</div>
              </div>
            ))}

            {/* Prob warning */}
            {Math.abs(totalProb - 1) > 0.01 && (
              <div style={{background:"#FDF0F0",borderRadius:"12px",padding:"12px 16px",border:"1px solid #F0C0C0"}}>
                <div style={{fontFamily:FB,fontSize:"12px",color:"#C04040",fontWeight:"600"}}>
                  ⚠️ Las probabilidades suman {Math.round(totalProb*100)}% — deben sumar 100%
                </div>
              </div>
            )}

            {Math.abs(totalProb - 1) <= 0.01 && (
              <div style={{background:B.mintPale,borderRadius:"12px",padding:"12px 16px"}}>
                <div style={{fontFamily:FB,fontSize:"12px",color:B.green,fontWeight:"600"}}>
                  ✓ Probabilidades correctas — suman 100%
                </div>
              </div>
            )}
          </div>
        ) : editorTab === "sorteos" && editSorteoIdx === null ? (
          /* Sorteos list */
          <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"20px"}}>
            {sorteos.map((s,i) => (
              <div key={s.id} onClick={()=>{setEditSorteoIdx(i);setSortDraft({...s});}} style={{
                background:B.card,borderRadius:"16px",padding:"16px",
                boxShadow:B.shadow,border:`1px solid ${B.border}`,
                cursor:"pointer",display:"flex",gap:"12px",alignItems:"center",
              }}>
                <Squircle size={46}><s.Icon/></Squircle>
                <div style={{flex:1}}>
                  <div style={{fontFamily:FB,fontSize:"13px",fontWeight:"700",color:B.navy,marginBottom:"3px"}}>{s.title}</div>
                  <div style={{fontFamily:FB,fontSize:"11px",color:B.mid}}>{s.desc}</div>
                </div>
                <div style={{fontSize:"18px",color:B.faint}}>›</div>
              </div>
            ))}
          </div>
        ) : editorTab === "sorteos" && editSorteoIdx !== null ? (
          /* Sorteo edit form */
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            <div style={{background:B.card,borderRadius:"16px",overflow:"hidden",boxShadow:B.shadow}}>
              <div style={{padding:"14px 16px 0",borderBottom:`1px solid ${B.border}`}}>
                <div style={{fontFamily:FB,fontSize:"9px",color:B.faint,letterSpacing:".12em",marginBottom:"6px"}}>NOMBRE DEL SORTEO</div>
                <input value={sortDraft?.title||""} onChange={e=>setSortDraft({...sortDraft,title:e.target.value})}
                  style={{width:"100%",padding:"0 0 12px",border:"none",background:"transparent",fontFamily:FD,fontSize:"18px",color:B.navy,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div style={{padding:"14px 16px 14px"}}>
                <div style={{fontFamily:FB,fontSize:"9px",color:B.faint,letterSpacing:".12em",marginBottom:"6px"}}>DESCRIPCIÓN (fecha sorteo, valor premio...)</div>
                <input value={sortDraft?.desc||""} onChange={e=>setSortDraft({...sortDraft,desc:e.target.value})}
                  style={{width:"100%",padding:0,border:"none",background:"transparent",fontFamily:FB,fontSize:"14px",color:B.text,outline:"none",boxSizing:"border-box"}}/>
              </div>
            </div>
            <div style={{background:B.bluePale,borderRadius:"14px",padding:"14px 16px"}}>
              <div style={{fontFamily:FB,fontSize:"10px",color:B.blue,fontWeight:"700",marginBottom:"8px"}}>VISTA PREVIA</div>
              <div style={{fontFamily:FD,fontSize:"18px",color:B.navy,marginBottom:"3px"}}>{sortDraft?.title}</div>
              <div style={{fontFamily:FB,fontSize:"12px",color:B.mid}}>{sortDraft?.desc}</div>
            </div>
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={()=>{setEditSorteoIdx(null);setSortDraft(null);}} style={{flex:1,padding:"14px",borderRadius:"13px",background:B.border,border:"none",color:B.mid,fontSize:"14px",fontWeight:"600",fontFamily:FB,cursor:"pointer"}}>
                Cancelar
              </button>
              <button onClick={()=>{const u=[...sorteos];u[editSorteoIdx]=sortDraft;setSorteos(u);setEditSorteoIdx(null);setSortDraft(null);}} style={{flex:2,padding:"14px",borderRadius:"13px",background:B.blue,border:"none",color:"#fff",fontSize:"14px",fontWeight:"600",fontFamily:FB,cursor:"pointer"}}>
                Guardar sorteo ✓
              </button>
            </div>
          </div>
        ) : (
          /* Edit form */
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            <div style={{background:B.card,borderRadius:"16px",overflow:"hidden",boxShadow:B.shadow}}>
              {/* Premio title */}
              <div style={{padding:"14px 16px 0",borderBottom:`1px solid ${B.border}`}}>
                <div style={{fontFamily:FB,fontSize:"9px",color:B.faint,letterSpacing:".12em",marginBottom:"6px"}}>NOMBRE DEL PREMIO</div>
                <input value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}
                  style={{width:"100%",padding:"0 0 12px",border:"none",background:"transparent",fontFamily:FD,fontSize:"18px",color:B.navy,outline:"none",boxSizing:"border-box",fontWeight:400}}/>
              </div>
              {/* Descripción corta */}
              <div style={{padding:"14px 16px 0",borderBottom:`1px solid ${B.border}`}}>
                <div style={{fontFamily:FB,fontSize:"9px",color:B.faint,letterSpacing:".12em",marginBottom:"6px"}}>DESCRIPCIÓN CORTA (aparece en la tarjeta)</div>
                <input value={draft.desc} onChange={e=>setDraft({...draft,desc:e.target.value})}
                  style={{width:"100%",padding:"0 0 12px",border:"none",background:"transparent",fontFamily:FB,fontSize:"14px",color:B.text,outline:"none",boxSizing:"border-box"}}/>
              </div>
              {/* Condiciones */}
              <div style={{padding:"14px 16px 0",borderBottom:`1px solid ${B.border}`}}>
                <div style={{fontFamily:FB,fontSize:"9px",color:B.faint,letterSpacing:".12em",marginBottom:"6px"}}>CONDICIONES DE CANJE</div>
                <input value={draft.cond||draft.desc} onChange={e=>setDraft({...draft,cond:e.target.value})}
                  style={{width:"100%",padding:"0 0 12px",border:"none",background:"transparent",fontFamily:FB,fontSize:"14px",color:B.text,outline:"none",boxSizing:"border-box"}}/>
              </div>
              {/* Días validez */}
              <div style={{padding:"14px 16px 0",borderBottom:`1px solid ${B.border}`}}>
                <div style={{fontFamily:FB,fontSize:"9px",color:B.faint,letterSpacing:".12em",marginBottom:"6px"}}>DÍAS DE VALIDEZ</div>
                <input type="number" value={draft.days} onChange={e=>setDraft({...draft,days:parseInt(e.target.value)||21})}
                  style={{width:"100%",padding:"0 0 12px",border:"none",background:"transparent",fontFamily:FB,fontSize:"14px",color:B.text,outline:"none",boxSizing:"border-box"}}/>
              </div>
              {/* Probabilidad */}
              <div style={{padding:"14px 16px 14px"}}>
                <div style={{fontFamily:FB,fontSize:"9px",color:B.faint,letterSpacing:".12em",marginBottom:"10px"}}>
                  PROBABILIDAD DE SALIR: <span style={{color:B.blue,fontWeight:"700"}}>{Math.round(draft.prob*100)}%</span>
                </div>
                <input type="range" min="5" max="70" value={Math.round(draft.prob*100)}
                  onChange={e=>setDraft({...draft,prob:parseInt(e.target.value)/100})}
                  style={{width:"100%",accentColor:B.blue}}/>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:FB,fontSize:"10px",color:B.faint,marginTop:"4px"}}>
                  <span>5% (raro)</span><span>70% (frecuente)</span>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div style={{background:B.bluePale,borderRadius:"14px",padding:"14px 16px",border:`1px solid ${B.blue}20`}}>
              <div style={{fontFamily:FB,fontSize:"10px",color:B.blue,fontWeight:"700",marginBottom:"8px",letterSpacing:".08em"}}>VISTA PREVIA</div>
              <div style={{fontFamily:FD,fontSize:"18px",color:B.navy,marginBottom:"3px"}}>{draft.title}</div>
              <div style={{fontFamily:FB,fontSize:"12px",color:B.mid,marginBottom:"6px"}}>{draft.desc}</div>
              <div style={{fontFamily:FB,fontSize:"11px",color:B.faint}}>Válido {draft.days} días · {draft.cond||draft.desc}</div>
            </div>

            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={cancelEdit} style={{flex:1,padding:"14px",borderRadius:"13px",background:B.border,border:"none",color:B.mid,fontSize:"14px",fontWeight:"600",fontFamily:FB,cursor:"pointer"}}>
                Cancelar
              </button>
              <button onClick={saveEdit} style={{flex:2,padding:"14px",borderRadius:"13px",background:B.blue,border:"none",color:"#fff",fontSize:"14px",fontWeight:"600",fontFamily:FB,cursor:"pointer",boxShadow:`0 4px 14px ${B.blue}40`}}>
                Guardar premio ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ADMIN PIN — protección con contraseña 2607
// ════════════════════════════════════════════════════════════════════════════
const ADMIN_PIN = "2607";

function AdminPin({ onSuccess, onCancel }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleKey(k) {
    if (k === "del") { setPin(p => p.slice(0,-1)); setError(false); return; }
    if (pin.length >= 4) return;
    const next = pin + k;
    setPin(next);
    if (next.length === 4) {
      if (next === ADMIN_PIN) {
        setTimeout(() => onSuccess(), 200);
      } else {
        setShake(true); setError(true);
        setTimeout(() => { setPin(""); setShake(false); }, 600);
      }
    }
  }

  const keys = ["1","2","3","4","5","6","7","8","9","","0","del"];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(14,20,40,.88)",backdropFilter:"blur(8px)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:B.card,borderRadius:"24px",padding:"32px 28px",width:"300px",textAlign:"center",boxShadow:B.shadowLg}}>
        <div style={{fontFamily:FD,fontSize:"20px",color:B.navy,marginBottom:"6px",fontWeight:700}}>PÓLKA Admin</div>
        <div style={{fontFamily:FB,fontSize:"12px",color:B.faint,marginBottom:"28px"}}>Introduce el PIN de acceso</div>
        <div style={{display:"flex",gap:"12px",justifyContent:"center",marginBottom:"28px",animation:shake?"shake .5s ease":"none"}}>
          {[0,1,2,3].map(i=>(
            <div key={i} style={{width:"14px",height:"14px",borderRadius:"50%",background:i<pin.length?(error?"#E84040":B.blue):B.border,transition:"background .15s"}}/>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"20px"}}>
          {keys.map((k,i)=>(
            k===""?<div key={i}/>:
            <button key={i} onClick={()=>handleKey(k)} style={{padding:"16px 8px",borderRadius:"12px",background:k==="del"?B.bgWarm:B.bluePale,border:"none",color:k==="del"?B.mid:B.navy,fontSize:k==="del"?"16px":"20px",fontWeight:"600",fontFamily:FB,cursor:"pointer"}}>
              {k==="del"?"⌫":k}
            </button>
          ))}
        </div>
        <button onClick={onCancel} style={{background:"none",border:"none",fontFamily:FB,fontSize:"12px",color:B.faint,cursor:"pointer",textDecoration:"underline"}}>Cancelar</button>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — cream/blue POLKA tones
// ════════════════════════════════════════════════════════════════════════════
function Admin({ onClose, onOpenPremios }) {
  const bars=[{d:"L",v:38},{d:"M",v:29},{d:"X",v:31},{d:"J",v:45},{d:"V",v:72},{d:"S",v:67},{d:"D",v:30}];
  const maxB=Math.max(...bars.map(b=>b.v));
  const prizes=[
    {n:"Pincho gratis",  p:40, c:B.blue,  Icon:IconPlate},
    {n:"Postre casa",    p:28, c:B.mint,  Icon:IconLeaf},
    {n:"Copa txakoli",   p:20, c:B.navy,  Icon:IconStar},
    {n:"10% descuento",  p:12, c:B.gold,  Icon:IconGift},
  ];

  return (
    <div style={{position:"fixed",inset:0,background:B.bg,zIndex:300,overflowY:"auto",fontFamily:FB}}>
      <div style={{maxWidth:"430px",margin:"0 auto",padding:"24px 20px 80px"}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"28px"}}>
          <div>
            <div style={{fontFamily:FD,fontSize:"22px",fontWeight:700,color:B.navy,letterSpacing:".06em"}}>PÓLKA</div>
            <div style={{fontSize:"9px",color:B.faint,letterSpacing:".2em",marginTop:"2px"}}>PANEL DE CONTROL</div>
          </div>
          <button onClick={onClose} style={{background:B.card,border:`1px solid ${B.border}`,color:B.mid,fontSize:"18px",width:"40px",height:"40px",borderRadius:"50%",cursor:"pointer",boxShadow:B.shadow}}>✕</button>
        </div>

        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px",marginBottom:"12px"}}>
          {[["47","HOY","🎟"],["312","SEMANA","📅"],["1.284","MES","📊"]].map(([v,l,ico])=>(
            <div key={l} style={{background:B.card,borderRadius:"16px",padding:"16px 8px",textAlign:"center",boxShadow:B.shadow,border:`1px solid ${B.border}`}}>
              <div style={{fontSize:"18px",marginBottom:"6px"}}>{ico}</div>
              <div style={{fontFamily:FD,fontSize:"22px",color:B.navy}}>{v}</div>
              <div style={{fontSize:"9px",color:B.faint,letterSpacing:".14em",marginTop:"4px"}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Review rate */}
        <div style={{background:B.card,borderRadius:"16px",padding:"16px 20px",marginBottom:"10px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:B.shadow,border:`1px solid ${B.border}`}}>
          <div>
            <div style={{fontSize:"9px",color:B.faint,letterSpacing:".1em",marginBottom:"4px"}}>TASA DE RESEÑA</div>
            <div style={{fontSize:"12px",color:B.mid}}>Clientes que publican en Google</div>
            {/* mini progress */}
            <div style={{marginTop:"8px",width:"120px",height:"4px",background:B.border,borderRadius:"2px"}}>
              <div style={{width:"63%",height:"100%",borderRadius:"2px",background:`linear-gradient(90deg,${B.blue},${B.blueLight})`}}/>
            </div>
          </div>
          <div style={{fontFamily:FD,fontSize:"36px",color:B.blue,fontWeight:700}}>63%</div>
        </div>

        {/* Local/Tourist */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"10px"}}>
          {[["LOCAL","58%",B.blue,"⌂"],["TURISTA","42%",B.mint,"✈"]].map(([l,v,c,ico])=>(
            <div key={l} style={{background:B.card,borderRadius:"16px",padding:"14px",textAlign:"center",boxShadow:B.shadow,border:`1px solid ${B.border}`}}>
              <div style={{fontSize:"20px",marginBottom:"6px"}}>{ico}</div>
              <div style={{fontFamily:FD,fontSize:"26px",color:c}}>{v}</div>
              <div style={{fontSize:"9px",color:B.faint,letterSpacing:".1em",marginTop:"4px"}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{background:B.card,borderRadius:"16px",padding:"18px",marginBottom:"10px",boxShadow:B.shadow,border:`1px solid ${B.border}`}}>
          <div style={{fontSize:"9px",color:B.faint,letterSpacing:".12em",marginBottom:"14px"}}>PARTICIPACIONES POR DÍA</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:"6px",height:"64px"}}>
            {bars.map(({d,v})=>(
              <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}>
                <div style={{width:"100%",height:`${(v/maxB)*52}px`,borderRadius:"5px 5px 0 0",background:v===maxB?`linear-gradient(180deg,${B.blueLight},${B.navy})`:B.bgWarm,transition:"height .5s",boxShadow:v===maxB?`0 4px 12px rgba(32,64,176,.3)`:"none"}}/>
                <div style={{fontSize:"10px",color:v===maxB?B.blue:B.faint,fontWeight:v===maxB?"700":"400"}}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Prize breakdown */}
        <div style={{background:B.card,borderRadius:"16px",padding:"18px",marginBottom:"10px",boxShadow:B.shadow,border:`1px solid ${B.border}`}}>
          <div style={{fontSize:"9px",color:B.faint,letterSpacing:".12em",marginBottom:"16px"}}>PREMIOS ENTREGADOS</div>
          {prizes.map(({n,p,c,Icon})=>(
            <div key={n} style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px"}}>
              <Squircle size={34}><Icon size={18}/></Squircle>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                  <span style={{fontSize:"12px",color:B.mid}}>{n}</span>
                  <span style={{fontSize:"12px",color:c,fontWeight:"700"}}>{p}%</span>
                </div>
                <div style={{height:"4px",background:B.bgWarm,borderRadius:"2px"}}>
                  <div style={{width:`${p}%`,height:"100%",borderRadius:"2px",background:c,transition:"width .6s"}}/>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Canje */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"24px"}}>
          {[["CANJEADOS","34%",B.mint,"✓"],["PENDIENTES","66%",B.faint,"⏳"]].map(([l,v,c,ico])=>(
            <div key={l} style={{background:B.card,borderRadius:"16px",padding:"14px",textAlign:"center",boxShadow:B.shadow,border:`1px solid ${B.border}`}}>
              <div style={{fontSize:"20px",marginBottom:"6px"}}>{ico}</div>
              <div style={{fontFamily:FD,fontSize:"26px",color:c}}>{v}</div>
              <div style={{fontSize:"9px",color:B.faint,letterSpacing:".1em",marginTop:"4px"}}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          <Btn label="🎁 Gestionar premios" onClick={onOpenPremios} variant="primary"/>
          <Btn label="← Volver al flujo cliente" onClick={onClose} variant="ghost"/>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [step,setStep]=useState(1);
  const [codeValid, setCodeValid]=useState(null); // null=checking, true=ok, false=invalid
  const [codeChecked, setCodeChecked]=useState(false);
  const urlCode = new URLSearchParams(window.location.search).get("code");

  useEffect(() => {
    if (!urlCode) { setCodeValid(true); setCodeChecked(true); return; }
    // Verify code with Apps Script
    fetch(SHEET_URL, {
      method:"POST",
      body: JSON.stringify({action:"verify", code: urlCode}),
    })
    .then(r => r.json())
    .then(d => { setCodeValid(d.valid); setCodeChecked(true); })
    .catch(() => { setCodeValid(true); setCodeChecked(true); }); // fail open
  }, []);
  const [lang,setLang]=useState("es");
  const [prize,setPrize]=useState(null);
  const [code]=useState(mkCode());
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [stars,setStars]=useState(0);
  const [feedback,setFeedback]=useState("");
  const [reviewDone,setReviewDone]=useState(false);
  const [admin,setAdmin]=useState(false);
  const [showPin,setShowPin]=useState(false);
  const [showPremiosEditor,setShowPremiosEditor]=useState(false);
  const [premiosDirectos,setPremiosDirectos]=useState(PREMIOS_DIRECTOS);
  const [sorteos,setSorteos]=useState(SORTEOS);
  const participaciones=4;

  function reset(){setStep(1);setPrize(null);setName("");setEmail("");setStars(0);setFeedback("");setReviewDone(false);}

  // Loading screen
  if (!codeChecked) return (
    <div style={{background:B.bg,minHeight:"100vh",maxWidth:"430px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"16px"}}>
      <div style={{fontFamily:FD,fontSize:"22px",color:B.navy,letterSpacing:".08em"}}>PÓLKA</div>
      <div style={{fontFamily:FB,fontSize:"13px",color:B.faint}}>Verificando tu ticket...</div>
      <div style={{width:"40px",height:"3px",background:B.border,borderRadius:"2px",overflow:"hidden"}}>
        <div style={{width:"40px",height:"100%",background:B.blue,borderRadius:"2px",animation:"slide 1s ease infinite"}}/>
      </div>
      <style>{`@keyframes slide{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    </div>
  );

  // Invalid/used code screen
  if (codeChecked && !codeValid && urlCode) return (
    <div style={{background:B.bg,minHeight:"100vh",maxWidth:"430px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:"72px",height:"72px",borderRadius:"50%",background:"#FEE8E8",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:"32px"}}>✕</div>
        <h2 style={{fontFamily:FD,fontSize:"22px",color:B.navy,margin:"0 0 10px"}}>Este premio ya fue canjeado</h2>
        <p style={{fontFamily:FB,fontSize:"14px",color:B.mid,lineHeight:1.5,margin:"0 0 8px"}}>
          El código de este ticket ya ha sido utilizado.
        </p>
        <p style={{fontFamily:FB,fontSize:"12px",color:B.faint}}>
          Código: {urlCode}
        </p>
      </div>
    </div>
  );

  return (
    <div style={{background:B.bg,minHeight:"100vh",maxWidth:"430px",margin:"0 auto",position:"relative"}}>
      {showPremiosEditor&&<PremiosEditor premios={premiosDirectos} setPremios={setPremiosDirectos} sorteos={sorteos} setSorteos={setSorteos} onClose={()=>setShowPremiosEditor(false)}/>}
      {showPin&&<AdminPin onSuccess={()=>{setShowPin(false);setAdmin(true);}} onCancel={()=>setShowPin(false)}/> }
      {admin&&<Admin onClose={()=>setAdmin(false)} onOpenPremios={()=>{setAdmin(false);setShowPremiosEditor(true);}}/>}
      <Header onReset={reset} lang={lang} setLang={setLang}/>
      <Dots step={step}/>
      <div style={{paddingBottom:"80px"}}>
        {step===1&&<Step1 lang={lang} premios={premiosDirectos} sorteos={sorteos} onNext={()=>setStep(2)}/>}
        {step===2&&<Step2 lang={lang} prize={prize} setPrize={setPrize} premios={premiosDirectos} participaciones={participaciones} onNext={()=>setStep(3)}/>}
        {step===3&&<Step3 lang={lang} prize={prize} code={code} name={name} setName={setName} email={email} setEmail={setEmail} onNext={()=>setStep(4)}/>}
        {step===4&&<Step4 lang={lang} name={name} prize={prize} code={code} email={email} stars={stars} setStars={setStars} feedback={feedback} setFeedback={setFeedback} done={reviewDone} setDone={setReviewDone}/>}
      </div>
      {/* Footer */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:"430px",background:"rgba(244,242,237,.94)",backdropFilter:"blur(14px)",borderTop:`1px solid ${B.border}`,padding:"10px 20px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:FB,fontSize:"10px",color:B.faint}}>PÓLKA © 2026</span>
        <button onClick={()=>setShowPin(true)} style={{background:"none",border:"none",fontFamily:FB,fontSize:"10px",color:B.faint,cursor:"pointer"}}>Admin ↗</button>
      </div>
    </div>
  );
}
