import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import TiltCard from '../motion/TiltCard'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`card-hover h-full rounded-2xl border border-white/[0.06] bg-brand-card p-7 hover:border-accento-1/40 ${className}`}
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
    <TiltCard>
      <Card>
        <div className="card-icon mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-accento-1 to-accento-2 text-black">
          <Icon size={24} aria-hidden="true" />
        </div>
        <h3 className="mb-2.5 text-sottotitolo text-white">{title}</h3>
        <div className="text-corpo text-white/60 text-pretty">{children}</div>
      </Card>
    </TiltCard>
  )
}
