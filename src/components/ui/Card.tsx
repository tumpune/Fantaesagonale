import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import TiltCard from '../motion/TiltCard'
import { PlaceholderBox } from './Placeholder'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`card-hover h-full rounded-2xl border border-white/[0.06] bg-brand-card p-7 hover:border-brand-yellow/40 ${className}`}
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
        <div className="card-icon mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-yellow to-brand-red text-black">
          <Icon size={24} aria-hidden="true" />
        </div>
        <h3 className="mb-2.5 text-sottotitolo text-white">{title}</h3>
        <div className="text-corpo text-white/60 text-pretty">{children}</div>
      </Card>
    </TiltCard>
  )
}

/** Scheda articolo condivisa fra l'anteprima in home e l'elenco del blog. */
export function ArticleCard({ tag, date = 'Data da definire' }: { tag: string; date?: string }) {
  return (
    <Card className="overflow-hidden !p-0">
      <PlaceholderBox className="h-40 rounded-none border-0 border-b border-white/[0.06]">
        Immagine di copertina
      </PlaceholderBox>
      <div className="p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-yellow/10 px-2.5 py-1 text-meta uppercase text-brand-yellow">
            {tag}
          </span>
          <span className="text-meta uppercase text-white/40">{date}</span>
        </div>
        <h3 className="mb-2 text-sottotitolo text-white">Titolo articolo di esempio</h3>
        <p className="text-corpo italic text-white/35">
          Testo in arrivo non appena i contenuti saranno disponibili.
        </p>
      </div>
    </Card>
  )
}
