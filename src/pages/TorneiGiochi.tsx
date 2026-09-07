import { Link } from 'react-router-dom'
import { Beer, Dices, Target, Trophy } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card, PageHero, btnPrimary } from '../components/ui'

type Activity = {
  Icon: LucideIcon
  title: string
  body: ReactNode
  links: string[]
}

const ACTIVITIES: Activity[] = [
  {
    Icon: Trophy,
    title: 'Fantacalcio al Listone',
    body: (
      <>
        Il nostro evento di punta: nella stagione 2025-2026 è alla 3ª edizione, con{' '}
        <strong className="text-white font-semibold">205 squadre iscritte</strong> e un{' '}
        <strong className="text-white font-semibold">montepremi totale di 20.000€</strong>. Novità
        di quest'anno: <strong className="text-white font-semibold">Survivor Soccer</strong>, il
        nuovo gioco a eliminazione che affianca il listone tradizionale.
      </>
    ),
    links: ['Come iscriversi', 'Regolamento', 'Classifica / Edizioni passate', 'Survivor Soccer'],
  },
  {
    Icon: Trophy,
    title: 'Tornei di calcio e altri sport',
    body: <>Organizziamo tornei aperti a tutti durante l'anno.</>,
    links: ['Calendario tornei', 'Modulo iscrizione'],
  },
  {
    Icon: Target,
    title: 'Freccette',
    body: <span className="italic text-white/35">Descrizione, regolamento e iscrizioni in arrivo.</span>,
    links: ['Descrizione', 'Regolamento', 'Iscrizioni'],
  },
  {
    Icon: Beer,
    title: 'Beer Pong',
    body: <span className="italic text-white/35">Descrizione, regolamento e iscrizioni in arrivo.</span>,
    links: ['Descrizione', 'Regolamento', 'Iscrizioni'],
  },
  {
    Icon: Dices,
    title: 'Cornhole',
    body: <span className="italic text-white/35">Descrizione, regolamento e iscrizioni in arrivo.</span>,
    links: ['Descrizione', 'Regolamento', 'Iscrizioni'],
  },
]

export default function TorneiGiochi() {
  return (
    <>
      <PageHero eyebrow="Tornei & Giochi" titleItalic="Le nostre" title="attività">
        Da freccette a beer pong, dal fantacalcio ai tornei di calcio: ogni sfida FantaEsagonale
        nasconde un premio, e la voglia di stare insieme.
      </PageHero>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid gap-6">
          {ACTIVITIES.map((activity) => (
            <Card key={activity.title} className="hover:translate-y-0">
              <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-brand-yellow to-brand-red text-black flex items-center justify-center">
                  <activity.Icon size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2.5">{activity.title}</h3>
                  <p className="text-white/60">{activity.body}</p>
                  <div className="flex flex-wrap gap-2.5 mt-4">
                    {activity.links.map((link) => (
                      <a
                        key={link}
                        href="#"
                        className="border border-white/15 text-white/60 text-sm px-4 py-1.5 rounded-full transition-colors hover:border-brand-yellow hover:text-brand-yellow"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 text-center bg-gradient-to-br from-brand-yellow/[0.08] to-brand-red/[0.1]">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-[-0.03em]">
          Vuoi partecipare al prossimo torneo?
        </h2>
        <Link to="/contatti" className={btnPrimary}>
          Contattaci / Modulo prenotazione
        </Link>
      </section>
    </>
  )
}
