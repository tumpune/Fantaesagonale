import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RAMI, ETICHETTA_STATO } from '../content/rami'
import { costruisci, latoInPath, puntiInAttributo, RIENTRO, type NomeSchema } from '../lib/nido'

/**
 * Il nido d'api dei progetti.
 *
 * Non sono esagoni affiancati: e' un reticolo unico e continuo, dove due celle
 * vicine condividono lo stesso lato. Il reticolo prosegue oltre i rami con
 * celle vuote e viene tagliato dai bordi della sezione, come un nido vero che
 * continua fuori dall'inquadratura.
 *
 * Tutto il filo sta in un solo <svg>, perche' e' l'unico modo di avere un lato
 * condiviso disegnato una volta sola: con un ritaglio per cella si otterrebbero
 * un filo doppio e, sul fondo quasi nero, le fessure sottili di antialiasing
 * che fanno sembrare il lavoro non finito. Il contenuto invece resta HTML vero
 * sopra al reticolo: icona, nome, descrizione e pulsante.
 *
 * Quando si punta un ramo si accendono i lati che lo uniscono agli altri rami:
 * e' il collegamento fra le parti di FantaEsagonale, reso visibile.
 */

/**
 * Quante celle vuote attorno ai rami, e quanto larga puo' farsi la sezione.
 *
 * I margini sono frazionari di proposito: l'ultimo anello viene tagliato dal
 * bordo e restano celle parziali. Sul telefono il contorno e' quasi assente,
 * perche' li' ogni pixel di larghezza serve al contenuto.
 */
const DISPOSIZIONI: Record<string, { schema: NomeSchema; margineX: number; margineY: number; max: string }> = {
  stretto: { schema: 'stretto', margineX: 0.14, margineY: 0.1, max: '26rem' },
  medio: { schema: 'largo', margineX: 0.75, margineY: 0.38, max: '46rem' },
  largo: { schema: 'largo', margineX: 1.2, margineY: 0.5, max: '68rem' },
}

/** Le tre soglie, dalla piu' larga alla piu' stretta. */
const SOGLIE: [string, string][] = [
  ['(min-width: 1024px)', 'largo'],
  ['(min-width: 640px)', 'medio'],
]

/**
 * Quale disposizione vale ora.
 *
 * Il numero di celle di contorno cambia con la larghezza, quindi le tre
 * disposizioni non possono convivere nel DOM come semplici variabili CSS: il
 * reticolo va ridisegnato. `matchMedia` cambia solo alla soglia, non a ogni
 * pixel trascinato, quindi non c'e' nulla da limitare in frequenza.
 */
function useDisposizione() {
  const scegli = () =>
    typeof window === 'undefined'
      ? 'largo'
      : (SOGLIE.find(([q]) => window.matchMedia(q).matches)?.[1] ?? 'stretto')

  const [nome, setNome] = useState(scegli)

  useEffect(() => {
    const liste = SOGLIE.map(([q]) => window.matchMedia(q))
    const aggiorna = () => setNome(scegli())
    liste.forEach((l) => l.addEventListener('change', aggiorna))
    aggiorna()
    return () => liste.forEach((l) => l.removeEventListener('change', aggiorna))
  }, [])

  return nome
}

