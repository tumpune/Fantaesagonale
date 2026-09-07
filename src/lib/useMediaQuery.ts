import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

// Lo spotlight segue il cursore: su touch non esiste, quindi la hero resterebbe
// permanentemente desaturata. Serve a scegliere la variante a colori.
export const usePointerFine = () => useMediaQuery('(hover: hover) and (pointer: fine)')
