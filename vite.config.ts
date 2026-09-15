import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Il pannello /admin e' una seconda pagina del progetto, con l'editor dei
 * contenuti in /admin/editor. Senza questa regola il server di sviluppo
 * risponderebbe a /admin/ con il sito, come fa per ogni indirizzo delle pagine
 * React. Su Vercel lo stesso fa vercel.json.
 */
const pannello = (): Plugin => {
  /**
   * L'editor e' un file statico: il server di sviluppo, cercando l'index.html
   * piu' vicino, gli risponderebbe con quello del pannello. Lo si serve qui.
   */
  const riscrivi =
    (cartellaEditor: string): Connect.NextHandleFunction =>
    (req, res, next) => {
      const percorso = req.url?.split(/[?#]/)[0]
      if (percorso === '/admin' || percorso === '/admin/') req.url = '/admin/index.html'
      if (percorso === '/admin/editor' || percorso === '/admin/editor/' || percorso === '/admin/editor/index.html') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(readFileSync(resolve(cartellaEditor, 'admin/editor/index.html')))
        return
      }
      next()
    }
  return {
    name: 'pannello-admin',
    configureServer: (server) => void server.middlewares.use(riscrivi(server.config.publicDir)),
    configurePreviewServer: (server) =>
      void server.middlewares.use(riscrivi(resolve(server.config.root, server.config.build.outDir))),
  }
}

export default defineConfig({
  plugins: [pannello(), react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      input: {
        sito: resolve(__dirname, 'index.html'),
        pannello: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
})
