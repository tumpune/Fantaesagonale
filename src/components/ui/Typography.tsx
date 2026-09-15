import { useRef, type ReactNode } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import Reveal from '../motion/Reveal'
import SplitText from '../motion/SplitText'
import { useReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Tutti i testi passano da qui.
 *
 * Le classi tipografiche non compaiono piu' nelle pagine: ogni componente
 * dichiara un ruolo (occhiello, titolo, guida, corpo) e dimensione, peso,
 * interlinea e spaziatura arrivano dalla scala definita in tailwind.config.
 * Prima ciascuna pagina se li sceglieva da sola, ed e' il motivo per cui la
 * scrittura sembrava cambiare da una sezione all'altra.
 */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="mb-4 inline-block text-occhiello uppercase text-brand-yellow">{children}</span>
  )
}

/** Paragrafo introduttivo, sotto un titolo. */
export function Guida({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`max-w-2xl text-guida text-white/60 text-pretty ${className}`}>{children}</p>
}

/** Testo corrente. */
export function Corpo({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-corpo text-white/60 text-pretty ${className}`}>{children}</p>
}

export function SectionHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
}) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mb-3 text-titolo text-white text-balance">
        {/* Solo i titoli testuali vengono divisi in parole: se arriva markup
            composto lo si rende com'e', senza tentare di analizzarlo. */}
        {typeof title === 'string' ? <SplitText text={title} step={55} /> : title}
      </h2>
      {subtitle && <Corpo className="mx-auto">{subtitle}</Corpo>}
    </Reveal>
  )
}

/**
 * Testata delle pagine interne. La home ha la sua, costruita attorno al logo,
 * ma condivide con questa fondo, scala e ritmo verticale.
 */
export function PageHero({
  eyebrow,
  titleItalic,
  title,
  children,
  actions,
}: {
  eyebrow: string
  titleItalic: string
  title: string
  children?: ReactNode
  actions?: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  // Il contenuto si allontana e sbiadisce mentre la testata esce dallo
  // schermo: lo scorrimento diventa un movimento in profondita' invece di un
  // semplice slittamento del blocco verso l'alto.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 90])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section
      ref={ref}
      className="px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:px-12 bg-[radial-gradient(circle_at_20%_20%,rgba(252,215,12,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(230,26,26,0.14),transparent_50%)]"
    >
      <m.div
        style={reduced ? undefined : { y, opacity }}
        className="mx-auto w-full max-w-6xl"
      >
        <Reveal variant="fade">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>

        {/* Le due righe condividono la stessa misura: cambia solo il carattere,
            corsivo per la prima e tondo per la seconda. Prima avevano pesi e
            spaziature diverse e sembravano due titoli accostati. */}
        <h1 className="mb-6 text-display text-white text-balance">
          <SplitText
            text={titleItalic}
            immediate
            delay={120}
            className="block font-playfair font-normal italic"
          />
          <SplitText text={title} immediate delay={280} className="-mt-1 block" />
        </h1>

        {children && (
          <Reveal delay={260}>
            <Guida>{children}</Guida>
          </Reveal>
        )}

        {actions && (
          <Reveal delay={360} className="mt-8 flex flex-wrap gap-3">
            {actions}
          </Reveal>
        )}
      </m.div>
    </section>
  )
}
