import { useEffect, useRef } from 'react'
import { usePointerFine, useReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Cursore personalizzato: un punto che segue il mouse esattamente e un anello
 * che lo insegue in ritardo, ingrandendosi sugli elementi interattivi.
 *
 * Le posizioni sono scritte direttamente sul DOM dentro il ciclo di
 * animazione: passare da uno stato React causerebbe un render per fotogramma.
 */
export default function CustomCursor() {
  const pointerFine = usePointerFine()
  const reduced = useReducedMotion()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pointerFine || reduced) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: target.x, y: target.y }
    let raf = 0
    let visible = false

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) {
        visible = true
        dotRef.current?.classList.add('is-active')
        ringRef.current?.classList.add('is-active')
      }
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null
      const interactive = el?.closest('a, button, input, select, textarea, [data-cursor]')
      ringRef.current?.classList.toggle('is-hovering', Boolean(interactive))
    }

    const onLeave = () => {
      visible = false
      dotRef.current?.classList.remove('is-active')
      ringRef.current?.classList.remove('is-active')
    }

    const onDown = () => ringRef.current?.classList.add('is-pressed')
    const onUp = () => ringRef.current?.classList.remove('is-pressed')

    const loop = () => {
      ring.x += (target.x - ring.x) * 0.18
      ring.y += (target.y - ring.y) * 0.18
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [pointerFine, reduced])

  if (!pointerFine || reduced) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
