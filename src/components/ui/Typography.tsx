import type { ReactNode } from 'react'
import Reveal from '../motion/Reveal'
import SplitText from '../motion/SplitText'

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
        {/* Solo i titoli testuali vengono divisi in parole: se arriva markup
            composto lo si rende com'e', senza tentare di analizzarlo. */}
        {typeof title === 'string' ? <SplitText text={title} step={55} /> : title}
      </h2>
      {subtitle && <p className="text-white/60 text-sm sm:text-base text-pretty">{subtitle}</p>}
    </Reveal>
  )
}

/**
 * Testata comune a tutte le pagine, home compresa.
 *
 * La home usava un componente tutto suo, con un fondo animato che non
 * compariva da nessun'altra parte: il sito sembrava due progetti diversi
 * accostati. Qui la differenza fra home e pagine interne e' solo di scala,
 * mentre fondo, tipografia e spaziature restano gli stessi.
 */
export function PageHero({
  eyebrow,
  titleItalic,
  title,
  children,
  actions,
  footer,
  size = 'page',
}: {
  eyebrow: string
  titleItalic: string
  title: string
  children?: ReactNode
  actions?: ReactNode
  footer?: ReactNode
  size?: 'page' | 'home'
}) {
  const home = size === 'home'

  return (
    <section
      className={`relative flex flex-col px-5 sm:px-8 lg:px-12 bg-[radial-gradient(circle_at_20%_20%,rgba(252,215,12,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(230,26,26,0.14),transparent_50%)] ${
        home
          ? 'min-h-[38rem] justify-center pb-20 pt-32 sm:min-h-[44rem] sm:pb-16 sm:pt-40'
          : 'pb-14 pt-28 sm:pb-16 sm:pt-36'
      }`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal variant="fade">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>

        <h1 className="text-white leading-[0.95] mb-5 sm:mb-6 text-balance">
          <SplitText
            text={titleItalic}
            immediate
            delay={120}
            className={`block font-playfair italic font-normal ${
              home ? 'text-4xl sm:text-6xl md:text-7xl' : 'text-3xl sm:text-5xl md:text-6xl'
            }`}
          />
          <SplitText
            text={title}
            immediate
            delay={280}
            className={`block font-normal -mt-1 ${
              home ? 'text-4xl sm:text-6xl md:text-7xl' : 'text-3xl sm:text-5xl md:text-6xl'
            }`}
          />
        </h1>

        {children && (
          <Reveal delay={260}>
            <p className="text-white/60 text-base sm:text-lg max-w-2xl text-pretty">{children}</p>
          </Reveal>
        )}

        {actions && (
          <Reveal delay={360} className="mt-8 flex flex-wrap gap-3">
            {actions}
          </Reveal>
        )}

        {footer && <div className="mt-12 border-t border-white/10 pt-7 sm:mt-16">{footer}</div>}
      </div>
    </section>
  )
}
