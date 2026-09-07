import { useRef, type PointerEvent, type ReactNode } from 'react'
import { usePointerFine, useReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Inclina la scheda verso il puntatore e fa scorrere un riflesso speculare sul
 * punto toccato dal mouse, come se la superficie fosse lucida e reale.
 *
 * Non usa un ciclo di animazione: la trasformazione e' scritta direttamente
 * sull'evento e ammortizzata dalla transizione CSS, cosi' resta leggera anche
 * quando la pagina ne contiene molte.
 */
export default function TiltCard({
  children,
  max = 7,
  className = '',
}: {
  children: ReactNode
  max?: number
  className?: string
}) {
  const pointerFine = usePointerFine()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const enabled = pointerFine && !reduced

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || !enabled) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--tilt-x', `${(0.5 - py) * max * 2}deg`)
    el.style.setProperty('--tilt-y', `${(px - 0.5) * max * 2}deg`)
    el.style.setProperty('--glare-x', `${px * 100}%`)
    el.style.setProperty('--glare-y', `${py * 100}%`)
    el.style.setProperty('--glare-opacity', '1')
  }

  const reset = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
    el.style.setProperty('--glare-opacity', '0')
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={`tilt h-full ${enabled ? 'tilt-active' : ''} ${className}`}
    >
      <div className="tilt-inner h-full">
        {children}
        <span className="tilt-glare" aria-hidden="true" />
      </div>
    </div>
  )
}
