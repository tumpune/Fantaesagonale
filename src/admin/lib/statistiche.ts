import { RAMI } from '../../content/rami'

/** Stessa forma restituita da api/statistiche.ts. */
export type Voce = { nome: string; valore: number }

export type Totali = { visite: number; pagine: number; visitatori: number; richieste: number }

export type Statistiche = {
  periodo: { giorni: number; dal: string; al: string }
  serie: ({ data: string } & Totali)[]
  totali: Totali
  precedente: Totali
  pagine: Voce[]
  fonti: Voce[]
  dispositivi: Voce[]
  nazioni: Voce[]
  citta: Voce[]
  argomenti: Voce[]
}

/** Generatore pseudo-casuale con seme: gli stessi dati di esempio a ogni apertura. */
function casuale(seme: number) {
  return () => {
    seme = (seme * 1664525 + 1013904223) % 4294967296
    return seme / 4294967296
  }
}

const iso = (data: Date) =>
  `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`

/**
 * Dati inventati per vedere com'e' fatta la sezione prima di configurare il
 * conteggio. Il pannello li mostra sempre con un avviso ben visibile.
 */
export function statisticheDiEsempio(giorni: number): Statistiche {
  const r = casuale(giorni * 7919)
  const oggi = new Date()
  const giornoDi = (indietro: number) => {
    const d = new Date(oggi)
    d.setDate(d.getDate() - indietro)
    return d
  }

  const genera = (inizio: number, crescita: number) =>
    Array.from({ length: giorni }, (_, i) => {
      const data = giornoDi(inizio - i)
      const weekend = [0, 6].includes(data.getDay()) ? 1.35 : 1
      const visite = Math.round((38 + crescita * i + r() * 22) * weekend)
      return {
        data: iso(data),
        visite,
        visitatori: Math.round(visite * (0.78 + r() * 0.1)),
        pagine: Math.round(visite * (2.1 + r() * 0.8)),
        richieste: r() < 0.35 ? Math.round(r() * 3) + 1 : 0,
      }
    })

  const serie = genera(giorni - 1, 0.35)
  const prima = genera(giorni * 2 - 1, 0.2)
  const somma = (lista: typeof serie): Totali => ({
    visite: lista.reduce((t, g) => t + g.visite, 0),
    pagine: lista.reduce((t, g) => t + g.pagine, 0),
    visitatori: Math.round(lista.reduce((t, g) => t + g.visitatori, 0) * 0.82),
    richieste: lista.reduce((t, g) => t + g.richieste, 0),
  })
  const totali = somma(serie)
  const quota = (pesi: [string, number][]) => {
    const tot = pesi.reduce((t, [, p]) => t + p, 0)
    return pesi.map(([nome, p]) => ({ nome, valore: Math.round((totali.visite * p) / tot) }))
  }

  return {
    periodo: { giorni, dal: serie[0].data, al: serie[serie.length - 1].data },
    serie,
    totali,
    precedente: somma(prima),
    pagine: [
      { nome: '/', valore: Math.round(totali.pagine * 0.34) },
      ...RAMI.slice(0, 6).map((ramo, i) => ({ nome: `/${ramo.slug}`, valore: Math.round(totali.pagine * (0.16 - i * 0.022)) })),
      { nome: '/chi-siamo', valore: Math.round(totali.pagine * 0.07) },
      { nome: '/contatti', valore: Math.round(totali.pagine * 0.05) },
      { nome: '/faq', valore: Math.round(totali.pagine * 0.03) },
    ].sort((a, b) => b.valore - a.valore),
    fonti: quota([
      ['diretto', 42],
      ['instagram.com', 27],
      ['google.com', 14],
      ['facebook.com', 9],
      ['l.wl.co', 5],
      ['tiktok.com', 3],
    ]),
    dispositivi: quota([
      ['mobile', 71],
      ['desktop', 24],
      ['tablet', 5],
    ]),
    nazioni: quota([
      ['IT', 94],
      ['DE', 3],
      ['CH', 2],
      ['BE', 1],
    ]),
    citta: quota([
      ['Grammichele', 31],
      ['Catania', 24],
      ['Caltagirone', 15],
      ['Palermo', 8],
      ['Milano', 6],
      ['Mineo', 5],
    ]),
    argomenti: [
      { nome: 'fantamaritati', valore: Math.round(totali.richieste * 0.4) },
      { nome: 'fantadsico', valore: Math.round(totali.richieste * 0.3) },
      { nome: 'generale', valore: Math.round(totali.richieste * 0.2) },
      { nome: 'eventi', valore: Math.round(totali.richieste * 0.1) },
    ].filter((v) => v.valore > 0),
  }
}
