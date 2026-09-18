import type { ReactNode } from 'react'
import Reveal from '../motion/Reveal'
import Magnetic from '../motion/Magnetic'
import { Eyebrow, Guida } from './Typography'

/**
 * Riquadro in evidenza, usato per missione, manifesto e presentazione FantADSico.
 * Un filetto pieno in alto al posto del fondo sfumato: si legge come una pagina
 * impaginata, non come un riquadro promozionale.
 */
export function HighlightPanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-12">
        <span aria-hidden="true" className="absolute left-0 top-0 h-[3px] w-24 bg-accento-1" />
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mb-4 max-w-2xl text-titolo text-white text-balance">{title}</h2>
        <Guida>{children}</Guida>
      </div>
    </Reveal>
  )
}

/**
 * Il richiamo finale chiudeva sei pagine con lo stesso identico markup
 * copiato: qui e' un componente solo, cosi' resta coerente ovunque. E' anche
 * l'unico blocco centrato rimasto, per distinguerlo dal resto della pagina.
 */
export function CtaBanner({ title, action }: { title: string; action: ReactNode }) {
  return (
    <section className="border-t border-white/[0.08] bg-brand-soft px-5 py-20 text-center sm:px-8 sm:py-24">
      <Reveal>
        <span aria-hidden="true" className="mx-auto mb-7 block h-[3px] w-12 bg-accento-1" />
        <h2 className="mx-auto mb-7 max-w-2xl text-titolo text-white text-balance">{title}</h2>
        <Magnetic>{action}</Magnetic>
      </Reveal>
    </section>
  )
}
