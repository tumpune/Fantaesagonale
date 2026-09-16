/**
 * Servizi condivisi dalle funzioni in /api. La cartella inizia con "_", quindi
 * Vercel non la pubblica come indirizzo.
 *
 * Ogni servizio esterno e' facoltativo: senza le sue variabili d'ambiente la
 * funzione che lo usa risponde "non configurato" invece di rompersi, e il
 * pannello mostra l'automazione come "da configurare".
 */

export const REPO = process.env.GITHUB_REPO || 'tumpune/Fantaesagonale'
export const RAMO_GIT = process.env.GITHUB_BRANCH || 'main'

/* ---------------------------------------------------------------- risposte */

export const json = (dati: unknown, status = 200) =>
  new Response(JSON.stringify(dati), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })

export const vuota = (status = 204) => new Response(null, { status })

/**
 * Le richieste dal sito arrivano dallo stesso indirizzo. Un Origin diverso
 * indica una pagina esterna che prova a usare la funzione.
 */
export function stessaOrigine(request: Request): boolean {
  const origine = request.headers.get('origin')
  return !origine || origine === new URL(request.url).origin
}

/**
 * Indirizzo di chi ha fatto la richiesta, preso dall'intestazione scritta dal
 * proxy di Vercel. Non si usa il primo valore di `x-forwarded-for`: quello puo'
 * essere inventato da chi chiama, e basterebbe cambiarlo a ogni richiesta per
 * aggirare i limiti antiabuso. L'ultimo valore, invece, lo aggiunge il proxy.
 */
export const ipDi = (request: Request) =>
  request.headers.get('x-real-ip')?.trim() ||
  request.headers.get('x-forwarded-for')?.split(',').pop()?.trim() ||
  ''

/** Percorsi che il sito pubblica davvero: gli altri non creano voci nuove. */
export const PERCORSI_NOTI = new Set([
  '/',
  '/chi-siamo',
  '/faq',
  '/contatti',
  '/privacy',
  '/cookie',
  '/aziende',
  '/eventi',
  '/fantacalcio',
  '/fantadsico',
  '/fantamaritati',
  '/ic2030',
  '/intrattenimento',
  '/italia-campione-2030',
  '/listone',
  '/maritati',
  '/marketing',
  '/matrimoni',
  '/merch',
  '/merchandising',
  '/sede',
  '/sede-fisica',
  '/shop',
  '/sponsor',
  '/territorio',
  '/tornei',
  '/tornei-giochi',
  '/turismo',
])

export async function sha256(testo: string): Promise<string> {
  const byte = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(testo))
  return [...new Uint8Array(byte)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/* ------------------------------------------------------------------- date */

/** Giorno di calendario a Roma, nel formato YYYY-MM-DD. */
export const giorno = (data = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(data)

/** Aritmetica sul calendario, senza ore: immune al cambio dell'ora legale. */
export function spostaGiorno(data: string, giorni: number): string {
  const [a, m, g] = data.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, g + giorni)).toISOString().slice(0, 10)
}

/** Gli ultimi `n` giorni fino a `oggi` compreso, dal piu' vecchio. */
export const giorniFinoA = (n: number, oggi = giorno()): string[] =>
  Array.from({ length: n }, (_, i) => spostaGiorno(oggi, i - (n - 1)))

/* ------------------------------------------------------------------ redis */

const redisUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const redisToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

export const redisConfigurato = () => Boolean(redisUrl() && redisToken())

/** Esegue piu' comandi in una sola richiesta all'API REST di Upstash. */
export async function redis(comandi: (string | number)[][]): Promise<unknown[]> {
  const risposta = await fetch(`${redisUrl()}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${redisToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(comandi),
  })
  if (!risposta.ok) throw new Error(`Archivio statistiche non raggiungibile (${risposta.status})`)
  const esiti = (await risposta.json()) as { result?: unknown; error?: string }[]
  return esiti.map((esito) => {
    if (esito.error) throw new Error(esito.error)
    return esito.result
  })
}

/** HGETALL restituisce [campo, valore, campo, valore...]. */
export function daCoppie(valore: unknown): Record<string, number> {
  const lista = Array.isArray(valore) ? valore : []
  const risultato: Record<string, number> = {}
  for (let i = 0; i < lista.length; i += 2) risultato[String(lista[i])] = Number(lista[i + 1]) || 0
  return risultato
}

/**
 * Sale per l'impronta giornaliera dei visitatori: segreto e legato al giorno,
 * cosi' la stessa persona non e' riconoscibile da un giorno all'altro.
 */
export const sale = () => process.env.STATISTICHE_SALE || redisToken() || ''

/** Le statistiche restano 13 mesi, poi si cancellano da sole. */
export const DURATA_STATISTICHE = 400 * 24 * 60 * 60

/** Ultima esecuzione di ogni automazione, letta dal pannello. */
export async function registraEsecuzione(nome: string, esito: 'ok' | 'errore' | 'saltata', dettaglio: string) {
  if (!redisConfigurato()) return
  await redis([
    ['HSET', 'automazioni:ultime', nome, JSON.stringify({ quando: new Date().toISOString(), esito, dettaglio })],
  ]).catch(() => {})
}

/* ----------------------------------------------------------------- github */

export type Utente = { login: string; nome: string; avatar: string }

const cacheAccessi = new Map<string, { scade: number; utente: Utente }>()

/**
 * Le funzioni riservate accettano solo chi ha accesso in scrittura al
 * repository: le stesse persone che possono modificare i contenuti.
 */
export async function collaboratore(request: Request): Promise<Utente | null> {
  const token = request.headers.get('authorization')?.match(/^Bearer\s+(\S+)$/)?.[1]
  if (!token) return null

  const chiave = await sha256(token)
  const inCache = cacheAccessi.get(chiave)
  if (inCache && inCache.scade > Date.now()) return inCache.utente

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'fantaesagonale-pannello',
  }
  const [repo, profilo] = await Promise.all([
    fetch(`https://api.github.com/repos/${REPO}`, { headers }),
    fetch('https://api.github.com/user', { headers }),
  ])

  let utente: Utente | null = null
  if (repo.ok && profilo.ok) {
    const r = (await repo.json()) as { permissions?: { push?: boolean } }
    const u = (await profilo.json()) as { login: string; name?: string; avatar_url: string }
    if (r.permissions?.push) utente = { login: u.login, nome: u.name || u.login, avatar: u.avatar_url }
  }

  // Si ricorda solo chi e' stato riconosciuto: se GitHub fosse
  // momentaneamente irraggiungibile, un collaboratore resterebbe fuori per
  // cinque minuti. La mappa si svuota quando cresce troppo, cosi' nessuno puo'
  // gonfiarla inviando token a caso.
  if (utente) {
    if (cacheAccessi.size > 500) cacheAccessi.clear()
    cacheAccessi.set(chiave, { scade: Date.now() + 5 * 60_000, utente })
  }
  return utente
}

