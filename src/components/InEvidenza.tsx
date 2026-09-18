import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { iniziativeAttive } from '../content/evidenza'
import { ramoDaSlug } from '../content/rami'
import Reveal from './motion/Reveal'
import { focusRing } from './ui/styles'

/**
 * "In evidenza ora": le iniziative attive oggi (questionario 2.2).
 * Ogni scheda prende il tema del proprio ramo. Se nessuna iniziativa e'
 * attiva il blocco non compare, invece di restare vuoto.
 */
export default function InEvidenza() {
  // Un'iniziativa collegata a un progetto che non esiste piu' porterebbe a una
  // pagina di errore, con la scheda priva di icona e occhiello: meglio non
  // mostrarla affatto.
  const attive = useMemo(() => iniziativeAttive().filter((i) => ramoDaSlug(i.ramo)), [])
  if (attive.length === 0) return null

  return (
    <div className={`grid gap-5 ${attive.length > 2 ? "md:grid-cols-3" : "mx-auto max-w-4xl sm:grid-cols-2"}`}>
      {attive.map((iniziativa, i) => {
        const ramo = ramoDaSlug(iniziativa.ramo)
        const Icon = ramo?.Icon
        return (
          <Reveal key={`${iniziativa.titolo}-${i}`} delay={i * 90}>
            <Link
              to={iniziativa.percorso}
              data-tema={ramo?.tema ?? 'centrale'}
              className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-brand-card p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] transition-colors duration-300 hover:bg-[#202020] ${focusRing}`}
            >
              <span className="mb-5 flex items-center gap-3">
                {Icon && (
                  <span className="h-10 w-10 grid place-items-center rounded-lg border border-accento-1/25 bg-accento-1/[0.08] text-accento-1">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                )}
                <span className="text-occhiello uppercase text-accento-1">{ramo?.nome}</span>
              </span>
              <span className="mb-2 text-sottotitolo text-white">{iniziativa.titolo}</span>
              <span className="mb-6 text-corpo text-white/60">{iniziativa.testo}</span>
              <span className="mt-auto inline-flex items-center gap-2 text-etichetta text-accento-1">
                {iniziativa.etichetta}
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>
          </Reveal>
        )
      })}
    </div>
  )
}
