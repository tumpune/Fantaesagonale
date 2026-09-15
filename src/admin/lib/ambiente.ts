/**
 * Dove sta girando il pannello.
 *
 * In locale non ci sono le funzioni /api ne' il login: l'editor scrive nei
 * file tramite decap-server e le sezioni che dipendono da Vercel mostrano cosa
 * succedera' online.
 */

export const LOCALE = ['localhost', '127.0.0.1'].includes(window.location.hostname)

/** Lo stesso repository indicato in public/admin/editor/config.yml. */
export const REPO = 'tumpune/Fantaesagonale'

export const SITO_PUBBLICO = 'https://fantaesagonale.vercel.app'

/** Indirizzo del sito da aprire dal pannello: quello locale quando si lavora in locale. */
export const SITO = LOCALE ? window.location.origin : SITO_PUBBLICO

/** Chiave in cui Decap salva l'utente: il pannello la condivide per non chiedere il login due volte. */
export const CHIAVE_UTENTE_DECAP = 'decap-cms-user'

export function leggiLocale<T>(chiave: string, predefinito: T): T {
  try {
    const valore = window.localStorage.getItem(chiave)
    return valore === null ? predefinito : (JSON.parse(valore) as T)
  } catch {
    return predefinito
  }
}

export function scriviLocale(chiave: string, valore: unknown) {
  try {
    if (valore === undefined) window.localStorage.removeItem(chiave)
    else window.localStorage.setItem(chiave, JSON.stringify(valore))
  } catch {
    /* archiviazione non disponibile: si continua senza ricordare la scelta */
  }
}
