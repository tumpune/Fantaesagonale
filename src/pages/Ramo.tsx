import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import Reveal from '../components/motion/Reveal'
import { ETICHETTA_STATO, type Ramo as RamoTipo } from '../content/rami'
import { testimonianzeDi } from '../content/testimonianze'
import {
  CtaBanner,
  FaqLista,
  PageHero,
  Section,
  SectionHead,
  Testimonianze,
  btnPrimary,
  btnSecondary,
} from '../components/ui'

/**
 * Modello comune per le pagine dei rami.
 *
 * Il questionario chiede che ogni settore abbia contenuti propri, FAQ
 * specifiche e testimonianze coerenti con quel servizio (4.1, 4.4), e che chi
 * arriva da un link dedicato atterri direttamente li' (2.2). Un solo modello
 * garantisce che ogni ramo abbia tutti questi pezzi, nello stesso ordine.
 */
export default function Ramo({ ramo }: { ramo: RamoTipo }) {
  const contatto = `/contatti?oggetto=${ramo.cta.oggetto}`

  return (
    <>
      <PageHero
        eyebrow={ramo.occhiello}
        highlight={ramo.nome}
        claim={ramo.titolo}
        extra={
          ramo.stato !== 'attivo' && (
            <span className="rounded-full border border-white/20 px-3 py-1 text-meta uppercase text-white/70">
              {ETICHETTA_STATO[ramo.stato]}
            </span>
          )
        }
        actions={
          <>
            <Link to={contatto} className={btnPrimary}>
              {ramo.cta.etichetta}
            </Link>
            <a href="#faq" className={btnSecondary}>
              Domande frequenti
            </a>
          </>
        }
      >
        {ramo.intro}
      </PageHero>

      <Section alt>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal variant="left">
            <p className="mb-4 text-occhiello uppercase text-accento-1">Per chi è</p>
            <p className="text-sottotitolo text-white/90 text-pretty">{ramo.perChi}</p>
            {ramo.nota && (
              <p className="mt-6 rounded-xl border border-accento-1/25 bg-accento-1/[0.06] px-5 py-4 text-corpo text-white/80">
                {ramo.nota}
              </p>
            )}
          </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2">
            {ramo.offerta.map((voce, i) => (
              <Reveal key={voce.titolo} as="li" variant="right" delay={i * 80}>
                <div className="card-hover h-full rounded-2xl border border-white/[0.06] bg-brand-card p-6 hover:border-accento-1/40">
                  <span className="card-icon mb-4 grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-accento-1 to-accento-2 text-black">
                    <Check size={17} aria-hidden="true" />
                  </span>
                  <h2 className="mb-2 text-sottotitolo text-white">{voce.titolo}</h2>
                  <p className="text-corpo text-white/60">{voce.testo}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {ramo.scale && (
        <Section>
          <SectionHead
            eyebrow="Formule"
            title="Una proposta per ogni portata"
            subtitle="Adattiamo campagne e servizi alla scala del tuo progetto."
          />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ramo.scale.map((scala, i) => (
              <Reveal key={scala.nome} as="li" delay={i * 80}>
                <div className="card-hover h-full rounded-2xl border border-white/[0.06] bg-brand-card p-6 hover:border-accento-1/40">
                  <span className="mb-4 block text-cifra text-accento-1">0{i + 1}</span>
                  <h3 className="mb-2 text-sottotitolo text-white">{scala.nome}</h3>
                  <p className="text-corpo text-white/60">{scala.testo}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Section>
      )}

      <Section alt={Boolean(ramo.scale)}>
        <SectionHead
          eyebrow="Testimonianze"
          title={ramo.slug === 'fantadsico' ? 'Aziende che hanno scelto FantADSico' : 'Chi ha partecipato'}
        />
        <Testimonianze voci={testimonianzeDi(ramo.slug)} />
      </Section>

      {ramo.faq.length > 0 && (
        <section id="faq" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
          <SectionHead eyebrow="Domande frequenti" title={`${ramo.nome}: le domande più comuni`} />
          <FaqLista voci={ramo.faq} />
        </section>
      )}

      <CtaBanner
        title={ramo.cta.etichetta}
        action={
          <Link to={contatto} className={btnPrimary}>
            Scrivici
          </Link>
        }
      />
    </>
  )
}
