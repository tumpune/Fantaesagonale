import { useEffect, useRef, type ReactNode } from 'react'
import { usePointerFine, useReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Attira l'elemento verso il cursore quando gli si avvicina e lo lascia
 * tornare a posto all'uscita, con un ritorno elastico.
 * Usato sui richiami principali: il pulsante sembra rispondere alla mano.
 */
export default function Magnetic({
  children,
  strength = 0.35,
  radius = 90,
  className = '',
}: {
  children: ReactNode
  strength?: number
  radius?: number
  className?: string
}) {
  const pointerFine = usePointerFine()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !pointerFine || reduced) return

    const current = { x: 0, y: 0 }
    const goal = { x: 0, y: 0 }
    let raf = 0

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const distance = Math.hypot(dx, dy)
      const reach = Math.max(r.width, r.height) / 2 + radius

      if (distance < reach) {
        goal.x = dx * strength
        goal.y = dy * strength
      } else {
        goal.x = 0
        goal.y = 0
      }
    }

    const loop = () => {
      current.x += (goal.x - current.x) * 0.15
      current.y += (goal.y - current.y) * 0.15
      el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      el.style.transform = ''
    }
  }, [pointerFine, reduced, strength, radius])

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  )
}
