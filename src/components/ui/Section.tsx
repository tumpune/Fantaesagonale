import type { ReactNode } from 'react'

/**
 * Ritmo verticale e larghezza del contenuto in un unico posto: prima ogni
 * pagina ripeteva la propria combinazione di padding, con risultati diversi
 * da una sezione all'altra.
 */
/** Tre respiri diversi: le sezioni portanti hanno piu' aria di quelle di servizio. */
const RITMI = {
  stretto: 'py-12 sm:py-14 lg:py-16',
  normale: 'py-16 sm:py-20 lg:py-24',
  ampio: 'py-24 sm:py-28 lg:py-36',
}

export function Section({
  children,
  alt = false,
  width = 'wide',
  ritmo = 'normale',
  className = '',
}: {
  children: ReactNode
  alt?: boolean
  width?: 'wide' | 'narrow'
  ritmo?: keyof typeof RITMI
  className?: string
}) {
  return (
    <section
      className={`px-5 sm:px-8 lg:px-12 ${RITMI[ritmo]} ${alt ? 'bg-brand-soft' : ''} ${className}`}
    >
      <div className={`mx-auto ${width === 'wide' ? 'max-w-6xl' : 'max-w-3xl'}`}>{children}</div>
    </section>
  )
}
