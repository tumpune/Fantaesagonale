import type { Testimonianza } from '../components/ui/Testimonianze'

/**
 * Testimonianze reali raccolte dallo staff (questionario 4.4), una per file in
 * `dati/testimonianze/` e gestite dal pannello /admin.
 *
 * Compaiono solo quelle segnate come pubblicate: lo staff puo' inserirle
 * appena arrivano e mostrarle dopo aver avuto il consenso della persona.
 */

export type TestimonianzaDati = Testimonianza & {
  /** Slug del ramo, oppure vuoto per le testimonianze sull'associazione. */
  ramo?: string
  pubblicata?: boolean
  data?: string
}

const FILE = import.meta.glob<TestimonianzaDati>('./dati/testimonianze/*.json', {
  eager: true,
  import: 'default',
})

/** Tutte, pubblicate o no: servono al pannello per segnalare quelle in attesa. */
export const TESTIMONIANZE: TestimonianzaDati[] = Object.values(FILE)

const PUBBLICATE = TESTIMONIANZE
  .filter((t) => t.pubblicata && t.testo?.trim() && t.autore?.trim())
  .sort((a, b) => (b.data ?? '').localeCompare(a.data ?? ''))

/**
 * Senza ramo restituisce tutte le testimonianze, per la home e "Chi siamo".
 * Con un ramo solo quelle di quel servizio (4.4: coerenti con la pagina).
 */
export function testimonianzeDi(ramo?: string, massimo = 6): Testimonianza[] {
  return PUBBLICATE.filter((t) => !ramo || t.ramo === ramo)
    .slice(0, massimo)
    .map(({ testo, autore, ruolo }) => ({ testo, autore, ruolo: ruolo || undefined }))
}
