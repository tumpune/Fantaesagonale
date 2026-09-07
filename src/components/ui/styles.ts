/** Classi condivise: un solo posto dove cambiare l'aspetto degli elementi comuni. */

export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black'

export const btnPrimary =
  `press btn-shine inline-block rounded-full px-6 py-3 sm:px-7 sm:py-3.5 text-sm font-semibold text-black bg-gradient-to-r from-brand-yellow to-brand-red hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-red/30 ${focusRing}`

export const btnSecondary =
  `press inline-block rounded-full px-6 py-3 sm:px-7 sm:py-3.5 text-sm font-semibold text-white border-2 border-white/80 hover:border-brand-yellow hover:text-brand-yellow hover:-translate-y-0.5 ${focusRing}`

export const btnDanger =
  `press btn-shine inline-block rounded-full px-7 py-3 text-sm font-semibold text-white bg-brand-red hover:bg-brand-redDark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-red/30 ${focusRing}`

export const gradientText =
  'bg-gradient-to-r from-brand-yellow to-brand-red bg-clip-text text-transparent'
