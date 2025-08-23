// vite.config.js  — paste-and-replace
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    // Allow your Railway host
    allowedHosts: ['sdl-quote-frontend-production.up.railway.app'],
    port: process.env.PORT ? Number(process.env.PORT) : 4173,
    host: true,
  },
  server: {
    host: true,
  },
})
