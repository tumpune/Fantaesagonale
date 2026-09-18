import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { iconaRiquadro } from './styles'

/**
 * Scheda di contenuto.
 *
 * Al passaggio del mouse si schiarisce appena, invece di sollevarsi e accendere
 * il bordo: il sollevamento resta agli esagoni dell'alveare, che sono la
 * navigazione vera. Il bordo interno di luce da' una superficie leggermente
 * rialzata anche da ferma.
 */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`h-full rounded-xl border border-white/[0.07] bg-brand-card p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] transition-colors duration-300 hover:bg-[#202020] ${className}`}
    >
      {children}
    </div>
  )
}

export function FeatureCard({
  Icon,
  title,
  children,
}: {
  Icon: LucideIcon
  title: string
  children: ReactNode
}) {
  return (
    <Card>
      <div className={`mb-5 h-11 w-11 ${iconaRiquadro}`}>
        <Icon size={20} aria-hidden="true" />
      </div>
      <h3 className="mb-2.5 text-sottotitolo text-white">{title}</h3>
      <div className="text-corpo text-white/60 text-pretty">{children}</div>
    </Card>
  )
}
