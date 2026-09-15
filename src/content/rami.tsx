import {
  Building2,
  Flag,
  HeartHandshake,
  MapPinned,
  Megaphone,
  PartyPopper,
  Shirt,
  Trophy,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * I rami del progetto, dal questionario del cliente (1.2, 1.4, 3.1, 4.1).
 *
 * Ogni ramo ha la propria pagina, il proprio tema cromatico e le proprie FAQ:
 * chi arriva da un link su FantaMaritati o sul fantacalcio deve atterrare
 * direttamente nella sezione giusta e poi poter esplorare il resto (2.2).
 *
 * I testi sono bozze costruite solo su quanto dichiarato nel questionario: il
 * cliente indica che i testi definitivi vanno scritti insieme (4.2). Nessuna
 * regola, prezzo o cifra e' stata aggiunta per completare il discorso.
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
  /** Ha una pagina costruita a parte invece del modello comune. */
  paginaDedicata?: boolean
}

export const ETICHETTA_STATO: Record<Stato, string> = {
  attivo: 'Attivo',
  'in-arrivo': 'In arrivo',
  'in-progetto': 'In progetto',
}

export const RAMI: Ramo[] = [
  {
    slug: 'fantacalcio',
    alias: ['listone'],
    nome: 'Fantacalcio',
    breve: 'Dove tutto è cominciato',
    Icon: Trophy,
    // Il questionario (6.2): il Fantacalcio 2026-2027 usa nero e oro.
    tema: 'oro',
    stato: 'attivo',
    occhiello: 'Fantacalcio a listone',
    titolo: 'Dove tutto è cominciato',
    intro:
      "FantaEsagonale nasce nell'agosto 2023 come fantacalcio a listone: un gioco di strategia interno all'associazione, con quota di iscrizione e premi. È ancora oggi il cuore del progetto, e il punto da cui è partito tutto il resto.",
    perChi: 'Appassionati di calcio e di fantacalcio, da Grammichele e da tutta Italia.',
    offerta: [
      {
        titolo: 'Gioco di strategia a listone',
        testo: "Un fantacalcio pensato come sfida di strategia fra i partecipanti dell'associazione.",
      },
      {
        titolo: 'Survivor Soccer',
        testo: 'Il gioco a eliminazione che affianca il listone tradizionale.',
      },
      {
        titolo: 'Stagione 2026-2027',
        testo: 'Una nuova identità in nero e oro per la prossima edizione.',
      },
    ],
    nota: 'La comunicazione della stagione 2026-2027 partirà indicativamente a maggio 2027.',
    faq: [
      {
        domanda: 'Quando parte la prossima stagione?',
        risposta:
          'La comunicazione del fantacalcio 2026-2027 partirà indicativamente a maggio 2027. Scrivici e ti avviseremo appena si aprono le iscrizioni.',
      },
      {
        domanda: 'Chi può partecipare?',
        risposta:
          "Il fantacalcio è un gioco interno all'associazione. Contattaci per sapere come prendere parte alla prossima edizione.",
      },
      {
        domanda: "Cos'è Survivor Soccer?",
        risposta: 'È il gioco a eliminazione che affianca il fantacalcio a listone tradizionale.',
      },
    ],
    cta: { etichetta: 'Avvisami quando aprono le iscrizioni', oggetto: 'fantacalcio' },
  },
  {
    slug: 'fantamaritati',
    alias: ['maritati', 'matrimoni'],
    nome: 'FantaMaritati',
    breve: 'Intrattenimento per matrimoni',
    Icon: HeartHandshake,
    // Il questionario (6.2, 6.4): bianco e nero, con un registro piu' raffinato.
    tema: 'mono',
    stato: 'attivo',
    occhiello: 'FantaMaritati',
    titolo: 'Il vostro matrimonio, da giocare insieme',
    intro:
      'FantaMaritati è il format di intrattenimento per matrimoni basato su social, trend, bonus e malus: gli invitati non guardano la festa, ci partecipano.',
    perChi:
      'Giovani coppie che stanno organizzando il matrimonio e cercano un intrattenimento originale e partecipativo.',
    offerta: [
      {
        titolo: 'Social e trend',
        testo: 'Il gioco vive dei contenuti e delle tendenze che gli invitati creano durante la festa.',
      },
      {
        titolo: 'Bonus e malus',
        testo: 'Un sistema di punteggi che trasforma i momenti del matrimonio in occasioni di gioco.',
      },
      {
        titolo: 'Tutti gli ospiti coinvolti',
        testo: 'Un format pensato per far partecipare davvero gli invitati, non solo per intrattenerli.',
      },
    ],
    faq: [
      {
        domanda: 'Come funziona FantaMaritati?',
        risposta:
          'È un format di intrattenimento basato su social, trend, bonus e malus, in cui gli invitati partecipano attivamente durante il matrimonio.',
      },
      {
        domanda: 'Come lo richiedo per il mio matrimonio?',
        risposta:
          'Scrivici dalla pagina Contatti indicando data e luogo del matrimonio: ti risponderemo con tutte le informazioni.',
      },
    ],
    cta: { etichetta: 'Richiedi informazioni', oggetto: 'fantamaritati' },
  },
  {
    slug: 'fantadsico',
    alias: ['sponsor', 'marketing', 'aziende'],
    nome: 'FantADSico',
    breve: 'Marketing per le aziende',
    Icon: Megaphone,
    tema: 'centrale',
    stato: 'attivo',
    occhiello: 'FantADSico · Digital marketing',
    titolo: 'Visibilità reale per chi fa crescere il territorio',
    intro:
      "FantADSico è l'area di FantaEsagonale dedicata alle aziende: campagne sponsor, social media e digital marketing per le attività commerciali, con formule adattate alla portata di ogni progetto. Non un contributo a fondo perduto, ma visibilità concreta e relazione con la community.",
    perChi:
      'Aziende e attività commerciali: dalle realtà locali per le iniziative sul territorio ai soggetti nazionali per i progetti di maggiore portata.',
    offerta: [
      {
        titolo: 'Campagne sponsor',
        testo: 'Visibilità legata ai progetti e agli eventi di FantaEsagonale.',
      },
      {
        titolo: 'Social media e digital marketing',
        testo: 'Contenuti e campagne pensati per far conoscere la tua attività alla community.',
      },
      {
        titolo: 'Formule su misura',
        testo: 'Proposte locali, provinciali, regionali o nazionali in base alla portata del progetto.',
      },
    ],
    faq: [
      {
        domanda: 'A che tipo di aziende vi rivolgete?',
        risposta:
          'Ad attività commerciali di ogni dimensione: locali per le iniziative sul territorio, provinciali o regionali per gli eventi più ampi, nazionali per i progetti di maggiore portata.',
      },
      {
        domanda: "Cosa ottiene un'azienda che collabora con voi?",
        risposta:
          'Visibilità, relazione con la community e potenziali opportunità economiche, attraverso contenuti, collaborazioni, eventi e servizi di digital marketing.',
      },
    ],
    cta: { etichetta: 'Richiedi un preventivo', oggetto: 'fantadsico' },
  },
  {
    slug: 'eventi',
    alias: ['tornei', 'tornei-giochi', 'intrattenimento'],
    nome: 'Eventi',
    breve: 'Tornei, challenge e interviste',
    Icon: PartyPopper,
    tema: 'centrale',
    stato: 'attivo',
    occhiello: 'Eventi e intrattenimento',
    titolo: "Portiamo il gioco dove c'è una festa",
    intro:
      'Organizziamo eventi e tornei, soprattutto sportivi, e collaboriamo alle iniziative di altri. Durante eventi sportivi e non portiamo giochi, challenge dal vivo, interviste e format pensati per i social.',
    perChi:
      'Organizzatori di eventi, associazioni e comunità, con un forte legame con il territorio ma aperti a iniziative più ampie.',
    offerta: [
      {
        titolo: 'Eventi e tornei',
        testo: 'Organizzazione di eventi e tornei, soprattutto sportivi.',
      },
      {
        titolo: 'Challenge dal vivo',
        testo: 'Format di gioco come freccette, beer pong e cornhole per animare ogni evento.',
      },
      {
        titolo: 'Interviste e contenuti social',
        testo: "Il racconto dell'evento attraverso interviste e format pensati per i social.",
      },
      {
        titolo: 'Collaborazioni',
        testo: 'Supporto alla realizzazione di iniziative organizzate da altri.',
      },
    ],
    faq: [
      {
        domanda: 'Potete animare un evento che organizziamo noi?',
        risposta:
          'Sì: oltre ai nostri eventi collaboriamo alla realizzazione di iniziative di terzi, portando giochi, challenge e interviste.',
      },
      {
        domanda: 'Che tipo di eventi seguite?',
        risposta:
          "Soprattutto eventi sportivi, ma anche eventi di altro genere in cui l'intrattenimento può fare la differenza.",
      },
    ],
    cta: { etichetta: 'Porta FantaEsagonale al tuo evento', oggetto: 'eventi' },
  },
  {
    slug: 'italia-campione-2030',
    alias: ['ic2030'],
    nome: 'Italia Campione 2030',
    breve: 'La challenge per la Nazionale',
    Icon: Flag,
    tema: 'centrale',
    stato: 'attivo',
    occhiello: 'Progetto speciale',
    titolo: 'Italia Campione 2030',
    intro:
      'Un video al giorno per 1572 giorni, fino alla finale dei Mondiali 2030: un canale di informazione e supporto dedicato alla Nazionale.',
    perChi: 'Tifosi della Nazionale italiana, appassionati di calcio e community social.',
    offerta: [],
    faq: [],
    cta: { etichetta: 'Resta aggiornato', oggetto: 'italia-campione-2030' },
    paginaDedicata: true,
  },
  {
    slug: 'merchandising',
    alias: ['merch', 'shop'],
    nome: 'Merchandising',
    breve: 'I prodotti del brand',
    Icon: Shirt,
    tema: 'centrale',
    stato: 'in-arrivo',
    occhiello: 'Merchandising',
    titolo: 'Il brand, anche fuori dallo schermo',
    intro:
      'Prodotti legati a FantaEsagonale e ai suoi progetti, per chi fa parte della community e vuole portarla con sé.',
    perChi: 'Tutta la community, e chiunque si riconosca in uno dei rami del progetto.',
    offerta: [
      { titolo: 'Prodotti del brand', testo: "Articoli con l'identità di FantaEsagonale." },
      {
        titolo: 'Linee per ogni progetto',
        testo: 'Prodotti dedicati ai singoli rami del progetto.',
      },
    ],
    nota: 'La vendita online arriverà in una fase successiva.',
    faq: [
      {
        domanda: 'Dove posso acquistare i prodotti?',
        risposta:
          'La vendita online è prevista in una fase successiva. Scrivici e ti avviseremo quando sarà disponibile.',
      },
    ],
    cta: { etichetta: "Avvisami all'apertura", oggetto: 'merchandising' },
  },
  {
    slug: 'turismo',
    alias: ['territorio'],
    // Il questionario indica il nome "SaSiSa Digitale" come ancora da
    // confermare: finche' non lo e', il sito usa una descrizione neutra.
    nome: 'Turismo e territorio',
    breve: 'Promozione del territorio',
    Icon: MapPinned,
    tema: 'centrale',
    stato: 'in-progetto',
    occhiello: 'Turismo e territorio',
    titolo: 'Raccontare il territorio a chi arriva',
    intro:
      "Progetti di promozione turistica e territoriale per far scoprire Grammichele e i suoi dintorni, collegati anche alla futura sede fisica dell'associazione.",
    perChi:
      "Visitatori e turisti interessati alle esperienze locali, alla cultura del territorio e alle occasioni d'incontro.",
    offerta: [
      {
        titolo: 'Promozione turistica',
        testo: 'Iniziative per far conoscere il territorio a chi viene da fuori.',
      },
      {
        titolo: 'Esperienze locali',
        testo: 'Occasioni per vivere la cultura, i luoghi e la comunità.',
      },
    ],
    nota: 'Il progetto è in fase di sviluppo.',
    faq: [
      {
        domanda: 'Il progetto è già attivo?',
        risposta:
          'È in fase di sviluppo. Se sei una realtà del territorio e vuoi collaborare, scrivici.',
      },
    ],
    cta: { etichetta: 'Collabora con noi', oggetto: 'turismo' },
  },
  {
    slug: 'sede',
    alias: ['sede-fisica'],
    nome: 'Sede fisica',
    breve: 'Un luogo per la community',
    Icon: Building2,
    tema: 'centrale',
    stato: 'in-progetto',
    occhiello: 'Sede fisica',
    titolo: 'Un luogo dove ritrovarsi',
    intro:
      'In prospettiva FantaEsagonale avrà una sede fisica: un luogo operativo, di incontro e di accoglienza, aperto alla community, ai partecipanti, ai partner e ai visitatori.',
    perChi: 'La community, i partecipanti alle attività, i partner, i visitatori e i turisti.',
    offerta: [
      {
        titolo: 'Spazio operativo',
        testo: "La base da cui organizzare le attività dell'associazione.",
      },
      { titolo: 'Incontro', testo: 'Un punto di ritrovo per chi fa parte della community.' },
      {
        titolo: 'Accoglienza',
        testo: 'Un riferimento per visitatori e turisti, collegato ai progetti sul territorio.',
      },
    ],
    nota: 'La sede è in progetto.',
    faq: [
      {
        domanda: 'Dove sarà la sede?',
        risposta: 'La sede è ancora in progetto. Scrivici per restare aggiornato sui prossimi passi.',
      },
    ],
    cta: { etichetta: 'Vuoi contribuire? Scrivici', oggetto: 'sede' },
  },
]

export const ramoDaSlug = (slug: string) => RAMI.find((r) => r.slug === slug)

/** Tema della pagina corrente: i rami hanno il loro, il resto usa il centrale. */
export const temaDaPercorso = (percorso: string): Tema =>
  RAMI.find((r) => percorso === `/${r.slug}`)?.tema ?? 'centrale'

/**
 * Scale delle formule FantADSico, dal questionario (1.4, 3.1). Senza prezzi:
 * il cliente non li ha indicati.
 */
export const SCALE_FANTADSICO = [
  { nome: 'Locale', testo: 'Per le attività del territorio e le iniziative locali.' },
  { nome: 'Provinciale', testo: 'Per le realtà che guardano a un pubblico più ampio.' },
  { nome: 'Regionale', testo: 'Per gli eventi di portata regionale.' },
  { nome: 'Nazionale', testo: 'Per i progetti di maggiore portata.' },
]
