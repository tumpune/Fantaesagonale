import type { ReactNode } from 'react'

/** Testo segnaposto in linea, per contenuti non ancora forniti. */
export function Placeholder({ children }: { children: ReactNode }) {
  return <span className="italic text-white/35">{children}</span>
}

/**
 * Riquadro in attesa di contenuto. Il riflesso che lo attraversa comunica che
 * e' uno spazio riservato e non un errore di caricamento.
 */
export function PlaceholderBox({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`placeholder-shimmer bg-brand-card border border-dashed border-white/15 rounded-xl flex items-center justify-center text-center text-xs text-white/35 p-4 ${className}`}
    >
      {children}
    </div>
  )
}
