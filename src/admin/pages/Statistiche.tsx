import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  Compass,
  Eye,
  FlaskConical,
  Globe2,
  Hexagon,
  Info,
  Layers,
  MapPin,
  MonitorSmartphone,
  MousePointerClick,
  RefreshCw,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { Andamento, Anello, Barre } from '../components/Grafici'
import { Avviso, Cifra, Scheda, Scheletro, TitoloPagina, anello, pulsantePrimario, pulsanteSecondario } from '../components/ui'
import { RAMI } from '../../content/rami'
import { LOCALE, leggiLocale, scriviLocale } from '../lib/ambiente'
import { nomeArgomento, nomePagina, temaPercorso } from '../lib/contenuti'
import { decimale, giornoBreve, numero, percentuale, variazione } from '../lib/formato'
import { useApi } from '../lib/servizi'
import { statisticheDiEsempio, type Statistiche as DatiStatistiche, type Voce } from '../lib/statistiche'

const PERIODI = [
  { giorni: 7, etichetta: '7 giorni' },
  { giorni: 30, etichetta: '30 giorni' },
  { giorni: 90, etichetta: '90 giorni' },
]

const COLORE_TEMA = { centrale: '#fcd70c', oro: '#ecc96e', mono: '#e5e5e5' }

/** Nomi comprensibili per i siti di provenienza piu' comuni. */
function nomeFonte(host: string): string {
  if (host === 'diretto') return 'Accesso diretto o app'
  const noti: [RegExp, string][] = [
    [/(^|\.)instagram\.com$/, 'Instagram'],
    [/(^|\.)facebook\.com$|^fb\.me$/, 'Facebook'],
    [/(^|\.)google\./, 'Google'],
    [/(^|\.)bing\.com$/, 'Bing'],
    [/(^|\.)tiktok\.com$/, 'TikTok'],
    [/(^|\.)youtube\.com$|^youtu\.be$/, 'YouTube'],
    [/wl\.co$|whatsapp/, 'WhatsApp'],
    [/^t\.me$|telegram/, 'Telegram'],
    [/(^|\.)linkedin\.com$|^lnkd\.in$/, 'LinkedIn'],
  ]
  return noti.find(([regola]) => regola.test(host))?.[1] ?? host
}

const nomeNazione = (codice: string) => {
  try {
    return new Intl.DisplayNames(['it'], { type: 'region' }).of(codice) ?? codice
  } catch {
    return codice
  }
}

/** Somma voci con lo stesso nome dopo averle rinominate (es. due domini di Instagram). */
function unisci(voci: Voce[], nome: (v: string) => string) {
  const totali = new Map<string, number>()
  for (const v of voci) totali.set(nome(v.nome), (totali.get(nome(v.nome)) ?? 0) + v.valore)
  return [...totali].map(([n, valore]) => ({ nome: n, valore })).sort((a, b) => b.valore - a.valore)
}

const METRICHE = [
  { chiave: 'visitatori', etichetta: 'Visitatori', colore: '#fcd70c' },
  { chiave: 'visite', etichetta: 'Visite', colore: '#ff6a3d' },
  { chiave: 'pagine', etichetta: 'Pagine viste', colore: '#e5e5e5' },
] as const