/** Legge un file dei contenuti dall'ultima versione pubblicata sul repository. */
export async function datiDalRepository<T>(percorso: string): Promise<T> {
  // Senza `no-store` la rete di distribuzione di GitHub servirebbe una copia
  // vecchia di qualche minuto: mettere in pausa un'automazione dal pannello
  // non avrebbe effetto subito.
  const risposta = await fetch(`https://raw.githubusercontent.com/${REPO}/${RAMO_GIT}/${percorso}`, {
    cache: 'no-store',
    headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
  })
  if (!risposta.ok) throw new Error(`Impossibile leggere ${percorso} (${risposta.status})`)
  return (await risposta.json()) as T
}

/** Elenco dei file di una cartella dei contenuti. */
export async function fileDelRepository(cartella: string): Promise<string[]> {
  const risposta = await fetch(`https://api.github.com/repos/${REPO}/contents/${cartella}?ref=${RAMO_GIT}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'fantaesagonale-pannello',
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  })
  if (risposta.status === 404) return []
  if (!risposta.ok) throw new Error(`Impossibile leggere ${cartella} (${risposta.status})`)
  const voci = (await risposta.json()) as { name: string; path: string; type: string }[]
  return voci.filter((v) => v.type === 'file' && v.name.endsWith('.json')).map((v) => v.path)
}

/* ------------------------------------------------------------------ email */

export const destinatariStaff = () =>
  (process.env.EMAIL_STAFF ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)

export const emailConfigurata = () => Boolean(process.env.RESEND_API_KEY && destinatariStaff().length)

export async function inviaEmail(email: {
  a: string[]
  oggetto: string
  html: string
  testo: string
  rispondiA?: string
}) {
  const risposta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_MITTENTE || 'FantaEsagonale <onboarding@resend.dev>',
      to: email.a,
      subject: email.oggetto,
      html: email.html,
      text: email.testo,
      ...(email.rispondiA ? { reply_to: email.rispondiA } : {}),
    }),
  })
  // Solo il codice di errore: la risposta del fornitore puo' contenere gli
  // indirizzi dei destinatari, che non vanno archiviati nelle esecuzioni.
  if (!risposta.ok) throw new Error(`Email non inviata (errore ${risposta.status})`)
}

export const html = (testo: string) =>
  testo.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** Impaginazione comune delle email, con i colori del sito. */
export function modelloEmail(titolo: string, corpo: string, piede = 'FantaEsagonale APS · Grammichele (CT)') {
  return `<!doctype html><html lang="it"><body style="margin:0;background:#0d0d0d;font-family:Inter,Segoe UI,Arial,sans-serif;color:#e8e8e8">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#1c1c1c;border-radius:16px;overflow:hidden;border:1px solid #2a2a2a">
<tr><td style="height:4px;background:linear-gradient(90deg,#fcd70c,#e61a1a)"></td></tr>
<tr><td style="padding:28px 32px 8px"><p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#fcd70c;font-weight:700">FantaEsagonale · Gestione</p>
<h1 style="margin:0;font-size:22px;line-height:1.25;color:#ffffff">${html(titolo)}</h1></td></tr>
<tr><td style="padding:16px 32px 28px;font-size:15px;line-height:1.6;color:#cfcfcf">${corpo}</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #2a2a2a;font-size:12px;color:#8a8a8a">${html(piede)}</td></tr>
</table></td></tr></table></body></html>`
}

/* ------------------------------------------------------------ contenuti */

export type Iniziativa = { titolo: string; ramo: string; dal?: string; al?: string; priorita?: number }

export type ImpostazioniAutomazioni = {
  moduloContatti?: { attivo?: boolean; rispostaAutomatica?: boolean; testoRisposta?: string }
  promemoriaScadenze?: { attivo?: boolean; giorniPrima?: number }
  riepilogoSettimanale?: { attivo?: boolean }
}
