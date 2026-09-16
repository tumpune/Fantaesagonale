import { Link } from 'react-router-dom'
import { Hash, Mic, Send, Video, type LucideIcon } from 'lucide-react'
import CampaignCountdown from '../components/CampaignCountdown'
import Reveal from '../components/motion/Reveal'
import { ramoDaSlug } from '../content/rami'
import { CtaBanner, FaqLista, FeatureCard, PageHero, Section, SectionHead, btnPrimary } from '../components/ui'

/**
 * Italia Campione 2030 ha una pagina propria — il conto alla rovescia e la
 * linea del tempo non esistono altrove — ma i testi arrivano dallo stesso
 * file degli altri progetti: cosi' anche questa pagina si aggiorna dal
 * pannello, invece di restare l'unica scritta nel codice.
 */

/** Icona del canale riconosciuta dal nome, con un ripiego neutro. */
const ICONE_CANALI: [RegExp, LucideIcon][] = [
  [/youtube|video/i, Video],
  [/instagram|facebook/i, Hash],
  [/tiktok/i, Mic],
  [/telegram|whatsapp/i, Send],
]

const iconaCanale = (titolo: string) => ICONE_CANALI.find(([regola]) => regola.test(titolo))?.[1] ?? Hash

export default function ItaliaCampione2030() {
  const ramo = ramoDaSlug('italia-campione-2030')
  if (!ramo) return null

  const [titolo, ...resto] = ramo.nome.split(' ')

  return (
    <>
      <PageHero eyebrow={ramo.occhiello} title={titolo} highlight={resto.join(' ')}>
        {ramo.intro}
      </PageHero>

      <Section alt width="narrow">
        <SectionHead eyebrow="La challenge in numeri" title="Un video al giorno, fino alla finale" />
        <CampaignCountdown />
      </Section>

      {ramo.tappe && ramo.tappe.length > 0 && (
        <Section width="narrow">
          <SectionHead eyebrow="La linea del tempo" title="Dalla delusione alla finale" />
          <ol className="grid gap-4">
            {ramo.tappe.map((tappa, i) => (
              <Reveal key={tappa.quando} as="li" variant="left" delay={i * 110}>
                <div className="card-hover grid gap-2 rounded-xl border border-white/[0.06] bg-brand-card p-5 hover:border-accento-1/40 sm:grid-cols-[140px_1fr] sm:gap-4">
                  <span className="text-etichetta text-accento-1">{tappa.quando}</span>
                  <p className="text-corpo text-white/60 text-pretty">{tappa.testo}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Section>
      )}

      {ramo.offerta.length > 0 && (
        <Section alt>
          <SectionHead
            eyebrow="Segui il progetto"
            title="Dove trovare i video quotidiani"
            subtitle={ramo.perChi}
          />
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {ramo.offerta.map((canale, i) => (
              <Reveal key={canale.titolo} delay={i * 90}>
                <FeatureCard Icon={iconaCanale(canale.titolo)} title={canale.titolo}>
                  {canale.testo}
                </FeatureCard>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {ramo.faq.length > 0 && (
        <section id="faq" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
          <SectionHead eyebrow="Domande frequenti" title="Le domande più comuni" />
          <FaqLista voci={ramo.faq} />
        </section>
      )}

      <CtaBanner
        title="Vuoi seguire ogni giorno la sfida verso il 2030?"
        action={
          <Link to={`/contatti?oggetto=${ramo.cta.oggetto}`} className={btnPrimary}>
            {ramo.cta.etichetta}
          </Link>
        }
      />
    </>
  )
}
