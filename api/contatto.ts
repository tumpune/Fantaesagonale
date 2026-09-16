import {
  DURATA_STATISTICHE,
  datiDalRepository,
  destinatariStaff,
  emailConfigurata,
  giorno,
  html,
  inviaEmail,
  ipDi,
  json,
  modelloEmail,
  redis,
  redisConfigurato,
  registraEsecuzione,
  sale,
  sha256,
  stessaOrigine,
  type ImpostazioniAutomazioni,
} from './_lib/servizi.js'

/**
 * Modulo contatti del sito: inoltra la richiesta allo staff via email, con
 * l'argomento nell'oggetto e il mittente come indirizzo di risposta.
 *
 * Il messaggio non viene salvato da nessuna parte oltre all'email: si conta
 * solo quante richieste arrivano per argomento, per le statistiche.
 */

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i
const MASSIMO_ORARIO = 5

/**
 * Freno di riserva quando l'archivio delle statistiche non e' configurato o non
 * risponde: vale solo per questa istanza della funzione, ma evita che il modulo
 * resti del tutto senza limiti.
 */
const inviiRecenti: number[] = []
const troppiInvii = () => {
  const ora = Date.now()
  while (inviiRecenti.length && ora - inviiRecenti[0] > 3_600_000) inviiRecenti.shift()
  inviiRecenti.push(ora)
  return inviiRecenti.length > 30
}

const testo = (valore: unknown, minimo: number, massimo: number) =>
  typeof valore === 'string' && valore.trim().length >= minimo && valore.trim().length <= massimo
    ? valore.trim()
    : null

export async function POST(request: Request): Promise<Response> {
  if (!stessaOrigine(request)) return json({ errore: 'origine-non-valida' }, 403)

  let dati: Record<string, unknown>
  try {
    dati = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ errore: 'richiesta-non-valida' }, 400)
  }

  // Campo nascosto: le persone non lo vedono, i programmi che compilano i
  // moduli in automatico si'. Si risponde "ok" per non insegnare nulla.
  if (typeof dati.sito === 'string' && dati.sito) return json({ ok: true })

  const nome = testo(dati.nome, 2, 80)
  const email = testo(dati.email, 5, 254)
  const telefono = dati.telefono ? testo(dati.telefono, 5, 30) : ''
  const oggetto = typeof dati.oggetto === 'string' && /^[a-z0-9-]{1,40}$/.test(dati.oggetto) ? dati.oggetto : null
  // L'etichetta finisce nell'oggetto dell'email: gli a capo permetterebbero di
  // aggiungere intestazioni di posta, quindi si appiattiscono in spazi.
  const argomento = (testo(dati.argomento, 1, 60) ?? oggetto)?.replace(/\s+/g, ' ')
  const messaggio = testo(dati.messaggio, 10, 4000)

  if (!nome || !email || !EMAIL.test(email) || telefono === null || !oggetto || !messaggio || dati.privacy !== true) {
    return json({ errore: 'campi-non-validi' }, 422)
  }

  if (!emailConfigurata()) return json({ errore: 'non-configurato' }, 503)

  const impostazioni = await datiDalRepository<ImpostazioniAutomazioni>('src/content/dati/automazioni.json').catch(
    () => ({}) as ImpostazioniAutomazioni,
  )
  if (impostazioni.moduloContatti?.attivo === false) return json({ errore: 'in-pausa' }, 503)

  if (!redisConfigurato() && troppiInvii()) return json({ errore: 'troppe-richieste' }, 429)

  if (redisConfigurato()) {
    const ora = new Date().toISOString().slice(0, 13)
    const chiave = `limite:${(await sha256(`${ipDi(request)}|${sale()}|${ora}`)).slice(0, 24)}`
    const [conteggio] = await redis([
      ['INCR', chiave],
      ['EXPIRE', chiave, 3600],
    ]).catch(() => [0])
    if (Number(conteggio) > MASSIMO_ORARIO) return json({ errore: 'troppe-richieste' }, 429)
  }

  const righe: [string, string][] = [
    ['Nome', nome],
    ['Email', email],
    ['Telefono', telefono || '—'],
    ['Argomento', argomento ?? oggetto],
  ]

  try {
    await inviaEmail({
      a: destinatariStaff(),
      rispondiA: email,
      oggetto: `[${argomento}] Nuova richiesta da ${nome}`,
      testo: `${righe.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${messaggio}`,
      html: modelloEmail(
        `Nuova richiesta: ${argomento}`,
        `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;font-size:14px">${righe
          .map(
            ([k, v]) =>
              `<tr><td style="padding:3px 16px 3px 0;color:#8a8a8a">${k}</td><td style="padding:3px 0;color:#fff">${html(v)}</td></tr>`,
          )
          .join('')}</table>
        <div style="padding:16px 18px;background:#141414;border-radius:12px;border-left:3px solid #fcd70c;white-space:pre-wrap;color:#e8e8e8">${html(messaggio)}</div>
        <p style="margin:20px 0 0;font-size:13px;color:#8a8a8a">Rispondi a questa email per scrivere direttamente a ${html(nome)}.</p>`,
      ),
    })
  } catch (errore) {
    await registraEsecuzione('moduloContatti', 'errore', errore instanceof Error ? errore.message : 'Invio non riuscito')
    return json({ errore: 'invio-non-riuscito' }, 502)
  }

  // La conferma a chi scrive e' facoltativa, e un suo errore non deve far
  // credere che la richiesta non sia arrivata.
  if (impostazioni.moduloContatti?.rispostaAutomatica) {
    const risposta =
      impostazioni.moduloContatti.testoRisposta?.trim() ||
      'Grazie per averci scritto: abbiamo ricevuto la tua richiesta e ti risponderemo il prima possibile.'
    await inviaEmail({
      a: [email],
      oggetto: 'Abbiamo ricevuto la tua richiesta — FantaEsagonale',
      testo: `Ciao ${nome},\n\n${risposta}\n\nFantaEsagonale APS`,
      html: modelloEmail(
        `Ciao ${nome}, grazie!`,
        `<p style="margin:0 0 16px;white-space:pre-wrap">${html(risposta)}</p><p style="margin:0;color:#8a8a8a;font-size:13px">Argomento: ${html(argomento ?? oggetto)}</p>`,
        'FantaEsagonale APS · Metti Fanta davanti a ogni parola e sorridi',
      ),
    }).catch(() => {})
  }

  if (redisConfigurato()) {
    const chiave = `s:${giorno()}`
    await redis([
      ['HINCRBY', chiave, `m:${oggetto}`, 1],
      ['EXPIRE', chiave, DURATA_STATISTICHE, 'NX'],
    ]).catch(() => {})
  }
  await registraEsecuzione('moduloContatti', 'ok', `Richiesta "${oggetto}" inoltrata`)

  return json({ ok: true })
}
