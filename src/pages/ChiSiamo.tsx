import { Link } from 'react-router-dom'
import Reveal from '../components/motion/Reveal'
import Alveare from '../components/Alveare'
import { testimonianzeDi } from '../content/testimonianze'
import { DISTINTIVO, MISSIONE, PRINCIPI, STORIA, VISIONE } from '../content/associazione'
import {
  CtaBanner,
  Guida,
  HighlightPanel,
  PageHero,
  Section,
  SectionHead,
  Testimonianze,
  btnPrimary,
} from '../components/ui'

/**
 * Il questionario (2.1) chiede che "Chi siamo" sia particolarmente solida,
 * con testimonianze e contenuti di presentazione: e' la pagina che deve
 * convincere tanto chi partecipa quanto le aziende che valutano di collaborare.
 */
export default function ChiSiamo() {
  return (
    <>
      <PageHero eyebrow="Chi siamo" title="La nostra" highlight="storia">
        FantaEsagonale APS nasce a Grammichele nell'agosto 2023 da un fantacalcio a listone. Da luglio
        2024 è diventata un ecosistema che unisce sport, intrattenimento, eventi, marketing e
        territorio.
      </PageHero>

      <Section alt>
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal variant="left">
            <p className="mb-4 text-occhiello uppercase text-accento-1">La visione</p>
            <p className="text-guida text-white/85 text-pretty">{VISIONE}</p>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <p className="mb-4 text-occhiello uppercase text-accento-1">Cosa ci distingue</p>
            <Guida>{DISTINTIVO}</Guida>
          </Reveal>
        </div>
      </Section>

      <Section width="narrow">
        <SectionHead eyebrow="Il percorso" title="Dal fantacalcio a un ecosistema" />
        <ol className="relative grid gap-4 before:absolute before:bottom-4 before:left-[1.4rem] before:top-4 before:w-px before:bg-gradient-to-b before:from-accento-1 before:to-accento-2/20">
          {STORIA.map((tappa, i) => (
            <Reveal key={`${tappa.quando}-${i}`} as="li" variant="left" delay={i * 100}>
              <div className="relative flex gap-5">
                <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-accento-1/40 bg-brand-black text-meta text-accento-1">
                  {i + 1}
                </span>
                <div className="flex-1 rounded-2xl border border-white/[0.06] bg-brand-card p-5">
                  <p className="mb-1 text-etichetta text-accento-1">{tappa.quando}</p>
                  <p className="text-corpo text-white/70">{tappa.testo}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section alt width="narrow">
        <HighlightPanel eyebrow="La missione" title="Dare valore al tempo libero">
          {MISSIONE}
        </HighlightPanel>
      </Section>

      <Section>
        <SectionHead
          eyebrow="I nostri principi"
          title="Come lavoriamo"
          subtitle="I valori che guidano lo staff, con la community e con i partner."
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPI.map((principio, i) => (
            <Reveal key={`${principio.nome}-${i}`} as="li" delay={i * 80}>
              <div className="card-hover h-full rounded-2xl border border-white/[0.06] bg-brand-card p-6 hover:border-accento-1/40">
                <span className="mb-4 block h-1 w-10 rounded-full bg-gradient-to-r from-accento-1 to-accento-2" />
                <h3 className="mb-2 text-sottotitolo text-white">{principio.nome}</h3>
                <p className="text-corpo text-white/60">{principio.testo}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <section className="bg-brand-soft px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <SectionHead
          eyebrow="I progetti"
          title="Le anime di FantaEsagonale"
          subtitle="Ogni ramo ha la sua pagina: scegli quello che ti interessa."
        />
        <Alveare />
      </section>

      <Section>
        <SectionHead eyebrow="Testimonianze" title="Cosa dice chi ci conosce" />
        <Testimonianze voci={testimonianzeDi()} />
      </Section>

      <CtaBanner
        title="Vuoi far parte del progetto?"
        action={
          <Link to="/contatti" className={btnPrimary}>
            Contattaci
          </Link>
        }
      />
    </>
  )
}
