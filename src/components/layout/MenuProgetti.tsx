import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RAMI, ETICHETTA_STATO } from '../../content/rami'
import { costruisci, puntiInAttributo, RIENTRO } from '../../lib/nido'

/**
 * La tendina dei progetti: lo stesso nido della sezione in home, in miniatura.
 *
 * Prima era un pannello largo 576px con due colonne di voci, che scendeva di
 * lato coprendo mezza pagina: il mega menu che si vede su qualunque sito. Qui
 * la barra ripete la forma del sito invece di contraddirla, e il pannello e'
 * quadrato, quindi resta sotto al pulsante che l'ha aperto.
 *
 * Il reticolo e' lo stesso di `lib/nido`, costruito senza celle di contorno:
 * in una tendina il nido deve leggersi come una figura chiusa, non come un
 * ritaglio di qualcosa di piu' grande.
 */
export default function MenuProgetti({ id, attuale }: { id: string; attuale: string }) {
  // Senza margini: in una tendina il nido deve leggersi come una figura
  // chiusa, non come il ritaglio di qualcosa di piu' grande. Restano solo i
  // lati che toccano i rami, quindi il contorno esterno e' quello del nido.
  const n = useMemo(() => costruisci('largo', 0, 0), [])
  const [attivo, setAttivo] = useState<number | null>(null)

  const v = n.vista
  const statoLato = (rami: number[], eco: number[]) =>
    attivo === null ? undefined : rami.includes(attivo) ? 'acceso' : eco.includes(attivo) ? 'eco' : undefined

  return (
    <div
      id={id}
      className="menu-nido absolute left-1/2 top-[calc(100%+0.9rem)] w-[23rem] -translate-x-1/2 rounded-2xl border border-white/10 bg-brand-soft/95 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl"
    >
      <div
        className="nido nido-compatto"
        style={
          {
            '--nido-rapporto': n.rapporto.toFixed(5),
            '--rientro-x': RIENTRO.x,
            '--rientro-y': RIENTRO.y,
          } as React.CSSProperties
        }
      >
        <svg className="nido-rete" viewBox={`${v.x} ${v.y} ${v.larghezza} ${v.altezza}`} aria-hidden="true" focusable="false" preserveAspectRatio="none">
          {n.rami.map((r) => (
            <polygon
              key={r.indice}
              className="nido-fondo"
              data-stato={attivo === r.indice ? 'acceso' : undefined}
              points={puntiInAttributo(r.punti)}
            />
          ))}
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
              <li key={ramo.slug} className="nido-cella" style={cella.stile}>
                <Link
                  to={`/${ramo.slug}`}
                  aria-current={attuale === `/${ramo.slug}` ? 'page' : undefined}
                  aria-label={`${ramo.nome}${attesa ? ` — ${ETICHETTA_STATO[ramo.stato]}` : ''}: ${ramo.breve}`}
                  onPointerEnter={() => setAttivo(i)}
                  onPointerLeave={() => setAttivo(null)}
                  onFocus={() => setAttivo(i)}
                  onBlur={() => setAttivo(null)}
                  className="nido-scheda"
                  data-corrente={attuale === `/${ramo.slug}` || undefined}
                >
                  <ramo.Icon className="nido-icona" aria-hidden="true" />
                  <span className="nido-nome text-balance">{ramo.nome}</span>
                  {/* Nella cella non c'e' spazio per scriverlo: il puntino dice
                      che il ramo non e' ancora aperto, e la parola per esteso
                      sta nel nome accessibile del collegamento. */}
                  {attesa && <span className="nido-attesa" aria-hidden="true" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
