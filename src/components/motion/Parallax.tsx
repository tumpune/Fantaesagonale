import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Sposta il contenuto piu' lentamente della pagina mentre scorre, creando
 * profondita' fra i livelli.
 *
 * L'aggiornamento e' agganciato a requestAnimationFrame e non all'evento di
 * scorrimento: leggere la posizione a ogni evento forzerebbe il browser a
 * ricalcolare il layout decine di volte al secondo.
 */
export default function Parallax({
  children,
  speed = 0.18,
  className = '',
}: {
  children: ReactNode
  speed?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    let raf = 0
    let ticking = false

    const update = () => {
      const r = el.getBoundingClientRect()
      const centro = r.top + r.height / 2 - window.innerHeight / 2
      el.style.transform = `translate3d(0, ${(-centro * speed).toFixed(2)}px, 0)`
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        raf = requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      el.style.transform = ''
    }
  }, [reduced, speed])

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  )
}
