import type { ReactNode } from 'react'
import Reveal from '../motion/Reveal'
import { Eyebrow } from './Typography'

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
      <div className="rounded-2xl border border-brand-yellow/20 bg-gradient-to-br from-brand-yellow/[0.08] to-brand-red/[0.08] p-7 text-center sm:p-10 lg:p-12">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mb-4 text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-3xl md:text-4xl text-balance">
          {title}
        </h2>
        <p className="text-base text-white/60 sm:text-lg text-pretty">{children}</p>
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
    <section className="bg-gradient-to-br from-brand-yellow/[0.08] to-brand-red/[0.1] px-5 py-14 text-center sm:px-8 sm:py-16">
      <Reveal>
        <h2 className="mx-auto mb-6 max-w-2xl text-xl font-extrabold tracking-[-0.03em] text-white sm:text-2xl md:text-3xl text-balance">
          {title}
        </h2>
        {action}
      </Reveal>
    </section>
  )
}
