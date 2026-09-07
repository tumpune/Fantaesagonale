import type { ReactNode } from 'react'

/**
 * Ritmo verticale e larghezza del contenuto in un unico posto: prima ogni
 * pagina ripeteva la propria combinazione di padding, con risultati diversi
 * da una sezione all'altra.
 */
export function Section({
  children,
  alt = false,
  width = 'wide',
  className = '',
}: {
  children: ReactNode
  alt?: boolean
  width?: 'wide' | 'narrow'
  className?: string
}) {
  return (
    <section
      className={`px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 ${alt ? 'bg-brand-soft' : ''} ${className}`}
    >
      <div className={`mx-auto ${width === 'wide' ? 'max-w-6xl' : 'max-w-3xl'}`}>{children}</div>
    </section>
  )
}
