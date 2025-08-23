// FRONTEND SERVER — paste this as index.js (or server.js) in your FRONTEND service
// Runs Express, serves /dist, and forces fresh HTML (no cache).
// This helps stop old vendor.js from being reused.

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const DIST_DIR = path.join(__dirname, "dist");

// Serve static assets from /dist with long cache, except HTML
app.use((req, res, next) => {
  // Never cache HTML documents
  if (req.path.endsWith(".html") || req.path === "/" ) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
});

app.use(express.static(DIST_DIR, {
  index: false,
  setHeaders: (res, filePath) => {
    // Cache-bust JS/CSS assets built by Vite (they're content-hashed and immutable)
    if (!filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
  }
}));

// Root → send the built index.html (no cache due to middleware above)
app.get("/", (_req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

// Health (optional)
app.get("/health", (_req, res) => {
  res.json({ ok: true, version: "frontend-fresh-html" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend server running on http://0.0.0.0:${PORT}`);
});
