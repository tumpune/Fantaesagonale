import { Link } from 'react-router-dom'
import { Globe, Megaphone, TrendingUp, Video } from 'lucide-react'
import {
  Eyebrow,
  FeatureCard,
  PageHero,
  PlaceholderBox,
  SectionHead,
  btnPrimary,
} from '../components/ui'

export default function Sponsor() {
  return (
    <>
      <PageHero eyebrow="FantADSico — il programma sponsor" titleItalic="Cresci" title="con noi">
        Diamo visibilità alla tua azienda attraverso i nostri eventi, tornei e contenuti social.
        Ogni sponsorizzazione FantaEsagonale significa entrare in contatto diretto con una community
        attiva e in crescita a Grammichele e dintorni.
      </PageHero>

      <section className="px-6 pb-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/contatti" className={btnPrimary}>
            Diventa sponsor
          </Link>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-brand-yellow/[0.08] to-brand-red/[0.08] border border-brand-yellow/20 rounded-2xl p-12">
          <Eyebrow>Cos'è FantADSico</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-[-0.03em]">
            Visibilità reale, non un contributo a fondo perduto
          </h2>
          <p className="text-white/60 text-lg">
            FantADSico è il programma di collaborazione tra FantaEsagonale e le attività commerciali
            locali: video pubblicitari, contenuti social e presenza durante i nostri eventi, con
            l'obiettivo di generare un aumento di visibilità reale e misurabile attraverso il
            digitale — non semplicemente uno sponsor "silenzioso".
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-brand-soft">
        <div className="max-w-6xl mx-auto">
          <SectionHead eyebrow="Cosa offriamo" title="Un pacchetto di visibilità su misura" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard Icon={Video} title="Video & contenuti social">
              Video pubblicitari e contenuti social dedicati alla tua azienda su Instagram, TikTok,
              Facebook e YouTube.
            </FeatureCard>
            <FeatureCard Icon={Megaphone} title="Visibilità agli eventi">
              Presenza durante tornei, fantacalcio al listone ed eventi organizzati da
              FantaEsagonale.
            </FeatureCard>
            <FeatureCard Icon={TrendingUp} title="Risultati concreti">
              Il focus è la crescita reale della tua visibilità digitale, non un contributo a fondo
              perduto.
            </FeatureCard>
            <FeatureCard Icon={Globe} title="Presenza sul sito">
              Il tuo logo e i tuoi materiali di comunicazione sul nostro sito.
            </FeatureCard>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHead eyebrow="I nostri sponsor" title="Le aziende che ci sostengono" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlaceholderBox key={i} className="h-24">
                Logo da inserire
              </PlaceholderBox>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 text-center bg-gradient-to-br from-brand-yellow/[0.08] to-brand-red/[0.1]">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-[-0.03em]">
          Vuoi diventare sponsor?
        </h2>
        <Link to="/contatti" className={btnPrimary}>
          Contattaci per un pacchetto su misura
        </Link>
      </section>
    </>
  )
}
