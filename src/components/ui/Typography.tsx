import { useRef, type ReactNode } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import Reveal from '../motion/Reveal'
import SplitText from '../motion/SplitText'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { gradientText } from './styles'

/**
 * Tutti i testi passano da qui: ogni componente dichiara un ruolo (occhiello,
 * titolo, guida, corpo) e dimensione, peso, interlinea e spaziatura arrivano
 * dalla scala in tailwind.config.
 */

export function Eyebrow({ children, className = 'mb-4' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-block text-occhiello uppercase text-accento-1 ${className}`}>
      {children}
    </span>
  )
}

/** Paragrafo introduttivo, sotto un titolo. */
export function Guida({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`max-w-2xl text-guida text-white/65 text-pretty ${className}`}>{children}</p>
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
        {typeof title === 'string' ? <SplitText text={title} step={55} /> : title}
      </h2>
      {subtitle && <Corpo className="mx-auto">{subtitle}</Corpo>}
    </Reveal>
  )
}

/**
 * Testata delle pagine interne.
 *
 * La seconda riga del titolo prende il colore del tema della pagina: entrando
 * nel Fantacalcio diventa oro, in FantaMaritati bianca, altrove giallo-rossa.
 * E' il segnale piu' immediato del ramo in cui ci si trova.
 */
export function PageHero({
  eyebrow,
  title,
  highlight,
  claim,
  children,
  actions,
  extra,
}: {
  eyebrow: string
  title?: string
  highlight?: string
  /** Frase sotto il titolo, a scala minore: per i rami, dopo il nome. */
  claim?: string
  children?: ReactNode
  actions?: ReactNode
  extra?: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 90])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section ref={ref} className="fondo-testata px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:px-12">
      <m.div style={reduced ? undefined : { y, opacity }} className="mx-auto w-full max-w-6xl">
        <Reveal variant="fade" className="mb-4 flex flex-wrap items-center gap-3">
          <Eyebrow className="">{eyebrow}</Eyebrow>
          {extra}
        </Reveal>

        <h1 className="mb-6 max-w-4xl text-display text-white text-balance">
          {title && <SplitText text={title} immediate delay={120} className="block" />}
          {highlight && (
            <SplitText
              text={highlight}
              immediate
              delay={300}
              className="block"
              wordClassName={gradientText}
            />
          )}
        </h1>

        {claim && (
          <Reveal delay={220}>
            <p className="mb-5 max-w-3xl text-titolo text-white text-balance">{claim}</p>
          </Reveal>
        )}

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
