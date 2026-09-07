import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { asset } from '../lib/constants'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Chi Siamo', to: '/chi-siamo' },
  { label: 'Tornei & Giochi', to: '/tornei-giochi' },
  { label: 'Sponsor', to: '/sponsor' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contatti', to: '/contatti' },
]

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-black/50'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

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
      className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-300 ${
        scrolled || open
          ? 'bg-brand-black/85 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Navigazione principale"
        className="relative mx-auto flex max-w-[110rem] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4"
      >
        <Link to="/" className={`flex shrink-0 items-center gap-2.5 rounded-full ${focusRing}`}>
          <img
            src={asset('img/logo-trasparente.png')}
            alt=""
            width={36}
            height={36}
            className="h-8 w-8 object-contain sm:h-9 sm:w-9"
          />
          <span className="whitespace-nowrap font-playfair text-lg italic text-white sm:text-2xl">
            FantaEsagonale
          </span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/25 bg-white/15 px-2 py-2 backdrop-blur-md lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${focusRing} ${
                  active ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/20 hover:text-white'
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
            className={`hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 sm:block ${focusRing}`}
          >
            Area Soci
          </Link>
          <button
            type="button"
            aria-label={open ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
            className={`grid h-11 w-11 place-items-center rounded-full text-white transition-colors hover:bg-white/15 lg:hidden ${focusRing}`}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="menu-mobile"
          className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 px-4 pb-5 pt-2 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  aria-current={pathname === link.to ? 'page' : undefined}
                  className={`block rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${focusRing} ${
                    pathname === link.to
                      ? 'bg-white/10 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="sm:hidden">
              <Link
                to="/area-soci"
                className={`mt-2 block rounded-xl bg-white px-4 py-3.5 text-center text-base font-semibold text-gray-900 ${focusRing}`}
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
