import { Link } from 'react-router-dom'
import Reveal from '../components/motion/Reveal'
import { FAQ_GENERALI } from '../content/associazione'
import { RAMI } from '../content/rami'
import { CtaBanner, FaqLista, PageHero, Section, SectionHead, btnPrimary } from '../components/ui'

/**
 * FAQ generali, piu' quelle di ogni ramo raccolte in un unico posto
 * (questionario 4.1). Le domande dei rami restano anche nelle rispettive
 * pagine: chi arriva direttamente li' non deve passare da qui per trovarle.
 */
export default function Faq() {
  const ramiConFaq = RAMI.filter((r) => r.faq.length > 0)

  return (
    <>
      <PageHero eyebrow="Domande frequenti" title="Tutto quello che" highlight="vuoi sapere">
        Le risposte alle domande più comuni su FantaEsagonale e sui suoi progetti. Non trovi quello
        che cerchi? Scrivici.
      </PageHero>

      <Section alt>
        <SectionHead eyebrow="Generali" title="FantaEsagonale in breve" />
        <FaqLista voci={FAQ_GENERALI} />
      </Section>

      {ramiConFaq.map((ramo, i) => (
        <section
          key={ramo.slug}
          data-tema={ramo.tema}
          className={`px-5 py-16 sm:px-8 sm:py-20 lg:px-12 ${i % 2 === 1 ? 'bg-brand-soft' : ''}`}
        >
          <Reveal className="mx-auto mb-8 flex max-w-3xl items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accento-1 to-accento-2 text-black">
              <ramo.Icon size={20} aria-hidden="true" />
            </span>
            <h2 className="text-titolo text-white">{ramo.nome}</h2>
            <Link
              to={`/${ramo.slug}`}
              className="link-underline ml-auto hidden text-etichetta text-accento-1 sm:inline-block"
            >
              Vai alla pagina
            </Link>
          </Reveal>
          <FaqLista voci={ramo.faq} />
        </section>
      ))}

      <CtaBanner
        title="Non hai trovato la risposta?"
        action={
          <Link to="/contatti" className={btnPrimary}>
            Scrivici
          </Link>
        }
      />
    </>
  )
}
