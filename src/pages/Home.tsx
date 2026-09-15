import { Link } from 'react-router-dom'
import LogoHero from '../components/hero/LogoHero'
import StatsRow from '../components/hero/StatsRow'
import CampaignCountdown from '../components/CampaignCountdown'
import Reveal from '../components/motion/Reveal'
import Marquee from '../components/motion/Marquee'
import Magnetic from '../components/motion/Magnetic'
import { HOME_FEATURES, NASTRO_ATTIVITA } from '../content/sezioni'
import {
  ArticleCard,
  CtaBanner,
  Corpo,
  FeatureCard,
  HighlightPanel,
  PlaceholderBox,
  Section,
  SectionHead,
  btnPrimary,
  btnSecondary,
} from '../components/ui'

/**
 * Ordine della home: chi siamo, cosa facciamo, perche' fidarsi, il progetto
 * speciale, chi ci sostiene, cosa raccontiamo, come contattarci.
 *
 * Le cifre chiave stanno solo nella testata. Una sezione "In numeri" le
 * ripeteva identiche poco piu' sotto: due volte lo stesso dato indebolisce
 * entrambe le occorrenze e allunga la pagina senza aggiungere nulla.
 */
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

      {/* Nastro d'insegna: separa la testata dal contenuto e riassume in una
          riga tutto quello che l'associazione organizza. */}
      <div className="border-y border-brand-yellow/20 bg-gradient-to-r from-brand-yellow/[0.07] via-brand-red/[0.07] to-brand-yellow/[0.07] py-5">
        <Marquee speed={32}>
          {NASTRO_ATTIVITA.map((voce) => (
            <span key={voce} className="flex items-center">
              <span className="px-7 text-titolo uppercase text-white/85">{voce}</span>
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-brand-yellow to-brand-red" />
            </span>
          ))}
        </Marquee>
      </div>

      <Section>
        <SectionHead
          eyebrow="Cosa facciamo"
          title="Un ecosistema di sport e divertimento"
          subtitle="Quattro anime, un'unica community."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 90}>
              <FeatureCard Icon={feature.Icon} title={feature.title}>
                {feature.text}
              </FeatureCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section alt width="narrow">
        <HighlightPanel eyebrow="Perché FantaEsagonale" title="Non siamo solo intrattenimento">
          Mettiamo in palio premi in denaro, coppe e riconoscimenti veri, perché la sfida sia
          autentica fino alla fine.
        </HighlightPanel>
      </Section>

      <Section>
        <div className="grid items-center gap-10 rounded-2xl border border-brand-yellow/25 bg-brand-card p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal variant="left">
            <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-brand-yellow to-brand-red px-3.5 py-1.5 text-occhiello uppercase text-black">
              Progetto speciale
            </span>
            <h2 className="mb-4 text-titolo text-white">Italia Campione 2030</h2>
            <Corpo className="mb-7">
              Nata dopo la mancata qualificazione ai Mondiali (sconfitta con la Bosnia, 31 marzo
              2026), è la nostra challenge di 1572 giorni: un video al giorno fino al 21 luglio 2030,
              giorno della finale. Un canale di informazione e supporto dedicato alla nazionale
              azzurra.
            </Corpo>
            <Link to="/italia-campione-2030" className={btnPrimary}>
              Scopri il progetto
            </Link>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <CampaignCountdown />
          </Reveal>
        </div>
      </Section>

      <Section alt>
        <SectionHead eyebrow="I nostri sponsor" title="Aziende che credono in noi" />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Reveal key={i} variant="scale" delay={i * 70}>
              <PlaceholderBox className="h-24">Logo sponsor {i + 1}</PlaceholderBox>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center" delay={160}>
          <Link to="/sponsor" className={btnSecondary}>
            Scopri le sponsorizzazioni
          </Link>
        </Reveal>
      </Section>

      <Section>
        <SectionHead eyebrow="Dal blog" title="News & Storie" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
