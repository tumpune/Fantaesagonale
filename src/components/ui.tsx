import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export const btnPrimary =
  'inline-block rounded-full px-7 py-3.5 text-sm font-semibold text-black bg-gradient-to-r from-brand-yellow to-brand-red transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-red/30'

export const btnSecondary =
  'inline-block rounded-full px-7 py-3.5 text-sm font-semibold text-white border-2 border-white/80 transition-colors hover:border-brand-yellow hover:text-brand-yellow'

export const gradientText =
  'bg-gradient-to-r from-brand-yellow to-brand-red bg-clip-text text-transparent'

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block uppercase tracking-[2px] text-xs font-bold text-brand-yellow mb-4">
      {children}
    </span>
  )
}

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'center' | 'left'
}) {
  return (
    <div
      className={
        align === 'center'
          ? 'text-center max-w-2xl mx-auto mb-12'
          : 'text-left max-w-2xl mb-11'
      }
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-[-0.03em]">
        {title}
      </h2>
      {subtitle && <p className="text-white/60">{subtitle}</p>}
    </div>
  )
}

export function PageHero({
  eyebrow,
  titleItalic,
  title,
  children,
}: {
  eyebrow: string
  titleItalic: string
  title: string
  children?: ReactNode
}) {
  return (
    <section className="pt-32 pb-16 px-6 bg-[radial-gradient(circle_at_20%_20%,rgba(252,215,12,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(230,26,26,0.14),transparent_50%)]">
      <div className="max-w-6xl mx-auto">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-white leading-[0.95] mb-6">
          <span
            className="block font-playfair italic font-normal text-4xl sm:text-6xl"
            style={{ letterSpacing: '-0.05em' }}
          >
            {titleItalic}
          </span>
          <span
            className="block font-normal text-4xl sm:text-6xl -mt-1"
            style={{ letterSpacing: '-0.08em' }}
          >
            {title}
          </span>
        </h1>
        {children && <p className="text-white/60 text-lg max-w-2xl">{children}</p>}
      </div>
    </section>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`bg-brand-card border border-white/[0.06] rounded-2xl p-8 transition-all hover:-translate-y-1.5 hover:border-brand-yellow/40 ${className}`}
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
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-brand-yellow to-brand-red text-black flex items-center justify-center mb-5">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2.5">{title}</h3>
      <div className="text-sm text-white/60">{children}</div>
    </Card>
  )
}

export function Placeholder({ children }: { children: ReactNode }) {
  return <span className="italic text-white/35">{children}</span>
}

export function PlaceholderBox({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`bg-brand-card border border-dashed border-white/15 rounded-xl flex items-center justify-center text-center text-xs text-white/35 p-4 ${className}`}
    >
      {children}
    </div>
  )
}
