import { Link } from 'react-router-dom'
import LogoHero from '../components/hero/LogoHero'
import Alveare from '../components/Alveare'
import { testimonianzeDi } from '../content/testimonianze'
import InEvidenza from '../components/InEvidenza'
import Reveal from '../components/motion/Reveal'
import Marquee from '../components/motion/Marquee'
import Magnetic from '../components/motion/Magnetic'
import { RAMI } from '../content/rami'
import { DISTINTIVO, FAQ_GENERALI, PRINCIPI, SLOGAN } from '../content/associazione'
import {
  CtaBanner,
  Eyebrow,
  FaqLista,
  Guida,
  Section,
  SectionHead,
  Testimonianze,
  btnPrimary,
  btnSecondary,
} from '../components/ui'

/**
 * Ordine della home, dal questionario (2.1, 2.2):
 * 1. capire subito cos'e' FantaEsagonale;
 * 2. vedere cosa e' attivo in questo momento;
 * 3. trovare il proprio ramo;
 * 4. fidarsi: visione, principi, testimonianze;
 * 5. risolvere i dubbi e contattare.
 */
export default function Home() {
  // Lo slogan si modifica dal pannello: la chiusa sotto al logo resta "e
  // sorridi" se c'e', altrimenti scende l'ultima parola.
  const chiusa = / e sorridi$/.test(SLOGAN) ? ' e sorridi' : SLOGAN.slice(SLOGAN.lastIndexOf(' '))
  const primaParte = SLOGAN.slice(0, SLOGAN.length - chiusa.length)

  return (
    <>
      <LogoHero
        eyebrow="FantaEsagonale APS · Grammichele"
        titoloSopra={primaParte}
        titoloSotto={chiusa.trim()}
        descrizione="Un'associazione nata nel 2023 che dà valore al tempo libero. Fantacalcio, eventi, FantaMaritati, marketing per le aziende e progetti per il territorio: tante anime, un unico ecosistema."
        azioni={
          <>
            <Magnetic>
              <a href="#progetti" className={btnPrimary}>
                Scopri i progetti
              </a>
            </Magnetic>
            <Magnetic>
              <Link to="/contatti" className={btnSecondary}>
                Contattaci
              </Link>
            </Magnetic>
          </>
        }
      />

      {/* Nastro dei rami: dice in una riga che FantaEsagonale non coincide con
          un solo settore, il primo messaggio chiesto dal questionario. */}
      <div className="border-y border-accento-1/20 bg-gradient-to-r from-accento-1/[0.06] via-accento-2/[0.06] to-accento-1/[0.06] py-5">
        <Marquee speed={36}>
          {RAMI.map((ramo) => (
            <span key={ramo.slug} className="flex items-center">
              <span className="px-7 font-display text-sottotitolo uppercase tracking-wide text-white/80">
                {ramo.nome}
              </span>
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-accento-1 to-accento-2" />
            </span>
          ))}
        </Marquee>
      </div>

      <Section>
        <SectionHead
          eyebrow="In evidenza ora"
          title="Cosa sta succedendo"
          subtitle="Le iniziative attive in questo momento."
        />
        <InEvidenza />
      </Section>

      <section id="progetti" className="scroll-mt-24 bg-brand-soft px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <SectionHead
          eyebrow="I nostri progetti"
          title="Scegli da dove iniziare"
          subtitle="Ogni esagono è un ramo di FantaEsagonale, con la sua pagina e le sue domande frequenti."
        />
        <Alveare />
      </section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal variant="left">
            <Eyebrow>Chi siamo</Eyebrow>
            <h2 className="mb-5 text-titolo text-white text-balance">
              Opportunità nuove, senza lasciare il proprio territorio
            </h2>
            <Guida className="mb-8">{DISTINTIVO}</Guida>
            <Link to="/chi-siamo" className={btnSecondary}>
              La nostra storia
            </Link>
          </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2">
            {PRINCIPI.map((principio, i) => (
              <Reveal key={principio.nome} as="li" variant="right" delay={i * 80}>
                <div className="card-hover h-full rounded-2xl border border-white/[0.06] bg-brand-card p-6 hover:border-accento-1/40">
                  <span className="mb-3 block h-1 w-10 rounded-full bg-gradient-to-r from-accento-1 to-accento-2" />
                  <h3 className="mb-2 text-sottotitolo text-white">{principio.nome}</h3>
                  <p className="text-corpo text-white/60">{principio.testo}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section alt>
        <SectionHead eyebrow="Testimonianze" title="Chi ha giocato con noi" />
        <Testimonianze voci={testimonianzeDi()} />
      </Section>

      <Section>
        <SectionHead eyebrow="Domande frequenti" title="Le risposte più cercate" />
        <FaqLista voci={FAQ_GENERALI.slice(0, 3)} />
        <Reveal className="mt-8 text-center">
          <Link to="/faq" className={btnSecondary}>
            Tutte le domande
          </Link>
        </Reveal>
      </Section>

      <CtaBanner
        title="Hai un'idea, un evento o un progetto?"
        action={
          <Link to="/contatti" className={btnPrimary}>
            Parliamone
          </Link>
        }
      />
    </>
  )
}
