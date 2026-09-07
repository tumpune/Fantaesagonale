import { Link } from 'react-router-dom'
import { Beer, Dices, Target, Trophy } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card, CtaBanner, PageHero, Section, btnPrimary } from '../components/ui'

type Activity = {
  Icon: LucideIcon
  title: string
  body: ReactNode
  topics: string[]
}

const ACTIVITIES: Activity[] = [
  {
    Icon: Trophy,
    title: 'Fantacalcio al Listone',
    body: (
      <>
        Il nostro evento di punta: nella stagione 2025-2026 è alla 3ª edizione, con{' '}
        <strong className="font-semibold text-white">205 squadre iscritte</strong> e un{' '}
        <strong className="font-semibold text-white">montepremi totale di 20.000€</strong>. Novità di
        quest'anno: <strong className="font-semibold text-white">Survivor Soccer</strong>, il nuovo
        gioco a eliminazione che affianca il listone tradizionale.
      </>
    ),
    topics: ['Come iscriversi', 'Regolamento', 'Classifica / Edizioni passate', 'Survivor Soccer'],
  },
  {
    Icon: Trophy,
    title: 'Tornei di calcio e altri sport',
    body: <>Organizziamo tornei aperti a tutti durante l'anno.</>,
    topics: ['Calendario tornei', 'Modulo iscrizione'],
  },
  {
    Icon: Target,
    title: 'Freccette',
    body: (
      <span className="italic text-white/35">Descrizione, regolamento e iscrizioni in arrivo.</span>
    ),
    topics: ['Descrizione', 'Regolamento', 'Iscrizioni'],
  },
  {
    Icon: Beer,
    title: 'Beer Pong',
    body: (
      <span className="italic text-white/35">Descrizione, regolamento e iscrizioni in arrivo.</span>
    ),
    topics: ['Descrizione', 'Regolamento', 'Iscrizioni'],
  },
  {
    Icon: Dices,
    title: 'Cornhole',
    body: (
      <span className="italic text-white/35">Descrizione, regolamento e iscrizioni in arrivo.</span>
    ),
    topics: ['Descrizione', 'Regolamento', 'Iscrizioni'],
  },
]

export default function TorneiGiochi() {
  return (
    <>
      <PageHero eyebrow="Tornei & Giochi" titleItalic="Le nostre" title="attività">
        Da freccette a beer pong, dal fantacalcio ai tornei di calcio: ogni sfida FantaEsagonale
        nasconde un premio, e la voglia di stare insieme.
      </PageHero>

      <Section>
        <div className="mx-auto grid max-w-5xl gap-5 sm:gap-6">
          {ACTIVITIES.map((activity) => (
            <Card key={activity.title} className="hover:translate-y-0">
              <div className="grid items-start gap-5 sm:grid-cols-[auto_1fr] sm:gap-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-yellow to-brand-red text-black sm:h-16 sm:w-16">
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
                        className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/50 sm:text-sm"
                      >
                        {topic}
                        <span className="sr-only"> — in arrivo</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
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
