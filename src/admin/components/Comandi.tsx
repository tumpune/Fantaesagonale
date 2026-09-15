import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3,
  CornerDownLeft,
  ExternalLink,
  Images,
  LayoutDashboard,
  Plus,
  Search,
  Settings2,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { SITO } from '../lib/ambiente'
import { VISTA_IMPOSTAZIONI_AUTOMAZIONI, VISTA_NUOVA_TESTIMONIANZA, VOCI_CONTENUTO } from '../lib/contenuti'

type Comando = { id: string; gruppo: string; etichetta: string; dettaglio?: string; Icon: LucideIcon; esegui: () => void }

/** Normalizza per cercare senza badare ad accenti e maiuscole. */
const semplice = (testo: string) =>
  testo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

/**
 * "Cerca o vai a…" (Ctrl+K): raggiunge qualsiasi sezione o progetto
 * scrivendone il nome, senza passare dai menu.
 */
export default function Comandi({ aperta, chiudi, apriMedia }: { aperta: boolean; chiudi: () => void; apriMedia: () => void }) {
  const naviga = useNavigate()
  const [ricerca, setRicerca] = useState('')
  const [indice, setIndice] = useState(0)
  const campo = useRef<HTMLInputElement>(null)
  const elenco = useRef<HTMLUListElement>(null)

  const comandi = useMemo<Comando[]>(() => {
    const vai = (a: string) => () => naviga(a)
    return [
      { id: 'panoramica', gruppo: 'Pannello', etichetta: 'Panoramica', Icon: LayoutDashboard, esegui: vai('/') },
      { id: 'statistiche', gruppo: 'Pannello', etichetta: 'Statistiche', Icon: BarChart3, esegui: vai('/statistiche') },
      { id: 'automazioni', gruppo: 'Pannello', etichetta: 'Automazioni', Icon: Workflow, esegui: vai('/automazioni') },
      ...VOCI_CONTENUTO.flatMap((voce) => [
        { id: voce.id, gruppo: 'Contenuti', etichetta: voce.etichetta, dettaglio: voce.descrizione, Icon: voce.Icon, esegui: vai(`/contenuti/${voce.vista}`) },
        ...(voce.figli ?? []).map((f) => ({
          id: `progetto-${f.id}`,
          gruppo: 'Progetti',
          etichetta: f.etichetta,
          dettaglio: `/${f.id}`,
          Icon: f.Icon,
          esegui: vai(`/contenuti/${f.vista}`),
        })),
      ]),
      { id: 'nuova-testimonianza', gruppo: 'Azioni', etichetta: 'Nuova testimonianza', Icon: Plus, esegui: vai(`/contenuti/${VISTA_NUOVA_TESTIMONIANZA}`) },
      { id: 'impostazioni', gruppo: 'Azioni', etichetta: 'Impostazioni delle automazioni', Icon: Settings2, esegui: vai(`/contenuti/${VISTA_IMPOSTAZIONI_AUTOMAZIONI}`) },
      { id: 'media', gruppo: 'Azioni', etichetta: 'Immagini e file', Icon: Images, esegui: apriMedia },
      { id: 'sito', gruppo: 'Azioni', etichetta: 'Apri il sito', dettaglio: SITO.replace(/^https?:\/\//, ''), Icon: ExternalLink, esegui: () => window.open(SITO, '_blank', 'noopener') },
    ]
  }, [naviga, apriMedia])

  const risultati = useMemo(() => {
    const termini = semplice(ricerca).split(/\s+/).filter(Boolean)
    return comandi.filter((c) => termini.every((t) => semplice(`${c.etichetta} ${c.dettaglio ?? ''} ${c.gruppo}`).includes(t)))
  }, [comandi, ricerca])

  useEffect(() => {
    if (!aperta) return
    setRicerca('')
    setIndice(0)
    requestAnimationFrame(() => campo.current?.focus())
  }, [aperta])

  useEffect(() => setIndice(0), [ricerca])

  useEffect(() => {
    elenco.current?.querySelector(`[data-indice="${indice}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [indice])

  if (!aperta) return null

  const esegui = (comando?: Comando) => {
    if (!comando) return
    chiudi()
    comando.esegui()
  }

  let gruppoPrecedente = ''

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={chiudi}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cerca o vai a"
        onMouseDown={(e) => e.stopPropagation()}
        className="entrata w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
          <Search size={18} className="text-white/40" aria-hidden="true" />
          <input
            ref={campo}
            value={ricerca}
            onChange={(e) => setRicerca(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setIndice((i) => Math.min(i + 1, risultati.length - 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setIndice((i) => Math.max(i - 1, 0))
              } else if (e.key === 'Enter') {
                e.preventDefault()
                esegui(risultati[indice])
              } else if (e.key === 'Escape') {
                chiudi()
              }
            }}
            placeholder="Cerca un progetto, una sezione o un'azione…"
            className="h-14 flex-1 bg-transparent text-guida text-white placeholder:text-white/30 focus:outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="risultati-comandi"
            aria-activedescendant={risultati[indice] ? `comando-${risultati[indice].id}` : undefined}
          />
          <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/40">Esc</kbd>
        </div>

        <ul ref={elenco} id="risultati-comandi" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {risultati.length === 0 && <li className="px-3 py-8 text-center text-micro text-white/40">Nessun risultato per “{ricerca}”</li>}
          {risultati.map((comando, i) => {
            const intestazione = comando.gruppo !== gruppoPrecedente ? comando.gruppo : null
            gruppoPrecedente = comando.gruppo
            const selezionato = i === indice
            return (
              <li key={comando.id} role="presentation">
                {intestazione && <p className="px-3 pb-1.5 pt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/30">{intestazione}</p>}
                <div
                  id={`comando-${comando.id}`}
                  role="option"
                  aria-selected={selezionato}
                  data-indice={i}
                  onMouseMove={() => setIndice(i)}
                  onClick={() => esegui(comando)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ${selezionato ? 'bg-white/[0.07]' : ''}`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${selezionato ? 'fondo-gradiente text-black' : 'bg-white/[0.05] text-white/60'}`}>
                    <comando.Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-etichetta text-white">{comando.etichetta}</span>
                    {comando.dettaglio && <span className="block truncate text-meta text-white/40">{comando.dettaglio}</span>}
                  </span>
                  {selezionato && <CornerDownLeft size={15} className="text-white/40" aria-hidden="true" />}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
