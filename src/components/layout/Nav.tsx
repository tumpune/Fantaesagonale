import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { asset } from '../../lib/constants'
import { NAV_LINKS } from '../../content/navigazione'
import { focusRing } from '../ui/styles'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [indicatore, setIndicatore] = useState({ left: 0, width: 0 })
  const pillRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  // Misura la voce attiva a ogni cambio pagina e al ridimensionamento: le
  // larghezze dipendono dal testo, quindi non si possono fissare a priori.
  useEffect(() => {
    const misura = () => {
      const contenitore = pillRef.current
      const attivo = contenitore?.querySelector<HTMLElement>('[data-attivo]')
      if (!contenitore || !attivo) {
        setIndicatore({ left: 0, width: 0 })
        return
      }
      setIndicatore({
        left: attivo.offsetLeft,
        width: attivo.offsetWidth,
      })
    }
    misura()
    window.addEventListener('resize', misura)
    return () => window.removeEventListener('resize', misura)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    // Blocca lo scroll della pagina sotto il menu aperto, altrimenti su mobile
    // si scorre il contenuto retrostante mentre il pannello resta fermo.
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled || open
          ? 'bg-brand-black/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/30'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav
        aria-label="Navigazione principale"
        className="relative mx-auto flex max-w-[110rem] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4"
      >
        <Link
          to="/"
          className={`group flex shrink-0 items-center gap-2.5 rounded-full ${focusRing}`}
        >
          <img
            src={asset('img/logo-trasparente.png')}
            alt=""
            width={36}
            height={36}
            className="h-8 w-8 object-contain transition-transform duration-500 group-hover:rotate-[14deg] group-hover:scale-110 sm:h-9 sm:w-9"
          />
          <span className="whitespace-nowrap font-playfair text-lg italic text-white sm:text-2xl">
            FantaEsagonale
          </span>
        </Link>

        <div
          ref={pillRef}
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/25 bg-white/15 px-2 py-2 backdrop-blur-md lg:flex"
        >
          {/* Un solo indicatore che scivola fra le voci: posizione e larghezza
              sono misurate sulla voce attiva, l'interpolazione la fa il CSS.
              Le animazioni di layout della libreria darebbero lo stesso
              risultato al prezzo di 13,6 KB compressi. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/25 transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              height: 'calc(100% - 1rem)',
              width: indicatore.width,
              transform: `translate3d(${indicatore.left}px, -50%, 0)`,
              opacity: indicatore.width ? 1 : 0,
            }}
          />
          {NAV_LINKS.map((link) => {
            const active = pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                data-attivo={active || undefined}
                aria-current={active ? 'page' : undefined}
                className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${focusRing} ${
                  active ? 'text-white' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/area-soci"
            className={`press btn-shine hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 sm:block ${focusRing}`}
          >
            Area Soci
          </Link>
          <button
            type="button"
            aria-label={open ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={open}
            aria-controls="menu-mobile"
            data-open={open}
            onClick={() => setOpen((v) => !v)}
            className={`burger press grid h-11 w-11 place-items-center rounded-full text-white hover:bg-white/15 lg:hidden ${focusRing}`}
          >
            {/* Tre barrette che ruotano in una X: il passaggio fra i due stati
                resta leggibile, a differenza di uno scambio secco di icone. */}
            <span className="relative flex h-4 w-5 flex-col justify-between" aria-hidden="true">
              <span className="burger-line burger-top h-0.5 w-full rounded bg-current" />
              <span className="burger-line burger-mid h-0.5 w-full rounded bg-current" />
              <span className="burger-line burger-bottom h-0.5 w-full rounded bg-current" />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="menu-mobile"
          className="menu-panel max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 px-4 pb-5 pt-2 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.to}
                className="menu-item"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <Link
                  to={link.to}
                  aria-current={pathname === link.to ? 'page' : undefined}
                  className={`press block rounded-xl px-4 py-3.5 text-base font-medium ${focusRing} ${
                    pathname === link.to
                      ? 'bg-white/10 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li
              className="menu-item sm:hidden"
              style={{ animationDelay: `${NAV_LINKS.length * 45}ms` }}
            >
              <Link
                to="/area-soci"
                className={`press mt-2 block rounded-xl bg-white px-4 py-3.5 text-center text-base font-semibold text-gray-900 ${focusRing}`}
              >
                Area Soci
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
