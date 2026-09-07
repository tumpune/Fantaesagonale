import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import ChatWidget from './ChatWidget'

// Titolo per rotta: in una single page application il titolo resterebbe
// altrimenti quello iniziale su ogni pagina, penalizzando cronologia,
// segnalibri e risultati di ricerca.
const TITLES: Record<string, string> = {
  '/': 'FantaEsagonale — Sport, giochi e community a Grammichele',
  '/chi-siamo': 'Chi siamo — FantaEsagonale',
  '/tornei-giochi': 'Tornei & Giochi — FantaEsagonale',
  '/sponsor': 'Sponsor — FantaEsagonale',
  '/blog': 'Blog — FantaEsagonale',
  '/contatti': 'Contatti — FantaEsagonale',
  '/area-soci': 'Area Soci — FantaEsagonale',
  '/italia-campione-2030': 'Italia Campione 2030 — FantaEsagonale',
}

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = TITLES[pathname] ?? 'FantaEsagonale'
  }, [pathname])

  return (
    <div className="min-h-screen bg-brand-black tracking-[-0.02em]">
      <a href="#contenuto" className="skip-link">
        Salta al contenuto
      </a>
      <Nav />
      <main id="contenuto">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
