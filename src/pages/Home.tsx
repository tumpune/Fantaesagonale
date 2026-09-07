import { Link } from 'react-router-dom'
import { Megaphone, Mic, Target, Trophy } from 'lucide-react'
import Hero from '../components/Hero'
import CampaignCountdown from '../components/CampaignCountdown'
import {
  ArticleCard,
  CtaBanner,
  FeatureCard,
  HighlightPanel,
  PlaceholderBox,
  Section,
  SectionHead,
  btnPrimary,
  btnSecondary,
  gradientText,
} from '../components/ui'

const STATS = [
  { value: '2023', label: 'anno di fondazione' },
  { value: '205', label: 'squadre iscritte al fantacalcio 2025-26' },
  { value: '3ª', label: 'edizione del Fantacalcio al Listone' },
  { value: '20.000€', label: 'montepremi totale 2025-26' },
]

export default function Home() {
  return (
    <>
      <Hero />

      <Section>
        <SectionHead
          eyebrow="Cosa facciamo"
          title="Un ecosistema di sport e divertimento"
          subtitle="Quattro anime, un'unica community."
        />
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <FeatureCard Icon={Trophy} title="Fantacalcio al Listone">
            Stagione 2025-2026, 3ª edizione: 205 squadre iscritte e 20.000€ di montepremi. Novità:
            Survivor Soccer.
          </FeatureCard>
          <FeatureCard Icon={Target} title="Giochi & Tornei">
            Freccette, beer pong, cornhole e sfide sportive per tutti.
          </FeatureCard>
          <FeatureCard Icon={Mic} title="Eventi & Intrattenimento">
            Interviste, sondaggi e contenuti pensati per la community.
          </FeatureCard>
          <FeatureCard Icon={Megaphone} title="FantADSico">
            Diamo visibilità reale alle aziende locali con campagne social su misura.
          </FeatureCard>
        </div>
      </Section>

      <Section alt>
        <SectionHead eyebrow="In numeri" title="FantaEsagonale in cifre" />
        <dl className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span
                  className={`block text-3xl font-extrabold sm:text-4xl md:text-5xl ${gradientText}`}
                >
                  {stat.value}
                </span>
                <span className="mt-2 block text-sm text-white/60">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section width="narrow">
        <HighlightPanel eyebrow="Perché FantaEsagonale" title="Non siamo solo intrattenimento">
          Mettiamo in palio premi in denaro, coppe e riconoscimenti veri, perché la sfida sia
          autentica fino alla fine.
        </HighlightPanel>
      </Section>

      <Section alt>
        <div className="grid items-center gap-8 rounded-2xl border border-brand-yellow/25 bg-brand-card p-6 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:gap-10 lg:p-12">
          <div>
            <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-brand-yellow to-brand-red px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-black">
              Progetto speciale
            </span>
            <h2 className="mb-4 text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-3xl md:text-4xl">
              Italia Campione 2030
            </h2>
            <p className="mb-6 text-sm text-white/60 sm:text-base text-pretty">
              Nata dopo la mancata qualificazione ai Mondiali (sconfitta con la Bosnia, 31 marzo
              2026), è la nostra challenge di 1572 giorni: un video al giorno fino al 21 luglio 2030,
              giorno della finale. Un canale di informazione e supporto dedicato alla nazionale
              azzurra.
            </p>
            <Link to="/italia-campione-2030" className={btnPrimary}>
              Scopri il progetto
            </Link>
          </div>
          <CampaignCountdown />
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="I nostri sponsor" title="Aziende che credono in noi" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <PlaceholderBox key={i} className="h-20 sm:h-24">
              Logo sponsor {i + 1}
            </PlaceholderBox>
          ))}
        </div>
        <div className="mt-9 text-center">
          <Link to="/sponsor" className={btnSecondary}>
            Scopri le sponsorizzazioni
          </Link>
        </div>
      </Section>

      <Section alt>
        <SectionHead eyebrow="Dal blog" title="News & Storie" />
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {['Tornei', 'Interviste', 'Sponsor'].map((tag) => (
            <ArticleCard key={tag} tag={tag} />
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Vuoi partecipare o proporre una sponsorizzazione?"
        action={
          <Link to="/contatti" className={btnPrimary}>
            Contattaci
          </Link>
        }
      />
    </>
  )
}
