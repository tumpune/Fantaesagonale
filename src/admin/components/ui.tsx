import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from 'lucide-react'
import { percentuale } from '../lib/formato'

/* Mattoni dell'interfaccia del pannello, allineati allo stile del sito. */

export const anello =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accento-1 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black'

const base = `inline-flex items-center justify-center gap-2 rounded-full text-etichetta transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${anello}`

export const pulsantePrimario = `${base} fondo-gradiente px-4 py-2.5 text-black shadow-[0_8px_24px_-12px_rgb(var(--accento-1)/0.6)] hover:brightness-110`
export const pulsanteSecondario = `${base} border border-white/[0.12] bg-white/[0.03] px-4 py-2.5 text-white hover:border-white/25 hover:bg-white/[0.07]`
export const pulsanteLeggero = `${base} px-3 py-2 text-white/70 hover:bg-white/[0.06] hover:text-white`

export function TitoloPagina({
  occhiello,
  titolo,
  descrizione,
  azioni,
}: {
  occhiello?: string
  titolo: ReactNode
  descrizione?: ReactNode
  azioni?: ReactNode
}) {
  return (
    <header className="entrata mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {occhiello && <p className="mb-2.5 text-occhiello uppercase text-accento-1">{occhiello}</p>}
        <h1 className="text-titolo text-white text-balance">{titolo}</h1>
        {descrizione && <p className="mt-2.5 max-w-2xl text-corpo text-white/55">{descrizione}</p>}
      </div>
      {azioni && <div className="flex flex-wrap items-center gap-2">{azioni}</div>}
    </header>
  )
}

