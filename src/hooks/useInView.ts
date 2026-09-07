import { useEffect, useRef, useState } from 'react'

/**
 * Segnala quando un elemento entra nel viewport, per far partire le animazioni
 * di ingresso solo al momento giusto. Smette di osservare dopo il primo
 * ingresso: gli elementi non devono rianimarsi a ogni scorrimento avanti e
 * indietro, sarebbe fastidioso da leggere.
 */
export function useInView<T extends HTMLElement>(options?: {
  threshold?: number
  rootMargin?: string
}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Senza IntersectionObserver il contenuto resta visibile invece di
    // rimanere invisibile per sempre in attesa di un'animazione che non parte.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? '0px 0px -60px 0px',
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options?.threshold, options?.rootMargin])

  return { ref, inView }
}
