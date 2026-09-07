import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { PlaceholderBox } from './Placeholder'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`card-hover h-full bg-brand-card border border-white/[0.06] rounded-2xl p-6 sm:p-8 hover:border-brand-yellow/40 ${className}`}
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
      <div className="card-icon w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r from-brand-yellow to-brand-red text-black flex items-center justify-center mb-4 sm:mb-5">
        <Icon size={24} aria-hidden="true" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-white mb-2.5">{title}</h3>
      <div className="text-sm text-white/60 text-pretty">{children}</div>
    </Card>
  )
}

/** Scheda articolo condivisa fra l'anteprima in home e l'elenco del blog. */
export function ArticleCard({ tag, date = 'Data da definire' }: { tag: string; date?: string }) {
  return (
    <Card className="overflow-hidden !p-0">
      <PlaceholderBox className="h-40 rounded-none border-0 border-b border-white/[0.06]">
        Immagine di copertina
      </PlaceholderBox>
      <div className="p-5 sm:p-6">
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-yellow/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand-yellow">
            {tag}
          </span>
          <span className="text-xs uppercase tracking-wider text-white/40">{date}</span>
        </div>
        <h3 className="mb-2 text-base font-bold text-white sm:text-lg">
          Titolo articolo di esempio
        </h3>
        <p className="text-sm italic text-white/35">
          Testo in arrivo non appena i contenuti saranno disponibili.
        </p>
      </div>
    </Card>
  )
}
