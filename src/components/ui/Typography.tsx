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

/**
 * Intestazione di sezione.
 *
 * Allineata a sinistra e preceduta dal numero della sezione con un filetto:
 * e' il gesto che distingue una pagina impaginata da una fila di blocchi tutti
 * uguali e centrati. Il centrato resta possibile, ma come eccezione.
 *
 * `livello` regola quanto pesa il titolo: "portante" per le sezioni che
 * reggono la pagina, "servizio" per quelle di contorno, che prima avevano
 * esattamente la stessa dimensione.
 */
export function SectionHead({
  eyebrow,
  title,
  subtitle,
  numero,
  livello = 'portante',
  centrato = false,
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  numero?: string
  livello?: 'portante' | 'servizio'
  centrato?: boolean
}) {
  return (
    <Reveal className={`mb-10 max-w-3xl ${centrato ? 'mx-auto text-center' : ''}`}>
      {numero && !centrato && (
        <span className="mb-4 flex items-center gap-4">
          <span className="text-meta cifre-allineate text-accento-1">{numero}</span>
          <span aria-hidden="true" className="h-px w-16 bg-accento-1/40" />
        </span>
      )}
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={`mb-3 text-white text-balance ${livello === 'portante' ? 'text-titolo' : 'text-sezione'}`}
      >
        {typeof title === 'string' ? <SplitText text={title} step={55} /> : title}
      </h2>
      {subtitle && <Corpo className={centrato ? 'mx-auto' : ''}>{subtitle}</Corpo>}
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
  dati,
}: {
  eyebrow: string
  title?: string
  highlight?: string
  /** Frase sotto il titolo, a scala minore: per i rami, dopo il nome. */
  claim?: string
  children?: ReactNode
  actions?: ReactNode
  extra?: ReactNode
  /** Scheda di dati a fianco del titolo: senza, il terzo destro resta vuoto. */
  dati?: { etichetta: string; valore: string }[]
}) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 90])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section ref={ref} className="fondo-testata px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:px-12">
      <m.div
        style={reduced ? undefined : { y, opacity }}
        className={`mx-auto w-full max-w-6xl ${dati?.length ? 'lg:grid lg:grid-cols-[1.1fr_0.75fr] lg:items-end lg:gap-16' : ''}`}
      >
        <div>
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
        </div>

        {/* Colonna dei dati: filetti orizzontali, niente riquadro. Riempie il
            terzo destro della testata, che altrimenti resta nero e basta. */}
        {dati && dati.length > 0 && (
          <Reveal delay={300} className="mt-12 lg:mt-0">
            <dl className="border-t border-white/12">
              {dati.map((riga, i) => (
                <div
                  key={`${riga.etichetta}-${i}`}
                  className="flex items-baseline justify-between gap-6 border-b border-white/12 py-3"
                >
                  <dt className="text-meta uppercase text-white/50">{riga.etichetta}</dt>
                  <dd className="cifre-allineate text-etichetta text-white text-right">{riga.valore}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </m.div>
    </section>
  )
}
