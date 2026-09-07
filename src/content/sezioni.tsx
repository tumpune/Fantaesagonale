import {
  AtSign,
  BarChart3,
  Beer,
  ClipboardList,
  Dices,
  FileText,
  Globe,
  Hash,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Mic,
  Phone,
  Pin,
  Send,
  Target,
  TrendingUp,
  Trophy,
  Video,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * Testi e dati delle pagine, separati dai componenti che li presentano: cosi'
 * si aggiorna un numero o una descrizione senza entrare nel markup.
 * `value` e' numerico dove la cifra viene animata al conteggio.
 */
export const STATS: { value: number; suffix?: string; display?: string; label: string }[] = [
  { value: 2023, display: '2023', label: 'anno di fondazione' },
  { value: 205, label: 'squadre iscritte al fantacalcio 2025-26' },
  { value: 3, suffix: 'ª', label: 'edizione del Fantacalcio al Listone' },
  { value: 20000, display: '20.000€', label: 'montepremi totale 2025-26' },
]

export const VALUES = [
  { title: 'Community', text: 'Costruiamo occasioni di incontro reali tra le persone.' },
  {
    title: 'Competizione sana',
    text: 'La sfida come motore di divertimento, con premi veri in palio.',
  },
  { title: 'Territorio', text: 'Vicini alle persone e alle aziende di Grammichele e dintorni.' },
  { title: 'Ottimismo', text: 'Crediamo nel valore del tempo libero e dello svago, senza tabù.' },
]

export const HOME_FEATURES: { Icon: LucideIcon; title: string; text: string }[] = [
  {
    Icon: Trophy,
    title: 'Fantacalcio al Listone',
    text: 'Stagione 2025-2026, 3ª edizione: 205 squadre iscritte e 20.000€ di montepremi. Novità: Survivor Soccer.',
  },
  {
    Icon: Target,
    title: 'Giochi & Tornei',
    text: 'Freccette, beer pong, cornhole e sfide sportive per tutti.',
  },
  {
    Icon: Mic,
    title: 'Eventi & Intrattenimento',
    text: 'Interviste, sondaggi e contenuti pensati per la community.',
  },
  {
    Icon: Megaphone,
    title: 'FantADSico',
    text: 'Diamo visibilità reale alle aziende locali con campagne social su misura.',
  },
]

export type Activity = {
  Icon: LucideIcon
  title: string
  body: ReactNode
  topics: string[]
}

export const ACTIVITIES: Activity[] = [
  {
    Icon: Trophy,
    title: 'Fantacalcio al Listone',
    body: (
      <>
        Il nostro evento di punta: nella stagione 2025-2026 è alla 3ª edizione, con{' '}
        <strong className="font-semibold text-white">205 squadre iscritte</strong> e un{' '}
        <strong className="font-semibold text-white">montepremi totale di 20.000€</strong>. Novità di
        quest'anno: <strong className="font-semibold text-white">Survivor Soccer</strong>, il nuovo
        gioco a eliminazione che affianca il listone tradizionale.
      </>
    ),
    topics: ['Come iscriversi', 'Regolamento', 'Classifica / Edizioni passate', 'Survivor Soccer'],
  },
  {
    Icon: Trophy,
    title: 'Tornei di calcio e altri sport',
    body: <>Organizziamo tornei aperti a tutti durante l'anno.</>,
    topics: ['Calendario tornei', 'Modulo iscrizione'],
  },
  {
    Icon: Target,
    title: 'Freccette',
    body: (
      <span className="italic text-white/35">Descrizione, regolamento e iscrizioni in arrivo.</span>
    ),
    topics: ['Descrizione', 'Regolamento', 'Iscrizioni'],
  },
  {
    Icon: Beer,
    title: 'Beer Pong',
    body: (
      <span className="italic text-white/35">Descrizione, regolamento e iscrizioni in arrivo.</span>
    ),
    topics: ['Descrizione', 'Regolamento', 'Iscrizioni'],
  },
  {
    Icon: Dices,
    title: 'Cornhole',
    body: (
      <span className="italic text-white/35">Descrizione, regolamento e iscrizioni in arrivo.</span>
    ),
    topics: ['Descrizione', 'Regolamento', 'Iscrizioni'],
  },
]

export const SPONSOR_OFFERS: { Icon: LucideIcon; title: string; text: string }[] = [
  {
    Icon: Video,
    title: 'Video & contenuti social',
    text: 'Video pubblicitari e contenuti social dedicati alla tua azienda su Instagram, TikTok, Facebook e YouTube.',
  },
  {
    Icon: Megaphone,
    title: 'Visibilità agli eventi',
    text: 'Presenza durante tornei, fantacalcio al listone ed eventi organizzati da FantaEsagonale.',
  },
  {
    Icon: TrendingUp,
    title: 'Risultati concreti',
    text: 'Il focus è la crescita reale della tua visibilità digitale, non un contributo a fondo perduto.',
  },
  {
    Icon: Globe,
    title: 'Presenza sul sito',
    text: 'Il tuo logo e i tuoi materiali di comunicazione sul nostro sito.',
  },
]

export const CONTACTS: { Icon: LucideIcon; title: string; text: string; todo?: boolean }[] = [
  {
    Icon: AtSign,
    title: 'Email',
    text: 'Da definire — serve email aziendale collegata al dominio',
    todo: true,
  },
  { Icon: Phone, title: 'Telefono / WhatsApp', text: 'Da definire', todo: true },
  {
    Icon: Hash,
    title: 'Social',
    text: 'Instagram / Facebook / TikTok / YouTube — link da inserire',
    todo: true,
  },
  { Icon: Send, title: 'Canale Telegram', text: 'Foto delle attività — link da inserire', todo: true },
  {
    Icon: MessageCircle,
    title: 'Canale WhatsApp',
    text: 'Novità e informazioni — link da inserire',
    todo: true,
  },
  { Icon: MapPin, title: 'Sede', text: 'Grammichele' },
]

export const MEMBER_FEATURES: { Icon: LucideIcon; title: string; text: string }[] = [
  {
    Icon: BarChart3,
    title: 'Classifiche fantacalcio',
    text: 'Classifiche aggiornate del Fantacalcio al Listone.',
  },
  {
    Icon: FileText,
    title: 'Regolamenti e documenti',
    text: 'Regolamenti ufficiali e documentazione dei tornei.',
  },
  { Icon: Pin, title: 'Bacheca interna', text: 'Comunicazioni interne per tutti i soci.' },
  {
    Icon: ClipboardList,
    title: 'Gestione tornei',
    text: 'Iscrizione e gestione della partecipazione ai tornei.',
  },
  { Icon: Mail, title: 'Newsletter dedicata', text: 'Aggiornamenti periodici riservati ai soci.' },
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
  { Icon: Video, title: 'YouTube', text: 'Link da inserire — video quotidiani della challenge.' },
  { Icon: Hash, title: 'Instagram', text: 'Link da inserire.' },
  { Icon: Mic, title: 'TikTok', text: 'Link da inserire.' },
  { Icon: Send, title: 'Canale Telegram', text: 'Link da inserire — foto delle attività.' },
]
