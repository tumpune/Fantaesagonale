import { AtSign, Hexagon, Landmark, Quote, Scale, Settings2, Sparkles, type LucideIcon } from 'lucide-react'
import { RAMI, type Stato, type Tema } from '../../content/rami'
import { INIZIATIVE, iniziativeAttive } from '../../content/evidenza'
import { PAGE_TITLES, RECAPITI, SOCIALS } from '../../content/navigazione'
import { TESTIMONIANZE } from '../../content/testimonianze'
import { CAMPI_LEGALI_MANCANTI, nomeCampoLegale } from '../../content/legale'

/* ---------------------------------------------------------- navigazione */

/** Una "vista" e' l'indirizzo interno dell'editor Decap, dopo "#/". */
export type VoceContenuto = {
  id: string
  etichetta: string
  Icon: LucideIcon
  vista: string
  descrizione?: string
  figli?: { id: string; etichetta: string; Icon: LucideIcon; vista: string; stato: Stato; tema: Tema }[]
}

export const vistaFile = (collezione: string, file: string) => `collections/${collezione}/entries/${file}`

export const VOCI_CONTENUTO: VoceContenuto[] = [
  {
    id: 'associazione',
    etichetta: 'Associazione',
    Icon: Landmark,
    vista: vistaFile('associazione', 'identita'),
    descrizione: 'Slogan, storia, principi e FAQ generali',
  },
  {
    id: 'evidenza',
    etichetta: 'In evidenza',
    Icon: Sparkles,
    vista: vistaFile('associazione', 'evidenza'),
    descrizione: 'Le iniziative in home, con le date',
  },
  {
    id: 'progetti',
    etichetta: 'Progetti',
    Icon: Hexagon,
    vista: 'collections/rami',
    descrizione: 'Le pagine dei rami',
    figli: RAMI.map((r) => ({
      id: r.slug,
      etichetta: r.nome,
      Icon: r.Icon,
      vista: vistaFile('rami', r.slug),
      stato: r.stato,
      tema: r.tema,
    })),
  },
  {
    id: 'testimonianze',
    etichetta: 'Testimonianze',
    Icon: Quote,
    vista: 'collections/testimonianze',
    descrizione: 'Le esperienze di chi ha partecipato',
  },
  {
    id: 'legale',
    etichetta: 'Informazioni legali',
    Icon: Scale,
    vista: vistaFile('associazione', 'legale'),
    descrizione: 'Dati che compaiono nella Privacy Policy',
  },
  {
    id: 'contatti',
    etichetta: 'Contatti e social',
    Icon: AtSign,
    vista: vistaFile('associazione', 'contatti'),
    descrizione: 'Email, telefono e profili',
  },
]

export const VISTA_IMPOSTAZIONI_AUTOMAZIONI = vistaFile('impostazioni', 'automazioni')
export const VISTA_NUOVA_TESTIMONIANZA = 'collections/testimonianze/new'

export const VOCE_IMPOSTAZIONI = { etichetta: 'Impostazioni automazioni', Icon: Settings2 }

/** Titolo leggibile di una vista, per l'intestazione del pannello. */
export function titoloVista(vista: string): { sezione: string; titolo: string; pagina?: string } {
  for (const voce of VOCI_CONTENUTO) {
    const figlio = voce.figli?.find((f) => vista.startsWith(f.vista))
    if (figlio) return { sezione: voce.etichetta, titolo: figlio.etichetta, pagina: `/${figlio.id}` }
    if (vista === voce.vista || (voce.figli && vista.startsWith(voce.vista))) return { sezione: 'Contenuti', titolo: voce.etichetta }
    if (vista.startsWith(voce.vista)) return { sezione: voce.etichetta, titolo: vista.endsWith('/new') ? 'Nuova' : 'Modifica' }
  }
  if (vista.startsWith(VISTA_IMPOSTAZIONI_AUTOMAZIONI)) return { sezione: 'Automazioni', titolo: 'Impostazioni' }
  return { sezione: 'Contenuti', titolo: 'Editor' }
}