export function Scheda({
  titolo,
  descrizione,
  azione,
  Icon,
  children,
  className = '',
  corpo = 'p-5 sm:p-6',
  id,
}: {
  titolo?: ReactNode
  descrizione?: ReactNode
  azione?: ReactNode
  Icon?: LucideIcon
  children: ReactNode
  className?: string
  corpo?: string
  id?: string
}) {
  return (
    <section
      id={id}
      className={`entrata min-w-0 scroll-mt-24 rounded-2xl border border-white/[0.07] bg-[#151515] ${className}`}
    >
      {(titolo || azione) && (
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 border-b border-white/[0.06] px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {Icon && (
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-accento-1">
                <Icon size={16} aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0">
              <h2 className="text-etichetta text-white">{titolo}</h2>
              {descrizione && <p className="mt-0.5 text-micro text-white/45">{descrizione}</p>}
            </div>
          </div>
          {azione && <div className="max-w-full shrink-0">{azione}</div>}
        </div>
      )}
      <div className={corpo}>{children}</div>
    </section>
  )
}

export type Tono = 'ok' | 'attenzione' | 'critico' | 'neutro' | 'accento'

const TONI: Record<Tono, string> = {
  ok: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20',
  attenzione: 'bg-accento-1/10 text-accento-1 ring-accento-1/25',
  critico: 'bg-accento-2/15 text-[#ff8a80] ring-accento-2/30',
  neutro: 'bg-white/[0.05] text-white/60 ring-white/10',
  accento: 'fondo-gradiente text-black ring-transparent',
}

const PUNTI: Record<Tono, string> = {
  ok: 'bg-emerald-400',
  attenzione: 'bg-accento-1',
  critico: 'bg-accento-2',
  neutro: 'bg-white/40',
  accento: 'bg-black',
}

export function Pillola({ tono = 'neutro', children, punto = false, pulsa = false }: { tono?: Tono; children: ReactNode; punto?: boolean; pulsa?: boolean }) {
  return (
    <span className={`inline-flex max-w-full items-center gap-1.5 truncate whitespace-nowrap rounded-full px-2.5 py-1 text-meta ring-1 ring-inset ${TONI[tono]}`}>
      {punto && (
        <span className="relative flex h-1.5 w-1.5">
          {pulsa && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${PUNTI[tono]}`} />}
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${PUNTI[tono]}`} />
        </span>
      )}
      {children}
    </span>
  )
}

export function Variazione({ valore, inversa = false }: { valore: number | null; inversa?: boolean }) {
  if (valore === null) return <span className="text-meta text-white/40">nuovo</span>
  const piatto = Math.abs(valore) < 0.005
  const buono = inversa ? valore < 0 : valore > 0
  const Icon = piatto ? Minus : valore > 0 ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-meta ${piatto ? 'text-white/45' : buono ? 'text-emerald-300' : 'text-[#ff8a80]'}`}
    >
      <Icon size={13} aria-hidden="true" />
      {piatto ? '0%' : percentuale(Math.abs(valore))}
    </span>
  )
}

export function Cifra({
  etichetta,
  valore,
  Icon,
  variazione,
  nota,
  caricamento = false,
  ritardo = 0,
}: {
  etichetta: string
  valore: ReactNode
  Icon: LucideIcon
  variazione?: number | null
  nota?: ReactNode
  caricamento?: boolean
  ritardo?: number
}) {
  return (
    <div
      className="entrata group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#151515] p-5 transition-colors hover:border-white/15"
      style={{ animationDelay: `${ritardo * 60}ms` }}
    >
      <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accento-1/[0.06] blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="mb-4 flex items-center justify-between">
        <span className="text-meta text-white/50">{etichetta}</span>
        <Icon size={16} className="text-white/30" aria-hidden="true" />
      </div>
      {caricamento ? (
        <span className="scheletro block h-9 w-24 rounded-lg" />
      ) : (
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="text-cifra text-white">{valore}</span>
          {variazione !== undefined && <Variazione valore={variazione} />}
        </div>
      )}
      {nota && <p className="mt-2 text-micro text-white/40">{nota}</p>}
    </div>
  )
}

export function Vuoto({ Icon, titolo, testo, azione }: { Icon: LucideIcon; titolo: string; testo?: ReactNode; azione?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/40">
        <Icon size={22} aria-hidden="true" />
      </span>
      <p className="text-etichetta text-white">{titolo}</p>
      {testo && <p className="mx-auto mt-1.5 max-w-sm text-micro text-white/45">{testo}</p>}
      {azione && <div className="mt-5">{azione}</div>}
    </div>
  )
}

export function Avviso({ tono = 'attenzione', Icon, titolo, children, azione }: { tono?: Tono; Icon: LucideIcon; titolo: string; children?: ReactNode; azione?: ReactNode }) {
  const colori: Record<Tono, string> = {
    ok: 'border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-300',
    attenzione: 'border-accento-1/25 bg-accento-1/[0.05] text-accento-1',
    critico: 'border-accento-2/30 bg-accento-2/[0.07] text-[#ff8a80]',
    neutro: 'border-white/10 bg-white/[0.03] text-white/70',
    accento: 'border-accento-1/25 bg-accento-1/[0.05] text-accento-1',
  }
  return (
    <div className={`entrata flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:p-5 ${colori[tono]}`}>
      <Icon size={20} className="shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-etichetta text-white">{titolo}</p>
        {children && <div className="mt-1 text-micro text-white/60">{children}</div>}
      </div>
      {azione && <div className="shrink-0">{azione}</div>}
    </div>
  )
}

export function Scheletro({ className = '' }: { className?: string }) {
  return <span className={`scheletro block rounded-lg ${className}`} />
}

/** Iniziali per l'avatar quando manca la foto. */
export function Avatar({ nome, immagine, grande = false }: { nome: string; immagine?: string; grande?: boolean }) {
  const misura = grande ? 'h-10 w-10 text-etichetta' : 'h-8 w-8 text-meta'
  if (immagine) return <img src={immagine} alt="" className={`${misura} shrink-0 rounded-full ring-1 ring-white/10`} />
  const iniziali = nome
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return <span className={`${misura} fondo-gradiente grid shrink-0 place-items-center rounded-full font-bold text-black`}>{iniziali}</span>
}
