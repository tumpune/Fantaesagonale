import { Link } from 'react-router-dom'
import { Facebook, Instagram, MessageCircle, Music2, Send, Youtube } from 'lucide-react'
import { asset } from '../lib/constants'

const SOCIALS = [
  { label: 'Instagram', Icon: Instagram },
  { label: 'Facebook', Icon: Facebook },
  { label: 'TikTok', Icon: Music2 },
  { label: 'YouTube', Icon: Youtube },
  { label: 'Canale Telegram', Icon: Send },
  { label: 'Canale WhatsApp', Icon: MessageCircle },
]

const COLUMNS = [
  {
    title: 'Sito',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Chi Siamo', to: '/chi-siamo' },
      { label: 'Tornei & Giochi', to: '/tornei-giochi' },
      { label: 'Sponsor', to: '/sponsor' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Blog', to: '/blog' },
      { label: 'Contatti', to: '/contatti' },
      { label: 'Area Soci', to: '/area-soci' },
      { label: 'Italia Campione 2030', to: '/italia-campione-2030' },
    ],
  },
]

const linkClass =
  'text-white/60 transition-colors hover:text-brand-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-brand-soft px-5 pb-6 pt-12 sm:px-8 sm:pt-14 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <img
                src={asset('img/logo-trasparente.png')}
                alt=""
                width={44}
                height={44}
                className="h-10 w-10 object-contain sm:h-11 sm:w-11"
              />
              <span className="font-playfair text-xl italic text-white sm:text-2xl">
                FantaEsagonale
              </span>
            </div>
            <p className="mb-4 max-w-[280px] text-sm text-white/60">
              Associazione di promozione sociale a Grammichele e dintorni. Dal 2023 trasmettiamo
              ottimismo attraverso sport, giochi e sfide vere.
            </p>
            {/* Icone non cliccabili: gli indirizzi dei profili non sono ancora
                stati forniti e un href="#" simulerebbe un collegamento che non c'e'. */}
            <ul className="flex flex-wrap gap-2">
              {SOCIALS.map(({ label, Icon }) => (
                <li
                  key={label}
                  title={`${label} — link in arrivo`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/50"
                >
                  <Icon size={16} aria-hidden="true" />
                  <span className="sr-only">{label} — link in arrivo</span>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="mb-4 text-xs uppercase tracking-wider text-white/50">{column.title}</h2>
              <ul className="space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="mb-4 text-xs uppercase tracking-wider text-white/50">Contatti</h2>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li className="italic text-white/40">Email da definire</li>
              <li className="italic text-white/40">Tel/WhatsApp da definire</li>
              <li>Grammichele</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-2 border-t border-white/[0.06] pt-5 text-xs text-white/40">
          <span>&copy; {new Date().getFullYear()} FantaEsagonale. Tutti i diritti riservati.</span>
          <span>Sito in fase di sviluppo — contenuti in corso di definizione</span>
        </div>
      </div>
    </footer>
  )
}
