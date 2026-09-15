import { Link } from 'react-router-dom'
import CampaignCountdown from '../components/CampaignCountdown'
import Reveal from '../components/motion/Reveal'
import { CAMPAIGN_CHANNELS, CAMPAIGN_TIMELINE } from '../content/sezioni'
import { CtaBanner, FeatureCard, PageHero, Section, SectionHead, btnPrimary } from '../components/ui'

export default function ItaliaCampione2030() {
  return (
    <>
      <PageHero
        eyebrow="Progetto speciale"
        title="Italia"
        highlight="Campione 2030"
      >
        Dopo la mancata qualificazione ai Mondiali — la sconfitta con la Bosnia del 31 marzo 2026 —
        FantaEsagonale ha lanciato una challenge lunga quattro anni: un video al giorno, ogni
        giorno, fino alla finale dei Mondiali. Un canale di informazione e supporto dedicato alla
        nazionale azzurra.
      </PageHero>

      <Section alt width="narrow">
        <SectionHead eyebrow="La challenge in numeri" title="1572 giorni, un video al giorno" />
        <CampaignCountdown />
      </Section>

      <Section width="narrow">
        <SectionHead eyebrow="La linea del tempo" title="Dalla delusione alla finale" />
        <ol className="grid gap-4">
          {CAMPAIGN_TIMELINE.map((item, i) => (
            <Reveal key={item.date} as="li" variant="left" delay={i * 110}>
              <div className="card-hover grid gap-2 rounded-xl border border-white/[0.06] bg-brand-card p-5 hover:border-accento-1/40 sm:grid-cols-[140px_1fr] sm:gap-4">
                <span className="text-etichetta text-accento-1">{item.date}</span>
                <p className="text-corpo text-white/60 text-pretty">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section alt>
        <SectionHead
          eyebrow="Segui il progetto"
          title="Dove trovare i video quotidiani"
          subtitle="I contenuti della challenge sono pubblicati sui nostri canali social, insieme agli aggiornamenti sulle altre attività di FantaEsagonale."
        />
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {CAMPAIGN_CHANNELS.map((channel, i) => (
            <Reveal key={channel.title} delay={i * 90}>
              <FeatureCard Icon={channel.Icon} title={channel.title}>
                {channel.text}
              </FeatureCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Vuoi seguire ogni giorno la sfida verso il 2030?"
        action={
          <Link to="/contatti?oggetto=italia-campione-2030" className={btnPrimary}>
            Resta aggiornato
          </Link>
        }
      />
    </>
  )
}
