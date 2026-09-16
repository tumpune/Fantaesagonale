import {
  collaboratore,
  daCoppie,
  datiDalRepository,
  destinatariStaff,
  emailConfigurata,
  fileDelRepository,
  giorniFinoA,
  giorno,
  html,
  inviaEmail,
  json,
  modelloEmail,
  redis,
  redisConfigurato,
  registraEsecuzione,
  spostaGiorno,
  type ImpostazioniAutomazioni,
  type Iniziativa,
} from './_lib/servizi.js'

/**
 * Automazioni pianificate.
 *
 * Vercel chiama GET ogni mattina (vedi "crons" in vercel.json) con il segreto
 * CRON_SECRET: parte il promemoria delle scadenze e, il lunedi', il riepilogo
 * settimanale. Dal pannello un collaboratore puo' lanciarle subito con POST,
 * per provarle: in quel caso l'email parte anche se non c'e' nulla da segnalare.
 */

type Esito = { esito: 'ok' | 'errore' | 'saltata'; dettaglio: string }

const SITO = process.env.SITO_URL || 'https://fantaesagonale.vercel.app'

const dataEstesa = (iso: string) =>
  new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    new Date(`${iso}T12:00:00Z`),
  )

const leggiImpostazioni = () =>
  datiDalRepository<ImpostazioniAutomazioni>('src/content/dati/automazioni.json').catch(
    () => ({}) as ImpostazioniAutomazioni,
  )

const leggiIniziative = () =>
  datiDalRepository<{ iniziative: Iniziativa[] }>('src/content/dati/evidenza.json').then((d) => d.iniziative ?? [])

async function concludi(nome: string, esito: Esito): Promise<Esito> {
  await registraEsecuzione(nome, esito.esito, esito.dettaglio)
  return esito
}

/* -------------------------------------------------------------- promemoria */

async function promemoria(prova: boolean): Promise<Esito> {
  if (!emailConfigurata()) return concludi('promemoriaScadenze', { esito: 'saltata', dettaglio: 'Email non configurata' })

  const impostazioni = (await leggiImpostazioni()).promemoriaScadenze
  if (!prova && impostazioni?.attivo === false)
    return concludi('promemoriaScadenze', { esito: 'saltata', dettaglio: 'Automazione in pausa' })

  const anticipo = Math.min(Math.max(Math.round(impostazioni?.giorniPrima ?? 3), 1), 30)
  const oggi = giorno()
  const traPoco = spostaGiorno(oggi, anticipo)

  // Se GitHub non risponde l'automazione non deve morire in silenzio: senza
  // iniziative non parte nessun avviso, ma l'esecuzione resta registrata.
  const iniziative = await leggiIniziative().catch(() => [] as Iniziativa[])
  const avvisi: string[] = []
  for (const i of iniziative) {
    if (i.dal === oggi) avvisi.push(`<strong>${html(i.titolo)}</strong> compare in home da oggi.`)
    if (i.dal === traPoco) avvisi.push(`<strong>${html(i.titolo)}</strong> comparirà in home ${dataEstesa(traPoco)}.`)
    if (i.al === traPoco) avvisi.push(`<strong>${html(i.titolo)}</strong> uscirà dalla home dopo ${dataEstesa(traPoco)}.`)
    if (i.al === oggi) avvisi.push(`Oggi è l'ultimo giorno in home per <strong>${html(i.titolo)}</strong>.`)
  }

  if (!avvisi.length && !prova)
    return concludi('promemoriaScadenze', { esito: 'ok', dettaglio: 'Nessuna scadenza da segnalare' })

  const corpo = avvisi.length
    ? `<ul style="margin:0 0 20px;padding-left:18px">${avvisi.map((a) => `<li style="margin:0 0 8px">${a}</li>`).join('')}</ul>`
    : `<p style="margin:0 0 20px">Email di prova: nei prossimi ${anticipo} giorni non ci sono iniziative che entrano o escono dalla home.</p>`

  try {
    await inviaEmail({
      a: destinatariStaff(),
      oggetto: avvisi.length ? `Promemoria: ${avvisi.length} scadenze in home` : 'Promemoria scadenze (prova)',
      testo: avvisi.map((a) => `- ${a.replace(/<[^>]+>/g, '')}`).join('\n') || 'Nessuna scadenza.',
      html: modelloEmail(
        'Scadenze delle iniziative in home',
        `${corpo}<a href="${SITO}/admin/#/automazioni" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#fcd70c;color:#0d0d0d;font-weight:700;text-decoration:none">Apri il pannello</a>`,
      ),
    })
  } catch (errore) {
    return concludi('promemoriaScadenze', { esito: 'errore', dettaglio: errore instanceof Error ? errore.message : 'Invio non riuscito' })
  }
  return concludi('promemoriaScadenze', {
    esito: 'ok',
    dettaglio: avvisi.length ? `${avvisi.length} scadenze segnalate` : 'Email di prova inviata',
  })
}

