import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, ClipboardList, FileText, Mail, Pin } from 'lucide-react'
import { FeatureCard, SectionHead } from '../components/ui'

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-brand-soft border border-white/15 text-white text-sm outline-none transition-colors focus:border-brand-yellow'

export default function AreaSoci() {
  const [feedback, setFeedback] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFeedback(
      "Accesso non ancora attivo: l'Area Soci richiede un sistema di autenticazione da collegare (backend/database soci).",
    )
  }

  return (
    <>
      <section className="min-h-[70vh] flex items-center justify-center px-6 pt-32 pb-16 bg-[radial-gradient(circle_at_20%_20%,rgba(252,215,12,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(230,26,26,0.14),transparent_50%)]">
        <div className="w-full max-w-md bg-brand-card border border-white/[0.08] rounded-2xl p-10 shadow-2xl shadow-black/40">
          <h1 className="text-2xl font-playfair italic text-white text-center mb-1.5">Area Soci</h1>
          <p className="text-center text-white/50 text-sm mb-8">
            Accesso riservato ai soci FantaEsagonale.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="utente" className="block text-sm font-semibold text-white/60 mb-2">
                Email o username
              </label>
              <input id="utente" name="utente" type="text" required className={inputClass} />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold text-white/60 mb-2">
                Password / codice
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full px-7 py-3.5 text-sm font-semibold text-black bg-gradient-to-r from-brand-yellow to-brand-red transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-red/30"
            >
              Accedi
            </button>

            {feedback && (
              <div className="mt-5 rounded-xl bg-brand-yellow/10 text-brand-yellow text-sm px-4 py-3.5">
                {feedback}
              </div>
            )}
          </form>

          <div className="flex justify-between text-sm mt-4">
            <a href="#" className="text-white/50 hover:text-brand-yellow transition-colors">
              Password dimenticata?
            </a>
            <Link to="/contatti" className="text-white/50 hover:text-brand-yellow transition-colors">
              Richiedi accesso
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-brand-soft">
        <div className="max-w-6xl mx-auto">
          <SectionHead
            eyebrow="Cosa trovi nell'Area Soci"
            title="Contenuti riservati ai membri"
            subtitle="Da definire nel dettaglio insieme al cliente."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard Icon={BarChart3} title="Classifiche fantacalcio">
              Classifiche aggiornate del Fantacalcio al Listone.
            </FeatureCard>
            <FeatureCard Icon={FileText} title="Regolamenti e documenti">
              Regolamenti ufficiali e documentazione dei tornei.
            </FeatureCard>
            <FeatureCard Icon={Pin} title="Bacheca interna">
              Comunicazioni interne per tutti i soci.
            </FeatureCard>
            <FeatureCard Icon={ClipboardList} title="Gestione tornei">
              Iscrizione e gestione della partecipazione ai tornei.
            </FeatureCard>
            <FeatureCard Icon={Mail} title="Newsletter dedicata">
              <span className="italic text-white/35">Eventuale, da valutare con il cliente.</span>
            </FeatureCard>
          </div>
        </div>
      </section>
    </>
  )
}
