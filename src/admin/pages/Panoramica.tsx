import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  GitCommitHorizontal,
  Hexagon,
  MousePointerClick,
  Plus,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { Scintilla } from '../components/Grafici'
import Modifiche from '../components/Modifiche'
import { Cifra, Pillola, Scheda, TitoloPagina, Vuoto, anello, pulsanteLeggero, pulsantePrimario, pulsanteSecondario } from '../components/ui'
import { useAccesso } from '../lib/accesso'
import { LOCALE, SITO } from '../lib/ambiente'
import {
  RIEPILOGO_CONTENUTI,
  VISTA_NUOVA_TESTIMONIANZA,
  VOCI_CONTENUTO,
  controllaContenuti,
  faseIniziative,
  vistaFile,
  type Livello,
} from '../lib/contenuti'
import { giornoBreve, numero, saluto, variazione } from '../lib/formato'
import { useApi } from '../lib/servizi'
import type { Statistiche } from '../lib/statistiche'

const COLORE_LIVELLO: Record<Livello, string> = {
  critico: 'bg-accento-2 shadow-[0_0_0_4px_rgb(var(--accento-2)/0.15)]',
  attenzione: 'bg-accento-1 shadow-[0_0_0_4px_rgb(var(--accento-1)/0.12)]',
  info: 'bg-white/30',
}

const COLORE_TEMA = { centrale: 'from-[#fcd70c] to-[#e61a1a]', oro: 'from-[#ecc96e] to-[#a87c24]', mono: 'from-white to-[#969696]' }

