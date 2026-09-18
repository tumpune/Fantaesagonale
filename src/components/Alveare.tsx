import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RAMI, ETICHETTA_STATO } from '../content/rami'
import { favo } from '../lib/favo'

/**
 * Alveare dei progetti: un favo vero, non una griglia.
 *
 * Gli esagoni hanno la punta in alto e le file sono sfalsate di mezzo passo,
 * quindi ogni cella tocca le vicine come in un favo. Prima erano esagoni
 * isolati dentro una griglia a colonne, con bande di vuoto fra l'uno e l'altro.
 *
 * L'esagono e' la forma del logo ed e' la pianta di Grammichele: qui smette di
 * essere decorazione e diventa la navigazione. Ogni cella porta il tema del
 * proprio ramo, cosi' il colore anticipa dove si sta per entrare.
 */
export default function Alveare() {
  // Due celle per fila sul telefono, tre da tablet in su. Con 8 rami escono
  // 2-1-2-1-2 e 3-2-3; con 7, 2-3-2; con 9, 3-3-3.
  const disposizioni = useMemo(
    () => ({ sm: favo(RAMI.length, 2), md: favo(RAMI.length, 3), lg: favo(RAMI.length, 3) }),
    [],
  )

  // Celle adiacenti a quella toccata: arretrano appena, cosi' il favo si apre
  // attorno alla scelta invece di comportarsi come schede indipendenti.
  const [vicine, setVicine] = useState<number[]>([])

  const accendi = (indice: number) => {
    const misura = window.innerWidth >= 640 ? 'md' : 'sm'
    setVicine(disposizioni[misura].celle[indice].vicine)
  }

  return (
    <ul
      className="favo favo-entra mx-auto w-full max-w-[26rem] sm:max-w-[46rem] lg:max-w-[52rem]"
      style={
        {
          '--favo-rapporto-sm': disposizioni.sm.rapporto,
          '--favo-rapporto-md': disposizioni.md.rapporto,
          '--favo-rapporto-lg': disposizioni.lg.rapporto,
        } as React.CSSProperties
      }
    >
      {RAMI.map((ramo, i) => (
        <li
          key={ramo.slug}
          data-tema={ramo.tema}
          data-vicina={vicine.includes(i) ? '' : undefined}
          onPointerEnter={() => accendi(i)}
          onPointerLeave={() => setVicine([])}
          style={
            {
              '--x-sm': disposizioni.sm.celle[i].x,
              '--y-sm': disposizioni.sm.celle[i].y,
              '--w-sm': disposizioni.sm.celle[i].w,
              '--ritardo-sm': disposizioni.sm.celle[i].ritardo,
              '--x-md': disposizioni.md.celle[i].x,
              '--y-md': disposizioni.md.celle[i].y,
              '--w-md': disposizioni.md.celle[i].w,
              '--ritardo-md': disposizioni.md.celle[i].ritardo,
              '--x-lg': disposizioni.lg.celle[i].x,
              '--y-lg': disposizioni.lg.celle[i].y,
              '--w-lg': disposizioni.lg.celle[i].w,
              '--ritardo-lg': disposizioni.lg.celle[i].ritardo,
            } as React.CSSProperties
          }
        >
          <Link
            to={`/${ramo.slug}`}
            aria-label={`${ramo.nome}: ${ramo.breve}`}
            onFocus={() => accendi(i)}
            onBlur={() => setVicine([])}
            className="favo-legame group"
          >
            {/* Il contorno e' un esagono pieno con sopra uno piu' piccolo del
                colore di fondo: clip-path taglia i bordi veri, quindi il
                profilo va costruito cosi'. */}
            <span className="esagono esagono-bordo bg-white/[0.18] transition-colors duration-500 group-hover:bg-accento-1" />
            <span className="esagono esagono-fondo bg-brand-card transition-colors duration-500 group-hover:bg-[#1d1d1d]" />

            <span className="favo-contenuto flex flex-col items-center justify-center text-center">
              <ramo.Icon
                size={22}
                aria-hidden="true"
                className="mb-2.5 shrink-0 text-accento-1 transition-transform duration-500 group-hover:-translate-y-0.5"
              />
              {/* Due righe al massimo: il testo non e' dentro il ritaglio, e un
                  nome lungo con i caratteri ingranditi uscirebbe dai lati obliqui. */}
              <span className="line-clamp-2 text-etichetta leading-tight text-white sm:text-sottotitolo">
                {ramo.nome}
              </span>
              <span className="mt-1 hidden line-clamp-2 text-micro leading-snug text-white/55 xs:block">
                {ramo.breve}
              </span>
              {ramo.stato !== 'attivo' && (
                <span className="mt-2 rounded border border-white/15 px-1.5 py-0.5 text-meta uppercase text-white/55">
                  {ETICHETTA_STATO[ramo.stato]}
                </span>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
