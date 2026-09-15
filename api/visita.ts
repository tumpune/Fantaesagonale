import {
  DURATA_STATISTICHE,
  giorno,
  ipDi,
  redis,
  redisConfigurato,
  sale,
  sha256,
  stessaOrigine,
  vuota,
} from './_lib/servizi.js'

/**
 * Conteggio anonimo delle visite, senza cookie.
 *
 * Si salvano solo totali per giorno: pagine viste e, per ogni ingresso nel
 * sito, provenienza, tipo di dispositivo, nazione e citta'. Per stimare i
 * visitatori unici si usa un'impronta che cambia ogni giorno, dentro una
 * struttura (HyperLogLog) da cui non si puo' risalire alla singola persona.
 * Nessun indirizzo IP viene conservato.
 */

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pingdom|preview|facebookexternalhit|whatsapp|telegram/i

const campo = (valore: unknown, formato: RegExp) =>
  typeof valore === 'string' && formato.test(valore) ? valore : null

export async function POST(request: Request): Promise<Response> {
  if (!redisConfigurato() || !stessaOrigine(request)) return vuota()

  const agente = request.headers.get('user-agent') ?? ''
  if (!agente || BOT.test(agente)) return vuota()

  let dati: { p?: unknown; r?: unknown; e?: unknown }
  try {
    dati = JSON.parse(await request.text())
  } catch {
    return vuota(400)
  }

  const percorso = campo(dati.p, /^\/[a-z0-9\-/]{0,60}$/)?.replace(/(.)\/$/, '$1')
  if (!percorso) return vuota(400)

  const fonte = campo(dati.r, /^[a-z0-9.-]{1,80}$/i)?.toLowerCase().replace(/^www\./, '') ?? 'diretto'
  const dispositivo = /ipad|tablet/i.test(agente) ? 'tablet' : /mobi|android|iphone/i.test(agente) ? 'mobile' : 'desktop'
  const nazione = campo(request.headers.get('x-vercel-ip-country'), /^[A-Z]{2}$/)
  const citta = (() => {
    try {
      return decodeURIComponent(request.headers.get('x-vercel-ip-city') ?? '').slice(0, 60)
    } catch {
      return ''
    }
  })()

  const oggi = giorno()
  const impronta = await sha256(`${oggi}|${sale()}|${ipDi(request)}|${agente}`)
  const chiave = `s:${oggi}`

  const comandi: (string | number)[][] = [
    ['HINCRBY', chiave, `p:${percorso}`, 1],
    ['PFADD', `u:${oggi}`, impronta.slice(0, 32)],
  ]
  // Una visita e' un ingresso nel sito: le pagine successive contano solo
  // come pagine viste, cosi' provenienza e dispositivo non si moltiplicano.
  if (dati.e === 1) {
    comandi.push(
      ['HINCRBY', chiave, 'i:visite', 1],
      ['HINCRBY', chiave, `f:${fonte}`, 1],
      ['HINCRBY', chiave, `d:${dispositivo}`, 1],
    )
    if (nazione) comandi.push(['HINCRBY', chiave, `n:${nazione}`, 1])
    if (citta) comandi.push(['HINCRBY', chiave, `l:${citta}`, 1])
  }
  // NX imposta la scadenza solo alla prima visita del giorno: le successive
  // non la allungano, e l'archivio si svuota da solo dopo 13 mesi.
  comandi.push(['EXPIRE', chiave, DURATA_STATISTICHE, 'NX'], ['EXPIRE', `u:${oggi}`, DURATA_STATISTICHE, 'NX'])

  await redis(comandi).catch(() => {})
  return vuota()
}
