import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Reveal from '../components/motion/Reveal'
import { CONTATTI } from '../content/sezioni'
import { OGGETTI_CONTATTO } from '../content/navigazione'
import { PageHero, Section, btnPrimary, focusRing } from '../components/ui'

const inputClass =
  'w-full rounded-xl border border-white/15 bg-brand-soft px-4 py-3 text-corpo text-white transition-all duration-300 hover:border-white/25 focus:border-accento-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accento-1'

const labelClass = 'mb-2 block text-etichetta text-white/75'

/** Messaggi per chi scrive, a partire dagli errori restituiti da api/contatto. */
const ERRORI_INVIO: Record<string, string> = {
  'campi-non-validi': 'Controlla i campi: il messaggio deve contenere almeno 10 caratteri.',
  'troppe-richieste': 'Hai inviato diverse richieste in poco tempo. Riprova tra un’ora.',
  'non-configurato': 'Il modulo non è ancora attivo. Nel frattempo puoi contattarci sui nostri canali.',
  'in-pausa': 'Il modulo è momentaneamente sospeso. Nel frattempo puoi contattarci sui nostri canali.',
  generico: 'Invio non riuscito. Riprova tra qualche minuto.',
}

export default function Contatti() {
  const [params] = useSearchParams()
  // Chi arriva dalla pagina di un ramo trova l'argomento gia' scelto: la
  // richiesta parte indirizzata al progetto giusto (questionario 5.1).
  const richiesto = params.get('oggetto') ?? 'generale'
  const oggettoIniziale = OGGETTI_CONTATTO.some((o) => o.valore === richiesto) ? richiesto : 'generale'

  const [esito, setEsito] = useState<{ tipo: 'ok' | 'errore'; testo: string } | null>(null)
  const [invio, setInvio] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const campi = new FormData(form)
    const oggetto = String(campi.get('oggetto'))
    setInvio(true)
    setEsito(null)

    try {
      const risposta = await fetch('/api/contatto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oggetto,
          argomento: OGGETTI_CONTATTO.find((o) => o.valore === oggetto)?.etichetta,
          nome: campi.get('nome'),
          email: campi.get('email'),
          telefono: campi.get('telefono'),
          messaggio: campi.get('messaggio'),
          privacy: campi.get('privacy') === 'on',
          sito: campi.get('sito'),
        }),
      })
      const dati = (await risposta.json().catch(() => ({}))) as { errore?: string }
      if (risposta.ok) {
        setEsito({ tipo: 'ok', testo: 'Grazie! Abbiamo ricevuto il tuo messaggio e ti risponderemo il prima possibile.' })
        form.reset()
      } else {
        setEsito({ tipo: 'errore', testo: ERRORI_INVIO[dati.errore ?? ''] ?? ERRORI_INVIO.generico })
      }
    } catch {
      setEsito({ tipo: 'errore', testo: 'Connessione non riuscita: controlla la rete e riprova.' })
    } finally {
      setInvio(false)
    }
  }

  return (
    <>
      <PageHero eyebrow="Contatti" title="Parliamo" highlight="insieme">
        Hai una domanda, un evento da organizzare o un progetto da proporci? Scegli l'argomento e
        scrivici: la tua richiesta arriverà alla persona giusta.
      </PageHero>

      <Section alt>
        <div className="grid items-start gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Reveal variant="left">
            <div className="rounded-2xl border border-white/[0.08] bg-brand-card p-6 sm:p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="relative">
                <div className="mb-5">
                  <label htmlFor="oggetto" className={labelClass}>
                    Argomento
                  </label>
                  <select
                    id="oggetto"
                    name="oggetto"
                    className={inputClass}
                    defaultValue={oggettoIniziale}
                    key={oggettoIniziale}
                  >
                    {OGGETTI_CONTATTO.map((o) => (
                      <option key={o.valore} value={o.valore}>
                        {o.etichetta}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-x-5 sm:grid-cols-2">
                  <div className="mb-5">
                    <label htmlFor="nome" className={labelClass}>
                      Nome e cognome
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      required
                      autoComplete="name"
                      className={inputClass}
                    />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="email" className={labelClass}>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label htmlFor="telefono" className={labelClass}>
                    Telefono <span className="font-normal text-white/60">(facoltativo)</span>
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    className={inputClass}
                  />
                </div>

                {/* Campo trappola per i programmi che compilano i moduli in
                    automatico: invisibile e fuori dalla navigazione da tastiera. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="sito">Sito web</label>
                  <input id="sito" name="sito" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="mb-6">
                  <label htmlFor="messaggio" className={labelClass}>
                    Messaggio
                  </label>
                  <textarea
                    id="messaggio"
                    name="messaggio"
                    required
                    minLength={10}
                    maxLength={4000}
                    rows={5}
                    className={`${inputClass} resize-y`}
                  />
                </div>

                {/* Il modulo raccoglie nome, email e telefono: il GDPR richiede
                    che chi scrive sia informato e dia il consenso prima dell'invio. */}
                <label className="mb-7 flex cursor-pointer items-start gap-3 text-micro text-white/65">
                  <input
                    type="checkbox"
                    name="privacy"
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(var(--accento-1))]"
                  />
                  <span>
                    Ho letto l'
                    <Link to="/privacy" className="link-underline text-accento-1">
                      informativa sulla privacy
                    </Link>{' '}
                    e acconsento al trattamento dei miei dati per ricevere una risposta.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={invio}
                  className={`${btnPrimary} w-full text-center disabled:cursor-wait disabled:opacity-70`}
                >
                  {invio ? 'Invio in corso…' : 'Invia messaggio'}
                </button>

                <div aria-live="polite">
                  {esito && (
                    <p
                      className={`entrata-messaggio mt-5 rounded-xl px-4 py-3.5 text-corpo ${
                        esito.tipo === 'ok' ? 'bg-accento-1/10 text-accento-1' : 'bg-accento-2/10 text-white'
                      }`}
                    >
                      {esito.testo}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </Reveal>

          <ul className="grid gap-3">
            {CONTATTI.map(({ Icon, titolo, testo, disponibile, href }, i) => {
              const contenuto = (
                <>
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                      disponibile
                        ? 'bg-gradient-to-br from-accento-1 to-accento-2 text-black'
                        : 'border border-white/10 text-white/55'
                    }`}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-etichetta text-white">{titolo}</span>
                    <span
                      className={`block break-words text-micro ${disponibile ? 'text-white/70' : 'text-white/55'}`}
                    >
                      {testo}
                    </span>
                  </span>
                </>
              )
              const scheda = 'flex items-center gap-4 rounded-xl border border-white/[0.06] bg-brand-card p-4'

              return (
                <Reveal key={titolo} as="li" variant="right" delay={i * 60}>
                  {href ? (
                    // I recapiti diventano cliccabili solo quando lo staff li inserisce.
                    <a
                      href={href}
                      {...(href.startsWith('https:') ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className={`card-hover ${scheda} hover:border-accento-1/40 ${focusRing}`}
                    >
                      {contenuto}
                    </a>
                  ) : (
                    <div className={scheda}>{contenuto}</div>
                  )}
                </Reveal>
              )
            })}
          </ul>
        </div>
      </Section>
    </>
  )
}
