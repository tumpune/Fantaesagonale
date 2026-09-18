/** Classi condivise: un solo posto dove cambiare l'aspetto degli elementi comuni. */

export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accento-1 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black'

// I pulsanti condividono misura del testo e spinta al passaggio del mouse, ma
// non la forma: la pillola resta al solo richiamo principale.
const btnBase = `press inline-block px-7 py-3.5 text-etichetta hover:-translate-y-0.5 ${focusRing}`

/**
 * Il gradiente giallo-rosso vive qui e nella barra di lettura: e' il gesto di
 * marca. Ripetuto su testi, icone, filetti e riquadri diventava una vernice
 * stesa ovunque, il segno piu' riconoscibile dei siti fatti in serie.
 */
export const btnPrimary = `${btnBase} btn-shine rounded-full bg-gradient-to-r from-accento-1 to-accento-2 text-black hover:shadow-lg hover:shadow-accento-2/30`

export const btnSecondary = `${btnBase} rounded-lg border border-white/25 text-white hover:border-accento-1 hover:text-accento-1`

/** Parola in evidenza nei titoli: colore pieno, non gradiente. */
export const gradientText = 'text-accento-1'

/**
 * Icona inquadrata, per le schede e gli elenchi. Contorno e fondo tenue invece
 * del quadratino pieno a gradiente, che era identico in otto punti del sito.
 */
export const iconaRiquadro =
  'grid place-items-center rounded-lg border border-accento-1/25 bg-accento-1/[0.08] text-accento-1'

/** Filetto con il numero di sezione o di voce, usato al posto delle spunte. */
export const numeroVoce = 'text-meta cifre-allineate text-accento-1/80'
