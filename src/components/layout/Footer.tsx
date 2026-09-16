import { Link } from 'react-router-dom'
import { asset } from '../../lib/constants'
import { FOOTER_COLONNE, SOCIALS } from '../../content/navigazione'
import { BREVE_PIE_PAGINA } from '../../content/associazione'
import { SLOGAN } from '../../content/associazione'
import { focusRing } from '../ui/styles'

const linkClass = `link-underline inline-block text-white/60 transition-colors hover:text-accento-1 ${focusRing}`

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-brand-soft px-5 pb-6 pt-14 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src={asset('img/logo-trasparente.png')}
                alt=""
                width={44}
                height={44}
                className="h-10 w-10 object-contain sm:h-11 sm:w-11"
              />
              <span className="font-display text-xl font-bold tracking-tight text-white">
                FantaEsagonale
              </span>
            </div>
            <p className="mb-2 font-display text-guida font-semibold text-white/85">{SLOGAN}</p>
            <p className="mb-5 max-w-xs text-micro text-white/55">{BREVE_PIE_PAGINA}</p>
            <ul className="flex flex-wrap gap-2">
              {SOCIALS.map(({ label, Icon, url }) =>
                url ? (
                  <li key={label}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className={`press flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-accento-1 hover:text-accento-1 ${focusRing}`}
                    >
                      <Icon size={16} aria-hidden="true" />
                    </a>
                  </li>
                ) : (
                  // Senza indirizzo l'icona non e' cliccabile: un href="#"
                  // simulerebbe un collegamento che non porta da nessuna parte.
                  <li
                    key={label}
                    title={`${label} — presto disponibile`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40"
                  >
                    <Icon size={16} aria-hidden="true" />
                    <span className="sr-only">{label} — presto disponibile</span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {FOOTER_COLONNE.map((colonna) => (
            <div key={colonna.title}>
              <h2 className="mb-4 text-meta uppercase text-white/45">{colonna.title}</h2>
              <ul className="space-y-2.5 text-micro">
                {colonna.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-between gap-2 border-t border-white/[0.06] pt-6 text-micro text-white/40">
          <span>&copy; {new Date().getFullYear()} FantaEsagonale APS · Grammichele (CT)</span>
          <span>Tutti i diritti riservati</span>
        </div>
      </div>
    </footer>
  )
}
