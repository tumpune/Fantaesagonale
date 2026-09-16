import dati from './dati/evidenza.json'

/**
 * Iniziative in evidenza nella home (questionario 2.2): la home deve dare
 * priorita' a cio' che e' attivo in quel momento — iscrizioni aperte, eventi,
 * richieste di preventivo, campagne stagionali.
 *
 * `dal` e `al` sono facoltativi. Un'iniziativa compare solo nel suo periodo e
 * sparisce da sola alla scadenza: nessuno deve ricordarsi di toglierla.
 * Senza date resta sempre visibile, per le richieste valide tutto l'anno.
 *
 * Le iniziative stanno in `dati/evidenza.json` e si gestiscono dal pannello /admin.
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

export const INIZIATIVE: Iniziativa[] = dati.iniziative.map((i: Partial<Iniziativa>) => ({
  ...i,
  percorso: i.percorso || `/${i.ramo}`,
  // Il pannello salva i campi data vuoti come stringa vuota: equivale a nessun limite.
  dal: i.dal || undefined,
  al: i.al || undefined,
  priorita: i.priorita ?? 99,
})) as Iniziativa[]

/**
 * Una data scritta male nel pannello non deve far sparire l'iniziativa senza
 * spiegazione: viene trattata come "nessun limite".
 */
const data = (iso: string, ora: string) => {
  const valore = new Date(`${iso}T${ora}`)
  return Number.isNaN(valore.getTime()) ? null : valore
}

const inizioGiorno = (iso: string) => data(iso, '00:00:00')
const fineGiorno = (iso: string) => data(iso, '23:59:59')

export function iniziativeAttive(oggi = new Date(), massimo = 3) {
  return INIZIATIVE.filter((i) => {
    const dal = i.dal ? inizioGiorno(i.dal) : null
    const al = i.al ? fineGiorno(i.al) : null
    return (!dal || dal <= oggi) && (!al || al >= oggi)
  })
    .sort((a, b) => a.priorita - b.priorita)
    .slice(0, massimo)
}
