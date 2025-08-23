import express from 'express'
import compression from 'compression'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

app.use(compression())
app.use(express.json())

// Health check
app.get(['/','/health'], (_req, res) => {
  res.json({ ok: true, app: 'sdl-alpha', version: '1.0.0' })
})

// Serve static assets from dist
const distPath = path.join(__dirname, 'dist')
app.use(express.static(distPath, { index: false }))

// SPA fallback: send index.html for all non-file routes
app.get('*', (req, res) => {
  const indexFile = path.join(distPath, 'index.html')
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile)
  } else {
    res
      .status(503)
      .send('<h1>Build not ready</h1><p>dist/index.html not found. Did postinstall run?</p>')
  }
})

app.listen(port, () => {
  console.log(`SDL alpha server listening on port ${port}`)
})