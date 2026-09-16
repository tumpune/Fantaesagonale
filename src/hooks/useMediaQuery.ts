import { useEffect, useState } from 'react'

/**
 * Una sola verifica per ogni domanda, condivisa da tutti i componenti.
 *
 * La home monta decine di elementi animati e ognuno chiedeva al browser la
 * propria copia della stessa media query, con il proprio ascoltatore: qui la
 * verifica e' una sola e gli interessati vengono avvisati insieme.
 */
type Registro = { mql: MediaQueryList; iscritti: Set<(valore: boolean) => void> }

const registri = new Map<string, Registro>()

function registro(query: string): Registro {
  const esistente = registri.get(query)
  if (esistente) return esistente

  const mql = window.matchMedia(query)
  const nuovo: Registro = { mql, iscritti: new Set() }
  mql.addEventListener('change', () => nuovo.iscritti.forEach((avvisa) => avvisa(mql.matches)))
  registri.set(query, nuovo)
  return nuovo
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const { mql, iscritti } = registro(query)
    setMatches(mql.matches)
    iscritti.add(setMatches)
    return () => {
      iscritti.delete(setMatches)
    }
  }, [query])

  return matches
}

// Distingue i dispositivi con un vero puntatore: gli effetti che inseguono il
// cursore non hanno senso su touch e li' vanno sostituiti o disattivati.
export const usePointerFine = () => useMediaQuery('(hover: hover) and (pointer: fine)')

// Chi ha attivato la riduzione del movimento nel sistema operativo non deve
// ricevere animazioni: vanno disattivate anche quelle guidate da JavaScript,
// che il CSS non puo' intercettare.
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
