import { Link } from 'react-router-dom'
import LogoHero from '../components/hero/LogoHero'
import StatsRow from '../components/hero/StatsRow'
import Magnetic from '../components/motion/Magnetic'
import CampaignCountdown from '../components/CampaignCountdown'
import Reveal from '../components/motion/Reveal'
import Marquee from '../components/motion/Marquee'
import Parallax from '../components/motion/Parallax'
import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'
import { HOME_FEATURES, STATS } from '../content/sezioni'
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

function Stat({
  value,
  display,
  suffix,
  label,
}: {
  value: number
  display?: string
  suffix?: string
  label: string
}) {
  // Soglia bassa: la cifra ferma a zero mentre entra in vista sembrerebbe
  // un dato mancante, non un'animazione in attesa.
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 })
  const counted = useCountUp(value, inView)
  // Alcune cifre hanno una forma propria (20.000€, 2023): si animano comunque,
  // ma a fine corsa mostrano il testo formattato invece del numero grezzo.
  const done = counted === value

  return (
    <div ref={ref}>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className={`block text-3xl font-extrabold sm:text-4xl md:text-5xl ${gradientText}`}>
          {done && display ? display : counted.toLocaleString('it-IT')}
          {suffix}
        </span>
        <span className="mt-2 block text-sm text-white/60">{label}</span>
      </dd>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <LogoHero
        eyebrow="Grammichele · dal 2023"
        titoloSopra="Il divertimento"
        titoloSotto="diventa competizione"
        descrizione="Associazione di promozione sociale a Grammichele. Fantacalcio al Listone, tornei, freccette, beer pong e cornhole: sfide vere, con premi veri."
        azioni={
          <>
            <Magnetic>
              <Link to="/tornei-giochi" className={btnPrimary}>
                Scopri i tornei
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/sponsor" className={btnSecondary}>
                Diventa sponsor
              </Link>
            </Magnetic>
          </>
        }
        dati={<StatsRow />}
      />

      {/* Nastro d'insegna: da' ritmo subito sotto la hero e riassume in una
          riga tutto quello che l'associazione organizza. */}
      <div className="border-y border-brand-yellow/20 bg-gradient-to-r from-brand-yellow/[0.07] via-brand-red/[0.07] to-brand-yellow/[0.07] py-5">
        <Marquee speed={32}>
          {['Fantacalcio al Listone', 'Survivor Soccer', 'Tornei di calcio', 'Freccette', 'Beer Pong', 'Cornhole', 'FantADSico', 'Italia Campione 2030'].map(
            (voce) => (
              <span key={voce} className="flex items-center">
                <span className="px-6 text-lg font-extrabold uppercase tracking-tight text-white/85 sm:px-8 sm:text-2xl">
                  {voce}
                </span>
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-brand-yellow to-brand-red" />
              </span>
            ),
          )}
        </Marquee>
      </div>

      <Section>
        <SectionHead
          eyebrow="Cosa facciamo"
          title="Un ecosistema di sport e divertimento"
          subtitle="Quattro anime, un'unica community."
        />
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {HOME_FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 90}>
              <FeatureCard Icon={feature.Icon} title={feature.title}>
                {feature.text}
              </FeatureCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHead eyebrow="In numeri" title="FantaEsagonale in cifre" />
        <dl className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
          {STATS.map((stat) => (
            <Stat key={stat.label} {...stat} />
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
          <Reveal variant="left">
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
          </Reveal>
          <Reveal variant="right" delay={120}>
            <Parallax speed={0.08}>
              <CampaignCountdown />
            </Parallax>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="I nostri sponsor" title="Aziende che credono in noi" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Reveal key={i} variant="scale" delay={i * 70}>
              <PlaceholderBox className="h-20 sm:h-24">Logo sponsor {i + 1}</PlaceholderBox>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-9 text-center" delay={160}>
          <Link to="/sponsor" className={btnSecondary}>
            Scopri le sponsorizzazioni
          </Link>
        </Reveal>
      </Section>

      <Section alt>
        <SectionHead eyebrow="Dal blog" title="News & Storie" />
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {['Tornei', 'Interviste', 'Sponsor'].map((tag, i) => (
            <Reveal key={tag} delay={i * 90}>
              <ArticleCard tag={tag} />
            </Reveal>
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
