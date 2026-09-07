import type { ReactNode } from 'react'
import Reveal from '../motion/Reveal'

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
    <Reveal
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
    </Reveal>
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
        <Reveal variant="fade">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <h1 className="text-white leading-[0.95] mb-5 sm:mb-6 text-balance">
          <Reveal as="span" variant="up" delay={80} className="block">
            <span
              className="block font-playfair italic font-normal text-3xl sm:text-5xl md:text-6xl"
              style={{ letterSpacing: '-0.05em' }}
            >
              {titleItalic}
            </span>
          </Reveal>
          <Reveal as="span" variant="up" delay={170} className="block">
            <span
              className="block font-normal text-3xl sm:text-5xl md:text-6xl -mt-1"
              style={{ letterSpacing: '-0.06em' }}
            >
              {title}
            </span>
          </Reveal>
        </h1>
        {children && (
          <Reveal variant="up" delay={260}>
            <p className="text-white/60 text-base sm:text-lg max-w-2xl text-pretty">{children}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
