import { Link } from 'react-router-dom'
import { Globe, Megaphone, TrendingUp, Video } from 'lucide-react'
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
          <Link to="/contatti" className={btnPrimary}>
            Diventa sponsor
          </Link>
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
          <FeatureCard Icon={Video} title="Video & contenuti social">
            Video pubblicitari e contenuti social dedicati alla tua azienda su Instagram, TikTok,
            Facebook e YouTube.
          </FeatureCard>
          <FeatureCard Icon={Megaphone} title="Visibilità agli eventi">
            Presenza durante tornei, fantacalcio al listone ed eventi organizzati da FantaEsagonale.
          </FeatureCard>
          <FeatureCard Icon={TrendingUp} title="Risultati concreti">
            Il focus è la crescita reale della tua visibilità digitale, non un contributo a fondo
            perduto.
          </FeatureCard>
          <FeatureCard Icon={Globe} title="Presenza sul sito">
            Il tuo logo e i tuoi materiali di comunicazione sul nostro sito.
          </FeatureCard>
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="I nostri sponsor" title="Le aziende che ci sostengono" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PlaceholderBox key={i} className="h-20 sm:h-24">
              Logo da inserire
            </PlaceholderBox>
          ))}
        </div>
      </Section>

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
