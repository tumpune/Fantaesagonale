import { Link } from 'react-router-dom'
import { Instagram, Music2, Send, Youtube } from 'lucide-react'
import CampaignCountdown from '../components/CampaignCountdown'
import { FeatureCard, SectionHead, btnPrimary } from '../components/ui'

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
      <section className="pt-32 pb-16 px-6 bg-[radial-gradient(circle_at_20%_20%,rgba(252,215,12,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(230,26,26,0.14),transparent_50%)]">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block bg-gradient-to-r from-brand-yellow to-brand-red text-black text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4">
            Progetto speciale
          </span>
          <h1 className="text-white leading-[0.95] mb-6">
            <span
              className="block font-playfair italic font-normal text-4xl sm:text-6xl"
              style={{ letterSpacing: '-0.05em' }}
            >
              Italia
            </span>
            <span
              className="block font-normal text-4xl sm:text-6xl -mt-1"
              style={{ letterSpacing: '-0.08em' }}
            >
              Campione 2030
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Dopo la mancata qualificazione ai Mondiali — la sconfitta con la Bosnia del 31 marzo 2026
            — FantaEsagonale ha lanciato una challenge lunga quattro anni: un video al giorno, ogni
            giorno, fino alla finale dei Mondiali. Un canale di informazione e supporto dedicato alla
            nazionale azzurra.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-brand-soft">
        <div className="max-w-3xl mx-auto">
          <SectionHead eyebrow="La challenge in numeri" title="1572 giorni, un video al giorno" />
          <CampaignCountdown size="lg" />
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionHead eyebrow="La linea del tempo" title="Dalla delusione alla finale" />
          <div className="grid gap-4">
            {TIMELINE.map((item) => (
              <div
                key={item.date}
                className="grid sm:grid-cols-[140px_1fr] gap-4 bg-brand-card border border-white/[0.06] rounded-xl p-5"
              >
                <div className="text-brand-yellow font-bold text-sm">{item.date}</div>
                <p className="text-sm text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-brand-soft">
        <div className="max-w-6xl mx-auto">
          <SectionHead
            eyebrow="Segui il progetto"
            title="Dove trovare i video quotidiani"
            subtitle="I contenuti della challenge sono pubblicati sui nostri canali social, insieme agli aggiornamenti sulle altre attività di FantaEsagonale."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </section>

      <section className="py-16 px-6 text-center bg-gradient-to-br from-brand-yellow/[0.08] to-brand-red/[0.1]">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-[-0.03em]">
          Vuoi seguire ogni giorno la sfida verso il 2030?
        </h2>
        <Link to="/contatti" className={btnPrimary}>
          Resta aggiornato
        </Link>
      </section>
    </>
  )
}
