import { Link } from 'react-router-dom'
import Reveal from '../components/motion/Reveal'
import Marquee from '../components/motion/Marquee'
import { SPONSOR_OFFERS } from '../content/sezioni'
import {
  CtaBanner,
  FeatureCard,
  HighlightPanel,
  PageHero,
  PlaceholderBox,
  Section,
  SectionHead,
  btnPrimary,
} from '../components/ui'

export default function Sponsor() {
  return (
    <>
      <PageHero eyebrow="FantADSico — il programma sponsor" titleItalic="Cresci" title="con noi">
        Diamo visibilità alla tua azienda attraverso i nostri eventi, tornei e contenuti social. Ogni
        sponsorizzazione FantaEsagonale significa entrare in contatto diretto con una community
        attiva e in crescita a Grammichele e dintorni.
      </PageHero>

      <div className="px-5 pb-2 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <Reveal variant="fade" delay={320}>
            <Link to="/contatti" className={btnPrimary}>
              Diventa sponsor
            </Link>
          </Reveal>
        </div>
      </div>

      <Section width="narrow">
        <HighlightPanel
          eyebrow="Cos'è FantADSico"
          title="Visibilità reale, non un contributo a fondo perduto"
        >
          FantADSico è il programma di collaborazione tra FantaEsagonale e le attività commerciali
          locali: video pubblicitari, contenuti social e presenza durante i nostri eventi, con
          l'obiettivo di generare un aumento di visibilità reale e misurabile attraverso il digitale
          — non semplicemente uno sponsor "silenzioso".
        </HighlightPanel>
      </Section>

      <Section alt>
        <SectionHead eyebrow="Cosa offriamo" title="Un pacchetto di visibilità su misura" />
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {SPONSOR_OFFERS.map((offer, i) => (
            <Reveal key={offer.title} delay={i * 90}>
              <FeatureCard Icon={offer.Icon} title={offer.title}>
                {offer.text}
              </FeatureCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="I nostri sponsor" title="Le aziende che ci sostengono" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Reveal key={i} variant="scale" delay={i * 70}>
              <PlaceholderBox className="h-20 sm:h-24">Logo da inserire</PlaceholderBox>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Scorrimento continuo: una vetrina che non si ferma comunica una
          collaborazione viva meglio di una griglia immobile. */}
      <div className="border-y border-white/10 bg-brand-soft py-6">
        <Marquee speed={26} reverse>
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="mx-3 flex h-16 w-40 items-center justify-center rounded-xl border border-dashed border-white/15 text-xs text-white/35"
            >
              Logo sponsor
            </span>
          ))}
        </Marquee>
      </div>

      <CtaBanner
        title="Vuoi diventare sponsor?"
        action={
          <Link to="/contatti" className={btnPrimary}>
            Contattaci per un pacchetto su misura
          </Link>
        }
      />
    </>
  )
}
