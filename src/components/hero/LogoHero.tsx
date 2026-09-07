import { useRef, type ReactNode } from 'react'
import { m, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { asset } from '../../lib/constants'
import { usePointerFine, useReducedMotion } from '../../hooks/useMediaQuery'
import SplitText from '../motion/SplitText'
import Reveal from '../motion/Reveal'
import { Eyebrow } from '../ui/Typography'

/**
 * Testata della home costruita attorno al logo.
 *
 * Il marchio sta al centro e il testo gli si dispone intorno; lo sfondo e' il
 * logo stesso, ingrandito e sfocato, piu' anelli esagonali che ruotano — la
 * forma del logo e la pianta di Grammichele. Nessuna immagine estranea: tutto
 * nasce dall'identita' del brand.
 */
export default function LogoHero({
  eyebrow,
  titoloSopra,
  titoloSotto,
  descrizione,
  azioni,
  dati,
}: {
  eyebrow: string
  titoloSopra: string
  titoloSotto: string
  descrizione: string
  azioni: ReactNode
  dati: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const pointerFine = usePointerFine()

  // Il logo si sposta appena verso il cursore: da' profondita' rispetto al
  // testo, che resta fermo, senza rubargli leggibilita'.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const molla = { stiffness: 60, damping: 18, mass: 1 }
  const px = useSpring(mx, molla)
  const py = useSpring(my, molla)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const logoScala = useTransform(scrollYProgress, [0, 1], [1, 1.25])

  const interattivo = pointerFine && !reduced

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        if (!interattivo) return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 40)
        my.set(((e.clientY - r.top) / r.height - 0.5) * 40)
      }}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
      // pb ampio su mobile: in basso a destra c'e' il pulsante fisso della
      // chat, che altrimenti copre il richiamo secondario.
      className="relative flex min-h-[44rem] items-center overflow-hidden px-5 pb-36 pt-28 sm:min-h-[100svh] sm:px-8 sm:py-32 lg:px-12 bg-[radial-gradient(circle_at_20%_20%,rgba(252,215,12,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(230,26,26,0.14),transparent_50%)]"
    >
      {/* Il logo ingrandito e sfocato diventa l'alone di fondo: lo sfondo nasce
          dal marchio invece di essere una decorazione qualsiasi. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
        <img
          src={asset('img/logo-trasparente.png')}
          alt=""
          className="w-[min(150vw,60rem)] max-w-none opacity-[0.045] blur-[80px]"
        />
      </div>

      <m.div
        style={reduced ? undefined : { y: scrollY, opacity: scrollOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center"
      >
        <Reveal variant="fade">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>

        <h1 className="w-full text-white leading-[0.95] text-balance">
          <SplitText
            text={titoloSopra}
            immediate
            delay={200}
            step={90}
            className="block font-playfair text-3xl font-normal italic sm:text-5xl md:text-6xl"
          />

          {/* Il marchio sta dentro il titolo, fra le due righe: e' il centro
              della composizione, non un elemento appoggiato accanto. */}
          <m.span
            className="my-10 block sm:my-14"
            initial={reduced ? false : { opacity: 0, scale: 0.55, rotate: -35 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 55, damping: 14, delay: 0.35 }}
          >
            <m.span
              style={interattivo ? { x: px, y: py, scale: logoScala } : undefined}
              className="relative inline-block"
            >
              <span className="logo-glow" aria-hidden="true" />

              {/* Anelli ancorati al marchio, non alla sezione: cosi' lo
                  incorniciano invece di attraversare testo e dati. */}
              <svg
                viewBox="-100 -100 200 200"
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[240%] w-[240%] -translate-x-1/2 -translate-y-1/2"
              >
                <polygon
                  points="0,-92 80,-46 80,46 0,92 -80,46 -80,-46"
                  className="hex-ring hex-ring-1"
                  fill="none"
                  stroke="rgba(252,215,12,0.28)"
                  strokeWidth="0.8"
                  strokeDasharray="14 8"
                />
                <polygon
                  points="0,-66 57,-33 57,33 0,66 -57,33 -57,-33"
                  className="hex-ring hex-ring-2"
                  fill="none"
                  stroke="rgba(230,26,26,0.32)"
                  strokeWidth="0.9"
                />
                <polygon
                  points="0,-46 40,-23 40,23 0,46 -40,23 -40,-23"
                  className="hex-ring hex-ring-3"
                  fill="none"
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="0.6"
                  strokeDasharray="3 7"
                />
              </svg>

              <img
                src={asset('img/logo-trasparente.png')}
                alt="FantaEsagonale"
                className="logo-float relative h-24 w-24 object-contain sm:h-32 sm:w-32 md:h-40 md:w-40"
              />
            </m.span>
          </m.span>

          <SplitText
            text={titoloSotto}
            immediate
            delay={560}
            step={90}
            className="block text-3xl font-extrabold sm:text-5xl md:text-6xl"
          />
        </h1>

        <Reveal delay={300}>
          <p className="mt-6 max-w-2xl text-base text-white/60 sm:text-lg text-pretty">
            {descrizione}
          </p>
        </Reveal>

        <Reveal delay={420} className="mt-8 flex flex-wrap justify-center gap-3">
          {azioni}
        </Reveal>

        <div className="mt-14 w-full border-t border-white/10 pt-7 sm:mt-16">{dati}</div>
      </m.div>
    </section>
  )
}
