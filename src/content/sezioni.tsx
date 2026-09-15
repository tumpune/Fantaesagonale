import { AtSign, Hash, MapPin, MessageCircle, Mic, Phone, Send, Video } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { RECAPITI, SOCIALS } from './navigazione'

/**
 * Canali di contatto, dai recapiti inseriti nel pannello /admin. Finche' un
 * recapito resta vuoto la voce compare come "Presto disponibile" e non e'
 * cliccabile: nessuno deve finire su un indirizzo che non esiste.
 */
const PRESTO = 'Presto disponibile'
const social = (label: string) => SOCIALS.find((s) => s.label === label)?.url

const socialPrincipali = SOCIALS.filter(
  (s) => s.url && ['Instagram', 'Facebook', 'TikTok', 'YouTube'].includes(s.label),
)

export const CONTATTI: {
  Icon: LucideIcon
  titolo: string
  testo: string
  disponibile: boolean
  href?: string
}[] = [
  RECAPITI.email
    ? { Icon: AtSign, titolo: 'Email', testo: RECAPITI.email, disponibile: true, href: `mailto:${RECAPITI.email}` }
    : { Icon: AtSign, titolo: 'Email', testo: PRESTO, disponibile: false },
  RECAPITI.telefono
    ? {
        Icon: Phone,
        titolo: 'Telefono e WhatsApp',
        testo: RECAPITI.telefono,
        disponibile: true,
        href: `tel:${RECAPITI.telefono.replace(/[^\d+]/g, '')}`,
      }
    : { Icon: Phone, titolo: 'Telefono e WhatsApp', testo: PRESTO, disponibile: false },
  {
    Icon: Hash,
    titolo: 'Social',
    testo: socialPrincipali.length
      ? socialPrincipali.map((s) => s.label).join(', ')
      : 'Instagram, Facebook, TikTok, YouTube',
    disponibile: socialPrincipali.length > 0,
  },
  {
    Icon: Send,
    titolo: 'Canale Telegram',
    testo: 'Le foto delle attività',
    disponibile: Boolean(social('Canale Telegram')),
    href: social('Canale Telegram'),
  },
  {
    Icon: MessageCircle,
    titolo: 'Canale WhatsApp',
    testo: 'Novità e informazioni',
    disponibile: Boolean(social('Canale WhatsApp')),
    href: social('Canale WhatsApp'),
  },
  { Icon: MapPin, titolo: 'Dove siamo', testo: RECAPITI.indirizzo || 'Grammichele (CT)', disponibile: true },
]

export const CAMPAIGN_TIMELINE = [
  {
    date: '31 marzo 2026',
    text: "L'Italia non si qualifica ai Mondiali dopo la sconfitta con la Bosnia. Nasce l'idea di Italia Campione 2030.",
  },
  {
    date: 'Ogni giorno',
    text: 'Un video al giorno per informare, commentare e sostenere il percorso verso il prossimo Mondiale, fino al 21 luglio 2030.',
  },
  {
    date: '21 luglio 2030',
    text: 'Giorno della finale dei Mondiali in Spagna, Portogallo e Marocco: il traguardo della challenge.',
  },
]

export const CAMPAIGN_CHANNELS: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: Video, title: 'YouTube', text: 'I video quotidiani della challenge.' },
  { Icon: Hash, title: 'Instagram', text: 'Aggiornamenti e contenuti brevi.' },
  { Icon: Mic, title: 'TikTok', text: 'I momenti più condivisi.' },
  { Icon: Send, title: 'Canale Telegram', text: 'Le foto delle attività.' },
]
