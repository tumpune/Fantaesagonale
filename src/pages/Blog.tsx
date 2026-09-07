import { Link } from 'react-router-dom'
import { ArticleCard, CtaBanner, PageHero, Section, btnPrimary } from '../components/ui'

const POSTS = ['Tornei', 'Interviste', 'Sponsor', 'Eventi', 'Tornei', 'Interviste']

export default function Blog() {
  return (
    <>
      <PageHero eyebrow="Blog" titleItalic="News &" title="Storie">
        Aggiornamenti su tornei, risultati, interviste e retroscena della community FantaEsagonale.
      </PageHero>

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {POSTS.map((tag, i) => (
            <ArticleCard key={`${tag}-${i}`} tag={tag} />
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
