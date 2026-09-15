import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  BarChart3,
  ChevronDown,
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Workflow,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useAccesso } from '../lib/accesso'
import { LOCALE, SITO } from '../lib/ambiente'
import { RIEPILOGO_CONTENUTI, VOCI_CONTENUTO, controllaContenuti } from '../lib/contenuti'
import { ETICHETTA_STATO, type Stato } from '../../content/rami'
import { Avatar, anello } from './ui'

/**
 * Barra laterale del pannello.
 *
 * Tre gruppi: il lavoro di tutti i giorni (panoramica, statistiche,
 * automazioni), i contenuti del sito nello stesso ordine in cui compaiono ai
 * visitatori, e gli strumenti. Su schermi grandi si puo' ridurre a sole icone;
 * sui telefoni si apre sopra la pagina.
 */

const COLORE_STATO: Record<Stato, string> = {
  attivo: 'bg-emerald-400',
  'in-arrivo': 'bg-accento-1',
  'in-progetto': 'bg-white/30',
}

const CONTROLLI_APERTI = controllaContenuti().filter((c) => c.livello !== 'info').length

function Voce({
  a,
  Icon,
  etichetta,
  compatta,
  attiva,
  badge,
  fine = false,
}: {
  a: string
  Icon: LucideIcon
  etichetta: string
  compatta: boolean
  attiva?: boolean
  badge?: { valore: number; tono: 'attenzione' | 'neutro' }
  fine?: boolean
}) {
  return (
    <NavLink
      to={a}
      end={fine}
      title={compatta ? etichetta : undefined}
      className={({ isActive }) => {
        const selezionata = attiva ?? isActive
        return `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-etichetta transition-colors ${anello} ${
          selezionata ? 'bg-white/[0.07] text-white' : 'text-white/55 hover:bg-white/[0.04] hover:text-white'
        } ${compatta ? 'justify-center' : ''}`
      }}
    >
      {({ isActive }) => {
        const selezionata = attiva ?? isActive
        return (
          <>
            <span
              className={`fondo-gradiente absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full transition-all duration-300 ${
                selezionata ? 'opacity-100' : 'scale-y-0 opacity-0'
              }`}
            />
            <Icon
              size={18}
              className={`shrink-0 transition-colors ${selezionata ? 'text-accento-1' : 'text-white/45 group-hover:text-white/80'}`}
              aria-hidden="true"
            />
            {!compatta && <span className="min-w-0 flex-1 truncate">{etichetta}</span>}
            {badge && badge.valore > 0 && (
              <span
                className={
                  compatta
                    ? 'absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accento-1'
                    : `rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none ${
                        badge.tono === 'attenzione' ? 'bg-accento-1 text-black' : 'bg-white/10 text-white/70'
                      }`
                }
              >
                {compatta ? <span className="sr-only">{badge.valore}</span> : badge.valore}
              </span>
            )}
          </>
        )
      }}
    </NavLink>
  )
}

function Gruppo({ titolo, compatta }: { titolo: string; compatta: boolean }) {
  return compatta ? (
    <div className="mx-auto my-3 h-px w-6 bg-white/10" />
  ) : (
    <p className="mb-1.5 mt-6 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/30">{titolo}</p>
  )
}

