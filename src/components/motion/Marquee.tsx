import type { ReactNode } from 'react'

/**
 * Nastro scorrevole continuo. Il contenuto e' duplicato e la traccia si sposta
 * esattamente della meta' della propria larghezza: al termine del ciclo la
 * seconda copia si trova dove era la prima, quindi il ritorno e' invisibile e
 * il movimento sembra infinito.
 */
export default function Marquee({
  children,
  speed = 28,
  reverse = false,
  className = '',
}: {
  children: ReactNode
  speed?: number
  reverse?: boolean
  className?: string
}) {
  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div
        className="marquee-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        <span className="marquee-group">{children}</span>
        <span className="marquee-group">{children}</span>
      </div>
    </div>
  )
}
