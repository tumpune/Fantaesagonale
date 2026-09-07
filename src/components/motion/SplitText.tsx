import { useInView } from '../../hooks/useInView'

/**
 * Rivela un titolo parola per parola: ogni parola sale da dietro una maschera,
 * come se fosse stampata riga per riga. E' l'effetto che da' peso a un titolo,
 * molto piu' di una dissolvenza complessiva.
 *
 * Le parole sono nodi di testo normali, senza copia nascosta di riserva: una
 * seconda copia verrebbe inclusa nella selezione e nel copia-incolla, facendo
 * comparire il titolo due volte. Lo spazio divisorio sta fuori dalla maschera,
 * altrimenti overflow:hidden lo ritaglia e le parole si attaccano fra loro.
 */
export default function SplitText({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  step = 70,
  immediate = false,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  step?: number
  immediate?: boolean
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.2 })
  const words = text.split(' ')
  const visible = immediate || inView

  return (
    <span ref={ref} className={`split ${className}`}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="split-mask">
            <span
              className={`split-word ${visible ? 'is-visible' : ''} ${wordClassName}`}
              style={{ transitionDelay: `${delay + i * step}ms` }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}
