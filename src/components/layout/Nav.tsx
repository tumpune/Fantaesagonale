import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { asset } from '../../lib/constants'
import { bloccaScorrimento } from '../../lib/scorrimento'
import { NAV_PRINCIPALE } from '../../content/navigazione'
import { RAMI } from '../../content/rami'
import MenuProgetti from './MenuProgetti'
import { btnPrimary, focusRing } from '../ui/styles'

export default function Nav() {
  const [menuMobile, setMenuMobile] = useState(false)
  const [progetti, setProgetti] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [indicatore, setIndicatore] = useState({ left: 0, width: 0 })
  const pillRef = useRef<HTMLDivElement>(null)
  const progettiRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  const inUnRamo = RAMI.some((r) => pathname === `/${r.slug}`)

  useEffect(() => {
    setMenuMobile(false)
    setProgetti(false)
  }, [pathname])

  // Posizione dell'indicatore sotto la voce attiva, rimisurata a ogni cambio
  // pagina e ridimensionamento: le larghezze dipendono dal testo.
  useEffect(() => {
    const misura = () => {
      const attivo = pillRef.current?.querySelector<HTMLElement>('[data-attivo]')
      setIndicatore(attivo ? { left: attivo.offsetLeft, width: attivo.offsetWidth } : { left: 0, width: 0 })
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

  // La tendina si chiude con Esc e con un clic fuori: senza, resterebbe aperta
  // sopra la pagina finche' non si ricorda di cliccare di nuovo sul pulsante.
  useEffect(() => {
    if (!progetti) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setProgetti(false)
    const onClick = (e: MouseEvent) => {
      if (!progettiRef.current?.contains(e.target as Node)) setProgetti(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [progetti])

  useEffect(() => {
    if (!menuMobile) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuMobile(false)
    window.addEventListener('keydown', onKey)
    // Sotto al menu aperto la pagina non deve muoversi. Serve fermare anche lo
    // scorrimento inerziale: sposta la pagina via JavaScript e ignorerebbe
    // `overflow: hidden`, facendo ritrovare un punto diverso alla chiusura.
    document.body.style.overflow = 'hidden'
    bloccaScorrimento(true)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      bloccaScorrimento(false)
    }
  }, [menuMobile])

  const vocePill = (attiva: boolean) =>
    `relative z-10 rounded-full px-4 py-1.5 text-etichetta transition-colors ${focusRing} ${
      attiva ? 'text-white' : 'text-white/75 hover:text-white'
    }`

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-300 ${
        scrolled || menuMobile
          ? 'border-b border-white/10 bg-brand-black/85 shadow-lg shadow-black/30 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label="Navigazione principale"
        className="relative mx-auto flex max-w-[110rem] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4"
      >
        <Link to="/" className={`group flex shrink-0 items-center gap-2.5 rounded-full ${focusRing}`}>
          <img
            src={asset('img/logo-trasparente.png')}
            alt=""
            width={36}
            height={36}
            className="h-8 w-8 object-contain transition-transform duration-500 group-hover:rotate-[14deg] group-hover:scale-110 sm:h-9 sm:w-9"
          />
          <span className="whitespace-nowrap font-display text-lg font-bold tracking-tight text-white sm:text-xl">
            FantaEsagonale
          </span>
        </Link>

        <div
          ref={pillRef}
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-2 backdrop-blur-md lg:flex"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 rounded-full bg-white/20 transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              height: 'calc(100% - 1rem)',
              width: indicatore.width,
              transform: `translate3d(${indicatore.left}px, -50%, 0)`,
              opacity: indicatore.width ? 1 : 0,
            }}
          />

          <Link
            to="/chi-siamo"
            data-attivo={pathname === '/chi-siamo' || undefined}
            aria-current={pathname === '/chi-siamo' ? 'page' : undefined}
            className={vocePill(pathname === '/chi-siamo')}
          >
            Chi siamo
          </Link>

          <div ref={progettiRef} className="relative" data-attivo={inUnRamo || undefined}>
            <button
              type="button"
              aria-expanded={progetti}
              aria-controls="menu-progetti"
              onClick={() => setProgetti((v) => !v)}
              className={`${vocePill(inUnRamo || progetti)} inline-flex items-center gap-1.5`}
            >
              Progetti
              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`transition-transform duration-300 ${progetti ? 'rotate-180' : ''}`}
              />
            </button>

            {progetti && <MenuProgetti id="menu-progetti" attuale={pathname} />}
          </div>

          {NAV_PRINCIPALE.filter((v) => v.to !== '/chi-siamo').map((voce) => (
            <Link
              key={voce.to}
              to={voce.to}
              data-attivo={pathname === voce.to || undefined}
              aria-current={pathname === voce.to ? 'page' : undefined}
              className={vocePill(pathname === voce.to)}
            >
              {voce.label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link to="/contatti" className={`${btnPrimary} hidden !px-5 !py-2.5 sm:inline-block`}>
            Contattaci
          </Link>
          <button
            type="button"
            aria-label={menuMobile ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={menuMobile}
            aria-controls="menu-mobile"
            data-open={menuMobile}
            onClick={() => setMenuMobile((v) => !v)}
            className={`burger press grid h-11 w-11 place-items-center rounded-full text-white hover:bg-white/15 lg:hidden ${focusRing}`}
          >
            <span className="relative flex h-4 w-5 flex-col justify-between" aria-hidden="true">
              <span className="burger-line burger-top h-0.5 w-full rounded bg-current" />
              <span className="burger-line burger-mid h-0.5 w-full rounded bg-current" />
              <span className="burger-line burger-bottom h-0.5 w-full rounded bg-current" />
            </span>
          </button>
        </div>
      </nav>

      {menuMobile && (
        <div
          id="menu-mobile"
          className="menu-panel max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 px-4 pb-6 pt-3 lg:hidden"
        >
          {/* Le voci principali arrivano dallo stesso elenco della barra su
              schermi larghi: aggiungerne una la fa comparire in entrambi. */}
          {NAV_PRINCIPALE.filter((voce) => voce.to !== '/faq').map((voce) => (
            <Link
              key={voce.to}
              to={voce.to}
              aria-current={pathname === voce.to ? 'page' : undefined}
              className={`menu-item block rounded-xl px-4 py-3 text-etichetta text-white/85 hover:bg-white/10 ${focusRing} ${
                pathname === voce.to ? 'bg-white/10' : ''
              }`}
            >
              {voce.label}
            </Link>
          ))}

          <p className="menu-item mt-3 px-4 pb-2 text-occhiello uppercase text-white/60">Progetti</p>
          <ul className="grid gap-1 sm:grid-cols-2">
            {RAMI.map((ramo, i) => (
              <li
                key={ramo.slug}
                data-tema={ramo.tema}
                className="menu-item"
                style={{ animationDelay: `${(i + 1) * 35}ms` }}
              >
                <Link
                  to={`/${ramo.slug}`}
                  aria-current={pathname === `/${ramo.slug}` ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-white/10 ${focusRing} ${
                    pathname === `/${ramo.slug}` ? 'bg-white/10' : ''
                  }`}
                >
                  <span className="h-8 w-8 shrink-0 grid place-items-center rounded-lg border border-accento-1/25 bg-accento-1/[0.08] text-accento-1">
                    <ramo.Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="text-etichetta text-white/85">{ramo.nome}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            to="/faq"
            className={`menu-item mt-3 block rounded-xl px-4 py-3 text-etichetta text-white/85 hover:bg-white/10 ${focusRing}`}
          >
            Domande frequenti
          </Link>
          <Link to="/contatti" className={`${btnPrimary} menu-item mt-4 block w-full text-center sm:hidden`}>
            Contattaci
          </Link>
        </div>
      )}
    </header>
  )
}
