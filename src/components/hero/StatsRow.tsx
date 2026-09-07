import Reveal from '../motion/Reveal'
import { useInView } from '../../hooks/useInView'
import { useCountUp } from '../../hooks/useCountUp'
import { gradientText } from '../ui/styles'
import { HERO_STATS } from '../../content/sezioni'

function Numero({
  valore,
  suffisso,
  etichetta,
  grezzo,
}: {
  valore: number
  suffisso?: string
  etichetta: string
  grezzo?: boolean
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 })
  const conteggio = useCountUp(valore, inView, 1500)

  return (
    <div ref={ref}>
      <div className={`text-2xl font-extrabold leading-none sm:text-3xl ${gradientText}`}>
        {grezzo ? conteggio : conteggio.toLocaleString('it-IT')}
        {suffisso}
      </div>
      <div className="mt-1.5 text-xs text-white/55 sm:text-sm">{etichetta}</div>
    </div>
  )
}

/** Riga dei dati sotto la testata della home. */
export default function StatsRow() {
  return (
    <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {HERO_STATS.map((stat, i) => (
        <Reveal key={stat.etichetta} delay={i * 90}>
          <dt className="sr-only">{stat.etichetta}</dt>
          <dd>
            <Numero {...stat} />
          </dd>
        </Reveal>
      ))}
    </dl>
  )
}
