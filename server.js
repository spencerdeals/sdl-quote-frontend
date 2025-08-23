// server.js — ESM, robust version for Vite/React on Railway
// - Serves /dist
// - Verifies dist/index.html on startup (prevents 'raw server code' issue)
// - Exposes /__whoami for quick deploy debugging

import path, { dirname } from 'path';
import express from 'express';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Build output dir
const STATIC_DIR = process.env.STATIC_DIR || path.join(__dirname, 'dist');
const INDEX_PATH = path.join(STATIC_DIR, 'index.html');

// --- Startup sanity check: ensure we have a valid built index.html ---
async function validateBuild() {
  try {
    const html = await fs.readFile(INDEX_PATH, 'utf8');
    const looksHtml = /^\s*<!doctype html>/i.test(html) && html.includes('<script type="module"');
    if (!looksHtml) {
      console.error('[BOOT] dist/index.html does not look like a built Vite HTML file.');
      console.error('[BOOT] First 200 chars:', html.slice(0, 200));
      throw new Error('Invalid dist/index.html; run `vite build` during deploy.');
    }
    console.log('[BOOT] Verified dist/index.html looks valid.');
  } catch (err) {
    console.error('[BOOT] Missing or invalid build output at', INDEX_PATH);
    console.error(err);
    // Keep server up, but respond with a clear error if root is requested
    app.get(['/', '/index', '/index.html'], (_req, res) => {
      res
        .status(500)
        .type('text/plain')
        .send(
          'Build missing or invalid. Ensure `postinstall: vite build` ran and dist/index.html exists.'
        );
    });
  }
}
await validateBuild();

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Static assets from /dist
app.use(express.static(STATIC_DIR, { maxAge: '1h' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'frontend', version: 'alpha-esm-dist' });
});

// Deploy/debug info
app.get('/__whoami', (_req, res) => {
  res.json({
    ok: true,
    commit: process.env.RAILWAY_GIT_COMMIT_SHA || null,
    built_at: process.env.BUILT_AT || null,
    static_dir: STATIC_DIR
  });
});

// Root serves built HTML
app.get(['/', '/index', '/index.html'], (_req, res, next) => {
  res.sendFile(INDEX_PATH, (err) => {
    if (err) next(err);
  });
});

// SPA fallback
app.get('*', (req, res, next) => {
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) return res.sendFile(INDEX_PATH);
  next();
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ ok: false, error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Frontend server listening on ${PORT}`);
  console.log(`Serving static files from: ${STATIC_DIR}`);
});
