import type Lenis from 'lenis'

/**
 * Riferimento allo scorrimento inerziale, condiviso con chi deve fermarlo.
 *
 * Quando si apre il menu a tutto schermo non basta `overflow: hidden` sul
 * corpo della pagina: Lenis sposta la pagina chiamando `scrollTo`, quindi
 * continuerebbe a scorrere sotto al menu. Fermarlo e' l'unico modo per
 * ritrovare la pagina dove la si era lasciata.
 */
let scorrimento: Lenis | null = null

export const registraScorrimento = (istanza: Lenis | null) => {
  scorrimento = istanza
}

export function bloccaScorrimento(bloccato: boolean) {
  if (bloccato) scorrimento?.stop()
  else scorrimento?.start()
}
