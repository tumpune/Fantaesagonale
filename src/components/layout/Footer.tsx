import { Link } from 'react-router-dom'
import { asset } from '../../lib/constants'
import { FOOTER_COLUMNS, SOCIALS } from '../../content/navigazione'
import { focusRing } from '../ui/styles'

const linkClass = `link-underline inline-block text-white/60 transition-colors hover:text-brand-yellow ${focusRing}`

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
            <ul className="flex flex-wrap gap-2">
              {SOCIALS.map(({ label, Icon, url }) =>
                url ? (
                  <li key={label}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className={`press flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-brand-yellow hover:text-brand-yellow ${focusRing}`}
                    >
                      <Icon size={16} aria-hidden="true" />
                    </a>
                  </li>
                ) : (
                  // Senza indirizzo l'icona non e' cliccabile: un href="#"
                  // simulerebbe un collegamento inesistente.
                  <li
                    key={label}
                    title={`${label} — link in arrivo`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors hover:border-white/30"
                  >
                    <Icon size={16} aria-hidden="true" />
                    <span className="sr-only">{label} — link in arrivo</span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {FOOTER_COLUMNS.map((column) => (
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
