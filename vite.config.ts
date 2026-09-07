import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Su Vercel (e su un dominio custom) il sito sta sulla radice, su GitHub Pages
// vive invece in una sottocartella col nome del repository. Il base path arriva
// quindi da VITE_BASE, che il workflow di Pages imposta a /Fantaesagonale/
// (maiuscole comprese: i percorsi di Pages sono case-sensitive). Senza questa
// distinzione l'HTML chiede gli asset a un percorso inesistente e la pagina
// resta bianca.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
  server: {
    port: 5173,
  },
})
