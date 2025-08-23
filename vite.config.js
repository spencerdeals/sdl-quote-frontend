import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['sdl-quote-frontend-production.up.railway.app'],
    host: true,
    port: process.env.PORT ? Number(process.env.PORT) : 4173,
  },
  server: {
    host: true,
  },
})
