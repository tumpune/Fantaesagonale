import {
  collaboratore,
  daCoppie,
  giorniFinoA,
  json,
  redis,
  redisConfigurato,
} from './_lib/servizi.js'

/**
 * Statistiche per il pannello /admin, riservate ai collaboratori.
 * `?giorni=30` restituisce il periodo richiesto e quello precedente di pari
 * durata, per mostrare l'andamento.
 */

type Voce = { nome: string; valore: number }

const classifica = (totali: Record<string, number>, massimo = 12): Voce[] =>
  Object.entries(totali)
    .map(([nome, valore]) => ({ nome, valore }))
    .sort((a, b) => b.valore - a.valore)
    .slice(0, massimo)

export async function GET(request: Request): Promise<Response> {
  if (!(await collaboratore(request))) return json({ errore: 'accesso-negato' }, 401)
  if (!redisConfigurato()) return json({ errore: 'non-configurato' }, 503)

  const richiesto = new URL(request.url).searchParams.get('giorni')
  const giorniChiesti = richiesto === null ? 30 : Number(richiesto)
  const n = Number.isFinite(giorniChiesti) ? Math.min(Math.max(Math.round(giorniChiesti), 1), 180) : 30

  const tutti = giorniFinoA(n * 2)
  const precedenti = tutti.slice(0, n)
  const attuali = tutti.slice(n)

  const risultati = await redis([
    ...tutti.map((g) => ['HGETALL', `s:${g}`]),
    ...attuali.map((g) => ['PFCOUNT', `u:${g}`]),
    ['PFCOUNT', ...attuali.map((g) => `u:${g}`)],
    ['PFCOUNT', ...precedenti.map((g) => `u:${g}`)],
  ]).catch(() => null)
  // Archivio momentaneamente irraggiungibile: il pannello lo distingue da un
  // errore vero e mostra le istruzioni di configurazione.
  if (!risultati) return json({ errore: 'non-configurato' }, 503)

  const perGiorno = tutti.map((_, i) => daCoppie(risultati[i]))
  const unici = risultati.slice(tutti.length, tutti.length + n).map(Number)
  const [uniciPeriodo, uniciPrecedenti] = risultati.slice(tutti.length + n).map(Number)

  const somma = (campi: Record<string, number>, prefisso: string) =>
    Object.entries(campi).reduce((t, [k, v]) => (k.startsWith(prefisso) ? t + v : t), 0)

  const raggruppa = (giorni: Record<string, number>[], prefisso: string) => {
    const totali: Record<string, number> = {}
    for (const campi of giorni)
      for (const [k, v] of Object.entries(campi))
        if (k.startsWith(prefisso)) totali[k.slice(prefisso.length)] = (totali[k.slice(prefisso.length)] ?? 0) + v
    return totali
  }

  const giorniAttuali = perGiorno.slice(n)
  const giorniPrecedenti = perGiorno.slice(0, n)
  const totale = (giorni: Record<string, number>[], prefisso: string) =>
    giorni.reduce((t, campi) => t + somma(campi, prefisso), 0)

  return json({
    periodo: { giorni: n, dal: attuali[0], al: attuali[n - 1] },
    serie: attuali.map((data, i) => ({
      data,
      visite: somma(giorniAttuali[i], 'i:'),
      pagine: somma(giorniAttuali[i], 'p:'),
      visitatori: unici[i] || 0,
      richieste: somma(giorniAttuali[i], 'm:'),
    })),
    totali: {
      visite: totale(giorniAttuali, 'i:'),
      pagine: totale(giorniAttuali, 'p:'),
      visitatori: uniciPeriodo || 0,
      richieste: totale(giorniAttuali, 'm:'),
    },
    precedente: {
      visite: totale(giorniPrecedenti, 'i:'),
      pagine: totale(giorniPrecedenti, 'p:'),
      visitatori: uniciPrecedenti || 0,
      richieste: totale(giorniPrecedenti, 'm:'),
    },
    pagine: classifica(raggruppa(giorniAttuali, 'p:'), 20),
    fonti: classifica(raggruppa(giorniAttuali, 'f:')),
    dispositivi: classifica(raggruppa(giorniAttuali, 'd:')),
    nazioni: classifica(raggruppa(giorniAttuali, 'n:')),
    citta: classifica(raggruppa(giorniAttuali, 'l:')),
    argomenti: classifica(raggruppa(giorniAttuali, 'm:')),
  })
}