/* --------------------------------------------------------------- riepilogo */

async function statisticheSettimana() {
  if (!redisConfigurato()) return null
  const giorni = giorniFinoA(14)
  const risultati = await redis([
    ...giorni.map((g) => ['HGETALL', `s:${g}`]),
    ['PFCOUNT', ...giorni.slice(7).map((g) => `u:${g}`)],
    ['PFCOUNT', ...giorni.slice(0, 7).map((g) => `u:${g}`)],
  ])
  const campi = giorni.map((_, i) => daCoppie(risultati[i]))
  const conta = (lista: Record<string, number>[], prefisso: string) =>
    lista.reduce((t, c) => t + Object.entries(c).reduce((s, [k, v]) => (k.startsWith(prefisso) ? s + v : s), 0), 0)

  const pagine: Record<string, number> = {}
  for (const c of campi.slice(7))
    for (const [k, v] of Object.entries(c)) if (k.startsWith('p:')) pagine[k.slice(2)] = (pagine[k.slice(2)] ?? 0) + v

  return {
    visite: conta(campi.slice(7), 'i:'),
    visitePrima: conta(campi.slice(0, 7), 'i:'),
    visitatori: Number(risultati[14]) || 0,
    visitatoriPrima: Number(risultati[15]) || 0,
    richieste: conta(campi.slice(7), 'm:'),
    pagine: Object.entries(pagine)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
  }
}

const variazione = (ora: number, prima: number) => {
  if (!prima) return ora ? 'nuovo' : '='
  const delta = Math.round(((ora - prima) / prima) * 100)
  return `${delta > 0 ? '+' : ''}${delta}%`
}

