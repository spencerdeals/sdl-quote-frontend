import React, { useEffect, useState } from 'react'

export default function App() {
  const [health, setHealth] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const url = '/health'
    fetch(url, { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Health fetch failed: ' + r.status)))
      .then(setHealth)
      .catch(e => setErr(String(e)))
    return () => controller.abort()
  }, [])

  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial, sans-serif', padding: 24 }}>
      <h1 style={{ margin: 0 }}>SDL — #alpha</h1>
      <p style={{ marginTop: 8 }}>Vite + React is wired up and compiling JSX.</p>

      <section style={{ marginTop: 20 }}>
        <h2 style={{ marginBottom: 8, fontSize: 16 }}>Health</h2>
        {err && <div style={{ color: '#b00020' }}>Error: {err}</div>}
        <pre style={{ background: '#f6f6f6', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
{JSON.stringify(health, null, 2)}
        </pre>
      </section>
    </div>
  )
}