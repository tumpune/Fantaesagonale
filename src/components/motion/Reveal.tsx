import type { ReactNode } from 'react'
import { m, type Variants } from 'motion/react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

type Variant = 'up' | 'fade' | 'left' | 'right' | 'scale'

/**
 * Ingressi allo scorrimento con molla fisica invece che con una curva fissa:
 * il movimento decelera come un oggetto reale, ed e' la differenza che si
 * avverte fra un'animazione corretta e una che sembra viva.
 *
 * `whileInView` con `once` fa partire l'animazione al primo ingresso e non la
 * ripete: rianimare a ogni passaggio renderebbe faticosa la rilettura.
 */
const VARIANTI: Record<Variant, Variants> = {
  up: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  left: {
    hidden: { opacity: 0, x: -28 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 28 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
}

export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  as = 'div',
  className = '',
}: {
  children: ReactNode
  variant?: Variant
  delay?: number
  as?: 'div' | 'span' | 'li'
  className?: string
}) {
  const Componente = m[as]

  // Su schermi stretti lo scostamento laterale di partenza sporge dal
  // contenitore e allarga la pagina: li' l'ingresso diventa verticale.
  // La correzione sta qui e non nel CSS perche' lo stato iniziale e' scritto
  // come stile inline dalla libreria, che avrebbe la precedenza.
  const stretto = useMediaQuery('(max-width: 640px)')
  const effettiva: Variant =
    stretto && (variant === 'left' || variant === 'right') ? 'up' : variant

  return (
    <Componente
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -60px 0px' }}
      variants={VARIANTI[effettiva]}
      transition={{
        type: 'spring',
        stiffness: 90,
        damping: 18,
        mass: 0.9,
        delay: delay / 1000,
      }}
    >
      {children}
    </Componente>
  )
}
