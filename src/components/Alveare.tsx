import { Link } from 'react-router-dom'
import { RAMI, ETICHETTA_STATO } from '../content/rami'
import { focusRing } from './ui/styles'

/**
 * Alveare dei progetti: un favo vero, non una griglia.
 *
 * Gli esagoni hanno la punta in alto e le file sono sfalsate di mezza cella,
 * quindi ogni cella tocca le sei vicine come in un favo. Prima erano esagoni
 * isolati dentro una griglia a colonne, con vuoti evidenti fra l'uno e l'altro.
 *
 * L'esagono e' la forma del logo ed e' la pianta di Grammichele: qui smette di
 * essere decorazione e diventa la navigazione. Ogni cella porta il tema del
 * proprio ramo, cosi' il colore anticipa dove si sta per entrare.
 */

/** Altezza di un esagono a punta in alto, in rapporto alla sua larghezza. */
const RAPPORTO = 2 / Math.sqrt(3)

/** Quanto si sovrappongono le file: la punta di una entra nella fila sopra. */
const PASSO_VERTICALE = 0.75

type Disposizione = { x: number; y: number; distanza: number }[]

/**
 * Divide le celle in file (es. 3-2-3) e calcola la posizione di ognuna in
 * frazioni della larghezza totale, cosi' il favo scala con il contenitore.
 * `distanza` misura quanto la cella e' lontana dal centro del favo: serve a
 * far entrare gli esagoni dal centro verso l'esterno.
 */
function disponi(quante: number, perFila: number) {
  const file: number[] = []
  for (let restanti = quante; restanti > 0; ) {
    // Le file si alternano: quella piena, poi una piu' corta incastrata sotto.
    const piena = file.length % 2 === 0
    const misura = Math.min(restanti, piena ? perFila : Math.max(perFila - 1, 1))
    file.push(misura)
    restanti -= misura
  }

  const larghezzaMax = Math.max(...file.map((n, i) => n + (i % 2 === 0 ? 0 : 0.5)))
  const larghezzaCella = 1 / larghezzaMax
  const altezzaCella = larghezzaCella * RAPPORTO
  const altezzaTotale = altezzaCella * (1 + (file.length - 1) * PASSO_VERTICALE)

  const celle: Disposizione = []
  const centro = { x: 0.5, y: altezzaTotale / 2 }

  file.forEach((quantita, fila) => {
    const larghezzaFila = quantita * larghezzaCella
    const partenza = (1 - larghezzaFila) / 2
    for (let i = 0; i < quantita; i++) {
      const x = partenza + i * larghezzaCella
      const y = fila * altezzaCella * PASSO_VERTICALE
      celle.push({
        x,
        y,
        distanza: Math.hypot(x + larghezzaCella / 2 - centro.x, y + altezzaCella / 2 - centro.y),
      })
    }
  })

  return { celle, larghezzaCella, altezzaTotale, rapporto: 1 / altezzaTotale }
}

/** Tre disposizioni: due per fila sul telefono, tre da tablet in su. */
const PICCOLO = 'sm'
const MISURE = ['sm', 'md', 'lg'] as const

export default function Alveare() {
  const disposizioni = {
    sm: disponi(RAMI.length, 2),
    md: disponi(RAMI.length, 3),
    lg: disponi(RAMI.length, 3),
  }

  const massimaDistanza = Math.max(...disposizioni.lg.celle.map((c) => c.distanza)) || 1

  return (
    <ul
      className="favo relative mx-auto w-full max-w-[26rem] sm:max-w-[46rem] lg:max-w-[52rem]"
      style={
        {
          '--favo-rapporto-sm': disposizioni.sm.rapporto,
          '--favo-rapporto-md': disposizioni.md.rapporto,
          '--favo-rapporto-lg': disposizioni.lg.rapporto,
        } as React.CSSProperties
      }
    >
      {RAMI.map((ramo, i) => {
        const posizioni = Object.fromEntries(
          MISURE.map((misura) => {
            const { celle, larghezzaCella } = disposizioni[misura]
            const cella = celle[i]
            return [
              misura,
              {
                x: `${(cella.x * 100).toFixed(4)}%`,
                y: `${((cella.y / disposizioni[misura].altezzaTotale) * 100).toFixed(4)}%`,
                w: `${(larghezzaCella * 100).toFixed(4)}%`,
              },
            ]
          }),
        )

        return (
          <li
            key={ramo.slug}
            data-tema={ramo.tema}
            className="favo-cella absolute"
            style={
              {
                '--x-sm': posizioni[PICCOLO].x,
                '--y-sm': posizioni[PICCOLO].y,
                '--w-sm': posizioni[PICCOLO].w,
                '--x-md': posizioni.md.x,
                '--y-md': posizioni.md.y,
                '--w-md': posizioni.md.w,
                '--x-lg': posizioni.lg.x,
                '--y-lg': posizioni.lg.y,
                '--w-lg': posizioni.lg.w,
                // L'entrata parte dal centro del favo e si propaga verso l'esterno.
                '--ritardo': `${Math.round((disposizioni.lg.celle[i].distanza / massimaDistanza) * 260)}ms`,
              } as React.CSSProperties
            }
          >
            <Link
              to={`/${ramo.slug}`}
              className={`favo-legame group relative block ${focusRing}`}
              aria-label={`${ramo.nome}: ${ramo.breve}`}
            >
              {/* Il contorno e' un esagono pieno con sopra uno piu' piccolo del
                  colore di fondo: clip-path taglia i bordi CSS, quindi il
                  profilo va costruito cosi'. */}
              <span className="esagono absolute inset-0 bg-white/[0.18] transition-colors duration-500 group-hover:bg-accento-1" />
              <span className="esagono absolute inset-[1.5px] bg-brand-card transition-colors duration-500 group-hover:bg-[#1d1d1d]" />
              {/* Velo nel colore del ramo: invisibile da fermo, appena percettibile
                  al passaggio del mouse. */}
              <span className="esagono absolute inset-[1.5px] bg-accento-1/[0.05] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <span className="relative flex h-full flex-col items-center justify-center px-[16%] text-center">
                <ramo.Icon
                  size={22}
                  aria-hidden="true"
                  className="mb-2.5 text-accento-1 transition-transform duration-500 group-hover:-translate-y-0.5"
                />
                <span className="text-etichetta leading-tight text-white sm:text-sottotitolo">{ramo.nome}</span>
                <span className="mt-1 hidden text-micro leading-snug text-white/55 xs:block">{ramo.breve}</span>
                {ramo.stato !== 'attivo' && (
                  <span className="mt-2 rounded border border-white/15 px-1.5 py-0.5 text-meta uppercase text-white/55">
                    {ETICHETTA_STATO[ramo.stato]}
                  </span>
                )}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
