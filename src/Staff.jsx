import { useState } from "react";

const SHEET_URL = "https://script.google.com/macros/s/AKfycbzYgCAx5PXM1AV0bOABfq_9RVpagJocJCumVJ2k6L7OSDSprc30nr5nWJpCgbmmMomRYw/exec";
const STAFF_PIN = "2607";

const B = {
  bg:"#F4F2ED", card:"#FFFFFF", navy:"#152060", blue:"#2040B0",
  bluePale:"#EEF2FF", text:"#0E1428", mid:"#525A7A", faint:"#9AA0BC",
  border:"#E2E0D8", green:"#2A6B45", mintPale:"#EDFAEC", bgWarm:"#ECEAE3",
  shadow:"0 2px 16px rgba(21,32,96,.08)", shadowMd:"0 8px 40px rgba(21,32,96,.13)",
};
const FD = "'Georgia','Times New Roman',serif";
const FB = "-apple-system,'Helvetica Neue',sans-serif";

function PinScreen({ onSuccess }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleKey(k) {
    if (k==="del") { setPin(p=>p.slice(0,-1)); setError(false); return; }
    if (pin.length>=4) return;
    const next = pin + k;
    setPin(next);
    if (next.length===4) {
      if (next===STAFF_PIN) { setTimeout(()=>onSuccess(),200); }
      else { setShake(true); setError(true); setTimeout(()=>{ setPin(""); setShake(false); },600); }
    }
  }

  return (
    <div style={{background:B.bg,minHeight:"100vh",maxWidth:"430px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <div style={{background:B.card,borderRadius:"24px",padding:"32px 28px",width:"100%",textAlign:"center",boxShadow:B.shadowMd}}>
        <div style={{fontFamily:FD,fontSize:"22px",fontWeight:700,color:B.navy,marginBottom:"4px"}}>PÓLKA</div>
        <div style={{fontFamily:FB,fontSize:"10px",color:B.faint,letterSpacing:".2em",marginBottom:"8px"}}>PERSONAL</div>
        <div style={{fontFamily:FB,fontSize:"13px",color:B.mid,marginBottom:"28px"}}>Introduce el PIN de acceso</div>
        <div style={{display:"flex",gap:"12px",justifyContent:"center",marginBottom:"28px",animation:shake?"shake .5s ease":"none"}}>
          {[0,1,2,3].map(i=>(
            <div key={i} style={{width:"14px",height:"14px",borderRadius:"50%",background:i<pin.length?(error?"#E84040":B.blue):B.border,transition:"background .15s"}}/>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}>
          {["1","2","3","4","5","6","7","8","9","","0","del"].map((k,i)=>(
            k===""?<div key={i}/>:
            <button key={i} onClick={()=>handleKey(k)} style={{
              padding:"16px 8px",borderRadius:"12px",
              background:k==="del"?B.bgWarm:B.bluePale,
              border:"none",color:k==="del"?B.mid:B.navy,
              fontSize:k==="del"?"16px":"20px",fontWeight:"600",fontFamily:FB,cursor:"pointer",
            }}>{k==="del"?"⌫":k}</button>
          ))}
        </div>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
    </div>
  );
}

function Validator() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function check() {
    if (code.trim().length<4) return;
    setLoading(true); setResult(null); setConfirmed(false);
    try {
      const r = await fetch(SHEET_URL,{method:"POST",body:JSON.stringify({action:"verify",code:code.trim().toUpperCase()})});
      const d = await r.json();
      setResult(d);
    } catch(e) { setResult({valid:false,reason:"Error de conexión"}); }
    setLoading(false);
  }

  function reset() { setCode(""); setResult(null); setConfirmed(false); }
  const keys = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".split("");

  return (
    <div style={{background:B.bg,minHeight:"100vh",maxWidth:"430px",margin:"0 auto"}}>
      <div style={{background:`linear-gradient(135deg,#2040B0,#152060)`,padding:"28px 24px 24px"}}>
        <div style={{fontFamily:FD,fontSize:"22px",fontWeight:700,color:"#fff",letterSpacing:".08em",marginBottom:"2px"}}>PÓLKA</div>
        <div style={{fontFamily:FB,fontSize:"9px",color:"rgba(255,255,255,.5)",letterSpacing:".2em",marginBottom:"12px"}}>VALIDACIÓN DE PREMIOS</div>
        <div style={{fontFamily:FB,fontSize:"13px",color:"rgba(255,255,255,.65)"}}>Introduce el código del cliente</div>
      </div>

      <div style={{padding:"24px 20px 0"}}>
        <div style={{background:B.card,borderRadius:"16px",overflow:"hidden",boxShadow:B.shadowMd,marginBottom:"14px"}}>
          <div style={{padding:"14px 16px 6px"}}>
            <div style={{fontFamily:FB,fontSize:"9px",color:B.faint,letterSpacing:".14em",marginBottom:"8px"}}>CÓDIGO DEL CLIENTE</div>
            <div style={{display:"flex",alignItems:"center",gap:"10px",paddingBottom:"14px"}}>
              <div style={{flex:1,fontFamily:"'SF Mono','Courier New',monospace",fontSize:"32px",fontWeight:"700",color:B.navy,letterSpacing:".18em"}}>
                {code.length>0?code:<span style={{color:B.border}}>_ _ _ _ _ _</span>}
              </div>
              {code.length>0&&<button onClick={reset} style={{background:"none",border:"none",fontSize:"20px",color:B.faint,cursor:"pointer"}}>✕</button>}
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:"5px",marginBottom:"8px"}}>
          {keys.map(k=>(
            <button key={k} onClick={()=>{if(code.length<6){setCode(c=>c+k);setResult(null);}}} style={{
              padding:"10px 2px",borderRadius:"8px",
              background:B.card,border:`1px solid ${B.border}`,
              color:B.navy,fontSize:"12px",fontWeight:"700",fontFamily:"monospace",cursor:"pointer",
            }}>{k}</button>
          ))}
        </div>

        <div style={{display:"flex",gap:"8px",marginBottom:"16px"}}>
          <button onClick={()=>{setCode(c=>c.slice(0,-1));setResult(null);}} style={{
            padding:"14px 20px",borderRadius:"13px",background:B.bgWarm,
            border:`1px solid ${B.border}`,color:B.mid,fontSize:"18px",cursor:"pointer",
          }}>⌫</button>
          <button onClick={check} disabled={code.length<4||loading} style={{
            flex:1,padding:"14px",borderRadius:"13px",
            background:code.length>=4?B.blue:B.border,border:"none",
            color:code.length>=4?"#fff":B.faint,
            fontSize:"15px",fontWeight:"600",fontFamily:FB,
            cursor:code.length>=4?"pointer":"default",
            boxShadow:code.length>=4?`0 4px 16px rgba(32,64,176,.4)`:"none",
          }}>{loading?"Verificando...":"Verificar →"}</button>
        </div>

        {result&&!confirmed&&(
          <div style={{background:result.valid?B.mintPale:"#FEE8E8",border:`1px solid ${result.valid?"#A0D4B0":"#F0C0C0"}`,borderRadius:"16px",padding:"20px",textAlign:"center"}}>
            <div style={{fontSize:"36px",marginBottom:"10px"}}>{result.valid?"✅":"❌"}</div>
            {result.valid?(
              <>
                <div style={{fontFamily:FD,fontSize:"20px",color:B.green,marginBottom:"4px"}}>Premio válido</div>
                <div style={{fontFamily:FB,fontSize:"13px",color:B.mid,marginBottom:"16px"}}>Entrega el premio al cliente · <strong>{code}</strong></div>
                <button onClick={()=>setConfirmed(true)} style={{width:"100%",padding:"14px",borderRadius:"12px",background:B.green,border:"none",color:"#fff",fontSize:"14px",fontWeight:"700",fontFamily:FB,cursor:"pointer"}}>
                  ✓ Confirmar entrega del premio
                </button>
              </>
            ):(
              <>
                <div style={{fontFamily:FD,fontSize:"20px",color:"#C04040",marginBottom:"4px"}}>
                  {result.reason==="Ya canjeado"?"Ya canjeado":"Código no válido"}
                </div>
                <div style={{fontFamily:FB,fontSize:"13px",color:B.mid}}>
                  {result.reason==="Ya canjeado"?"Este premio ya fue entregado anteriormente":"El código no existe en el sistema"}
                </div>
              </>
            )}
          </div>
        )}

        {confirmed&&(
          <div style={{background:B.mintPale,border:`1px solid #A0D4B0`,borderRadius:"16px",padding:"24px",textAlign:"center"}}>
            <div style={{fontSize:"36px",marginBottom:"10px"}}>🎉</div>
            <div style={{fontFamily:FD,fontSize:"20px",color:B.green,marginBottom:"6px"}}>Premio entregado</div>
            <div style={{fontFamily:FB,fontSize:"13px",color:B.mid,marginBottom:"16px"}}>Código {code} marcado como canjeado</div>
            <button onClick={reset} style={{width:"100%",padding:"14px",borderRadius:"12px",background:B.blue,border:"none",color:"#fff",fontSize:"14px",fontWeight:"600",fontFamily:FB,cursor:"pointer"}}>
              Validar otro código
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Staff() {
  const [authed, setAuthed] = useState(false);
  if (!authed) return <PinScreen onSuccess={()=>setAuthed(true)}/>;
  return <Validator/>;
}
