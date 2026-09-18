import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Reveal from '../components/motion/Reveal'
import { btnPrimary, btnSecondary, gradientText } from '../components/ui'

/**
 * Senza una rotta di riserva qualsiasi indirizzo sbagliato lasciava la pagina
 * completamente bianca: nessun messaggio e nessun modo di tornare indietro.
 */
export default function NonTrovata() {
  return (
    <section className="fondo-testata flex min-h-[80svh] items-center justify-center px-5 pb-16 pt-28 text-center sm:px-8 sm:pt-36">
      <Reveal variant="scale" className="max-w-lg">
        <div className="mx-auto mb-6 h-14 w-14 grid place-items-center rounded-lg border border-accento-1/25 bg-accento-1/[0.08] text-accento-1">
          <Compass size={24} aria-hidden="true" />
        </div>
        <p className="mb-3 text-occhiello uppercase text-accento-1">
          Errore 404
        </p>
        <h1 className="mb-5 text-display text-white text-balance">
          <span className="block">Questa pagina</span>
          <span className={`block ${gradientText}`}>non esiste</span>
        </h1>
        <p className="mb-8 text-guida text-white/60 text-pretty">
          L’indirizzo che hai aperto non corrisponde a nessuna pagina del sito. Può darsi che il link
          fosse sbagliato o che la pagina sia stata spostata.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className={btnPrimary}>
            Torna alla home
          </Link>
          <Link to="/contatti" className={btnSecondary}>
            Scrivici
          </Link>
        </div>
      </Reveal>
    </section>
  )
}
