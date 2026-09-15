/** Classi condivise: un solo posto dove cambiare l'aspetto degli elementi comuni. */

export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accento-1 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black'

// I pulsanti condividono forma e misura del testo: cambia solo il riempimento.
const btnBase = `press inline-block rounded-full px-7 py-3.5 text-etichetta hover:-translate-y-0.5 ${focusRing}`

export const btnPrimary = `${btnBase} btn-shine bg-gradient-to-r from-accento-1 to-accento-2 text-black hover:shadow-lg hover:shadow-accento-2/30`

export const btnSecondary = `${btnBase} border-2 border-white/80 text-white hover:border-accento-1 hover:text-accento-1`

export const btnDanger = `${btnBase} btn-shine bg-accento-2 text-white hover:brightness-90 hover:shadow-lg hover:shadow-accento-2/30`

export const gradientText =
  'bg-gradient-to-r from-accento-1 to-accento-2 bg-clip-text text-transparent'
