import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { LazyMotion } from 'motion/react'
import { funzionalitaMovimento } from '../../lib/motionFeatures'
import Nav from './Nav'
import Footer from './Footer'
import ChatWidget from './ChatWidget'
import ScrollProgress from '../motion/ScrollProgress'
import SmoothScroll from '../motion/SmoothScroll'
import { PAGE_TITLES, TITOLO_NON_TROVATA } from '../../content/navigazione'
import { temaDaPercorso } from '../../content/rami'
import { registraVisita } from '../../lib/visite'

/**
 * Il cursore personalizzato e il sipario fra una pagina e l'altra sono stati
 * tolti: il questionario (6.1) chiede "tranquillita' nella navigazione" e una
 * professionalita' "senza ostentarla". Restano gli ingressi discreti allo
 * scorrimento e le transizioni leggere.
 */
export default function Layout() {
  const { pathname } = useLocation()
  const tema = temaDaPercorso(pathname)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = PAGE_TITLES[pathname] ?? TITOLO_NON_TROVATA
    registraVisita(pathname)
  }, [pathname])

  return (
    <LazyMotion features={funzionalitaMovimento} strict>
      {/* Il tema del ramo si applica a tutta la pagina, menu e barra di lettura
          compresi: entrare nel Fantacalcio vuol dire entrare nel nero e oro. */}
      <div data-tema={tema} className="min-h-screen bg-brand-black">
        <a href="#contenuto" className="skip-link">
          Salta al contenuto
        </a>

        <SmoothScroll />
        <ScrollProgress />

        <Nav />
        <main id="contenuto" key={pathname} className="page-transition">
          <Outlet />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </LazyMotion>
  )
}
