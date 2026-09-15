import { ArrowLeft, Github, LoaderCircle, ShieldAlert } from 'lucide-react'
import { useAccesso } from '../lib/accesso'
import { SITO } from '../lib/ambiente'
import { anello, pulsantePrimario, pulsanteSecondario } from '../components/ui'

/**
 * Schermata di accesso. Non ci sono password del sito: si entra con il
 * proprio account GitHub, e l'accesso si concede o si toglie aggiungendo o
 * rimuovendo la persona tra i collaboratori del repository.
 */
export default function Accesso() {
  const { stato, accedi, esci } = useAccesso()

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[38%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accento-1/[0.07] blur-[120px]" />
        <div className="absolute left-[62%] top-[58%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accento-2/[0.08] blur-[120px]" />
      </div>

      <main className="entrata relative w-full max-w-md">
        <div className="rounded-3xl border border-white/[0.08] bg-[#121212]/90 p-8 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] backdrop-blur sm:p-10">
          <img src="/img/logo-trasparente.png" alt="FantaEsagonale" className="mx-auto mb-7 h-20 w-20 object-contain" />
          <p className="mb-2 text-center text-occhiello uppercase text-accento-1">Area riservata</p>
          <h1 className="mb-3 text-center font-display text-[1.9rem] font-extrabold leading-tight tracking-tight text-white">
            Gestione del sito
          </h1>

          {stato.fase === 'negato' ? (
            <>
              <div className="mb-6 mt-6 flex gap-3 rounded-2xl border border-accento-2/30 bg-accento-2/[0.07] p-4">
                <ShieldAlert size={20} className="mt-0.5 shrink-0 text-[#ff8a80]" aria-hidden="true" />
                <p className="text-micro text-white/75">
                  L'account <strong className="text-white">@{stato.login}</strong> non ha il permesso di modificare il sito.
                  Chiedi a un amministratore di aggiungerti tra i collaboratori del repository.
                </p>
              </div>
              <button type="button" onClick={esci} className={`${pulsanteSecondario} w-full`}>
                Usa un altro account
              </button>
            </>
          ) : (
            <>
              <p className="mb-8 text-center text-corpo text-white/55">
                Accedi con il tuo account GitHub per modificare i contenuti, vedere le statistiche e gestire le automazioni.
              </p>
              {stato.fase === 'ospite' && stato.errore && (
                <p role="alert" className="mb-5 rounded-xl border border-accento-2/30 bg-accento-2/[0.07] px-4 py-3 text-micro text-white/80">
                  {stato.errore}
                </p>
              )}
              <button type="button" onClick={accedi} disabled={stato.fase === 'verifica'} className={`${pulsantePrimario} w-full !py-3`}>
                {stato.fase === 'verifica' ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
                    Verifica in corso…
                  </>
                ) : (
                  <>
                    <Github size={18} aria-hidden="true" />
                    Accedi con GitHub
                  </>
                )}
              </button>
              <p className="mt-5 text-center text-meta font-normal text-white/35">
                Possono entrare solo i collaboratori autorizzati.
              </p>
            </>
          )}
        </div>

        <a href={SITO} className={`mx-auto mt-6 flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-micro text-white/45 hover:text-white ${anello}`}>
          <ArrowLeft size={14} aria-hidden="true" />
          Torna al sito
        </a>
      </main>
    </div>
  )
}