/* ----------------------------------------------------------- pagine */

/** Nome della pagina per un percorso del sito, come nel titolo del browser. */
export function nomePagina(percorso: string): string {
  if (percorso === '/') return 'Home'
  const titolo = PAGE_TITLES[percorso]
  return titolo ? titolo.replace(/ — FantaEsagonale APS$/, '') : percorso
}

export const temaPercorso = (percorso: string): Tema | undefined => RAMI.find((r) => `/${r.slug}` === percorso)?.tema

export const nomeArgomento = (oggetto: string) =>
  ({ generale: 'Informazioni generali', testimonianza: 'Testimonianze', altro: 'Altro' })[oggetto] ??
  RAMI.find((r) => r.slug === oggetto)?.nome ??
  oggetto

/* -------------------------------------------------------- iniziative */

const giornoIso = (data: Date) =>
  `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`

export type FaseIniziativa = 'in-onda' | 'in-arrivo' | 'terminata'

export function faseIniziative(oggi = new Date()) {
  const iso = giornoIso(oggi)
  const attive = new Set(iniziativeAttive(oggi, Infinity).map((i) => i.titolo))
  const visibili = new Set(iniziativeAttive(oggi).map((i) => i.titolo))
  return INIZIATIVE.map((i) => {
    const fase: FaseIniziativa = i.al && i.al < iso ? 'terminata' : i.dal && i.dal > iso ? 'in-arrivo' : 'in-onda'
    return {
      ...i,
      fase,
      // In home ne compaiono al massimo tre: le altre attive restano in coda.
      inHome: visibili.has(i.titolo),
      inCoda: attive.has(i.titolo) && !visibili.has(i.titolo),
      tema: RAMI.find((r) => r.slug === i.ramo)?.tema ?? 'centrale',
    }
  }).sort((a, b) => a.priorita - b.priorita)
}

/* ---------------------------------------------------------- controlli */

export type Livello = 'critico' | 'attenzione' | 'info'

export type Controllo = {
  id: string
  livello: Livello
  titolo: string
  dettaglio: string
  vista?: string
}

const PERCORSI_RISERVATI = new Set(['chi-siamo', 'faq', 'contatti', 'privacy', 'cookie', 'admin', 'api'])

/**
 * Controllo automatico dei contenuti pubblicati: segnala cio' che manca o
 * che rischia di dare un'impressione sbagliata a chi visita il sito.
 */
