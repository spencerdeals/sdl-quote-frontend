import { useState } from 'react';

// IMPORTANT: Use FULL backend URL (not "/quote")
const BACKEND = "https://so-quote.fly.dev";

export default function App() {
  const [title, setTitle] = useState('');
  const [qty, setQty] = useState(1);
  const [firstCost, setFirstCost] = useState('');
  const [volume, setVolume] = useState('');
  const [log, setLog] = useState('Ready.');
  const [cls, setCls] = useState('');

  const print = (msg, c = '') => {
    setCls(c);
    setLog(typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2));
  };

  const doHealth = async () => {
    try {
      const r = await fetch(`${BACKEND}/health`, { mode: 'cors' });
      const j = await r.json();
      print(j, 'ok');
    } catch (e) {
      print(e.message || String(e), 'err');
    }
  };

  const doQuote = async () => {
    try {
      const payload = {
        title: title || null,
        qty: Number(qty || 0),
        firstCost: Number(firstCost || 0),
        volume: Number(volume || 0),
      };
      const r = await fetch(`${BACKEND}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors',
        credentials: 'omit',
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      print(j, 'ok');
    } catch (e) {
      print(e.message || String(e), 'err');
    }
  };

  const S = {
    page: { fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', background: '#f6f8f7', color: '#0b2314', minHeight: '100vh', margin: 0 },
    header: { padding: '16px 20px', background: 'white', borderBottom: '1px solid #e6ece8', position: 'sticky', top: 0 },
    h1: { margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '.2px' },
    main: { maxWidth: 720, margin: '32px auto', padding: '0 16px 40px' },
    card: { background: 'white', border: '1px solid #e6ece8', borderRadius: 14, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.03)' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
    label: { display: 'block', fontSize: 13, margin: '10px 0 6px' },
    input: { width: '100%', padding: '10px 12px', border: '1px solid #cad5cc', borderRadius: 10, fontSize: 14 },
    actions: { display: 'flex', gap: 10, marginTop: 14 },
    btn: { padding: '10px 14px', borderRadius: 10, border: '1px solid #2c7a3f', background: '#2c7a3f', color: 'white', fontWeight: 600, cursor: 'pointer' },
    btnSecondary: { padding: '10px 14px', borderRadius: 10, border: '1px solid '#2c7a3f', background: 'white', color: '#2c7a3f', fontWeight: 600, cursor: 'pointer' },
    pre: { whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', background: '#f3f7f4', border: '1px solid #e1ebe5', padding: 10, borderRadius: 10, fontSize: 12 },
    ok: { color: '#1a7f37' },
    err: { color: '#b42318' },
    hint: { fontSize: 12, color: '#5b6a60', marginTop: 8 },
  };

  return (
    <div style={S.page}>
      <header style={S.header}><h1 style={S.h1}>SDL — Instant Quote (Alpha)</h1></header>
      <main style={S.main}>
        <div style={S.card}>
          <div style={S.row}>
            <div>
              <label style={S.label} htmlFor="title">Item Title</label>
              <input style={S.input} id="title" placeholder="e.g., Milan Corner Seat" value={title} onChange={(e)=>setTitle(e.target.value)} />
            </div>
            <div>
              <label style={S.label} htmlFor="qty">Quantity</label>
              <input style={S.input} id="qty" type="number" min="1" value={qty} onChange={(e)=>setQty(e.target.value)} />
            </div>
          </div>
          <label style={S.label} htmlFor="price">First Cost (USD)</label>
          <input style={S.input} id="price" type="number" step="0.01" placeholder="e.g., 190.00" value={firstCost} onChange={(e)=>setFirstCost(e.target.value)} />
          <label style={S.label} htmlFor="volume">Volume (ft³)</label>
          <input style={S.input} id="volume" type="number" step="0.01" placeholder="e.g., 11.33" value={volume} onChange={(e)=>setVolume(e.target.value)} />
          <div style={S.actions}>
            <button style={S.btn} onClick={doQuote}>Get Quote</button>
            <button style={S.btnSecondary} onClick={doHealth}>Check Backend Health</button>
            <a style={S.btnSecondary} href={`${BACKEND}/debug/cors`} target="_blank" rel="noreferrer">Open CORS Debug</a>
          </div>
          <div style={S.hint}>This app calls your backend using a <b>FULL URL</b>. Update the BACKEND constant if your domain changes.</div>
          <pre style={{...S.pre, ...(cls==='ok'?S.ok:cls==='err'?S.err:{})}}>{log}</pre>
        </div>
      </main>
    </div>
  );
}
