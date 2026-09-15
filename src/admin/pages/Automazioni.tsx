import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Inbox,
  Info,
  KeyRound,
  LoaderCircle,
  Mail,
  Rocket,
  Send,
  Settings2,
  ShieldCheck,
  X,
  type LucideIcon,
} from 'lucide-react'
import impostazioni from '../../content/dati/automazioni.json'
import Modifiche from '../components/Modifiche'
import { Avviso, Pillola, Scheda, TitoloPagina, anello, pulsanteLeggero, pulsanteSecondario, type Tono } from '../components/ui'
import { useAccesso } from '../lib/accesso'
import { LOCALE } from '../lib/ambiente'
import { VISTA_IMPOSTAZIONI_AUTOMAZIONI, controllaContenuti, faseIniziative, vistaFile, type Livello } from '../lib/contenuti'
import { giornoBreve, tempoFa } from '../lib/formato'
import { inviaApi, useApi } from '../lib/servizi'

/* ------------------------------------------------------------------ tipi */

type Servizi = { accesso: boolean; statistiche: boolean; email: boolean; dominioEmail: boolean; pianificazione: boolean }
type Esecuzione = { quando: string; esito: 'ok' | 'errore' | 'saltata'; dettaglio: string }
type StatoServer = { servizi: Servizi; ultime: Record<string, Esecuzione> }

type StatoAutomazione = 'attiva' | 'in-pausa' | 'da-configurare' | 'sconosciuto'

const PILLOLA_STATO: Record<StatoAutomazione, { tono: Tono; testo: string }> = {
  attiva: { tono: 'ok', testo: 'Attiva' },
  'in-pausa': { tono: 'neutro', testo: 'In pausa' },
  'da-configurare': { tono: 'attenzione', testo: 'Da configurare' },
  sconosciuto: { tono: 'neutro', testo: 'Si verifica online' },
}

const TONO_LIVELLO: Record<Livello, Tono> = { critico: 'critico', attenzione: 'attenzione', info: 'neutro' }
const NOME_LIVELLO: Record<Livello, string> = { critico: 'Importante', attenzione: 'Da vedere', info: 'Suggerimento' }

/* -------------------------------------------------------------- mattoni */

function Requisito({ ok, nome, children }: { ok: boolean | null; nome: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-micro">
      <span
        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
          ok === null ? 'bg-white/10 text-white/40' : ok ? 'bg-emerald-400/15 text-emerald-300' : 'bg-accento-1/15 text-accento-1'
        }`}
      >
        {ok === null ? <Info size={10} /> : ok ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
      </span>
      <span className="text-white/60">
        <code className="rounded bg-white/[0.06] px-1 py-px text-[12px] text-white/85">{nome}</code> {children}
      </span>
    </li>
  )
}

function Automazione({
  id,
  Icon,
  nome,
  quando,
  stato,
  descrizione,
  children,
  ultima,
  azioni,
}: {
  id: string
  Icon: LucideIcon
  nome: string
  quando: string
  stato: StatoAutomazione
  descrizione: ReactNode
  children?: ReactNode
  ultima?: Esecuzione
  azioni?: ReactNode
}) {
  return (
    <section id={id} className="entrata scroll-mt-24 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#151515]">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:p-6">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
            stato === 'attiva' ? 'fondo-gradiente text-black' : 'border border-white/10 bg-white/[0.03] text-white/50'
          }`}
        >
          <Icon size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <h2 className="text-sottotitolo text-white">{nome}</h2>
            <Pillola tono={PILLOLA_STATO[stato].tono} punto>
              {PILLOLA_STATO[stato].testo}
            </Pillola>
          </div>
          <p className="mb-1 flex items-center gap-1.5 text-meta text-white/40">
            <Clock size={12} aria-hidden="true" />
            {quando}
          </p>
          <p className="max-w-2xl text-micro text-white/55">{descrizione}</p>
        </div>
        {azioni && <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">{azioni}</div>}
      </div>

      {children && <div className="border-t border-white/[0.06] px-5 py-5 sm:px-6">{children}</div>}

      {ultima && (
        <p className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] bg-white/[0.015] px-5 py-3 text-meta font-normal text-white/45 sm:px-6">
          <span className={`h-1.5 w-1.5 rounded-full ${ultima.esito === 'ok' ? 'bg-emerald-400' : ultima.esito === 'errore' ? 'bg-accento-2' : 'bg-white/30'}`} />
          Ultima esecuzione {tempoFa(ultima.quando)} — {ultima.dettaglio}
        </p>
      )}
    </section>
  )
}

