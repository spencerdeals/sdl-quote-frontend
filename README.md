# SDL Quote Frontend (Fresh Starter)

**Generated:** 2025-08-23T15:28:28.089666Z

Production-ready Vite + React served by Express on Railway.

## Structure
- `server.js` — ESM Express server serving `dist/` with startup validation and `/health` + `/__whoami`.
- `index.html` — Vite entry HTML (tiny).
- `vite.config.js` — standard React plugin config.
- `src/` — React app (`main.jsx`, `App.jsx`, `shared/ErrorBoundary.jsx`).
- `dist/` — build output (created during deploy by `postinstall`).
- `.gitignore` — ignores `node_modules/` and `dist/`.

## Deploy
1. Push to GitHub.
2. Railway → new service from this repo.
3. Settings → Start Command: `node server.js`
4. Redeploy. Build logs must show `vite build` and `Serving static files from: .../dist`.

## Verify
- `/` shows "Frontend is live ✅"
- `/health` returns JSON status
- `/__whoami` returns commit SHA and static dir
