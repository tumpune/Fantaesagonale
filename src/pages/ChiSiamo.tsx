import { Link } from 'react-router-dom'
import {
  Card,
  Eyebrow,
  PageHero,
  PlaceholderBox,
  SectionHead,
  btnPrimary,
} from '../components/ui'

const VALUES = [
  { title: 'Community', text: 'Costruiamo occasioni di incontro reali tra le persone.' },
  {
    title: 'Competizione sana',
    text: 'La sfida come motore di divertimento, con premi veri in palio.',
  },
  { title: 'Territorio', text: 'Vicini alle persone e alle aziende di Grammichele e dintorni.' },
  { title: 'Ottimismo', text: 'Crediamo nel valore del tempo libero e dello svago, senza tabù.' },
]

export default function ChiSiamo() {
  return (
    <>
      <PageHero eyebrow="Chi siamo" titleItalic="La nostra" title="storia">
        FantaEsagonale nasce a Grammichele nell'agosto 2023 come sponsor di un fantacalcio a
        listone. Da allora si è trasformata in un'associazione di promozione sociale, con
        l'obiettivo di intrattenere le persone attraverso giochi, attività sportive, interviste,
        sondaggi e contenuti social.
      </PageHero>

      <section className="py-20 px-6 bg-brand-soft">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-[-0.03em]">
              Da sponsor ad associazione
            </h2>
            <p className="text-white/60">
              Organizziamo il Fantacalcio al Listone — nella stagione 2025-2026 alla 3ª edizione,
              con 205 squadre iscritte e un montepremi totale di 20.000€ — tornei di calcio e altri
              sport, e giochi come freccette, beer pong e cornhole. Collaboriamo inoltre con le
              aziende del territorio realizzando campagne pubblicitarie e video sponsorizzati sui
              nostri profili social attraverso{' '}
              <strong className="text-white font-semibold">FantADSico</strong>, il nostro programma
              di sponsorizzazione digitale.
            </p>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-[-0.03em]">
              Sfide vere, premi veri
            </h2>
            <p className="text-white/60">
              Quello che ci contraddistingue è la voglia di far divertire davvero: mettiamo in palio
              premi in denaro e riconoscimenti concreti — coppe e oggetti — per rendere ogni sfida
              speciale.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-brand-yellow/[0.08] to-brand-red/[0.08] border border-brand-yellow/20 rounded-2xl p-12">
          <Eyebrow>La nostra missione</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-[-0.03em]">
            Ottimismo, territorio, tempo libero
          </h2>
          <p className="text-white/60 text-lg">
            Valorizzare il territorio di Grammichele e dintorni, trasmettere ottimismo attraverso lo
            sport e i giochi, e sfatare i tabù sulla cultura del tempo libero e dello svago: non un
            passatempo secondario, ma un valore per la community.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-brand-soft">
        <div className="max-w-6xl mx-auto">
          <SectionHead eyebrow="I nostri valori" title="Cosa ci guida" align="left" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <div key={value.title} className="border-l-[3px] border-brand-red pl-5 py-1.5">
                <h3 className="text-white font-bold mb-1.5">{value.title}</h3>
                <p className="text-sm text-white/60">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHead
            eyebrow="Portfolio"
            title="Il nostro percorso"
            subtitle="Una selezione dei contenuti social più significativi del nostro cammino, dai primi listoni alle sfide più recenti."
            align="left"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <PlaceholderBox className="h-36 mb-5">Video / post in arrivo</PlaceholderBox>
                <h3 className="text-lg font-bold text-white mb-2">Highlight in arrivo</h3>
                <p className="text-sm italic text-white/35">
                  Contenuti social da selezionare e caricare.
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-brand-soft">
        <div className="max-w-6xl mx-auto">
          <SectionHead eyebrow="Dove siamo" title="Grammichele" align="left" />
          <PlaceholderBox className="h-56">Mappa / indirizzo (da confermare)</PlaceholderBox>
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
