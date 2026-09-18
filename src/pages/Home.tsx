import { Link } from 'react-router-dom'
import LogoHero from '../components/hero/LogoHero'
import Alveare from '../components/Alveare'
import Numeri from '../components/Numeri'
import { testimonianzeDi } from '../content/testimonianze'
import InEvidenza from '../components/InEvidenza'
import Reveal from '../components/motion/Reveal'
import Marquee from '../components/motion/Marquee'
import Magnetic from '../components/motion/Magnetic'
import { RAMI, ramoDaSlug } from '../content/rami'
import { iniziativeAttive } from '../content/evidenza'
import { DISTINTIVO, FAQ_GENERALI, INTRO_HOME, PRINCIPI, SLOGAN } from '../content/associazione'
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
 * 1. capire subito cos’e' FantaEsagonale;
 * 2. vedere cosa e' attivo in questo momento;
 * 3. trovare il proprio ramo;
 * 4. fidarsi: visione, principi, testimonianze;
 * 5. risolvere i dubbi e contattare.
 */
export default function Home() {
  // Lo slogan si modifica dal pannello: la chiusa sotto al logo resta "e
  // sorridi" se c’e', altrimenti scende l’ultima parola.
  const ultimoSpazio = SLOGAN.lastIndexOf(' ')
  const chiusa = / e sorridi$/.test(SLOGAN) ? ' e sorridi' : ultimoSpazio > 0 ? SLOGAN.slice(ultimoSpazio) : ''
  const primaParte = SLOGAN.slice(0, SLOGAN.length - chiusa.length)

  // Le sezioni senza contenuto non compaiono affatto: un titolo che promette
  // novita' seguito dal vuoto e' peggio del silenzio.
  const iniziativeInHome = iniziativeAttive().filter((i) => ramoDaSlug(i.ramo)).length

  return (
    <>
      <LogoHero
        eyebrow="FantaEsagonale APS · Grammichele"
        titoloSopra={primaParte}
        titoloSotto={chiusa.trim()}
        descrizione={INTRO_HOME}
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
      <div className="border-y border-white/[0.07] bg-white/[0.02] py-5">
        <Marquee speed={36}>
          {RAMI.map((ramo) => (
            <span key={ramo.slug} className="flex items-center">
              <span className="px-7 font-display text-sottotitolo uppercase tracking-wide text-white/80">
                {ramo.nome}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-accento-1/70" />
            </span>
          ))}
        </Marquee>
      </div>

      <Numeri />

      {iniziativeInHome > 0 && (
        <Section ritmo="stretto">
          <SectionHead
            numero="01"
            eyebrow="In evidenza ora"
            title="Cosa sta succedendo"
            subtitle="Le iniziative attive in questo momento."
            livello="servizio"
          />
          <InEvidenza />
        </Section>
      )}

      <section id="progetti" className="scroll-mt-24 border-y border-white/[0.06] bg-brand-soft px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            numero="02"
            eyebrow="I nostri progetti"
            title="Scegli da dove iniziare"
            subtitle="Ogni esagono è un ramo di FantaEsagonale, con la sua pagina e le sue domande frequenti."
          />
        </div>
        <Alveare />
      </section>

      <Section ritmo="ampio">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal variant="left">
            <span className="mb-4 flex items-center gap-4">
              <span className="text-meta cifre-allineate text-accento-1">03</span>
              <span aria-hidden="true" className="h-px w-16 bg-accento-1/40" />
            </span>
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
              <Reveal key={`${principio.nome}-${i}`} as="li" variant="right" delay={i * 80}>
                <div className="h-full rounded-xl border border-white/[0.07] bg-brand-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] transition-colors duration-300 hover:bg-[#202020]">
                  <span aria-hidden="true" className="mb-3 block h-[3px] w-10 bg-accento-1" />
                  <h3 className="mb-2 text-sottotitolo text-white">{principio.nome}</h3>
                  <p className="text-corpo text-white/60">{principio.testo}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section alt ritmo="stretto">
        <SectionHead numero="04" eyebrow="Testimonianze" title="Chi ha giocato con noi" livello="servizio" />
        <Testimonianze voci={testimonianzeDi()} />
      </Section>

      {FAQ_GENERALI.length > 0 && (
        <Section ritmo="stretto">
          <SectionHead numero="05" eyebrow="Domande frequenti" title="Le risposte più cercate" livello="servizio" />
          <FaqLista voci={FAQ_GENERALI.slice(0, 3)} />
          <Reveal className="mt-8 text-center">
            <Link to="/faq" className={btnSecondary}>
              Tutte le domande
            </Link>
          </Reveal>
        </Section>
      )}

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
