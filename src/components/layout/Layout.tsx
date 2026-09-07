import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import ChatWidget from './ChatWidget'
import { PAGE_TITLES, TITOLO_NON_TROVATA } from '../../content/navigazione'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    // In una single page application il titolo resterebbe quello iniziale su
    // ogni pagina, penalizzando cronologia, segnalibri e motori di ricerca.
    document.title = PAGE_TITLES[pathname] ?? TITOLO_NON_TROVATA
  }, [pathname])

  return (
    <div className="min-h-screen bg-brand-black tracking-[-0.02em]">
      <a href="#contenuto" className="skip-link">
        Salta al contenuto
      </a>
      <Nav />
      {/* La key sul pathname rimonta il contenuto a ogni cambio rotta, cosi'
          l'animazione di ingresso riparte invece di scattare una volta sola. */}
      <main id="contenuto" key={pathname} className="page-transition">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
