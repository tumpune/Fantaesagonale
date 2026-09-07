import { useEffect, useRef } from 'react'

/**
 * Barra di avanzamento della lettura in cima alla pagina.
 *
 * Dove il browser supporta le animazioni native guidate dallo scroll la barra
 * e' mossa dal compositore, senza JavaScript per fotogramma: il CSS in
 * @supports la governa e questo listener resta come alternativa altrove.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (CSS.supports('animation-timeline: scroll()')) return

    const el = ref.current
    if (!el) return
    let raf = 0

    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const ratio = max > 0 ? doc.scrollTop / max : 0
      el.style.transform = `scaleX(${ratio})`
      raf = 0
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={ref} className="scroll-progress-bar" />
    </div>
  )
}
