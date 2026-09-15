import { AtSign, Hash, MapPin, MessageCircle, Mic, Phone, Send, Video } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * Canali di contatto. Email, telefono e link social non sono ancora stati
 * forniti (questionario: referente e contatti "da compilare", email aziendale
 * da creare). `disponibile` evita di mostrare un recapito che non esiste.
 */
export const CONTATTI: { Icon: LucideIcon; titolo: string; testo: string; disponibile: boolean }[] = [
  { Icon: AtSign, titolo: 'Email', testo: 'Presto disponibile', disponibile: false },
  { Icon: Phone, titolo: 'Telefono e WhatsApp', testo: 'Presto disponibile', disponibile: false },
  { Icon: Hash, titolo: 'Social', testo: 'Instagram, Facebook, TikTok, YouTube', disponibile: false },
  { Icon: Send, titolo: 'Canale Telegram', testo: 'Le foto delle attività', disponibile: false },
  { Icon: MessageCircle, titolo: 'Canale WhatsApp', testo: 'Novità e informazioni', disponibile: false },
  { Icon: MapPin, titolo: 'Dove siamo', testo: 'Grammichele (CT)', disponibile: true },
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
