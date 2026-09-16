import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
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

/**
 * I contenuti sono letti con import.meta.glob: in sviluppo, quando l'editor
 * crea o elimina un file (per esempio una testimonianza), l'elenco va
 * ricalcolato, altrimenti la novita' non compare finche' non si riavvia tutto.
 */
const contenutiAggiornati = (): Plugin => ({
  name: 'contenuti-aggiornati',
  configureServer(server) {
    const moduliConElenchi = ['src/content/testimonianze.ts', 'src/content/rami.tsx']
    const aggiorna = (file: string) => {
      if (!file.split('\\').join('/').includes('/src/content/dati/')) return
      for (const percorso of moduliConElenchi) {
        const modulo = server.moduleGraph.getModuleById(resolve(__dirname, percorso))
        if (modulo) server.moduleGraph.invalidateModule(modulo)
      }
      server.ws.send({ type: 'full-reload' })
    }
    server.watcher.on('add', aggiorna)
    server.watcher.on('unlink', aggiorna)
  },
})

/**
 * Mappa del sito e robots.txt, scritti alla pubblicazione leggendo i file dei
 * progetti: aggiungendo un ramo dal pannello, l'indirizzo compare da solo.
 * Il pannello di gestione resta escluso dai motori di ricerca.
 */
const mappaDelSito = (): Plugin => ({
  name: 'mappa-del-sito',
  apply: 'build',
  closeBundle() {
    const sito = process.env.SITO_URL || 'https://fantaesagonale.vercel.app'
    const cartella = resolve(__dirname, 'src/content/dati/rami')
    const slugRami = readdirSync(cartella)
      .filter((nome) => nome.endsWith('.json'))
      .map((nome) => JSON.parse(readFileSync(resolve(cartella, nome), 'utf8')) as { slug: string; ordine?: number })
      .sort((a, b) => (a.ordine ?? 99) - (b.ordine ?? 99))
      .map((ramo) => `/${ramo.slug}`)

    const pagine = ['/', '/chi-siamo', '/faq', '/contatti', ...slugRami, '/privacy', '/cookie']
    const oggi = new Date().toISOString().slice(0, 10)
    const uscita = resolve(__dirname, 'dist')

    writeFileSync(
      resolve(uscita, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pagine
        .map(
          (percorso) =>
            `  <url><loc>${sito}${percorso}</loc><lastmod>${oggi}</lastmod><priority>${percorso === '/' ? '1.0' : '0.7'}</priority></url>`,
        )
        .join('\n')}\n</urlset>\n`,
    )
    writeFileSync(
      resolve(uscita, 'robots.txt'),
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: ${sito}/sitemap.xml\n`,
    )
  },
})

export default defineConfig({
  plugins: [pannello(), contenutiAggiornati(), mappaDelSito(), react()],
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
