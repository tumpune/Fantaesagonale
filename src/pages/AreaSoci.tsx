import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/motion/Reveal'
import { MEMBER_FEATURES } from '../content/sezioni'
import { FeatureCard, Section, SectionHead, btnPrimary } from '../components/ui'

const inputClass =
  'w-full rounded-xl border border-white/15 bg-brand-soft px-4 py-3 text-sm text-white transition-all duration-300 hover:border-white/25 focus:border-brand-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow'

const labelClass = 'mb-2 block text-sm font-semibold text-white/70'

export default function AreaSoci() {
  const [feedback, setFeedback] = useState('')
  const [checking, setChecking] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setChecking(true)
    setFeedback('')
    setTimeout(() => {
      setChecking(false)
      setFeedback(
        "L'accesso non è ancora attivo. Scrivici dalla pagina contatti per ricevere le credenziali quando l'area sarà aperta.",
      )
    }, 700)
  }

  return (
    <>
      <section className="flex min-h-[70svh] items-center justify-center px-5 pb-16 pt-28 sm:px-8 sm:pt-36 bg-[radial-gradient(circle_at_20%_20%,rgba(252,215,12,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(230,26,26,0.14),transparent_50%)]">
        <Reveal variant="scale" className="w-full max-w-md">
          <div className="rounded-2xl border border-white/[0.08] bg-brand-card p-6 shadow-2xl shadow-black/40 sm:p-8 lg:p-10">
            <h1 className="mb-1.5 text-center font-playfair text-2xl italic text-white">
              Area Soci
            </h1>
            <p className="mb-8 text-center text-sm text-white/50">
              Accesso riservato ai soci FantaEsagonale.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="utente" className={labelClass}>
                  Email o username
                </label>
                <input
                  id="utente"
                  name="utente"
                  type="text"
                  required
                  autoComplete="username"
                  className={inputClass}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className={labelClass}>
                  Password / codice
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={checking}
                className={`${btnPrimary} w-full text-center disabled:cursor-wait disabled:opacity-70`}
              >
                {checking ? 'Verifica in corso…' : 'Accedi'}
              </button>

              <div aria-live="polite">
                {feedback && (
                  <p className="reveal reveal-up is-visible mt-5 rounded-xl bg-brand-yellow/10 px-4 py-3.5 text-sm text-brand-yellow">
                    {feedback}
                  </p>
                )}
              </div>
            </form>

            <p className="mt-5 text-center text-sm text-white/50">
              Non hai le credenziali?{' '}
              <Link to="/contatti" className="link-underline text-brand-yellow">
                Richiedi accesso
              </Link>
            </p>
          </div>
        </Reveal>
      </section>

      <Section alt>
        <SectionHead
          eyebrow="Cosa trovi nell'Area Soci"
          title="Contenuti riservati ai membri"
          subtitle="L'area è in preparazione: ecco cosa ci sarà."
        />
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {MEMBER_FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 90}>
              <FeatureCard Icon={feature.Icon} title={feature.title}>
                {feature.text}
              </FeatureCard>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  )
}
