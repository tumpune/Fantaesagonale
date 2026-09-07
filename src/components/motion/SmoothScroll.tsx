import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Scorrimento inerziale: la pagina continua brevemente il movimento dopo la
 * rotellina, invece di fermarsi di colpo. E' il dettaglio che piu' distingue
 * la sensazione dei siti curati, perche' agisce su ogni singola interazione.
 *
 * Disattivato quando il sistema chiede movimento ridotto: alterare il
 * comportamento dello scorrimento e' proprio cio' che da' fastidio a chi
 * soffre di disturbi vestibolari.
 */
export default function SmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Il tocco resta quello nativo del sistema: su mobile lo scorrimento
      // gestito via JavaScript peggiora la risposta invece di migliorarla.
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    let raf = 0
    const loop = (tempo: number) => {
      lenis.raf(tempo)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // I collegamenti interni devono passare da Lenis, altrimenti il salto
    // nativo e lo scorrimento animato si contendono la posizione.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (target) {
        e.preventDefault()
        lenis.scrollTo(target as HTMLElement, { offset: -80 })
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [reduced])

  return null
}
