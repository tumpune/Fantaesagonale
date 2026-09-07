import { Link } from 'react-router-dom'
import Reveal from '../components/motion/Reveal'
import { ACTIVITIES } from '../content/sezioni'
import { Card, CtaBanner, PageHero, Section, btnPrimary } from '../components/ui'

export default function TorneiGiochi() {
  return (
    <>
      <PageHero eyebrow="Tornei & Giochi" titleItalic="Le nostre" title="attività">
        Da freccette a beer pong, dal fantacalcio ai tornei di calcio: ogni sfida FantaEsagonale
        nasconde un premio, e la voglia di stare insieme.
      </PageHero>

      <Section>
        <div className="mx-auto grid max-w-5xl gap-5 sm:gap-6">
          {ACTIVITIES.map((activity, i) => (
            <Reveal key={activity.title} variant={i % 2 === 0 ? 'left' : 'right'} delay={40}>
              <Card>
                <div className="grid items-start gap-5 sm:grid-cols-[auto_1fr] sm:gap-6">
                  <div className="card-icon flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-yellow to-brand-red text-black sm:h-16 sm:w-16">
                    <activity.Icon size={28} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="mb-2.5 text-lg font-bold text-white sm:text-xl">
                      {activity.title}
                    </h2>
                    <p className="text-sm text-white/60 sm:text-base text-pretty">{activity.body}</p>
                    {/* Elenchi di argomenti, non link: le pagine di destinazione
                        non esistono ancora e un href="#" riporterebbe in cima. */}
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {activity.topics.map((topic) => (
                        <li
                          key={topic}
                          className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/50 transition-colors duration-300 hover:border-brand-yellow/50 hover:text-white/80 sm:text-sm"
                        >
                          {topic}
                          <span className="sr-only"> — in arrivo</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBanner
        title="Vuoi partecipare al prossimo torneo?"
        action={
          <Link to="/contatti" className={btnPrimary}>
            Contattaci
          </Link>
        }
      />
    </>
  )
}
