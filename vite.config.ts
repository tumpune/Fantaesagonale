import { defineConfig, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Il pannello /admin e' una pagina statica in public/admin. Senza questa
 * regola il server di sviluppo risponderebbe a /admin/ con il sito, come fa
 * per ogni indirizzo delle pagine React. Su Vercel lo stesso fa vercel.json.
 */
const pannello = (): Plugin => {
  const riscrivi: Connect.NextHandleFunction = (req, _res, next) => {
    if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin/index.html'
    next()
  }
  return {
    name: 'pannello-admin',
    configureServer: (server) => void server.middlewares.use(riscrivi),
    configurePreviewServer: (server) => void server.middlewares.use(riscrivi),
  }
}

export default defineConfig({
  plugins: [pannello(), react()],
  server: { port: 5173 },
})
