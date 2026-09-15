import { Link } from 'react-router-dom'
import { RAMI, ETICHETTA_STATO } from '../content/rami'
import Reveal from './motion/Reveal'
import { focusRing } from './ui/styles'

/**
 * Mappa esagonale dei progetti.
 *
 * Il questionario chiede che il sito mostri "le diverse anime del brand" e che
 * ogni visitatore trovi subito cio' che cerca (2.1). L'esagono e' la forma del
 * logo e la pianta di Grammichele: qui smette di essere decorazione e diventa
 * la navigazione stessa. Ogni cella porta il tema del proprio ramo, cosi' il
 * colore anticipa gia' dove si sta per entrare.
 */
export default function Alveare() {
  return (
    // Le colonne pari scendono di mezza cella e sporgerebbero sotto la lista.
    // Il padding in percentuale si calcola sulla larghezza: una cella alta
    // 1/0.866 della propria colonna, che e' meta' della larghezza su due
    // colonne e un quarto su quattro, sporge di circa 29% e 14,5%.
    <ul className="alveare mx-auto grid max-w-5xl grid-cols-2 gap-x-3 gap-y-2 pb-[30%] sm:gap-x-5 lg:grid-cols-4 lg:pb-[15%]">
      {RAMI.map((ramo, i) => (
        <li key={ramo.slug} data-tema={ramo.tema}>
          <Reveal variant="scale" delay={i * 60}>
            <Link
              to={`/${ramo.slug}`}
              className={`group relative block aspect-[0.866] ${focusRing} rounded-lg`}
            >
              {/* Bordo: un esagono pieno di colore con sopra un esagono piu'
                  piccolo del colore di fondo. clip-path taglia i bordi CSS,
                  quindi il contorno va costruito cosi'. */}
              <span className="esagono absolute inset-0 bg-gradient-to-br from-accento-1/50 to-accento-2/40 transition-opacity duration-500 group-hover:from-accento-1 group-hover:to-accento-2" />
              <span className="esagono absolute inset-[2px] bg-brand-card transition-colors duration-500 group-hover:bg-brand-soft" />

              <span className="relative flex h-full flex-col items-center justify-center px-[14%] text-center transition-transform duration-500 group-hover:-translate-y-1">
                <span className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accento-1 to-accento-2 text-black transition-transform duration-500 group-hover:scale-110 sm:mb-3 sm:h-12 sm:w-12">
                  <ramo.Icon size={20} aria-hidden="true" />
                </span>
                <span className="text-etichetta leading-tight text-white sm:text-sottotitolo">
                  {ramo.nome}
                </span>
                <span className="mt-1 hidden text-micro leading-snug text-white/55 xs:block">
                  {ramo.breve}
                </span>
                {ramo.stato !== 'attivo' && (
                  <span className="mt-2 rounded-full border border-white/15 px-2 py-0.5 text-meta uppercase text-white/50">
                    {ETICHETTA_STATO[ramo.stato]}
                  </span>
                )}
              </span>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