async function riepilogo(prova: boolean): Promise<Esito> {
  if (!emailConfigurata()) return concludi('riepilogoSettimanale', { esito: 'saltata', dettaglio: 'Email non configurata' })
  if (!prova && (await leggiImpostazioni()).riepilogoSettimanale?.attivo === false)
    return concludi('riepilogoSettimanale', { esito: 'saltata', dettaglio: 'Automazione in pausa' })

  const oggi = giorno()
  const [statistiche, iniziative, fileTestimonianze] = await Promise.all([
    statisticheSettimana().catch(() => null),
    leggiIniziative().catch(() => [] as Iniziativa[]),
    fileDelRepository('src/content/dati/testimonianze').catch(() => [] as string[]),
  ])
  const testimonianze = await Promise.all(
    fileTestimonianze.map((f) => datiDalRepository<{ pubblicata?: boolean }>(f).catch(() => ({ pubblicata: true }))),
  )
  const inAttesa = testimonianze.filter((t) => !t.pubblicata).length

  const inOnda = iniziative.filter((i) => (!i.dal || i.dal <= oggi) && (!i.al || i.al >= oggi))
  const inArrivo = iniziative.filter((i) => i.dal && i.dal > oggi && i.dal <= spostaGiorno(oggi, 14))

  const blocco = (titolo: string, contenuto: string) =>
    `<h2 style="margin:24px 0 10px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#fcd70c">${titolo}</h2>${contenuto}`
  const cifra = (etichetta: string, valore: number, delta: string) =>
    `<td style="padding:14px;background:#141414;border-radius:12px;width:33%"><div style="font-size:26px;font-weight:800;color:#fff">${valore.toLocaleString('it-IT')}</div><div style="font-size:12px;color:#8a8a8a">${etichetta}${delta ? ` · <span style="color:#fcd70c">${delta}</span>` : ''}</div></td>`

  const parteStatistiche = statistiche
    ? blocco(
        'Ultimi 7 giorni',
        `<table role="presentation" width="100%" cellspacing="8" cellpadding="0" style="margin:0 -8px"><tr>${cifra('visite', statistiche.visite, variazione(statistiche.visite, statistiche.visitePrima))}${cifra('visitatori', statistiche.visitatori, variazione(statistiche.visitatori, statistiche.visitatoriPrima))}${cifra('richieste', statistiche.richieste, '')}</tr></table>` +
          (statistiche.pagine.length
            ? `<ol style="margin:14px 0 0;padding-left:18px">${statistiche.pagine.map(([p, v]) => `<li style="margin:0 0 4px">${html(p)} — ${v}</li>`).join('')}</ol>`
            : ''),
      )
    : blocco('Statistiche', '<p style="margin:0">Il conteggio delle visite non è ancora configurato.</p>')

  const lista = (voci: Iniziativa[], vuoto: string, dettaglio: (i: Iniziativa) => string) =>
    voci.length
      ? `<ul style="margin:0;padding-left:18px">${voci.map((i) => `<li style="margin:0 0 6px"><strong>${html(i.titolo)}</strong>${dettaglio(i)}</li>`).join('')}</ul>`
      : `<p style="margin:0;color:#8a8a8a">${vuoto}</p>`

  const corpo =
    parteStatistiche +
    blocco('In home adesso', lista(inOnda, 'Nessuna iniziativa: il blocco "In evidenza" non compare.', (i) => (i.al ? ` — fino a ${dataEstesa(i.al)}` : ''))) +
    blocco('In arrivo nelle prossime due settimane', lista(inArrivo, 'Nessuna.', (i) => ` — da ${dataEstesa(i.dal!)}`)) +
    blocco(
      'Testimonianze',
      `<p style="margin:0">${inAttesa ? `${inAttesa} in attesa di pubblicazione.` : 'Nessuna in attesa.'}</p>`,
    ) +
    `<p style="margin:28px 0 0"><a href="${SITO}/admin/#/statistiche" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#fcd70c;color:#0d0d0d;font-weight:700;text-decoration:none">Apri le statistiche</a></p>`

  try {
    await inviaEmail({
      a: destinatariStaff(),
      oggetto: `${prova ? '[Prova] ' : ''}Riepilogo settimanale — FantaEsagonale`,
      testo: statistiche
        ? `Ultimi 7 giorni: ${statistiche.visite} visite, ${statistiche.visitatori} visitatori, ${statistiche.richieste} richieste.`
        : 'Riepilogo settimanale del sito.',
      html: modelloEmail('La settimana del sito', corpo),
    })
  } catch (errore) {
    return concludi('riepilogoSettimanale', { esito: 'errore', dettaglio: errore instanceof Error ? errore.message : 'Invio non riuscito' })
  }
  return concludi('riepilogoSettimanale', { esito: 'ok', dettaglio: prova ? 'Email di prova inviata' : 'Riepilogo inviato' })
}

/* ------------------------------------------------------------------ ingressi */

export async function GET(request: Request): Promise<Response> {
  const segreto = process.env.CRON_SECRET
  if (!segreto || request.headers.get('authorization') !== `Bearer ${segreto}`) {
    return json({ errore: 'accesso-negato' }, 401)
  }
  const lunedi = new Date(`${giorno()}T12:00:00Z`).getUTCDay() === 1
  return json({
    promemoriaScadenze: await promemoria(false),
    riepilogoSettimanale: lunedi ? await riepilogo(false) : { esito: 'saltata', dettaglio: 'Solo il lunedì' },
  })
}

export async function POST(request: Request): Promise<Response> {
  if (!(await collaboratore(request))) return json({ errore: 'accesso-negato' }, 401)
  const { azione } = (await request.json().catch(() => ({}))) as { azione?: string }
  if (azione === 'promemoriaScadenze') return json(await promemoria(true))
  if (azione === 'riepilogoSettimanale') return json(await riepilogo(true))
  return json({ errore: 'azione-sconosciuta' }, 400)
}
