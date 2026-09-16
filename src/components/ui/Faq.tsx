import { Plus } from 'lucide-react'
import type { Faq } from '../../content/rami'
import Reveal from '../motion/Reveal'

/**
 * Domande frequenti a fisarmonica (questionario 4.1: FAQ generali e per ramo).
 *
 * Usa <details> nativo invece di uno stato React: apertura, chiusura, tastiera
 * e lettori di schermo funzionano gia' senza una riga di JavaScript, e il
 * contenuto resta nel documento per i motori di ricerca anche se chiuso.
 */
export function FaqLista({ voci }: { voci: Faq[] }) {
  if (voci.length === 0) return null

  return (
    <div className="mx-auto grid max-w-3xl gap-3">
      {voci.map((voce, i) => (
        <Reveal key={`${voce.domanda}-${i}`} delay={i * 60}>
          <details className="faq-voce group rounded-2xl border border-white/[0.08] bg-brand-card transition-colors open:border-accento-1/30 hover:border-white/15">
            <summary className="flex cursor-pointer items-center justify-between gap-6 px-6 py-5 text-sottotitolo text-white">
              {voce.domanda}
              <span className="faq-segno grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-accento-1">
                <Plus size={16} aria-hidden="true" />
              </span>
            </summary>
            <p className="faq-risposta px-6 pb-6 text-corpo text-white/65 text-pretty">
              {voce.risposta}
            </p>
          </details>
        </Reveal>
      ))}
    </div>
  )
}
