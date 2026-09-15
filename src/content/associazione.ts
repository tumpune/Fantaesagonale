import type { Faq } from './rami'
import dati from './dati/associazione.json'

/**
 * Identita' dell'associazione, dal questionario (1.2, 1.3, 1.5, 3.3).
 * I testi stanno in `dati/associazione.json` e si modificano dal pannello /admin.
 */

export const SLOGAN: string = dati.slogan
export const PRESENTAZIONE: string = dati.presentazione
export const MISSIONE: string = dati.missione
export const VISIONE: string = dati.visione
export const DISTINTIVO: string = dati.distintivo

/** Le tappe del percorso, in ordine cronologico. */
export const STORIA: { quando: string; testo: string }[] = dati.storia

/** I principi che guidano lo staff, come indicati nel questionario (1.5). */
export const PRINCIPI: { nome: string; testo: string }[] = dati.principi

export const FAQ_GENERALI: Faq[] = dati.faq