export default function Statistiche() {
  const [giorni, setGiorni] = useState(30)
  const [esempio, setEsempio] = useState(() => leggiLocale('pannello.statisticheEsempio', false))
  const [metriche, setMetriche] = useState<string[]>(['visitatori', 'visite'])
  const { esito, ricarica } = useApi<DatiStatistiche>(`/api/statistiche?giorni=${giorni}`)

  const alternaEsempio = (valore: boolean) => {
    setEsempio(valore)
    scriviLocale('pannello.statisticheEsempio', valore)
  }

  const reali = esito.stato === 'ok' ? esito.dati : null
  const nonDisponibili = esito.stato === 'locale' || esito.stato === 'non-configurato'
  const inEsempio = !reali && nonDisponibili && esempio
  const dati = useMemo(() => reali ?? (inEsempio ? statisticheDiEsempio(giorni) : null), [reali, inEsempio, giorni])
  const caricamento = esito.stato === 'caricamento'

  const interesse = useMemo(() => {
    if (!dati) return []
    const visite = new Map(dati.pagine.map((p) => [p.nome, p.valore]))
    const richieste = new Map(dati.argomenti.map((a) => [a.nome, a.valore]))
    return RAMI.map((r) => ({ ramo: r, visite: visite.get(`/${r.slug}`) ?? 0, richieste: richieste.get(r.slug) ?? 0 }))
      .filter((r) => r.visite || r.richieste)
      .sort((a, b) => b.visite - a.visite)
  }, [dati])

  const selettorePeriodo = (
    <div role="radiogroup" aria-label="Periodo" className="flex rounded-full border border-white/[0.08] bg-white/[0.02] p-1">
      {PERIODI.map((p) => (
        <button
          key={p.giorni}
          type="button"
          role="radio"
          aria-checked={giorni === p.giorni}
          onClick={() => setGiorni(p.giorni)}
          className={`rounded-full px-3.5 py-1.5 text-micro font-semibold transition-colors ${anello} ${
            giorni === p.giorni ? 'bg-white text-black' : 'text-white/55 hover:text-white'
          }`}
        >
          {p.etichetta}
        </button>
      ))}
    </div>
  )

  return (
    <>
      <TitoloPagina
        occhiello="Statistiche"
        titolo="Chi visita il sito"
        descrizione="Visite contate in forma anonima: nessun cookie, nessun dato personale, nessun servizio di terze parti."
        azioni={
          <>
            {selettorePeriodo}
            {!nonDisponibili && (
              <button type="button" onClick={ricarica} className={`${pulsanteSecondario} !p-2.5`} aria-label="Aggiorna">
                <RefreshCw size={16} className={caricamento ? 'animate-spin' : ''} />
              </button>
            )}
          </>
        }
      />

      {nonDisponibili && !esempio && (
        <Scheda className="mb-6" corpo="p-6 sm:p-10">
          <div className="mx-auto max-w-xl text-center">
            <span className="fondo-gradiente mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl text-black">
              <BarChart3 size={26} aria-hidden="true" />
            </span>
            <h2 className="mb-2 font-display text-[1.5rem] font-bold tracking-tight text-white">
              {LOCALE ? 'Le visite si contano sul sito online' : 'Conteggio delle visite da attivare'}
            </h2>
            <p className="mb-7 text-corpo text-white/55">
              {LOCALE
                ? 'In locale non arrivano visitatori veri, quindi qui non c’è nulla da contare. Puoi vedere com’è fatta la sezione con dei dati di esempio.'
                : 'Il sito è già pronto a contare le visite: manca solo l’archivio in cui salvarle. Su Vercel apri Storage, aggiungi Upstash Redis e collegalo al progetto, poi fai un nuovo deploy.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => alternaEsempio(true)} className={pulsantePrimario}>
                <FlaskConical size={16} aria-hidden="true" />
                Mostra dati di esempio
              </button>
              {!LOCALE && (
                <Link to="/automazioni#configurazione" className={pulsanteSecondario}>
                  Istruzioni di configurazione
                </Link>
              )}
            </div>
          </div>
        </Scheda>
      )}

      {inEsempio && (
        <div className="z-20 mb-6 sm:sticky sm:top-[4.5rem]">
          <Avviso
            tono="critico"
            Icon={FlaskConical}
            titolo="Dati di esempio: non sono visite reali"
            azione={
              <button type="button" onClick={() => alternaEsempio(false)} className={`${pulsanteSecondario} !py-1.5 text-micro`}>
                Nascondi
              </button>
            }
          >
            Servono solo a vedere com’è fatta la sezione.
          </Avviso>
        </div>
      )}

      {esito.stato === 'errore' && (
        <div className="mb-6">
          <Avviso tono="critico" Icon={Info} titolo="Statistiche non disponibili" azione={<button type="button" onClick={ricarica} className={`${pulsanteSecondario} !py-1.5 text-micro`}>Riprova</button>}>
            {esito.messaggio}
          </Avviso>
        </div>
      )}

      {(dati || caricamento) && (
        <>
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-4">
            <Cifra
              etichetta="Visitatori unici"
              Icon={Users}
              caricamento={caricamento}
              valore={dati ? numero(dati.totali.visitatori) : ''}
              variazione={dati ? variazione(dati.totali.visitatori, dati.precedente.visitatori) : undefined}
              nota="rispetto al periodo precedente"
            />
            <Cifra
              etichetta="Visite"
              Icon={Compass}
              caricamento={caricamento}
              valore={dati ? numero(dati.totali.visite) : ''}
              variazione={dati ? variazione(dati.totali.visite, dati.precedente.visite) : undefined}
              nota={dati && dati.totali.visitatori ? `${decimale(dati.totali.visite / dati.totali.visitatori)} per visitatore` : ' '}
              ritardo={1}
            />
            <Cifra
              etichetta="Pagine viste"
              Icon={Eye}
              caricamento={caricamento}
              valore={dati ? numero(dati.totali.pagine) : ''}
              variazione={dati ? variazione(dati.totali.pagine, dati.precedente.pagine) : undefined}
              nota={dati && dati.totali.visite ? `${decimale(dati.totali.pagine / dati.totali.visite)} pagine per visita` : ' '}
              ritardo={2}
            />
            <Cifra
              etichetta="Richieste di contatto"
              Icon={MousePointerClick}
              caricamento={caricamento}
              valore={dati ? numero(dati.totali.richieste) : ''}
              variazione={dati ? variazione(dati.totali.richieste, dati.precedente.richieste) : undefined}
              nota={dati && dati.totali.visite ? `${percentuale(dati.totali.richieste / dati.totali.visite)} delle visite` : ' '}
              ritardo={3}
            />
          </div>

          <Scheda
            className="mt-6"
            titolo="Andamento"
            descrizione={dati ? `${giornoBreve(dati.periodo.dal)} – ${giornoBreve(dati.periodo.al)}` : undefined}
            Icon={BarChart3}
            azione={
              <div className="flex flex-wrap justify-end gap-1.5">
                {METRICHE.map((m) => {
                  const attiva = metriche.includes(m.chiave)
                  return (
                    <button
                      key={m.chiave}
                      type="button"
                      aria-pressed={attiva}
                      onClick={() =>
                        setMetriche((correnti) =>
                          attiva ? (correnti.length > 1 ? correnti.filter((c) => c !== m.chiave) : correnti) : [...correnti, m.chiave],
                        )
                      }
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-meta transition-colors ${anello} ${
                        attiva ? 'border-white/20 bg-white/[0.06] text-white' : 'border-white/[0.07] text-white/40 hover:text-white/70'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: attiva ? m.colore : 'rgb(255 255 255 / 0.2)' }} />
                      {m.etichetta}
                    </button>
                  )
                })}
              </div>
            }
          >
            {dati ? (
              <Andamento dati={dati.serie} serie={METRICHE.filter((m) => metriche.includes(m.chiave)).map((m) => ({ ...m }))} />
            ) : (
              <Scheletro className="h-[260px] w-full" />
            )}
          </Scheda>

          {dati && (
            <>
              <div className="mt-6 grid gap-6 lg:grid-cols-5">
                <Scheda className="min-w-0 lg:col-span-3" titolo="Pagine più viste" Icon={Layers} corpo="p-3 sm:p-4">
                  <Barre
                    voci={dati.pagine.slice(0, 10).map((p) => {
                      const tema = temaPercorso(p.nome)
                      return {
                        chiave: p.nome,
                        etichetta: nomePagina(p.nome),
                        secondaria: p.nome,
                        valore: p.valore,
                        colore: tema ? COLORE_TEMA[tema] : undefined,
                      }
                    })}
                    totale={dati.totali.pagine}
                  />
                </Scheda>

                <Scheda className="lg:col-span-2" titolo="Interesse per progetto" descrizione="Visite alla pagina e richieste ricevute" Icon={Hexagon} corpo="p-3 sm:p-4">
                  {interesse.length ? (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-meta text-white/35">
                          <th className="px-3 pb-2 font-semibold">Progetto</th>
                          <th className="px-3 pb-2 text-right font-semibold">Visite</th>
                          <th className="px-3 pb-2 text-right font-semibold">Richieste</th>
                        </tr>
                      </thead>
                      <tbody>
                        {interesse.map(({ ramo, visite, richieste }) => (
                          <tr key={ramo.slug} className="border-t border-white/[0.05]">
                            <td className="px-3 py-2.5">
                              <span className="flex items-center gap-2.5 text-micro text-white/85">
                                <ramo.Icon size={15} style={{ color: COLORE_TEMA[ramo.tema] }} aria-hidden="true" />
                                {ramo.nome}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-right text-etichetta text-white">{numero(visite)}</td>
                            <td className="px-3 py-2.5 text-right text-etichetta text-white">{richieste ? numero(richieste) : <span className="text-white/30">—</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="py-6 text-center text-micro text-white/40">Nessuna visita alle pagine dei progetti</p>
                  )}
                </Scheda>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <Scheda titolo="Da dove arrivano" descrizione="Sito o app di provenienza" Icon={Globe2} corpo="p-3 sm:p-4">
                  <Barre voci={unisci(dati.fonti, nomeFonte).slice(0, 8).map((f) => ({ chiave: f.nome, etichetta: f.nome, valore: f.valore }))} />
                </Scheda>

                <Scheda titolo="Dispositivi" Icon={MonitorSmartphone}>
                  <Anello
                    voci={[
                      { chiave: 'mobile', etichetta: 'Telefono', colore: '#fcd70c' },
                      { chiave: 'desktop', etichetta: 'Computer', colore: '#ff6a3d' },
                      { chiave: 'tablet', etichetta: 'Tablet', colore: '#e5e5e5' },
                    ].map((d) => ({ ...d, valore: dati.dispositivi.find((v) => v.nome === d.chiave)?.valore ?? 0 }))}
                    centro={
                      <div>
                        <p className="font-display text-[1.35rem] font-extrabold text-white">
                          {percentuale((dati.dispositivi.find((d) => d.nome === 'mobile')?.valore ?? 0) / Math.max(1, dati.dispositivi.reduce((t, d) => t + d.valore, 0)))}
                        </p>
                        <p className="text-meta text-white/40">da telefono</p>
                      </div>
                    }
                  />
                </Scheda>

                <Scheda titolo="Dove si trovano" descrizione="Città stimate dalla rete, in forma aggregata" Icon={MapPin} corpo="p-3 sm:p-4" className="md:col-span-2 xl:col-span-1">
                  <Barre voci={dati.citta.slice(0, 6).map((c) => ({ chiave: c.nome, etichetta: c.nome, valore: c.valore }))} vuoto="Nessuna città rilevata" />
                  {dati.nazioni.length > 1 && (
                    <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-white/[0.06] px-3 pt-3 text-meta font-normal text-white/50">
                      {dati.nazioni.slice(0, 5).map((n) => (
                        // Niente bandiere emoji: su Windows compaiono come due lettere.
                        <span key={n.nome}>
                          {nomeNazione(n.nome)} <span className="text-white">{numero(n.valore)}</span>
                        </span>
                      ))}
                    </p>
                  )}
                </Scheda>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Scheda titolo="Richieste per argomento" descrizione="Dal modulo contatti" Icon={MousePointerClick} corpo="p-3 sm:p-4">
                  <Barre
                    voci={dati.argomenti.map((a) => ({ chiave: a.nome, etichetta: nomeArgomento(a.nome), valore: a.valore }))}
                    vuoto="Nessuna richiesta nel periodo"
                  />
                </Scheda>
                <Scheda titolo="Come contiamo" Icon={ShieldCheck}>
                  <ul className="space-y-3 text-micro text-white/55">
                    <li>
                      <strong className="text-white">Visitatori unici</strong>: stima basata su un codice che cambia ogni giorno. La stessa persona in due giorni diversi conta due volte.
                    </li>
                    <li>
                      <strong className="text-white">Visite</strong>: ogni ingresso nel sito. Provenienza, dispositivo e città si riferiscono agli ingressi.
                    </li>
                    <li>
                      <strong className="text-white">Pagine viste</strong>: ogni pagina aperta, anche durante la stessa visita.
                    </li>
                    <li>Non si contano i motori di ricerca, le anteprime dei link e chi ha chiesto al browser di non essere tracciato. I dati si cancellano dopo 13 mesi.</li>
                  </ul>
                </Scheda>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
