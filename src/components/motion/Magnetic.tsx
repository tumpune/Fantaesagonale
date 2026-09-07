import { useRef, type ReactNode } from 'react'
import { m, useMotionValue, useSpring } from 'motion/react'
import { usePointerFine, useReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Attira l'elemento verso il cursore e lo lascia tornare a posto con una
 * molla, non con una transizione a durata fissa: il rientro ha lo slancio di
 * un oggetto con una massa, che e' cio' che rende credibile l'effetto.
 */
export default function Magnetic({
  children,
  strength = 0.35,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const pointerFine = usePointerFine()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const molla = { stiffness: 220, damping: 16, mass: 0.6 }
  const sx = useSpring(x, molla)
  const sy = useSpring(y, molla)

  const attivo = pointerFine && !reduced

  return (
    <m.span
      ref={ref}
      style={attivo ? { x: sx, y: sy } : undefined}
      onMouseMove={(e) => {
        if (!attivo || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </m.span>
  )
}
