import { Link } from 'react-router-dom'
import { Megaphone, Mic, Target, Trophy } from 'lucide-react'
import Hero from '../components/Hero'
import CampaignCountdown from '../components/CampaignCountdown'
import {
  Card,
  Eyebrow,
  FeatureCard,
  PlaceholderBox,
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

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHead
            eyebrow="Cosa facciamo"
            title="Un ecosistema di sport e divertimento"
            subtitle="Quattro anime, un'unica community."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </section>

      <section className="py-20 px-6 bg-brand-soft">
        <div className="max-w-6xl mx-auto">
          <SectionHead eyebrow="In numeri" title="FantaEsagonale in cifre" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className={`text-4xl md:text-5xl font-extrabold ${gradientText}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-white/60 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-brand-yellow/[0.08] to-brand-red/[0.08] border border-brand-yellow/20 rounded-2xl p-12">
          <Eyebrow>Perché FantaEsagonale</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-[-0.03em]">
            Non siamo solo intrattenimento
          </h2>
          <p className="text-white/60 text-lg">
            Mettiamo in palio premi in denaro, coppe e riconoscimenti veri, perché la sfida sia
            autentica fino alla fine.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-brand-soft">
        <div className="max-w-6xl mx-auto">
          <div className="bg-brand-card border border-brand-yellow/25 rounded-2xl p-10 md:p-12 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
            <div>
              <span className="inline-block bg-gradient-to-r from-brand-yellow to-brand-red text-black text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4">
                Progetto speciale
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-[-0.03em]">
                Italia Campione 2030
              </h2>
              <p className="text-white/60 mb-6">
                Nata dopo la mancata qualificazione ai Mondiali (sconfitta con la Bosnia, 31 marzo
                2026), è la nostra challenge di 1572 giorni: un video al giorno fino al 21 luglio
                2030, giorno della finale. Un canale di informazione e supporto dedicato alla
                nazionale azzurra.
              </p>
              <Link to="/italia-campione-2030" className={btnPrimary}>
                Scopri il progetto
              </Link>
            </div>
            <CampaignCountdown />
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHead eyebrow="I nostri sponsor" title="Aziende che credono in noi" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <PlaceholderBox key={i} className="h-24">
                Logo sponsor {i + 1}
              </PlaceholderBox>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/sponsor" className={btnSecondary}>
              Scopri le sponsorizzazioni
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-brand-soft">
        <div className="max-w-6xl mx-auto">
          <SectionHead eyebrow="Dal blog" title="News & Storie" />
          <div className="grid gap-6 md:grid-cols-3">
            {['Tornei', 'Interviste', 'Sponsor'].map((tag) => (
              <Card key={tag} className="p-0 overflow-hidden hover:translate-y-0">
                <PlaceholderBox className="h-40 rounded-none border-0 border-b border-white/[0.06]">
                  Immagine articolo
                </PlaceholderBox>
                <div className="p-6">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="bg-brand-yellow/10 text-brand-yellow text-[0.7rem] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                    <span className="text-[0.7rem] uppercase tracking-wider text-white/35">
                      Data da definire
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Titolo articolo di esempio</h3>
                  <p className="text-sm italic text-white/35">
                    Testo in arrivo non appena disponibile.
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 text-center bg-gradient-to-br from-brand-yellow/[0.08] to-brand-red/[0.1]">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-[-0.03em]">
          Vuoi partecipare o proporre una sponsorizzazione?
        </h2>
        <Link to="/contatti" className={btnPrimary}>
          Contattaci
        </Link>
      </section>
    </>
  )
}
