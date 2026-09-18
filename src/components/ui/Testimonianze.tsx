import { Link } from 'react-router-dom'
import { Quote } from 'lucide-react'
import Reveal from '../motion/Reveal'
import { btnSecondary } from './styles'

export type Testimonianza = { testo: string; autore: string; ruolo?: string }

/**
 * Testimonianze (questionario 4.4: "elemento fondamentale", per ogni ramo).
 *
 * Finche' non ne arrivano di reali il blocco non ne mostra di inventate:
 * citazioni fittizie attribuite a persone inesistenti farebbero perdere
 * credibilita' proprio al punto del sito che deve costruirla. Il vuoto diventa
 * invece un invito a lasciarne una, che aiuta anche a raccoglierle.
 */
export function Testimonianze({
  voci,
  oggetto = 'testimonianza',
}: {
  voci: Testimonianza[]
  oggetto?: string
}) {
  if (voci.length === 0) {
    return (
      <Reveal>
        <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-white/15 bg-brand-card/60 px-8 py-10 text-center">
          <Quote size={24} className="mx-auto mb-4 text-accento-1" aria-hidden="true" />
          <p className="mb-2 text-sottotitolo text-white">Hai partecipato a un nostro progetto?</p>
          <p className="mx-auto mb-7 max-w-md text-corpo text-white/60">
            Stiamo raccogliendo le esperienze di chi ha giocato, collaborato o festeggiato con noi.
            Raccontaci la tua.
          </p>
          <Link to={`/contatti?oggetto=${oggetto}`} className={btnSecondary}>
            Lascia una testimonianza
          </Link>
        </div>
      </Reveal>
    )
  }

  return (
    // Flex centrato invece di una griglia: con una o due testimonianze le
    // schede restano al centro invece di addossarsi a sinistra.
    <div className="flex flex-wrap justify-center gap-6">
      {voci.map((v, i) => (
        <Reveal
          key={`${v.autore}-${i}`}
          delay={i * 80}
          className="w-full md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
        >
          <figure className="h-full rounded-xl border border-white/[0.07] bg-brand-card p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]">
            <Quote size={20} className="mb-4 text-accento-1" aria-hidden="true" />
            <blockquote className="mb-5 text-guida italic text-white/80">«{v.testo}»</blockquote>
            <figcaption>
              <span className="block text-etichetta text-white">{v.autore}</span>
              {v.ruolo && <span className="text-micro text-white/50">{v.ruolo}</span>}
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  )
}
