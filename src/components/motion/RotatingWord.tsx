import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Sostituisce ciclicamente una parola facendola scorrere verso l'alto dietro
 * una maschera, mentre la successiva sale al suo posto.
 *
 * La larghezza e' riservata dalla parola piu' lunga, resa invisibile ma
 * presente nel flusso: senza, la riga si allargherebbe e restringerebbe a ogni
 * cambio, spostando il testo intorno.
 */
export default function RotatingWord({
  words,
  intervalMs = 2600,
  className = '',
}: {
  words: string[]
  intervalMs?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const [indice, setIndice] = useState(0)
  const [uscita, setUscita] = useState(false)

  useEffect(() => {
    if (reduced || words.length < 2) return

    const ciclo = setInterval(() => {
      setUscita(true)
      setTimeout(() => {
        setIndice((i) => (i + 1) % words.length)
        setUscita(false)
      }, 420)
    }, intervalMs)

    return () => clearInterval(ciclo)
  }, [reduced, words.length, intervalMs])

  const piuLunga = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  return (
    <span className={`rotating ${className}`}>
      <span className="rotating-spacer" aria-hidden="true">
        {piuLunga}
      </span>
      <span className="sr-only">{words.join(', ')}</span>
      <span className="rotating-viewport" aria-hidden="true">
        <span className={`rotating-word ${uscita ? 'is-leaving' : 'is-entering'}`}>
          {words[indice]}
        </span>
      </span>
    </span>
  )
}
