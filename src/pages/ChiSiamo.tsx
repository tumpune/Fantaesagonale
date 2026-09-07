import { Link } from 'react-router-dom'
import {
  Card,
  CtaBanner,
  HighlightPanel,
  PageHero,
  PlaceholderBox,
  Section,
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
        FantaEsagonale nasce a Grammichele nell'agosto 2023 come sponsor di un fantacalcio a listone.
        Da allora si è trasformata in un'associazione di promozione sociale, con l'obiettivo di
        intrattenere le persone attraverso giochi, attività sportive, interviste, sondaggi e
        contenuti social.
      </PageHero>

      <Section alt>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <h2 className="mb-4 text-xl font-extrabold tracking-[-0.03em] text-white sm:text-2xl md:text-3xl">
              Da sponsor ad associazione
            </h2>
            <p className="text-sm text-white/60 sm:text-base text-pretty">
              Organizziamo il Fantacalcio al Listone — nella stagione 2025-2026 alla 3ª edizione, con
              205 squadre iscritte e un montepremi totale di 20.000€ — tornei di calcio e altri
              sport, e giochi come freccette, beer pong e cornhole. Collaboriamo inoltre con le
              aziende del territorio realizzando campagne pubblicitarie e video sponsorizzati sui
              nostri profili social attraverso{' '}
              <strong className="font-semibold text-white">FantADSico</strong>, il nostro programma
              di sponsorizzazione digitale.
            </p>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-extrabold tracking-[-0.03em] text-white sm:text-2xl md:text-3xl">
              Sfide vere, premi veri
            </h2>
            <p className="text-sm text-white/60 sm:text-base text-pretty">
              Quello che ci contraddistingue è la voglia di far divertire davvero: mettiamo in palio
              premi in denaro e riconoscimenti concreti — coppe e oggetti — per rendere ogni sfida
              speciale.
            </p>
          </div>
        </div>
      </Section>

      <Section width="narrow">
        <HighlightPanel eyebrow="La nostra missione" title="Ottimismo, territorio, tempo libero">
          Valorizzare il territorio di Grammichele e dintorni, trasmettere ottimismo attraverso lo
          sport e i giochi, e sfatare i tabù sulla cultura del tempo libero e dello svago: non un
          passatempo secondario, ma un valore per la community.
        </HighlightPanel>
      </Section>

      <Section alt>
        <SectionHead eyebrow="I nostri valori" title="Cosa ci guida" align="left" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <li key={value.title} className="border-l-[3px] border-brand-red py-1.5 pl-5">
              <h3 className="mb-1.5 font-bold text-white">{value.title}</h3>
              <p className="text-sm text-white/60">{value.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHead
          eyebrow="Portfolio"
          title="Il nostro percorso"
          subtitle="Una selezione dei contenuti social più significativi del nostro cammino, dai primi listoni alle sfide più recenti."
          align="left"
        />
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <PlaceholderBox className="mb-5 h-36">Video / post in arrivo</PlaceholderBox>
              <h3 className="mb-2 text-base font-bold text-white sm:text-lg">Highlight in arrivo</h3>
              <p className="text-sm italic text-white/35">
                Contenuti social da selezionare e caricare.
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHead eyebrow="Dove siamo" title="Grammichele" align="left" />
        <PlaceholderBox className="h-48 sm:h-56">
          Mappa / indirizzo (da confermare)
        </PlaceholderBox>
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
