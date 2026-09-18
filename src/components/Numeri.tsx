import { NUMERI } from '../content/associazione'
import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'
import { gradientText } from './ui/styles'

/**
 * Le cifre contano da zero quando la fascia entra in vista. Valori come "3ª"
 * o "2023" non si prestano: il primo perche' non e' un numero, il secondo
 * perche' vederlo scorrere da zero al 2023 sembrerebbe un errore.
 */
function Cifra({ valore, parti }: { valore: string; parti: boolean }) {
  const contabile = /^\d{1,3}$/.test(valore)
  const numero = useCountUp(contabile ? Number(valore) : 0, contabile && parti)
  return <>{contabile ? numero : valore}</>
}

/**
 * Fascia dei numeri dell'associazione, subito sotto la testata.
 *
 * Quattro cifre dicono in un colpo d'occhio quanto e' reale il progetto, cosa
 * che nessun paragrafo riesce a fare altrettanto in fretta. Compaiono
 * scorrendo, una dopo l'altra, e restano leggibili anche senza animazioni.
 */
export default function Numeri() {
  const { ref: contenitore, inView: visibile } = useInView<HTMLDivElement>({ threshold: 0.3 })

  if (!NUMERI.length) return null

  return (
    <div ref={contenitore} className="border-b border-white/[0.06] bg-brand-soft/60 px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10 lg:grid-cols-4">
        {NUMERI.map((numero, i) => (
          <div
            key={`${numero.valore}-${i}`}
            className="group relative text-center transition-transform duration-500"
            style={{
              opacity: visibile ? 1 : 0,
              transform: visibile ? 'none' : 'translateY(14px)',
              transition: `opacity .6s cubic-bezier(.16,1,.3,1) ${i * 90}ms, transform .6s cubic-bezier(.16,1,.3,1) ${i * 90}ms`,
            }}
          >
            <dt
              className={`cifre-allineate mb-1 font-display text-[clamp(1.9rem,1.3rem+2vw,2.9rem)] font-extrabold leading-none tracking-tight ${gradientText}`}
            >
              <Cifra valore={numero.valore} parti={visibile} />
            </dt>
            <dd className="text-micro text-white/55 text-pretty">{numero.etichetta}</dd>

            {/* Separatore fra le colonne, solo dove serve davvero. */}
            {i < NUMERI.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute -right-3 top-1/2 hidden h-10 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/12 to-transparent sm:-right-5 lg:block"
              />
            )}
          </div>
        ))}
      </dl>
    </div>
  )
}