function PulsanteProva({ azione, disabilitato }: { azione: string; disabilitato: boolean }) {
  const { utente } = useAccesso()
  const [stato, setStato] = useState<{ fase: 'pronto' | 'invio' | 'fatto' | 'errore'; testo?: string }>({ fase: 'pronto' })

  const prova = async () => {
    setStato({ fase: 'invio' })
    try {
      const esito = await inviaApi<Esecuzione>('/api/automazioni', utente?.token, { azione })
      setStato({ fase: esito.esito === 'errore' ? 'errore' : 'fatto', testo: esito.dettaglio })
    } catch (errore) {
      setStato({ fase: 'errore', testo: errore instanceof Error ? errore.message : 'Non riuscito' })
    }
  }

  return (
    <div className="flex flex-col items-start gap-1.5 sm:items-end">
      <button
        type="button"
        onClick={prova}
        disabled={disabilitato || stato.fase === 'invio'}
        title={disabilitato ? (LOCALE ? 'Disponibile sul sito online' : 'Configura prima l’invio delle email') : undefined}
        className={`${pulsanteSecondario} !py-2 text-micro`}
      >
        {stato.fase === 'invio' ? <LoaderCircle size={14} className="animate-spin" /> : <Send size={14} />}
        Invia una prova
      </button>
      {stato.testo && (
        <span role="status" className={`text-meta font-normal ${stato.fase === 'errore' ? 'text-[#ff8a80]' : 'text-emerald-300'}`}>
          {stato.testo}
        </span>
      )}
    </div>
  )
}

function Variabile({ nome, descrizione, ok }: { nome: string; descrizione: string; ok: boolean | null }) {
  const [copiato, setCopiato] = useState(false)
  return (
    <tr className="border-t border-white/[0.06]">
      <td className="py-3 pr-4 align-top">
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(nome).then(() => {
              setCopiato(true)
              window.setTimeout(() => setCopiato(false), 1500)
            })
          }}
          className={`group inline-flex items-center gap-2 rounded-md bg-white/[0.05] px-2 py-1 font-mono text-[12px] text-white/90 hover:bg-white/[0.09] ${anello}`}
          title="Copia il nome"
        >
          {nome}
          {copiato ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} className="text-white/35 group-hover:text-white/70" />}
        </button>
      </td>
      <td className="py-3 pr-4 align-top text-micro text-white/55">{descrizione}</td>
      <td className="py-3 text-right align-top">
        {ok === null ? <span className="text-meta text-white/30">—</span> : ok ? <Pillola tono="ok">Presente</Pillola> : <Pillola tono="attenzione">Manca</Pillola>}
      </td>
    </tr>
  )
}

/* ------------------------------------------------------------------ pagina */

