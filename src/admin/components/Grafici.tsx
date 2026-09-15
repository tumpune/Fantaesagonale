import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { giornoBreve, giornoLungo, numero, percentuale } from '../lib/formato'

/**
 * Grafici in SVG scritti a mano: bastano tre forme (andamento, barre, anello)
 * e una libreria di grafici peserebbe piu' dell'intero pannello.
 */

function useLarghezza<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [larghezza, setLarghezza] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const osservatore = new ResizeObserver(([voce]) => setLarghezza(voce.contentRect.width))
    osservatore.observe(ref.current)
    return () => osservatore.disconnect()
  }, [])
  return [ref, larghezza] as const
}

/** Arrotonda il massimo a un valore "tondo" per le linee della griglia. */
function scalaTonda(massimo: number) {
  if (massimo <= 4) return 4
  const potenza = 10 ** Math.floor(Math.log10(massimo))
  const passo = [1, 2, 2.5, 5, 10].map((m) => m * potenza).find((p) => p * 4 >= massimo) ?? potenza * 10
  return passo * 4
}

export type Serie = { chiave: string; etichetta: string; colore: string }

export function Andamento<T extends { data: string } & Record<string, number | string>>({
  dati,
  serie,
  altezza = 260,
}: {
  dati: T[]
  serie: Serie[]
  altezza?: number
}) {
  const [ref, larghezza] = useLarghezza<HTMLDivElement>()
  const [indice, setIndice] = useState<number | null>(null)
  const id = useId().replace(/:/g, '')

  const margine = { alto: 12, destra: 12, basso: 28, sinistra: 40 }
  const w = Math.max(larghezza - margine.sinistra - margine.destra, 10)
  const h = altezza - margine.alto - margine.basso

  const massimo = useMemo(
    () => scalaTonda(Math.max(1, ...dati.flatMap((d) => serie.map((s) => Number(d[s.chiave]) || 0)))),
    [dati, serie],
  )

  const x = (i: number) => (dati.length <= 1 ? w / 2 : (i / (dati.length - 1)) * w)
  const y = (valore: number) => h - (valore / massimo) * h

  /** Curva morbida (Catmull-Rom convertita in Bezier), senza superare i punti. */
  const percorso = (chiave: string) => {
    const punti = dati.map((d, i) => [x(i), y(Number(d[chiave]) || 0)] as const)
    if (punti.length < 2) return punti.length ? `M${punti[0][0]},${punti[0][1]}` : ''
    let d = `M${punti[0][0]},${punti[0][1]}`
    for (let i = 0; i < punti.length - 1; i++) {
      const [x0, y0] = punti[i - 1] ?? punti[i]
      const [x1, y1] = punti[i]
      const [x2, y2] = punti[i + 1]
      const [x3, y3] = punti[i + 2] ?? punti[i + 1]
      const c1y = Math.min(h, Math.max(0, y1 + (y2 - y0) / 6))
      const c2y = Math.min(h, Math.max(0, y2 - (y3 - y1) / 6))
      d += ` C${x1 + (x2 - x0) / 6},${c1y} ${x2 - (x3 - x1) / 6},${c2y} ${x2},${y2}`
    }
    return d
  }

  const passoEtichette = Math.max(1, Math.ceil(dati.length / Math.max(2, Math.floor(w / 72))))

  const muovi = (clientX: number, sinistra: number) => {
    if (!dati.length) return
    const posizione = clientX - sinistra - margine.sinistra
    setIndice(Math.min(dati.length - 1, Math.max(0, Math.round((posizione / w) * (dati.length - 1)))))
  }

  const attivo = indice !== null ? dati[indice] : null

  return (
    <div ref={ref} className="relative w-full select-none" style={{ height: altezza }}>
      {larghezza > 0 && (
        <svg
          width={larghezza}
          height={altezza}
          role="img"
          aria-label={`Andamento di ${serie.map((s) => s.etichetta).join(' e ')} dal ${dati[0] ? giornoLungo(dati[0].data) : ''}`}
          onPointerMove={(e) => muovi(e.clientX, e.currentTarget.getBoundingClientRect().left)}
          onPointerLeave={() => setIndice(null)}
        >
          <defs>
            {serie.map((s) => (
              <linearGradient key={s.chiave} id={`${id}-${s.chiave}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={s.colore} stopOpacity="0.28" />
                <stop offset="100%" stopColor={s.colore} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          <g transform={`translate(${margine.sinistra},${margine.alto})`}>
            {[0, 1, 2, 3, 4].map((passo) => {
              const valore = (massimo / 4) * passo
              return (
                <g key={passo}>
                  <line x1={0} x2={w} y1={y(valore)} y2={y(valore)} stroke="rgb(255 255 255 / 0.06)" strokeDasharray={passo ? '3 4' : undefined} />
                  <text x={-10} y={y(valore)} dy="0.32em" textAnchor="end" className="fill-white/35 text-[11px]">
                    {numero(valore)}
                  </text>
                </g>
              )
            })}

            {dati.map((d, i) =>
              i % passoEtichette === 0 || i === dati.length - 1 ? (
                <text key={d.data} x={x(i)} y={h + 20} textAnchor={i === 0 ? 'start' : i === dati.length - 1 ? 'end' : 'middle'} className="fill-white/35 text-[11px]">
                  {giornoBreve(d.data)}
                </text>
              ) : null,
            )}

            {serie.map((s, n) => (
              <g key={s.chiave}>
                {n === 0 && <path d={`${percorso(s.chiave)} L${x(dati.length - 1)},${h} L${x(0)},${h} Z`} fill={`url(#${id}-${s.chiave})`} />}
                <path
                  d={percorso(s.chiave)}
                  fill="none"
                  stroke={s.colore}
                  strokeWidth={n === 0 ? 2.25 : 1.75}
                  strokeDasharray={n === 0 ? undefined : '5 4'}
                  strokeLinecap="round"
                />
              </g>
            ))}

            {attivo && indice !== null && (
              <g>
                <line x1={x(indice)} x2={x(indice)} y1={0} y2={h} stroke="rgb(255 255 255 / 0.18)" />
                {serie.map((s) => (
                  <circle key={s.chiave} cx={x(indice)} cy={y(Number(attivo[s.chiave]) || 0)} r={4} fill="#0d0d0d" stroke={s.colore} strokeWidth={2} />
                ))}
              </g>
            )}
          </g>
        </svg>
      )}

      {attivo && indice !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-[10rem] rounded-xl border border-white/10 bg-[#0f0f0f]/95 px-3.5 py-3 shadow-2xl backdrop-blur"
          style={{
            left: Math.min(Math.max(margine.sinistra + x(indice) - 80, 0), Math.max(larghezza - 170, 0)),
          }}
        >
          <p className="mb-2 text-meta capitalize text-white/60">{giornoLungo(attivo.data)}</p>
          {serie.map((s) => (
            <p key={s.chiave} className="flex items-center justify-between gap-4 text-micro text-white/80">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: s.colore }} />
                {s.etichetta}
              </span>
              <span className="font-semibold text-white">{numero(Number(attivo[s.chiave]) || 0)}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export type VoceBarra = { chiave: string; etichetta: ReactNode; secondaria?: ReactNode; valore: number; colore?: string }

export function Barre({ voci, totale, vuoto = 'Nessun dato nel periodo' }: { voci: VoceBarra[]; totale?: number; vuoto?: string }) {
  const massimo = Math.max(1, ...voci.map((v) => v.valore))
  const somma = totale ?? voci.reduce((t, v) => t + v.valore, 0)
  if (!voci.length) return <p className="py-6 text-center text-micro text-white/40">{vuoto}</p>
  return (
    <ul className="space-y-1.5">
      {voci.map((v, i) => (
        <li key={v.chiave} className="group relative overflow-hidden rounded-lg px-3 py-2">
          <span
            className="absolute inset-y-0 left-0 rounded-lg opacity-[0.14] transition-[width,opacity] duration-700 ease-out group-hover:opacity-25"
            style={{ width: `${(v.valore / massimo) * 100}%`, background: v.colore ?? 'rgb(var(--accento-1))', transitionDelay: `${i * 30}ms` }}
          />
          <span className="relative flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="truncate text-micro text-white/85">{v.etichetta}</span>
              {v.secondaria && <span className="hidden truncate text-meta text-white/35 sm:inline">{v.secondaria}</span>}
            </span>
            <span className="flex shrink-0 items-baseline gap-2">
              <span className="text-etichetta text-white">{numero(v.valore)}</span>
              {somma > 0 && <span className="w-11 text-right text-meta text-white/35">{percentuale(v.valore / somma)}</span>}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export function Anello({ voci, centro }: { voci: { chiave: string; etichetta: string; valore: number; colore: string }[]; centro: ReactNode }) {
  const totale = voci.reduce((t, v) => t + v.valore, 0)
  const raggio = 42
  const circonferenza = 2 * Math.PI * raggio
  let progressivo = 0

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-col xl:flex-row">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label="Ripartizione per dispositivo">
          <circle cx="50" cy="50" r={raggio} fill="none" stroke="rgb(255 255 255 / 0.06)" strokeWidth="10" />
          {totale > 0 &&
            voci.map((v) => {
              const lunghezza = (v.valore / totale) * circonferenza
              const segmento = (
                <circle
                  key={v.chiave}
                  cx="50"
                  cy="50"
                  r={raggio}
                  fill="none"
                  stroke={v.colore}
                  strokeWidth="10"
                  strokeDasharray={`${Math.max(lunghezza - 1.5, 0)} ${circonferenza}`}
                  strokeDashoffset={-progressivo}
                  strokeLinecap="butt"
                />
              )
              progressivo += lunghezza
              return segmento
            })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">{centro}</div>
      </div>
      <ul className="w-full space-y-2.5">
        {voci.map((v) => (
          <li key={v.chiave} className="flex items-center justify-between gap-3 text-micro">
            <span className="flex items-center gap-2.5 text-white/75">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: v.colore }} />
              {v.etichetta}
            </span>
            <span className="text-white">{totale ? percentuale(v.valore / totale) : '—'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Mini andamento senza assi, per le schede della panoramica. */
export function Scintilla({ valori, colore = 'rgb(var(--accento-1))', altezza = 48 }: { valori: number[]; colore?: string; altezza?: number }) {
  const id = useId().replace(/:/g, '')
  const massimo = Math.max(1, ...valori)
  const punti = valori.map((v, i) => `${valori.length <= 1 ? 50 : (i / (valori.length - 1)) * 100},${altezza - (v / massimo) * (altezza - 4) - 2}`)
  return (
    <svg viewBox={`0 0 100 ${altezza}`} preserveAspectRatio="none" className="w-full" style={{ height: altezza }} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={colore} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colore} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${altezza} ${punti.join(' ')} 100,${altezza}`} fill={`url(#${id})`} />
      <polyline points={punti.join(' ')} fill="none" stroke={colore} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  )
}
