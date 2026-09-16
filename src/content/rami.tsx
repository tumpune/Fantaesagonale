import {
  Building2,
  CalendarDays,
  Camera,
  Flag,
  Gift,
  HeartHandshake,
  MapPinned,
  Megaphone,
  PartyPopper,
  Shirt,
  Star,
  Ticket,
  Trophy,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * I rami del progetto, dal questionario del cliente (1.2, 1.4, 3.1, 4.1).
 *
 * Ogni ramo ha la propria pagina, il proprio tema cromatico e le proprie FAQ:
 * chi arriva da un link su FantaMaritati o sul fantacalcio deve atterrare
 * direttamente nella sezione giusta e poi poter esplorare il resto (2.2).
 *
 * I testi stanno in `dati/rami/*.json` e si modificano dal pannello /admin:
 * lo staff aggiorna i contenuti senza toccare il codice (questionario 9.1).
 * Qui restano solo i tipi e le regole che non devono dipendere da un editor.
 */

export type Tema = 'centrale' | 'oro' | 'mono'

/** Serve a non promettere cio' che non esiste ancora. */
export type Stato = 'attivo' | 'in-arrivo' | 'in-progetto'

export type Faq = { domanda: string; risposta: string }

export type Ramo = {
  slug: string
  /** Indirizzi brevi da stampare su materiali, merch e QR degli eventi. */
  alias?: string[]
  nome: string
  breve: string
  Icon: LucideIcon
  tema: Tema
  stato: Stato
  occhiello: string
  titolo: string
  intro: string
  perChi: string
  offerta: { titolo: string; testo: string }[]
  nota?: string
  faq: Faq[]
  cta: { etichetta: string; oggetto: string }
  /** Formule a scala: per ora solo FantADSico. */
  scale?: { nome: string; testo: string }[]
  /** Linea del tempo: per ora solo Italia Campione 2030. */
  tappe?: { quando: string; testo: string }[]
  /** Ha una pagina costruita a parte invece del modello comune. */
  paginaDedicata?: boolean
}

export const ETICHETTA_STATO: Record<Stato, string> = {
  attivo: 'Attivo',
  'in-arrivo': 'In arrivo',
  'in-progetto': 'In progetto',
}

/**
 * Le icone selezionabili dal pannello. Le chiavi sono le stesse del campo
 * "Icona" nella configurazione di /admin: aggiungerne una va fatto in entrambi.
 */
export const ICONE: Record<string, LucideIcon> = {
  trophy: Trophy,
  'heart-handshake': HeartHandshake,
  megaphone: Megaphone,
  'party-popper': PartyPopper,
  flag: Flag,
  shirt: Shirt,
  'map-pinned': MapPinned,
  'building-2': Building2,
  'calendar-days': CalendarDays,
  camera: Camera,
  gift: Gift,
  star: Star,
  ticket: Ticket,
  users: Users,
}

/** Rami con una pagina scritta a mano: il loro contenuto non segue il modello. */
const PAGINE_DEDICATE = new Set(['italia-campione-2030'])

type RamoDati = Omit<Ramo, 'Icon' | 'paginaDedicata' | 'tema' | 'stato'> & {
  ordine?: number
  icona?: string
  tema?: string
  stato?: string
}

const TEMI: Tema[] = ['centrale', 'oro', 'mono']
const STATI: Stato[] = ['attivo', 'in-arrivo', 'in-progetto']

/**
 * Un file salvato a meta' o con un valore non previsto non deve rompere il
 * sito: ogni campo facoltativo ricade su un valore sicuro.
 */
function daDati({ ordine: _ordine, icona, tema, stato, ...dati }: RamoDati): Ramo {
  return {
    ...dati,
    // Un indirizzo breve scritto male ("Maritati ", "/sposi") non deve creare
    // una rotta sbagliata: si tengono solo minuscole, numeri e trattini.
    alias: (dati.alias ?? []).map((a) => a.trim()).filter((a) => /^[a-z0-9-]+$/.test(a)),
    offerta: dati.offerta ?? [],
    faq: dati.faq ?? [],
    nota: dati.nota || undefined,
    scale: dati.scale?.length ? dati.scale : undefined,
    tappe: dati.tappe?.length ? dati.tappe : undefined,
    // L'oggetto del modulo contatti coincide con lo slug: lo si deriva invece
    // di chiederlo, cosi' dal pannello non si puo' scollegare.
    cta: { etichetta: dati.cta?.etichetta || 'Contattaci', oggetto: dati.slug },
    Icon: ICONE[icona ?? ''] ?? Star,
    tema: TEMI.includes(tema as Tema) ? (tema as Tema) : 'centrale',
    stato: STATI.includes(stato as Stato) ? (stato as Stato) : 'attivo',
    paginaDedicata: PAGINE_DEDICATE.has(dati.slug),
  }
}

const FILE_RAMI = import.meta.glob<RamoDati>('./dati/rami/*.json', { eager: true, import: 'default' })

export const RAMI: Ramo[] = Object.values(FILE_RAMI)
  .sort((a, b) => (a.ordine ?? 99) - (b.ordine ?? 99) || a.nome.localeCompare(b.nome))
  .map(daDati)

export const ramoDaSlug = (slug: string) => RAMI.find((r) => r.slug === slug)

/** Tema della pagina corrente: i rami hanno il loro, il resto usa il centrale. */
export const temaDaPercorso = (percorso: string): Tema =>
  RAMI.find((r) => percorso === `/${r.slug}`)?.tema ?? 'centrale'
