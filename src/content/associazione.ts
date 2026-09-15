import type { Faq } from './rami'

/**
 * Identita' dell'associazione, dal questionario (1.2, 1.3, 1.5, 3.3).
 * Bozze da rivedere con il cliente: i testi definitivi vanno scritti insieme.
 */

export const SLOGAN = 'Metti Fanta davanti a ogni parola e sorridi'

export const PRESENTAZIONE =
  "FantaEsagonale APS è un'associazione di promozione sociale nata a Grammichele nell'agosto 2023. Partita come fantacalcio a listone, oggi è un ecosistema che unisce sport, intrattenimento, social media, eventi, promozione del territorio e collaborazioni con le attività commerciali."

export const MISSIONE =
  'Dare valore al tempo libero: creare occasioni di svago, socialità, leggerezza e partecipazione, perché il divertimento è una parte importante della qualità della vita.'

export const VISIONE =
  "FantaEsagonale nasce da un'iniziativa apparentemente semplice, un fantacalcio, ma con una visione sociale, civica, etica e territoriale: dimostrare che anche nel Sud Italia si possono costruire opportunità, professionalità e modelli economici nuovi, senza dover lasciare il proprio territorio."

export const DISTINTIVO =
  'Colleghiamo mondi che di solito restano separati — fantacalcio, sport, eventi, intrattenimento, marketing, turismo, community e merchandising — in un unico ecosistema coerente, capace di generare valore senza perdere la dimensione associativa e sociale.'

export const STORIA = [
  {
    quando: 'Agosto 2023',
    testo:
      "Nasce il fantacalcio a listone: un gioco di strategia interno all'associazione, con quota di iscrizione e premi.",
  },
  {
    quando: 'Luglio 2024',
    testo:
      'Il cambio di prospettiva: FantaEsagonale inizia ad allargare il progetto oltre il solo fantacalcio.',
  },
  {
    quando: 'Dal 2024',
    testo:
      'Prende forma un ecosistema: campagne sponsor e digital marketing, eventi e intrattenimento, FantaMaritati, FantADSico, merchandising e Italia Campione 2030.',
  },
  {
    quando: 'In prospettiva',
    testo: 'Una sede fisica come luogo operativo, di incontro e di accoglienza.',
  },
]

/** I principi che guidano lo staff, come indicati nel questionario (1.5). */
export const PRINCIPI = [
  { nome: 'Onestà', testo: 'Diciamo le cose come stanno, a chi partecipa e a chi collabora con noi.' },
  { nome: 'Trasparenza', testo: 'Un rapporto limpido con la community e con i partner.' },
  {
    nome: 'Disponibilità',
    testo: 'Ci siamo per chi partecipa, per chi collabora e per chi vuole saperne di più.',
  },
  { nome: 'Autenticità', testo: "Restiamo fedeli all'idea da cui siamo partiti." },
]

export const FAQ_GENERALI: Faq[] = [
  {
    domanda: "Cos'è FantaEsagonale?",
    risposta: PRESENTAZIONE,
  },
  {
    domanda: "Cosa vuol dire 'Metti Fanta davanti a ogni parola e sorridi'?",
    risposta:
      'È lo slogan che riassume il filo conduttore del progetto: dare valore al tempo libero e trasformare le occasioni di tutti i giorni in momenti di divertimento e socialità.',
  },
  {
    domanda: 'Vi rivolgete ai privati o alle aziende?',
    risposta:
      'A entrambi: ai privati con il fantacalcio, gli eventi, FantaMaritati e i progetti per la community; alle aziende con FantADSico, le campagne sponsor e il digital marketing.',
  },
  {
    domanda: 'Dove operate?',
    risposta:
      'Siamo nati a Grammichele e il legame con il territorio resta centrale, ma alcuni progetti hanno una portata provinciale, regionale o nazionale.',
  },
  {
    domanda: 'Come posso contattarvi?',
    risposta:
      "Dalla pagina Contatti, scegliendo l'argomento: la richiesta arriva già indirizzata al progetto giusto.",
  },
]
