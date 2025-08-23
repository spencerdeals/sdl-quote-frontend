# SDL — #alpha Frontend

This is a production-ready Vite + React app configured for Railway.
It includes:
- Vite build pipeline
- Express server for production (serves `dist/`)
- SPA fallback routing
- `/health` endpoint
- ErrorBoundary to avoid blank screens

## Run locally
```bash
npm install
npm run dev
# open http://localhost:5173
```

## Build + run production server locally
```bash
npm run build
npm start
# open http://localhost:3000
```

## Deploy on Railway
1. Connect this repo to your Railway **frontend service**.
2. Ensure Start Command is `npm start` (Railway runs `npm install` automatically).
3. The `postinstall` script builds the app during deploy.
4. Hit the service URL → `/health` should return `{ ok: true }`.
