// server.js — ESM, paste-and-replace full file
// Serves index.html from project root (no /public folder)

import path, { dirname } from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const STATIC_DIR = __dirname;

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Static assets from root (so /index.html, /styles.css, /app.js work)
app.use(express.static(STATIC_DIR, { maxAge: '1h', extensions: ['html'] }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'frontend', version: 'alpha-esm-root' });
});

// Root serves index.html
app.get(['/', '/index', '/index.html'], (_req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

// Client-side router fallback to index.html
app.get('*', (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.sendFile(path.join(STATIC_DIR, 'index.html'));
  }
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Frontend server listening on port ${PORT}`);
  console.log(`Serving static files from root: ${STATIC_DIR}`);
  console.log('Root URL will serve index.html. /health returns { ok: true }.');
});
