// server.js — Express server to serve your frontend at the root URL
// Paste-and-replace full file
// App: Railway *frontend* service (the one that currently shows `{ ok: true }`)
// File path: server.js (root of the project or wherever Railway starts your app)
// Start command (Railway): node server.js

const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');

const app = express();

// ----- Config -----
const PORT = process.env.PORT || 3000;
// If you keep your built/static files elsewhere, set STATIC_DIR accordingly in Railway env vars.
// Defaults to ./public
const STATIC_DIR = process.env.STATIC_DIR || path.join(__dirname, 'public');

// ----- Middleware -----
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// Serve static assets (HTML/CSS/JS) from STATIC_DIR
app.use(express.static(STATIC_DIR, {
  maxAge: '1h',
  extensions: ['html']
}));

// Health check (kept at /health so your monitors still work)
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'frontend', version: 'alpha' });
});

// Root should serve your app (index.html)
app.get(['/', '/index', '/index.html'], (_req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

// Optional: if you’re using a client-side router, this sends unknown routes to index.html
app.get('*', (req, res, next) => {
  // Only fall back to index.html if the client accepts HTML
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
  if (acceptsHtml) {
    return res.sendFile(path.join(STATIC_DIR, 'index.html'));
  }
  return next();
});

// Basic error handler
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ ok: false, error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Frontend server listening on port ${PORT}`);
  console.log(`Serving static files from: ${STATIC_DIR}`);
  console.log('Root URL will serve index.html. /health returns { ok: true }.');
});
