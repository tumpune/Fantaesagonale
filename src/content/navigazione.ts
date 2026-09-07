import { Facebook, Instagram, MessageCircle, Music2, Send, Youtube } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Chi Siamo', to: '/chi-siamo' },
  { label: 'Tornei & Giochi', to: '/tornei-giochi' },
  { label: 'Sponsor', to: '/sponsor' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contatti', to: '/contatti' },
]

/**
 * `url` restera' vuoto finche' non arrivano gli indirizzi reali dei profili:
 * le icone vengono mostrate come non cliccabili, cosi' nessuno finisce su un
 * collegamento che non porta da nessuna parte.
 */
export const SOCIALS: { label: string; Icon: LucideIcon; url?: string }[] = [
  { label: 'Instagram', Icon: Instagram },
  { label: 'Facebook', Icon: Facebook },
  { label: 'TikTok', Icon: Music2 },
  { label: 'YouTube', Icon: Youtube },
  { label: 'Canale Telegram', Icon: Send },
  { label: 'Canale WhatsApp', Icon: MessageCircle },
]

export const FOOTER_COLUMNS = [
  {
    title: 'Sito',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Chi Siamo', to: '/chi-siamo' },
      { label: 'Tornei & Giochi', to: '/tornei-giochi' },
      { label: 'Sponsor', to: '/sponsor' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Blog', to: '/blog' },
      { label: 'Contatti', to: '/contatti' },
      { label: 'Area Soci', to: '/area-soci' },
      { label: 'Italia Campione 2030', to: '/italia-campione-2030' },
    ],
  },
]

export const PAGE_TITLES: Record<string, string> = {
  '/': 'FantaEsagonale — Sport, giochi e community a Grammichele',
  '/chi-siamo': 'Chi siamo — FantaEsagonale',
  '/tornei-giochi': 'Tornei & Giochi — FantaEsagonale',
  '/sponsor': 'Sponsor — FantaEsagonale',
  '/blog': 'Blog — FantaEsagonale',
  '/contatti': 'Contatti — FantaEsagonale',
  '/area-soci': 'Area Soci — FantaEsagonale',
  '/italia-campione-2030': 'Italia Campione 2030 — FantaEsagonale',
}

export const TITOLO_NON_TROVATA = 'Pagina non trovata — FantaEsagonale'