export default function Sidebar({
  aperta,
  chiudi,
  compatta,
  alternaCompatta,
  apriComandi,
  apriMedia,
}: {
  aperta: boolean
  chiudi: () => void
  compatta: boolean
  alternaCompatta: () => void
  apriComandi: () => void
  apriMedia: () => void
}) {
  const { pathname } = useLocation()
  const { utente, esci } = useAccesso()
  const vista = pathname.startsWith('/contenuti/') ? pathname.slice('/contenuti/'.length) : ''
  const [progettiAperti, setProgettiAperti] = useState(() => vista.startsWith('collections/rami'))

  useEffect(() => {
    if (vista.startsWith('collections/rami')) setProgettiAperti(true)
  }, [vista])

  // Sul telefono la barra si chiude appena si sceglie una destinazione.
  useEffect(chiudi, [pathname, chiudi])

  const ridotta = compatta && !aperta

  return (
    <>
      <div
        aria-hidden="true"
        onClick={chiudi}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${aperta ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <aside
        id="barra-laterale"
        aria-label="Navigazione del pannello"
        className={`fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col border-r border-white/[0.06] bg-[#0f0f0f] transition-[transform,width] duration-300 ease-out lg:translate-x-0 ${
          aperta ? 'translate-x-0' : '-translate-x-full'
        } ${ridotta ? 'lg:w-[4.75rem]' : 'lg:w-[17rem]'}`}
      >
        {/* Marchio */}
        <div className={`flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.06] ${ridotta ? 'justify-center px-2' : 'px-4'}`}>
          <Link to="/" className={`flex min-w-0 items-center gap-3 rounded-lg ${anello}`}>
            <img src="/img/logo-mark.png" alt="" className="h-8 w-8 shrink-0" />
            {!ridotta && (
              <span className="min-w-0 leading-tight">
                <span className="block truncate font-display text-[15px] font-bold text-white">FantaEsagonale</span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-accento-1">Gestione</span>
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={chiudi}
            className={`ml-auto rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white lg:hidden ${anello}`}
            aria-label="Chiudi il menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className={`flex-1 overflow-y-auto overflow-x-hidden pb-4 pt-3 ${ridotta ? 'px-2.5' : 'px-3'}`}>
          <button
            type="button"
            onClick={apriComandi}
            title={ridotta ? 'Cerca (Ctrl+K)' : undefined}
            className={`mb-2 flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-micro text-white/40 transition-colors hover:border-white/15 hover:text-white/70 ${anello} ${ridotta ? 'justify-center' : ''}`}
          >
            <Search size={16} className="shrink-0" aria-hidden="true" />
            {!ridotta && (
              <>
                <span className="flex-1 text-left">Cerca o vai a…</span>
                <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-sans text-[10px] text-white/40">Ctrl K</kbd>
              </>
            )}
          </button>

          <div className="space-y-0.5">
            <Voce a="/" fine Icon={LayoutDashboard} etichetta="Panoramica" compatta={ridotta} />
            <Voce a="/statistiche" Icon={BarChart3} etichetta="Statistiche" compatta={ridotta} />
            <Voce
              a="/automazioni"
              Icon={Workflow}
              etichetta="Automazioni"
              compatta={ridotta}
              badge={{ valore: CONTROLLI_APERTI, tono: 'attenzione' }}
            />
          </div>

          <Gruppo titolo="Contenuti del sito" compatta={ridotta} />
          <div className="space-y-0.5">
            {VOCI_CONTENUTO.map((voce) => {
              const attiva = vista.startsWith(voce.vista)
              if (!voce.figli)
                return (
                  <Voce
                    key={voce.id}
                    a={`/contenuti/${voce.vista}`}
                    Icon={voce.Icon}
                    etichetta={voce.etichetta}
                    compatta={ridotta}
                    attiva={attiva}
                    badge={
                      voce.id === 'testimonianze'
                        ? { valore: RIEPILOGO_CONTENUTI.testimonianzeInAttesa, tono: 'neutro' }
                        : undefined
                    }
                  />
                )

              return (
                <div key={voce.id}>
                  <div className="relative flex items-center">
                    <div className="flex-1">
                      <Voce a={`/contenuti/${voce.vista}`} Icon={voce.Icon} etichetta={voce.etichetta} compatta={ridotta} attiva={vista === voce.vista} />
                    </div>
                    {!ridotta && (
                      <button
                        type="button"
                        onClick={() => setProgettiAperti((v) => !v)}
                        aria-expanded={progettiAperti}
                        aria-controls="elenco-progetti"
                        aria-label={progettiAperti ? 'Nascondi i progetti' : 'Mostra i progetti'}
                        className={`absolute right-1.5 rounded-lg p-1.5 text-white/40 hover:bg-white/[0.06] hover:text-white ${anello}`}
                      >
                        <ChevronDown size={15} className={`transition-transform duration-300 ${progettiAperti ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {!ridotta && (
                    <div
                      id="elenco-progetti"
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${progettiAperti ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                      <ul className="ml-[1.35rem] overflow-hidden border-l border-white/[0.07] pl-2.5" aria-hidden={!progettiAperti}>
                        {voce.figli.map((figlio) => {
                          const selezionato = vista.startsWith(figlio.vista)
                          return (
                            <li key={figlio.id}>
                              <Link
                                to={`/contenuti/${figlio.vista}`}
                                aria-current={selezionato ? 'page' : undefined}
                                tabIndex={progettiAperti ? undefined : -1}
                                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-micro transition-colors ${anello} ${
                                  selezionato ? 'bg-white/[0.06] text-white' : 'text-white/50 hover:bg-white/[0.03] hover:text-white'
                                }`}
                              >
                                <span className="min-w-0 flex-1 truncate">{figlio.etichetta}</span>
                                <span
                                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${COLORE_STATO[figlio.stato]}`}
                                  title={ETICHETTA_STATO[figlio.stato]}
                                />
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <Gruppo titolo="Strumenti" compatta={ridotta} />
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={apriMedia}
              title={ridotta ? 'Immagini e file' : undefined}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-etichetta text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white ${anello} ${ridotta ? 'justify-center' : ''}`}
            >
              <Images size={18} className="shrink-0 text-white/45 group-hover:text-white/80" aria-hidden="true" />
              {!ridotta && <span>Immagini e file</span>}
            </button>
            <a
              href={SITO}
              target="_blank"
              rel="noreferrer"
              title={ridotta ? 'Apri il sito' : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-etichetta text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white ${anello} ${ridotta ? 'justify-center' : ''}`}
            >
              <ExternalLink size={18} className="shrink-0 text-white/45 group-hover:text-white/80" aria-hidden="true" />
              {!ridotta && <span>Apri il sito</span>}
            </a>
          </div>
        </nav>

        {/* Utente */}
        <div className={`shrink-0 border-t border-white/[0.06] ${ridotta ? 'space-y-2 p-2.5' : 'p-3'}`}>
          {utente && (
            <div className={`flex items-center gap-3 rounded-xl ${ridotta ? 'flex-col' : 'bg-white/[0.03] p-2.5'}`}>
              <Avatar nome={utente.nome} immagine={utente.avatar} />
              {!ridotta && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-etichetta text-white">{utente.nome}</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-white/45">
                    <span className={`h-1.5 w-1.5 rounded-full ${LOCALE ? 'bg-accento-1' : 'bg-emerald-400'}`} />
                    {LOCALE ? 'In locale' : 'Online'}
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={esci}
                title="Esci"
                aria-label="Esci dal pannello"
                className={`rounded-lg p-2 text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white ${anello}`}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={alternaCompatta}
            className={`mt-2 hidden w-full items-center gap-3 rounded-xl px-3 py-2 text-micro text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/80 lg:flex ${anello} ${ridotta ? 'justify-center' : ''}`}
            aria-label={ridotta ? 'Espandi la barra laterale' : 'Riduci la barra laterale'}
          >
            {ridotta ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            {!ridotta && <span>Riduci</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