export function controllaContenuti(oggi = new Date()): Controllo[] {
  const esiti: Controllo[] = []
  const iso = giornoIso(oggi)
  const contatti = vistaFile('associazione', 'contatti')
  const evidenza = vistaFile('associazione', 'evidenza')

  if (CAMPI_LEGALI_MANCANTI.length)
    esiti.push({
      id: 'legali',
      livello: 'critico',
      titolo: 'Informazioni legali incomplete',
      dettaglio: `Nella Privacy Policy compaiono ancora segnaposto: manca ${CAMPI_LEGALI_MANCANTI.map(nomeCampoLegale).join(', ')}.`,
      vista: vistaFile('associazione', 'legale'),
    })

  if (!RECAPITI.email)
    esiti.push({
      id: 'email',
      livello: 'critico',
      titolo: "Manca l'email dell'associazione",
      dettaglio: 'Nella pagina Contatti compare "Presto disponibile".',
      vista: contatti,
    })
  if (!RECAPITI.telefono)
    esiti.push({ id: 'telefono', livello: 'info', titolo: 'Telefono non inserito', dettaglio: 'Facoltativo, ma utile per WhatsApp.', vista: contatti })

  const socialVuoti = SOCIALS.filter((s) => !s.url)
  if (socialVuoti.length)
    esiti.push({
      id: 'social',
      livello: socialVuoti.length === SOCIALS.length ? 'attenzione' : 'info',
      titolo: `${socialVuoti.length} profili social senza indirizzo`,
      dettaglio: socialVuoti.map((s) => s.label).join(', '),
      vista: contatti,
    })

  if (!iniziativeAttive(oggi).length)
    esiti.push({
      id: 'evidenza-vuota',
      livello: 'attenzione',
      titolo: 'Nessuna iniziativa in home',
      dettaglio: 'Il blocco "In evidenza" non compare finché non ce n\'è almeno una attiva.',
      vista: evidenza,
    })

  const scadute = INIZIATIVE.filter((i) => i.al && i.al < iso)
  if (scadute.length)
    esiti.push({
      id: 'evidenza-scadute',
      livello: 'info',
      titolo: `${scadute.length} iniziative terminate`,
      dettaglio: `Non compaiono più: ${scadute.map((i) => i.titolo).join(', ')}. Puoi toglierle dall'elenco.`,
      vista: evidenza,
    })

  const inAttesa = TESTIMONIANZE.filter((t) => !t.pubblicata)
  if (inAttesa.length)
    esiti.push({
      id: 'testimonianze-attesa',
      livello: 'attenzione',
      titolo: `${inAttesa.length} testimonianze in attesa`,
      dettaglio: 'Pubblicale appena hai il consenso di chi le ha scritte.',
      vista: 'collections/testimonianze',
    })
  if (!TESTIMONIANZE.some((t) => t.pubblicata))
    esiti.push({
      id: 'testimonianze-zero',
      livello: 'attenzione',
      titolo: 'Nessuna testimonianza pubblicata',
      dettaglio: 'Il questionario le indica come elemento fondamentale: al loro posto compare un invito a lasciarne una.',
      vista: 'collections/testimonianze',
    })

  for (const ramo of RAMI.filter((r) => r.stato === 'attivo' && !r.paginaDedicata)) {
    if (!ramo.faq.length)
      esiti.push({
        id: `faq-${ramo.slug}`,
        livello: 'info',
        titolo: `${ramo.nome}: nessuna domanda frequente`,
        dettaglio: 'La sezione FAQ della pagina non compare.',
        vista: vistaFile('rami', ramo.slug),
      })
    if (ramo.intro.length < 120)
      esiti.push({
        id: `intro-${ramo.slug}`,
        livello: 'info',
        titolo: `${ramo.nome}: introduzione molto breve`,
        dettaglio: "Due o tre frasi aiutano chi arriva da un link a capire subito di cosa si tratta.",
        vista: vistaFile('rami', ramo.slug),
      })
  }

  const visti = new Map<string, string>()
  for (const ramo of RAMI)
    for (const alias of ramo.alias ?? []) {
      const conflitto = visti.get(alias) ?? (PERCORSI_RISERVATI.has(alias) || RAMI.some((r) => r.slug === alias) ? 'una pagina del sito' : undefined)
      if (conflitto)
        esiti.push({
          id: `alias-${alias}`,
          livello: 'critico',
          titolo: `Indirizzo breve /${alias} duplicato`,
          dettaglio: `È già usato da ${conflitto}: il link potrebbe portare alla pagina sbagliata.`,
          vista: vistaFile('rami', ramo.slug),
        })
      visti.set(alias, ramo.nome)
    }

  const ordine: Record<Livello, number> = { critico: 0, attenzione: 1, info: 2 }
  return esiti.sort((a, b) => ordine[a.livello] - ordine[b.livello])
}

export const RIEPILOGO_CONTENUTI = {
  progetti: RAMI.length,
  progettiAttivi: RAMI.filter((r) => r.stato === 'attivo').length,
  testimonianzePubblicate: TESTIMONIANZE.filter((t) => t.pubblicata).length,
  testimonianzeInAttesa: TESTIMONIANZE.filter((t) => !t.pubblicata).length,
  faq: RAMI.reduce((t, r) => t + r.faq.length, 0),
}
