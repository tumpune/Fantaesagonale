import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Reveal from '../components/motion/Reveal'
import { btnPrimary, btnSecondary } from '../components/ui'

/**
 * Senza una rotta di riserva qualsiasi indirizzo sbagliato lasciava la pagina
 * completamente bianca: nessun messaggio e nessun modo di tornare indietro.
 */
export default function NonTrovata() {
  return (
    <section className="flex min-h-[80svh] items-center justify-center px-5 pb-16 pt-28 text-center sm:px-8 sm:pt-36 bg-[radial-gradient(circle_at_20%_20%,rgba(252,215,12,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(230,26,26,0.14),transparent_50%)]">
      <Reveal variant="scale" className="max-w-lg">
        <div className="card-icon mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-yellow to-brand-red text-black">
          <Compass size={30} aria-hidden="true" />
        </div>
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-brand-yellow">
          Errore 404
        </p>
        <h1 className="mb-4 leading-[0.95] text-white">
          <span
            className="block font-playfair text-3xl font-normal italic sm:text-5xl"
            style={{ letterSpacing: '-0.05em' }}
          >
            Questa pagina
          </span>
          <span
            className="-mt-1 block text-3xl font-normal sm:text-5xl"
            style={{ letterSpacing: '-0.06em' }}
          >
            non esiste
          </span>
        </h1>
        <p className="mb-8 text-base text-white/60 text-pretty">
          L'indirizzo che hai aperto non corrisponde a nessuna pagina del sito. Può darsi che il link
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
