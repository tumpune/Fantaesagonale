/** Classi condivise: un solo posto dove cambiare l'aspetto degli elementi comuni. */

export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black'

// I pulsanti condividono forma e misura del testo: cambia solo il riempimento.
const btnBase = `press inline-block rounded-full px-7 py-3.5 text-etichetta hover:-translate-y-0.5 ${focusRing}`

export const btnPrimary = `${btnBase} btn-shine bg-gradient-to-r from-brand-yellow to-brand-red text-black hover:shadow-lg hover:shadow-brand-red/30`

export const btnSecondary = `${btnBase} border-2 border-white/80 text-white hover:border-brand-yellow hover:text-brand-yellow`

export const btnDanger = `${btnBase} btn-shine bg-brand-red text-white hover:bg-brand-redDark hover:shadow-lg hover:shadow-brand-red/30`

export const gradientText =
  'bg-gradient-to-r from-brand-yellow to-brand-red bg-clip-text text-transparent'
