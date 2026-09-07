import { Link } from 'react-router-dom'
import { Card, PageHero, PlaceholderBox, btnPrimary } from '../components/ui'

const POSTS = ['Tornei', 'Interviste', 'Sponsor', 'Eventi', 'Tornei', 'Interviste']

export default function Blog() {
  return (
    <>
      <PageHero eyebrow="Blog" titleItalic="News &" title="Storie">
        Aggiornamenti su tornei, risultati, interviste e retroscena della community FantaEsagonale.
      </PageHero>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((tag, i) => (
            <Card key={`${tag}-${i}`} className="p-0 overflow-hidden hover:translate-y-0">
              <PlaceholderBox className="h-40 rounded-none border-0 border-b border-white/[0.06]">
                Immagine di copertina
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
                  Testo dell'articolo verrà scritto man mano che i contenuti saranno disponibili.
                </p>
              </div>
            </Card>
          ))}
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