export default function Automazioni() {
  const { hash } = useLocation()
  const { esito } = useApi<StatoServer>('/api/stato')
  const server = esito.stato === 'ok' ? esito.dati : null
  const s = server?.servizi
  const conosciuto = (valore: boolean | undefined) => (s ? Boolean(valore) : null)

  useEffect(() => {
    if (!hash) return
    window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
  }, [hash])

  const controlli = controllaContenuti()
  const iniziative = faseIniziative()
  const giorniPrima = impostazioni.promemoriaScadenze.giorniPrima

  const statoCon = (requisiti: boolean[], attivo: boolean): StatoAutomazione =>
    !s ? 'sconosciuto' : requisiti.every(Boolean) ? (attivo ? 'attiva' : 'in-pausa') : 'da-configurare'

  const statoContatti = statoCon([s?.email ?? false], impostazioni.moduloContatti.attivo)
  const statoPromemoria = statoCon([s?.email ?? false, s?.pianificazione ?? false], impostazioni.promemoriaScadenze.attivo)
  const statoRiepilogo = statoCon([s?.email ?? false, s?.pianificazione ?? false], impostazioni.riepilogoSettimanale.attivo)

  const stati: StatoAutomazione[] = ['attiva', 'attiva', 'attiva', statoContatti, statoPromemoria, statoRiepilogo]
  const conteggio = (stato: StatoAutomazione) => stati.filter((x) => x === stato).length

  const impostazioniLink = (
    <Link to={`/contenuti/${VISTA_IMPOSTAZIONI_AUTOMAZIONI}`} className={`${pulsanteLeggero} text-micro`}>
      <Settings2 size={14} aria-hidden="true" />
      Impostazioni
    </Link>
  )

  // Prossime scadenze che finiranno nel promemoria: quelle entro i giorni di anticipo.
  const oggi = new Date()
  const limite = new Date(oggi.getTime() + giorniPrima * 86_400_000).toISOString().slice(0, 10)
  const oggiIso = oggi.toISOString().slice(0, 10)
  const prossime = iniziative.flatMap((i) => [
    ...(i.dal && i.dal >= oggiIso && i.dal <= limite ? [{ titolo: i.titolo, data: i.dal, tipo: 'entra in home' }] : []),
    ...(i.al && i.al >= oggiIso && i.al <= limite ? [{ titolo: i.titolo, data: i.al, tipo: 'esce dalla home' }] : []),
  ])

  return (
    <>
      <TitoloPagina
        occhiello="Automazioni"
        titolo="Il sito lavora da solo"
        descrizione="Quello che succede senza che nessuno debba ricordarselo: pubblicazione, programmazione della home, controlli ed email allo staff."
        azioni={
          <Link to={`/contenuti/${VISTA_IMPOSTAZIONI_AUTOMAZIONI}`} className={pulsanteSecondario}>
            <Settings2 size={16} aria-hidden="true" />
            Impostazioni
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <Pillola tono="ok" punto>
          {conteggio('attiva')} attive
        </Pillola>
        {conteggio('da-configurare') > 0 && (
          <Pillola tono="attenzione" punto>
            {conteggio('da-configurare')} da configurare
          </Pillola>
        )}
        {conteggio('in-pausa') > 0 && (
          <Pillola tono="neutro" punto>
            {conteggio('in-pausa')} in pausa
          </Pillola>
        )}
        {conteggio('sconosciuto') > 0 && <Pillola tono="neutro">{conteggio('sconosciuto')} verificabili online</Pillola>}
      </div>

      {LOCALE && (
        <div className="mb-6">
          <Avviso tono="neutro" Icon={Info} titolo="Stai usando il pannello in locale">
            Le automazioni via email girano su Vercel: qui vedi come sono impostate, mentre stato ed esecuzioni si controllano sul sito online.
          </Avviso>
        </div>
      )}
      {esito.stato === 'errore' && (
        <div className="mb-6">
          <Avviso tono="critico" Icon={Info} titolo="Impossibile leggere lo stato dei servizi">
            {esito.messaggio}
          </Avviso>
        </div>
      )}

      <div className="space-y-5">
        <Automazione
          id="pubblicazione"
          Icon={Rocket}
          nome="Pubblicazione automatica"
          quando="A ogni salvataggio"
          stato="attiva"
          descrizione="Quando salvi una modifica nell'editor, il sito viene ricostruito e pubblicato da Vercel in circa un minuto. Qui sotto vedi quando una modifica è davvero online."
        >
          <Modifiche quante={5} />
        </Automazione>

        <Automazione
          id="programmazione"
          Icon={CalendarClock}
          nome="Programmazione della home"
          quando="In tempo reale, a ogni visita"
          stato="attiva"
          descrizione="Le iniziative “In evidenza” compaiono dalla data di inizio e spariscono dopo quella di fine. In home ne restano al massimo tre, in ordine di priorità."
          azioni={
            <Link to={`/contenuti/${vistaFile('associazione', 'evidenza')}`} className={`${pulsanteLeggero} text-micro`}>
              Modifica le iniziative <ArrowRight size={14} aria-hidden="true" />
            </Link>
          }
        >
          <ol className="space-y-2">
            {iniziative.map((i) => (
              <li key={i.titolo} className="grid gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="truncate text-etichetta text-white">{i.titolo}</p>
                  <p className="text-meta font-normal text-white/40">
                    {i.dal ? `dal ${giornoBreve(i.dal)}` : 'da sempre'} · {i.al ? `al ${giornoBreve(i.al)}` : 'senza scadenza'} · priorità {i.priorita}
                  </p>
                </div>
                <div>
                  {i.inHome && <Pillola tono="ok" punto>In home</Pillola>}
                  {i.inCoda && <Pillola tono="neutro">In coda: ce ne sono già tre</Pillola>}
                  {i.fase === 'in-arrivo' && <Pillola tono="attenzione">In arrivo</Pillola>}
                  {i.fase === 'terminata' && <Pillola tono="neutro">Terminata</Pillola>}
                </div>
              </li>
            ))}
          </ol>
        </Automazione>

        <Automazione
          id="controllo-contenuti"
          Icon={ShieldCheck}
          nome="Controllo dei contenuti"
          quando="A ogni pubblicazione"
          stato="attiva"
          descrizione="Verifica recapiti, iniziative, testimonianze, domande frequenti e indirizzi brevi, e segnala cosa manca o rischia di dare un'impressione sbagliata."
        >
          {controlli.length ? (
            <ul className="divide-y divide-white/[0.06]">
              {controlli.map((c) => (
                <li key={c.id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4">
                  <span className="w-28 shrink-0">
                    <Pillola tono={TONO_LIVELLO[c.livello]} punto>
                      {NOME_LIVELLO[c.livello]}
                    </Pillola>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-micro font-semibold text-white">{c.titolo}</span>
                    <span className="block text-meta font-normal text-white/45">{c.dettaglio}</span>
                  </span>
                  {c.vista && (
                    <Link to={`/contenuti/${c.vista}`} className={`${pulsanteLeggero} shrink-0 self-start text-micro sm:self-center`}>
                      Correggi <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex items-center gap-2 text-micro text-emerald-300">
              <CheckCircle2 size={16} /> Nessun problema trovato.
            </p>
          )}
        </Automazione>

        <Automazione
          id="modulo-contatti"
          Icon={Inbox}
          nome="Richieste dal modulo contatti"
          quando="A ogni richiesta"
          stato={statoContatti}
          descrizione={
            <>
              Ogni messaggio inviato dalla pagina Contatti arriva via email allo staff, con l'argomento nell'oggetto: basta rispondere per scrivere a chi l'ha inviato.
              {impostazioni.moduloContatti.rispostaAutomatica
                ? ' Chi scrive riceve anche una conferma automatica.'
                : ' La conferma automatica a chi scrive è disattivata.'}
            </>
          }
          ultima={server?.ultime.moduloContatti}
          azioni={impostazioniLink}
        >
          <ul className="space-y-2">
            <Requisito ok={conosciuto(s?.email)} nome="RESEND_API_KEY + EMAIL_STAFF">
              servizio di invio e indirizzi dello staff che ricevono le richieste
            </Requisito>
            <Requisito ok={conosciuto(s?.dominioEmail)} nome="EMAIL_MITTENTE">
              facoltativo: mittente con il dominio dell'associazione, necessario per la conferma a chi scrive
            </Requisito>
          </ul>
        </Automazione>

        <Automazione
          id="promemoria"
          Icon={BellRing}
          nome="Promemoria delle scadenze"
          quando="Ogni mattina"
          stato={statoPromemoria}
          descrizione={`Avvisa lo staff via email ${giorniPrima} giorni prima che un'iniziativa entri o esca dalla home, e il giorno stesso.`}
          ultima={server?.ultime.promemoriaScadenze}
          azioni={
            <>
              {impostazioniLink}
              <PulsanteProva azione="promemoriaScadenze" disabilitato={!s?.email} />
            </>
          }
        >
          <p className="mb-2 text-meta text-white/40">Nei prossimi {giorniPrima} giorni</p>
          {prossime.length ? (
            <ul className="space-y-1.5">
              {prossime.map((p) => (
                <li key={`${p.titolo}-${p.tipo}`} className="text-micro text-white/70">
                  <strong className="text-white">{p.titolo}</strong> {p.tipo} il {giornoBreve(p.data)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-micro text-white/50">Nessuna scadenza: il promemoria non partirà.</p>
          )}
        </Automazione>

        <Automazione
          id="riepilogo"
          Icon={Mail}
          nome="Riepilogo settimanale"
          quando="Ogni lunedì mattina"
          stato={statoRiepilogo}
          descrizione="Un'email con visite e richieste della settimana, il confronto con quella precedente, le pagine più viste, le iniziative in home e le testimonianze in attesa."
          ultima={server?.ultime.riepilogoSettimanale}
          azioni={
            <>
              {impostazioniLink}
              <PulsanteProva azione="riepilogoSettimanale" disabilitato={!s?.email} />
            </>
          }
        />

        <Scheda
          id="configurazione"
          titolo="Configurazione su Vercel"
          descrizione="Project → Settings → Environment Variables. Dopo averle aggiunte serve un nuovo deploy."
          Icon={KeyRound}
        >
          <div className="-mx-1 overflow-x-auto px-1">
            <table className="w-full min-w-[34rem] text-left">
              <thead>
                <tr className="text-meta text-white/35">
                  <th className="pb-2 font-semibold">Variabile</th>
                  <th className="pb-2 font-semibold">A cosa serve</th>
                  <th className="pb-2 text-right font-semibold">Stato</th>
                </tr>
              </thead>
              <tbody>
                <Variabile nome="GITHUB_CLIENT_ID" descrizione="Accesso al pannello con GitHub (anche GITHUB_CLIENT_SECRET)" ok={conosciuto(s?.accesso)} />
                <Variabile nome="KV_REST_API_URL" descrizione="Archivio delle statistiche: si aggiunge da Vercel → Storage → Upstash Redis (anche KV_REST_API_TOKEN)" ok={conosciuto(s?.statistiche)} />
                <Variabile nome="RESEND_API_KEY" descrizione="Invio delle email, da resend.com (gratuito fino a 3.000 al mese)" ok={conosciuto(s?.email)} />
                <Variabile nome="EMAIL_STAFF" descrizione="Chi riceve richieste e promemoria; più indirizzi separati da virgola" ok={conosciuto(s?.email)} />
                <Variabile nome="EMAIL_MITTENTE" descrizione="Facoltativo, es. FantaEsagonale <info@dominio.it>" ok={conosciuto(s?.dominioEmail)} />
                <Variabile nome="CRON_SECRET" descrizione="Protegge le automazioni pianificate: una stringa lunga e casuale" ok={conosciuto(s?.pianificazione)} />
              </tbody>
            </table>
          </div>
        </Scheda>
      </div>
    </>
  )
}
