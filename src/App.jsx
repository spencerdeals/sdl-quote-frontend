import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

function currency(n){
  if(n==null || isNaN(Number(n))) return "";
  return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(Number(n));
}

export default function App(){
  const [url,setUrl]=useState("");
  const [item,setItem]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  async function submit(e){
    e.preventDefault();
    setError(""); setItem(null);
    if(!url.trim()){ setError("Enter product URL"); return; }
    setLoading(true);
    try{
      const res=await fetch(`${API_BASE}/quote`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ url: url.trim() })
      });
      const data = await res.json();
      if(!res.ok) setError(data?.error || `Error ${res.status}`);
      else setItem(data.item || null);
    }catch(err){ setError(String(err)); }
    finally{ setLoading(false); }
  }

  return (
    <div style={{maxWidth:640,margin:"40px auto",padding:16,fontFamily:"system-ui, sans-serif"}}>
      <h1 style={{fontSize:24,marginBottom:12}}>Instant Quote</h1>
      <form onSubmit={submit} style={{display:"flex",gap:8,marginBottom:16}}>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://vendor.com/product" style={{flex:1,padding:8,border:"1px solid #cbd5e1",borderRadius:8}}/>
        <button disabled={loading} style={{padding:"8px 12px",background:"#059669",color:"#fff",border:"none",borderRadius:8}}>
          {loading ? "Fetching…" : "Go"}
        </button>
      </form>
      {error && <div style={{color:"#b91c1c",marginBottom:12}}>{error}</div>}
      {item && (
        <div style={{border:"1px solid #e5e7eb",borderRadius:12,padding:12,display:"flex",gap:12}}>
          <div style={{width:112,height:112,background:"#f1f5f9",borderRadius:12,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {item.image ? <img src={item.image} alt={item.title||item.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:12,color:"#94a3b8"}}>No Image</span>}
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
              <div style={{fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.title || item.name || "Unnamed Item"}</div>
              <div style={{fontWeight:700}}>{currency(item.price)}</div>
            </div>
            {item.variant && <div style={{color:"#475569",fontSize:14,marginTop:6}}>Variant: {item.variant}</div>}
            {item.url && <a href={item.url} target="_blank" rel="noreferrer" style={{color:"#065f46",fontSize:14,display:"inline-block",marginTop:8}}>View product</a>}
          </div>
        </div>
      )}
    </div>
  );
}
