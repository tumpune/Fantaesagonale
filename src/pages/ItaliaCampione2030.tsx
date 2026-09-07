import { Link } from 'react-router-dom'
import { Instagram, Music2, Send, Youtube } from 'lucide-react'
import CampaignCountdown from '../components/CampaignCountdown'
import { CtaBanner, FeatureCard, Section, SectionHead, btnPrimary } from '../components/ui'

const TIMELINE = [
  {
    date: '31 marzo 2026',
    text: "L'Italia non si qualifica ai Mondiali dopo la sconfitta con la Bosnia. Nasce l'idea di Italia Campione 2030.",
  },
  {
    date: 'Ogni giorno',
    text: 'Un video al giorno per informare, commentare e sostenere il percorso verso il prossimo Mondiale, fino al 21 luglio 2030.',
  },
  {
    date: '21 luglio 2030',
    text: 'Giorno della finale dei Mondiali in Spagna, Portogallo e Marocco: il traguardo della challenge.',
  },
]

export default function ItaliaCampione2030() {
  return (
    <>
      <section className="px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-36 lg:px-12 bg-[radial-gradient(circle_at_20%_20%,rgba(252,215,12,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(230,26,26,0.14),transparent_50%)]">
        <div className="mx-auto max-w-6xl">
          <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-brand-yellow to-brand-red px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-black">
            Progetto speciale
          </span>
          <h1 className="mb-5 leading-[0.95] text-white sm:mb-6 text-balance">
            <span
              className="block font-playfair text-3xl font-normal italic sm:text-5xl md:text-6xl"
              style={{ letterSpacing: '-0.05em' }}
            >
              Italia
            </span>
            <span
              className="-mt-1 block text-3xl font-normal sm:text-5xl md:text-6xl"
              style={{ letterSpacing: '-0.06em' }}
            >
              Campione 2030
            </span>
          </h1>
          <p className="max-w-2xl text-base text-white/60 sm:text-lg text-pretty">
            Dopo la mancata qualificazione ai Mondiali — la sconfitta con la Bosnia del 31 marzo 2026
            — FantaEsagonale ha lanciato una challenge lunga quattro anni: un video al giorno, ogni
            giorno, fino alla finale dei Mondiali. Un canale di informazione e supporto dedicato alla
            nazionale azzurra.
          </p>
        </div>
      </section>

      <Section alt width="narrow">
        <SectionHead eyebrow="La challenge in numeri" title="1572 giorni, un video al giorno" />
        <CampaignCountdown size="lg" />
      </Section>

      <Section width="narrow">
        <SectionHead eyebrow="La linea del tempo" title="Dalla delusione alla finale" />
        <ol className="grid gap-4">
          {TIMELINE.map((item) => (
            <li
              key={item.date}
              className="grid gap-2 rounded-xl border border-white/[0.06] bg-brand-card p-5 sm:grid-cols-[140px_1fr] sm:gap-4"
            >
              <span className="text-sm font-bold text-brand-yellow">{item.date}</span>
              <p className="text-sm text-white/60 text-pretty">{item.text}</p>
            </li>
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
          <FeatureCard Icon={Youtube} title="YouTube">
            <span className="italic text-white/35">
              Link da inserire — video quotidiani della challenge.
            </span>
          </FeatureCard>
          <FeatureCard Icon={Instagram} title="Instagram">
            <span className="italic text-white/35">Link da inserire.</span>
          </FeatureCard>
          <FeatureCard Icon={Music2} title="TikTok">
            <span className="italic text-white/35">Link da inserire.</span>
          </FeatureCard>
          <FeatureCard Icon={Send} title="Canale Telegram">
            <span className="italic text-white/35">Link da inserire — foto delle attività.</span>
          </FeatureCard>
        </div>
      </Section>

      <CtaBanner
        title="Vuoi seguire ogni giorno la sfida verso il 2030?"
        action={
          <Link to="/contatti" className={btnPrimary}>
            Resta aggiornato
          </Link>
        }
      />
    </>
  )
}
