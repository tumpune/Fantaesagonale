/**
 * Conteggio anonimo delle visite (vedi api/visita.ts): nessun cookie, nessun
 * dato salvato nel browser, nessun servizio di terze parti.
 *
 * Non parte in locale, ne' per chi ha chiesto al browser di non essere
 * tracciato (Global Privacy Control o Do Not Track).
 */

let ingresso = true

export function registraVisita(percorso: string) {
  if (!import.meta.env.PROD || ['localhost', '127.0.0.1'].includes(window.location.hostname)) return

  const nav = navigator as Navigator & { globalPrivacyControl?: boolean }
  if (nav.globalPrivacyControl || navigator.doNotTrack === '1') return

  // La provenienza conta solo per la prima pagina: nelle successive il
  // referrer e' ancora quello d'ingresso e gonfierebbe le fonti.
  let fonte: string | undefined
  if (ingresso && document.referrer) {
    try {
      const host = new URL(document.referrer).hostname
      if (host !== window.location.hostname) fonte = host
    } catch {
      /* referrer non valido: visita diretta */
    }
  }

  const corpo = JSON.stringify({ p: percorso, r: fonte, e: ingresso ? 1 : 0 })
  ingresso = false

  if (!navigator.sendBeacon?.('/api/visita', corpo)) {
    fetch('/api/visita', { method: 'POST', body: corpo, keepalive: true }).catch(() => {})
  }
}
