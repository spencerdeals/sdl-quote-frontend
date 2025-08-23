// server.js — ESM version for "type":"module" projects
// Serves index.html from project root (no /public folder)

import path, { dirname } from 'path';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ----- Config -----
const PORT = process.env.PORT || 3000;
// Point directly to root folder where index.html lives
const STATIC_DIR = process.env.STATIC_DIR || __dirname;

// ----- Middleware -----
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// Serve static assets (CSS/JS/images) from root
app.use(express.static(STATIC_DIR, {
  maxAge: '1h',
  extensions: ['html']
}));

// Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'frontend', version: 'alpha-esm-root' });
});

// Root should serve index.html
app.get(['/', '/index', '/index.html'], (_req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

// Client-side router fallback
app.get('*', (req, res, next) => {
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
  if (acceptsHtml) {
    return res.sendFile(path.join(STATIC_DIR, 'index.html'));
  }
  return next();
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ ok: false, error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Frontend server (ESM) listening on port ${PORT}`);
  console.log(`Serving static files from root: ${STATIC_DIR}`);
  console.log('Root URL will serve index.html. /health returns { ok: true }.');
});
