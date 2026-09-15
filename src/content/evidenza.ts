/**
 * Iniziative in evidenza nella home (questionario 2.2): la home deve dare
 * priorita' a cio' che e' attivo in quel momento — iscrizioni aperte, eventi,
 * richieste di preventivo, campagne stagionali.
 *
 * `dal` e `al` sono facoltativi. Un'iniziativa compare solo nel suo periodo e
 * sparisce da sola alla scadenza: nessuno deve ricordarsi di toglierla.
 * Senza date resta sempre visibile, per le richieste valide tutto l'anno.
 */

export type Iniziativa = {
  titolo: string
  testo: string
  percorso: string
  etichetta: string
  ramo: string
  dal?: string
  al?: string
  /** Numeri piu' bassi compaiono prima. */
  priorita: number
}

export const INIZIATIVE: Iniziativa[] = [
  {
    titolo: 'Stagione 2026-2027',
    testo: 'Si aprono le iscrizioni al fantacalcio a listone. Non perdere la nuova edizione.',
    percorso: '/fantacalcio',
    etichetta: 'Scopri come partecipare',
    ramo: 'fantacalcio',
    dal: '2027-05-01',
    priorita: 1,
  },
  {
    titolo: 'Italia Campione 2030',
    testo: 'Un video al giorno fino alla finale dei Mondiali. La challenge è in corso.',
    percorso: '/italia-campione-2030',
    etichetta: 'Segui la challenge',
    ramo: 'italia-campione-2030',
    dal: '2026-03-31',
    al: '2030-07-21',
    priorita: 2,
  },
  {
    titolo: 'Stai organizzando il matrimonio?',
    testo: 'Porta FantaMaritati alla tua festa: gli invitati non guardano, partecipano.',
    percorso: '/fantamaritati',
    etichetta: 'Richiedi informazioni',
    ramo: 'fantamaritati',
    priorita: 3,
  },
  {
    titolo: 'Fai crescere la tua attività',
    testo: 'Campagne sponsor e digital marketing su misura con FantADSico.',
    percorso: '/fantadsico',
    etichetta: 'Richiedi un preventivo',
    ramo: 'fantadsico',
    priorita: 4,
  },
]

const inizioGiorno = (iso: string) => new Date(`${iso}T00:00:00`)
const fineGiorno = (iso: string) => new Date(`${iso}T23:59:59`)

export function iniziativeAttive(oggi = new Date(), massimo = 3) {
  return INIZIATIVE.filter(
    (i) => (!i.dal || inizioGiorno(i.dal) <= oggi) && (!i.al || fineGiorno(i.al) >= oggi),
  )
    .sort((a, b) => a.priorita - b.priorita)
    .slice(0, massimo)
}