export default function Panoramica() {
  const { utente } = useAccesso()
  const { esito } = useApi<Statistiche>('/api/statistiche?giorni=7')
  const controlli = controllaContenuti()
  const daSistemare = controlli.filter((c) => c.livello !== 'info')
  const iniziative = faseIniziative()
  const inHome = iniziative.filter((i) => i.inHome)
  const inArrivo = iniziative.filter((i) => i.fase === 'in-arrivo')

  const oggi = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
  const nome = utente?.login === 'locale' ? '' : `, ${utente?.nome.split(' ')[0]}`
  const statistiche = esito.stato === 'ok' ? esito.dati : null

  const notaStatistiche =
    esito.stato === 'locale' ? 'Si raccolgono solo online' : esito.stato === 'non-configurato' ? 'Conteggio da attivare' : 'Ultimi 7 giorni'

  return (
    <>
      <TitoloPagina
        occhiello={oggi}
        titolo={
          <>
            {saluto()}
            {nome}
          </>
        }
        descrizione="Com'è il sito oggi, cosa è cambiato e cosa merita attenzione."
        azioni={
          <>
            <Link to={`/contenuti/${VISTA_NUOVA_TESTIMONIANZA}`} className={pulsantePrimario}>
              <Plus size={16} aria-hidden="true" />
              Nuova testimonianza
            </Link>
            <a href={SITO} target="_blank" rel="noreferrer" className={pulsanteSecondario}>
              <ExternalLink size={16} aria-hidden="true" />
              Apri il sito
            </a>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-4">
        <Cifra
          etichetta="Visitatori"
          Icon={Users}
          caricamento={esito.stato === 'caricamento'}
          valore={statistiche ? numero(statistiche.totali.visitatori) : '—'}
          variazione={statistiche ? variazione(statistiche.totali.visitatori, statistiche.precedente.visitatori) : undefined}
          nota={notaStatistiche}
        />
        <Cifra
          etichetta="In home adesso"
          Icon={Sparkles}
          valore={inHome.length}
          nota={inArrivo.length ? `${inArrivo.length} in arrivo` : 'Nessuna in arrivo'}
          ritardo={1}
        />
        <Cifra
          etichetta="Testimonianze"
          Icon={Quote}
          valore={RIEPILOGO_CONTENUTI.testimonianzePubblicate}
          nota={RIEPILOGO_CONTENUTI.testimonianzeInAttesa ? `${RIEPILOGO_CONTENUTI.testimonianzeInAttesa} in attesa` : 'Pubblicate sul sito'}
          ritardo={2}
        />
        <Cifra
          etichetta="Da sistemare"
          Icon={ShieldCheck}
          valore={daSistemare.length}
          nota={`${controlli.length - daSistemare.length} suggerimenti minori`}
          ritardo={3}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <Scheda
            titolo="Visite della settimana"
            descrizione={statistiche ? `${giornoBreve(statistiche.periodo.dal)} – ${giornoBreve(statistiche.periodo.al)}` : 'Conteggio anonimo, senza cookie'}
            Icon={BarChart3}
            azione={
              <Link to="/statistiche" className={`${pulsanteLeggero} text-micro`}>
                Dettagli <ArrowRight size={14} aria-hidden="true" />
              </Link>
            }
          >
            {statistiche ? (
              <div className="grid items-end gap-6 sm:grid-cols-[auto_1fr]">
                <div className="flex gap-8 sm:flex-col sm:gap-4">
                  <div>
                    <p className="text-cifra text-white">{numero(statistiche.totali.visite)}</p>
                    <p className="text-meta text-white/45">visite</p>
                  </div>
                  <div>
                    <p className="text-cifra text-white">{numero(statistiche.totali.richieste)}</p>
                    <p className="flex items-center gap-1.5 text-meta text-white/45">
                      <MousePointerClick size={12} aria-hidden="true" /> richieste
                    </p>
                  </div>
                </div>
                <Scintilla valori={statistiche.serie.map((g) => g.visite)} altezza={110} />
              </div>
            ) : (
              <Vuoto
                Icon={BarChart3}
                titolo={LOCALE ? 'Le visite si contano sul sito online' : esito.stato === 'caricamento' ? 'Caricamento…' : 'Conteggio delle visite da attivare'}
                testo={
                  LOCALE
                    ? 'In locale non arrivano visitatori veri. Nella sezione Statistiche puoi vedere un esempio.'
                    : 'Serve collegare l’archivio delle statistiche su Vercel: le istruzioni sono in Automazioni.'
                }
                azione={
                  <Link to="/statistiche" className={pulsanteSecondario}>
                    Vai alle statistiche
                  </Link>
                }
              />
            )}
          </Scheda>

          <Scheda
            titolo="In evidenza sulla home"
            descrizione="Le iniziative compaiono e scompaiono da sole secondo le date"
            Icon={CalendarClock}
            azione={
              <Link to={`/contenuti/${vistaFile('associazione', 'evidenza')}`} className={`${pulsanteLeggero} text-micro`}>
                Modifica <ArrowRight size={14} aria-hidden="true" />
              </Link>
            }
          >
            {inHome.length ? (
              <ul className="grid gap-3 md:grid-cols-3">
                {inHome.map((i) => (
                  <li key={i.titolo} className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                    <span className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${COLORE_TEMA[i.tema]}`} />
                    <p className="mb-1 text-etichetta text-white">{i.titolo}</p>
                    <p className="mb-3 line-clamp-2 text-micro text-white/50">{i.testo}</p>
                    <p className="text-meta font-normal text-white/40">{i.al ? `Fino al ${giornoBreve(i.al)}` : 'Sempre visibile'}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <Vuoto Icon={Sparkles} titolo="Nessuna iniziativa in home" testo="Il blocco “In evidenza” non compare finché non ne aggiungi una." />
            )}
            {inArrivo.length > 0 && (
              <p className="mt-4 flex flex-wrap items-center gap-2 text-micro text-white/50">
                <span className="text-white/35">In arrivo:</span>
                {inArrivo.map((i) => (
                  <Pillola key={i.titolo} tono="neutro">
                    {i.titolo} · {giornoBreve(i.dal!)}
                  </Pillola>
                ))}
              </p>
            )}
          </Scheda>

          <Scheda titolo="Contenuti del sito" descrizione="Scegli cosa modificare" Icon={Hexagon} corpo="p-3 sm:p-4">
            <ul className="grid gap-2 sm:grid-cols-2">
              {VOCI_CONTENUTO.map((voce) => (
                <li key={voce.id}>
                  <Link
                    to={`/contenuti/${voce.vista}`}
                    className={`group flex items-center gap-3.5 rounded-xl p-3 transition-colors hover:bg-white/[0.04] ${anello}`}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/60 transition-colors group-hover:border-accento-1/40 group-hover:text-accento-1">
                      <voce.Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-etichetta text-white">{voce.etichetta}</span>
                      <span className="block truncate text-micro text-white/45">
                        {voce.figli ? `${voce.figli.length} progetti · ${RIEPILOGO_CONTENUTI.progettiAttivi} attivi` : voce.descrizione}
                      </span>
                    </span>
                    <ArrowRight size={15} className="shrink-0 -translate-x-1 text-white/25 opacity-0 transition-all group-hover:translate-x-0 group-hover:text-white/60 group-hover:opacity-100" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Scheda>
        </div>

        <div className="min-w-0 space-y-6">
          <Scheda
            titolo="Da sistemare"
            descrizione="Controllo automatico dei contenuti"
            Icon={ShieldCheck}
            azione={
              <Link to="/automazioni#controllo-contenuti" className={`${pulsanteLeggero} text-micro`}>
                Tutti <ArrowRight size={14} aria-hidden="true" />
              </Link>
            }
            corpo="p-3 sm:p-4"
          >
            {daSistemare.length ? (
              <ul className="space-y-1">
                {daSistemare.slice(0, 5).map((c) => {
                  const contenuto = (
                    <>
                      <span
                        className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${COLORE_LIVELLO[c.livello]}`}
                        title={c.livello === 'critico' ? 'Importante' : 'Da vedere'}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-micro font-semibold text-white">{c.titolo}</span>
                        <span className="line-clamp-2 block text-meta font-normal text-white/45">{c.dettaglio}</span>
                      </span>
                    </>
                  )
                  return (
                    <li key={c.id}>
                      {c.vista ? (
                        <Link to={`/contenuti/${c.vista}`} className={`flex gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/[0.04] ${anello}`}>
                          {contenuto}
                        </Link>
                      ) : (
                        <div className="flex gap-3 p-2.5">{contenuto}</div>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <Vuoto Icon={CheckCircle2} titolo="Tutto in ordine" testo="Nessun problema nei contenuti pubblicati." />
            )}
          </Scheda>

          <Scheda titolo="Ultime modifiche" descrizione="Ogni salvataggio viene pubblicato da solo" Icon={GitCommitHorizontal} corpo="px-4 py-3 sm:px-5">
            <Modifiche quante={6} />
          </Scheda>
        </div>
      </div>
    </>
  )
}
