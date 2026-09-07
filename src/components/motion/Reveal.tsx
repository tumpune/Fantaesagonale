import type { ElementType, ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'

type Variant = 'up' | 'fade' | 'left' | 'right' | 'scale'

const VARIANTS: Record<Variant, string> = {
  up: 'reveal-up',
  fade: 'reveal-fade',
  left: 'reveal-left',
  right: 'reveal-right',
  scale: 'reveal-scale',
}

/**
 * Anima l'ingresso del contenuto quando entra nel viewport.
 * Sotto prefers-reduced-motion il CSS neutralizza transizione e spostamento,
 * quindi il contenuto compare comunque: qui non serve un ramo separato.
 */
export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: ReactNode
  variant?: Variant
  delay?: number
  as?: ElementType
  className?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <Tag
      ref={ref}
      className={`reveal ${VARIANTS[variant]} ${inView ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

/**
 * Applica un ritardo crescente ai figli diretti, cosi' una griglia di schede
 * entra a cascata invece che tutta insieme.
 */
export function RevealGroup({
  children,
  step = 90,
  variant = 'up',
  className = '',
}: {
  children: ReactNode[]
  step?: number
  variant?: Variant
  className?: string
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} variant={variant} delay={i * step}>
          {child}
        </Reveal>
      ))}
    </div>
  )
}
