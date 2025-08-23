import { defineConfig } from 'vite'

export default defineConfig({
  preview: {
    // Allow your Railway host
    allowedHosts: ['sdl-quote-frontend-production.up.railway.app'],
    // Optional: also allow your custom domain when you add it
    // allowedHosts: ['sdl-quote-frontend-production.up.railway.app', 'www.sdl.bm'],
    port: process.env.PORT ? Number(process.env.PORT) : 4173,
    host: true,
  },
  server: {
    host: true,
  },
})
