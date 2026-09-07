import { useEffect, useState } from 'react'
import { useReducedMotion } from './useMediaQuery'

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Conta da zero al valore finale quando l'elemento diventa visibile.
 * Restituisce subito il valore finale se il movimento e' ridotto o se la cifra
 * non e' ancora entrata nel viewport, cosi' il numero e' sempre leggibile.
 */
export function useCountUp(target: number, start: boolean, durationMs = 1400) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return
    if (reduced) {
      setValue(target)
      return
    }

    let frame = 0
    const t0 = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - t0) / durationMs)
      setValue(Math.round(target * easeOut(progress)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, start, durationMs, reduced])

  return value
}
