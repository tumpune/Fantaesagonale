import { PRESENTAZIONE, SLOGAN } from '../content/associazione'
import { LEGALE } from '../content/legale'
import { RECAPITI, SOCIALS } from '../content/navigazione'
import type { Faq } from '../content/rami'

/**
 * Dati strutturati (schema.org) per i motori di ricerca.
 *
 * Servono a far capire a Google che dietro al sito c'e' un'associazione con un
 * indirizzo e dei recapiti, e a far comparire le domande frequenti direttamente
 * nei risultati di ricerca. I valori arrivano dagli stessi file modificabili
 * dal pannello: nessun dato scritto due volte.
 */

const SITO = 'https://fantaesagonale.vercel.app'

/** I campi vuoti si tolgono: meglio niente che un dato finto. */
const senzaVuoti = <T extends Record<string, unknown>>(oggetto: T) =>
  Object.fromEntries(Object.entries(oggetto).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && !v.length)))

function Schema({ dati }: { dati: object }) {
  return (
    <script
      type="application/ld+json"
      // Il contenuto e' generato qui, non arriva dall'esterno.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dati).replace(/</g, '\\u003c') }}
    />
  )
}

export function SchemaAssociazione() {
  return (
    <Schema
      dati={senzaVuoti({
        '@context': 'https://schema.org',
        '@type': 'NGO',
        name: 'FantaEsagonale APS',
        alternateName: 'FantaEsagonale',
        url: SITO,
        logo: `${SITO}/img/logo.png`,
        description: PRESENTAZIONE,
        slogan: SLOGAN,
        foundingDate: '2023-08',
        email: RECAPITI.email || undefined,
        telephone: RECAPITI.telefono || undefined,
        address: senzaVuoti({
          '@type': 'PostalAddress',
          streetAddress: LEGALE.sedeLegale || undefined,
          addressLocality: 'Grammichele',
          addressRegion: 'CT',
          addressCountry: 'IT',
        }),
        sameAs: SOCIALS.map((s) => s.url).filter(Boolean),
      })}
    />
  )
}

/** Domande e risposte della pagina, per i risultati di ricerca estesi. */
export function SchemaDomande({ voci }: { voci: Faq[] }) {
  if (!voci.length) return null
  return (
    <Schema
      dati={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: voci.map((v) => ({
          '@type': 'Question',
          name: v.domanda,
          acceptedAnswer: { '@type': 'Answer', text: v.risposta },
        })),
      }}
    />
  )
}
