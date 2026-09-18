import { Component, type ErrorInfo, type ReactNode } from 'react'
import { btnPrimary, btnSecondary } from './ui/styles'

/**
 * Rete di sicurezza attorno alle pagine.
 *
 * I contenuti arrivano da file modificabili dal pannello: un campo tolto per
 * sbaglio potrebbe far fallire la resa di una pagina. Senza questa rete il
 * visitatore vedrebbe una schermata bianca; cosi' vede un messaggio chiaro e
 * un modo per tornare indietro, e il resto del sito resta raggiungibile.
 */
type Stato = { errore: Error | null }

export default class SchermoErrore extends Component<{ children: ReactNode }, Stato> {
  state: Stato = { errore: null }

  static getDerivedStateFromError(errore: Error): Stato {
    return { errore }
  }

  componentDidCatch(errore: Error, dettagli: ErrorInfo) {
    // Resta negli strumenti per sviluppatori del browser: serve a capire quale
    // contenuto ha causato il problema.
    console.error('Pagina non visualizzabile:', errore, dettagli.componentStack)
  }

  render() {
    if (!this.state.errore) return this.props.children

    return (
      <section className="fondo-testata flex min-h-[70svh] items-center justify-center px-5 py-24 text-center">
        <div className="max-w-md">
          <p className="mb-3 text-occhiello uppercase text-accento-1">Contenuto non disponibile</p>
          <h1 className="mb-5 text-titolo text-white text-balance">Questa pagina non si apre</h1>
          <p className="mb-8 text-guida text-white/60 text-pretty">
            Qualcosa nei contenuti impedisce di mostrarla. Il resto del sito funziona: puoi tornare
            alla home o riprovare fra poco.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/"
              className={btnPrimary}
            >
              Torna alla home
            </a>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={btnSecondary}
            >
              Ricarica la pagina
            </button>
          </div>
        </div>
      </section>
    )
  }
}