export default function Nido() {
  const disposizione = useDisposizione()
  const cfg = DISPOSIZIONI[disposizione]
  const n = useMemo(() => costruisci(cfg.schema, cfg.margineX, cfg.margineY), [cfg])

  /** Ramo puntato o a fuoco: accende i suoi lati e quelli dei vicini. */
  const [attivo, setAttivo] = useState<number | null>(null)

  const v = n.vista
  const vistaSvg = `${v.x.toFixed(4)} ${v.y.toFixed(4)} ${v.larghezza.toFixed(4)} ${v.altezza.toFixed(4)}`

  /** Un solo path per tutti i lati di contorno: centinaia di segmenti, una
   *  sola forma da disegnare, e nessuno di loro deve mai cambiare da solo. */
  const contorno = useMemo(() => n.latiEsterni.map(latoInPath).join(''), [n])

  const statoLato = (rami: number[], eco: number[]) =>
    attivo === null ? undefined : rami.includes(attivo) ? 'acceso' : eco.includes(attivo) ? 'eco' : undefined

  return (
    <div
      className="nido mx-auto w-full"
      style={
        {
          '--nido-rapporto': n.rapporto.toFixed(5),
          '--rientro-x': RIENTRO.x,
          '--rientro-y': RIENTRO.y,
          maxWidth: cfg.max,
        } as React.CSSProperties
      }
    >
      {/* Il reticolo e' decorazione: non entra nella lettura ne' nella
          tabulazione, e non intercetta il puntatore. La navigazione vera sono
          gli otto collegamenti del livello sopra. */}
      <svg className="nido-rete" viewBox={vistaSvg} aria-hidden="true" focusable="false" preserveAspectRatio="none">
        <defs>
          <radialGradient id="nido-sfumatura">
            <stop offset="0.55" stopColor="#ffffff" />
            <stop offset="1" stopColor="#4a4a4a" />
          </radialGradient>
          <mask id="nido-maschera">
            <rect x={v.x} y={v.y} width={v.larghezza} height={v.altezza} fill="url(#nido-sfumatura)" />
          </mask>
        </defs>

        <g mask="url(#nido-maschera)">
          <path className="rete-contorno" d={contorno} />
        </g>

        {/* Il fondo delle celle dei rami: un poligono pieno che condivide i
            vertici col reticolo, quindi niente fessure fra fondo e filo. */}
        {n.rami.map((r) => (
          <polygon
            key={r.indice}
            className="nido-fondo"
            data-stato={attivo === r.indice ? 'acceso' : undefined}
            points={puntiInAttributo(r.punti)}
          />
        ))}

        {/* I lati che toccano un ramo restano segmenti separati: ognuno deve
            poter cambiare colore da solo. Sono poche decine. */}
        {n.latiAttivi.map((l, i) => (
          <line
            key={i}
            className="rete-ramo"
            data-stato={statoLato(l.rami, l.eco)}
            data-condiviso={l.condiviso ? '' : undefined}
            x1={l.a[0]}
            y1={l.a[1]}
            x2={l.b[0]}
            y2={l.b[1]}
          />
        ))}
      </svg>

      <ul className="nido-livello">
        {RAMI.map((ramo, i) => {
          const cella = n.rami[i]
          if (!cella) return null
          const attesa = ramo.stato !== 'attivo'
          return (
            <li key={ramo.slug} className="nido-cella" style={{ ...cella.stile, '--ritardo': `${i * 60}ms` } as React.CSSProperties}>
              <Link
                to={`/${ramo.slug}`}
                aria-label={`${ramo.nome}: ${ramo.breve}`}
                className="nido-scheda"
                onPointerEnter={() => setAttivo(i)}
                onPointerLeave={() => setAttivo(null)}
                onFocus={() => setAttivo(i)}
                onBlur={() => setAttivo(null)}
              >
                {/* Il nome della cella descrive gia' il ramo; la descrizione
                    breve sta sulla pagina di destinazione. Dentro un esagono non
                    ci starebbe a nessuna larghezza senza troncarsi a meta' parola,
                    perche' la cella si stringe verso le punte. */}
                <ramo.Icon className="nido-icona" aria-hidden="true" />
                <span className="nido-nome text-balance">{ramo.nome}</span>
                {/* Non e' un <button>: un pulsante vero dentro un collegamento
                    e' markup non valido. E' l'aspetto del pulsante dato alla
                    fine del collegamento, che resta uno solo e copre la cella.
                    Sui rami non ancora aperti dice a che punto sono, cosi' non
                    si promette una pagina che non c'e' ancora. */}
                <span className="nido-pulsante" data-attesa={attesa ? '' : undefined}>
                  {attesa ? ETICHETTA_STATO[ramo.stato] : 'Scopri'}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
