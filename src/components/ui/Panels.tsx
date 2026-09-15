import type { ReactNode } from 'react'
import Reveal from '../motion/Reveal'
import Magnetic from '../motion/Magnetic'
import { Eyebrow, Guida } from './Typography'

/** Riquadro in evidenza, usato per missione, manifesto e presentazione FantADSico. */
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
    <Reveal variant="scale">
      <div className="rounded-2xl border border-brand-yellow/20 bg-gradient-to-br from-brand-yellow/[0.08] to-brand-red/[0.08] p-8 text-center sm:p-12">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mb-4 text-titolo text-white text-balance">{title}</h2>
        <Guida className="mx-auto">{children}</Guida>
      </div>
    </Reveal>
  )
}

/**
 * Il richiamo finale chiudeva sei pagine con lo stesso identico markup
 * copiato: qui e' un componente solo, cosi' resta coerente ovunque.
 */
export function CtaBanner({ title, action }: { title: string; action: ReactNode }) {
  return (
    <section className="bg-gradient-to-br from-brand-yellow/[0.08] to-brand-red/[0.1] px-5 py-16 text-center sm:px-8">
      <Reveal>
        <h2 className="mx-auto mb-7 max-w-2xl text-titolo text-white text-balance">{title}</h2>
        <Magnetic>{action}</Magnetic>
      </Reveal>
    </section>
  )
}
