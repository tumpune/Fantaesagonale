import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black'

export const btnPrimary =
  `inline-block rounded-full px-6 py-3 sm:px-7 sm:py-3.5 text-sm font-semibold text-black bg-gradient-to-r from-brand-yellow to-brand-red transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-red/30 active:translate-y-0 ${focusRing}`

export const btnSecondary =
  `inline-block rounded-full px-6 py-3 sm:px-7 sm:py-3.5 text-sm font-semibold text-white border-2 border-white/80 transition-colors hover:border-brand-yellow hover:text-brand-yellow ${focusRing}`

export const gradientText =
  'bg-gradient-to-r from-brand-yellow to-brand-red bg-clip-text text-transparent'

/**
 * Ritmo verticale e larghezza del contenuto in un unico posto: prima ogni
 * pagina ripeteva la propria combinazione di padding, con risultati diversi
 * da una sezione all'altra.
 */
export function Section({
  children,
  alt = false,
  width = 'wide',
  className = '',
}: {
  children: ReactNode
  alt?: boolean
  width?: 'wide' | 'narrow'
  className?: string
}) {
  return (
    <section
      className={`px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 ${alt ? 'bg-brand-soft' : ''} ${className}`}
    >
      <div className={`mx-auto ${width === 'wide' ? 'max-w-6xl' : 'max-w-3xl'}`}>{children}</div>
    </section>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block uppercase tracking-[0.15em] text-xs font-bold text-brand-yellow mb-3 sm:mb-4">
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
          ? 'text-center max-w-2xl mx-auto mb-10 sm:mb-12'
          : 'text-left max-w-2xl mb-10 sm:mb-12'
      }
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-[-0.03em] text-balance">
        {title}
      </h2>
      {subtitle && <p className="text-white/60 text-sm sm:text-base text-pretty">{subtitle}</p>}
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
    <section className="px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-36 lg:px-12 bg-[radial-gradient(circle_at_20%_20%,rgba(252,215,12,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(230,26,26,0.14),transparent_50%)]">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-white leading-[0.95] mb-5 sm:mb-6 text-balance">
          <span
            className="block font-playfair italic font-normal text-3xl sm:text-5xl md:text-6xl"
            style={{ letterSpacing: '-0.05em' }}
          >
            {titleItalic}
          </span>
          <span
            className="block font-normal text-3xl sm:text-5xl md:text-6xl -mt-1"
            style={{ letterSpacing: '-0.06em' }}
          >
            {title}
          </span>
        </h1>
        {children && (
          <p className="text-white/60 text-base sm:text-lg max-w-2xl text-pretty">{children}</p>
        )}
      </div>
    </section>
  )
}

/** Riquadro in evidenza, usato per missione, manifesto e presentazione FantADSico. */
export function HighlightPanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-brand-yellow/20 bg-gradient-to-br from-brand-yellow/[0.08] to-brand-red/[0.08] p-7 text-center sm:p-10 lg:p-12">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mb-4 text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-3xl md:text-4xl text-balance">
        {title}
      </h2>
      <p className="text-base text-white/60 sm:text-lg text-pretty">{children}</p>
    </div>
  )
}

/**
 * Il richiamo finale chiudeva sei pagine con lo stesso identico markup
 * copiato: qui e' un componente solo, cosi' resta coerente ovunque.
 */
export function CtaBanner({ title, action }: { title: string; action: ReactNode }) {
  return (
    <section className="bg-gradient-to-br from-brand-yellow/[0.08] to-brand-red/[0.1] px-5 py-14 text-center sm:px-8 sm:py-16">
      <h2 className="mx-auto mb-6 max-w-2xl text-xl font-extrabold tracking-[-0.03em] text-white sm:text-2xl md:text-3xl text-balance">
        {title}
      </h2>
      {action}
    </section>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`bg-brand-card border border-white/[0.06] rounded-2xl p-6 sm:p-8 transition-all hover:-translate-y-1.5 hover:border-brand-yellow/40 ${className}`}
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
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r from-brand-yellow to-brand-red text-black flex items-center justify-center mb-4 sm:mb-5">
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
    <Card className="overflow-hidden p-0 hover:translate-y-0">
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
        <h3 className="mb-2 text-base font-bold text-white sm:text-lg">Titolo articolo di esempio</h3>
        <p className="text-sm italic text-white/35">
          Testo in arrivo non appena i contenuti saranno disponibili.
        </p>
      </div>
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
