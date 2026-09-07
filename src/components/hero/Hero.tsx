import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import HexField from './HexField'
import SplitText from '../motion/SplitText'
import RotatingWord from '../motion/RotatingWord'
import Magnetic from '../motion/Magnetic'
import { useInView } from '../../hooks/useInView'
import { useCountUp } from '../../hooks/useCountUp'
import { btnDanger, btnSecondary, gradientText } from '../ui/styles'

const PAROLE = ['competizione', 'community', 'territorio', 'ottimismo']

const NUMERI = [
  { valore: 205, etichetta: 'squadre iscritte' },
  { valore: 20, suffisso: 'mila €', etichetta: 'di montepremi' },
  { valore: 3, suffisso: 'ª', etichetta: 'edizione del Listone' },
  { valore: 2023, grezzo: true, etichetta: 'dalla fondazione' },
]

function Numero({
  valore,
  suffisso,
  etichetta,
  grezzo,
  ritardo,
}: {
  valore: number
  suffisso?: string
  etichetta: string
  grezzo?: boolean
  ritardo: number
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 })
  const conteggio = useCountUp(valore, inView, 1500)

  return (
    <div
      ref={ref}
      className="hero-anim hero-fade text-center sm:text-left"
      style={{ animationDelay: `${ritardo}ms` }}
    >
      <div className={`text-2xl font-extrabold leading-none sm:text-3xl ${gradientText}`}>
        {grezzo ? conteggio : conteggio.toLocaleString('it-IT')}
        {suffisso}
      </div>
      <div className="mt-1.5 text-xs text-white/55 sm:text-sm">{etichetta}</div>
    </div>
  )
}

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-brand-black min-h-[36rem] h-[100svh]"
      aria-label="FantaEsagonale"
    >
      <HexField />

      {/* Vignettatura: spegne il campo di esagoni verso il centro e ai bordi,
          altrimenti il reticolo competerebbe con il testo per l'attenzione. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,13,13,0.86)_0%,rgba(13,13,13,0.4)_48%,rgba(13,13,13,0.82)_100%)]" />

      {/* pb ampio: in basso a destra c'e' il pulsante fisso della chat, che
          altrimenti coprirebbe l'ultimo dato della riga. */}
      <div className="relative z-10 flex h-[100svh] min-h-[36rem] flex-col justify-between px-5 pb-20 pt-24 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span
            className="hero-anim hero-fade mb-5 inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/[0.07] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-yellow"
            style={{ animationDelay: '0.15s' }}
          >
            Grammichele · dal 2023
          </span>

          <h1 className="max-w-5xl text-white leading-[0.95] text-balance">
            <SplitText
              text="Il divertimento diventa"
              immediate
              delay={280}
              step={90}
              className="block font-playfair italic font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            />
            <span
              className="hero-anim hero-fade mt-1 block text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ letterSpacing: '-0.05em', animationDelay: '0.75s' }}
            >
              <RotatingWord words={PAROLE} className={gradientText} />
            </span>
          </h1>

          <p
            className="hero-anim hero-fade mt-6 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base text-pretty"
            style={{ animationDelay: '0.95s' }}
          >
            Associazione di promozione sociale a Grammichele. Fantacalcio al Listone, tornei,
            freccette, beer pong e cornhole: sfide vere, con premi veri.
          </p>

          <div
            className="hero-anim hero-fade mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '1.1s' }}
          >
            <Magnetic>
              <Link to="/tornei-giochi" className={btnDanger}>
                Scopri i tornei
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/sponsor" className={btnSecondary}>
                Diventa sponsor
              </Link>
            </Magnetic>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 border-t border-white/10 pt-6 sm:grid-cols-4 sm:gap-6">
          {NUMERI.map((n, i) => (
            <Numero key={n.etichetta} {...n} ritardo={1250 + i * 110} />
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-2 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/45 hero-anim hero-fade lg:flex"
        style={{ animationDelay: '1.7s' }}
        aria-hidden="true"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Scorri</span>
        <ChevronDown size={18} className="scroll-hint" />
      </div>
    </section>
  )
}
