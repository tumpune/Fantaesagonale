import { Facebook, Instagram, MessageCircle, Music2, Send, Youtube } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { RAMI } from './rami'
import { SLOGAN } from './associazione'
import contatti from './dati/contatti.json'

/**
 * Voci principali del menu. I rami sono raccolti sotto "Progetti": undici voci
 * affiancate in una barra non entrerebbero, e costringerebbero chi arriva a
 * leggerle tutte prima di trovare la propria.
 */
export const NAV_PRINCIPALE = [
  { label: 'Chi siamo', to: '/chi-siamo' },
  { label: 'FAQ', to: '/faq' },
]

/**
 * Un indirizzo inserito dal pannello finisce in un href: si accettano solo
 * collegamenti https, cosi' un valore sbagliato non diventa uno script.
 */
const urlSicuro = (url?: string) => (url && /^https:\/\/\S+$/.test(url.trim()) ? url.trim() : undefined)

export const RECAPITI = {
  email: contatti.email.trim(),
  telefono: contatti.telefono.trim(),
  indirizzo: contatti.indirizzo.trim(),
}

/**
 * `url` resta vuoto finche' lo staff non inserisce i profili dal pannello: le
 * icone vengono mostrate come non cliccabili, cosi' nessuno finisce su un
 * collegamento che non porta da nessuna parte.
 */
export const SOCIALS: { label: string; Icon: LucideIcon; url?: string }[] = [
  { label: 'Instagram', Icon: Instagram, url: urlSicuro(contatti.social.instagram) },
  { label: 'Facebook', Icon: Facebook, url: urlSicuro(contatti.social.facebook) },
  { label: 'TikTok', Icon: Music2, url: urlSicuro(contatti.social.tiktok) },
  { label: 'YouTube', Icon: Youtube, url: urlSicuro(contatti.social.youtube) },
  { label: 'Canale Telegram', Icon: Send, url: urlSicuro(contatti.social.telegram) },
  { label: 'Canale WhatsApp', Icon: MessageCircle, url: urlSicuro(contatti.social.canaleWhatsapp) },
]

export const FOOTER_COLONNE = [
  {
    title: 'Progetti',
    links: RAMI.map((r) => ({ label: r.nome, to: `/${r.slug}` })),
  },
  {
    title: 'Associazione',
    links: [
      { label: 'Chi siamo', to: '/chi-siamo' },
      { label: 'Domande frequenti', to: '/faq' },
      { label: 'Contatti', to: '/contatti' },
    ],
  },
  {
    title: 'Informazioni legali',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Cookie Policy', to: '/cookie' },
    ],
  },
]

export const PAGE_TITLES: Record<string, string> = {
  '/': `FantaEsagonale APS — ${SLOGAN}`,
  '/chi-siamo': 'Chi siamo — FantaEsagonale APS',
  '/faq': 'Domande frequenti — FantaEsagonale APS',
  '/contatti': 'Contatti — FantaEsagonale APS',
  '/privacy': 'Privacy Policy — FantaEsagonale APS',
  '/cookie': 'Cookie Policy — FantaEsagonale APS',
  ...Object.fromEntries(RAMI.map((r) => [`/${r.slug}`, `${r.nome} — FantaEsagonale APS`])),
}

export const TITOLO_NON_TROVATA = 'Pagina non trovata — FantaEsagonale APS'

/** Argomenti del modulo contatti: la richiesta arriva gia' indirizzata. */
export const OGGETTI_CONTATTO = [
  { valore: 'generale', etichetta: 'Informazioni generali' },
  ...RAMI.map((r) => ({ valore: r.cta.oggetto, etichetta: r.nome })),
  { valore: 'testimonianza', etichetta: 'Voglio lasciare una testimonianza' },
  { valore: 'altro', etichetta: 'Altro' },
]
