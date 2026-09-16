import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { LazyMotion } from 'motion/react'
import { funzionalitaMovimento } from '../../lib/motionFeatures'
import Nav from './Nav'
import Footer from './Footer'
import ChatWidget from './ChatWidget'
import SchermoErrore from '../SchermoErrore'
import { SchemaAssociazione } from '../DatiStrutturati'
import ScrollProgress from '../motion/ScrollProgress'
import SmoothScroll from '../motion/SmoothScroll'
import { DESCRIZIONE_PREDEFINITA, DESCRIZIONI, PAGE_TITLES, TITOLO_NON_TROVATA } from '../../content/navigazione'
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
    // "instant" e' necessario: con scroll-behavior smooth la pagina nuova
    // comparirebbe a meta' altezza e scivolerebbe su per un secondo.
    window.scrollTo({ top: 0, behavior: 'instant' })

    // Un indirizzo copiato da una chat puo' avere la barra finale: senza
    // toglierla, titolo e descrizione sarebbero quelli della pagina di errore.
    const percorso = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

    // Titolo e descrizione cambiano a ogni pagina: sono quelli che compaiono
    // su Google e nell'anteprima dei link condivisi sui social.
    const titolo = PAGE_TITLES[percorso] ?? TITOLO_NON_TROVATA
    const descrizione = DESCRIZIONI[percorso] ?? DESCRIZIONE_PREDEFINITA
    document.title = titolo
    for (const [selettore, valore] of [
      ['meta[name="description"]', descrizione],
      ['meta[property="og:description"]', descrizione],
      ['meta[property="og:title"]', titolo],
      ['meta[property="og:url"]', window.location.href],
    ] as const) {
      document.head.querySelector(selettore)?.setAttribute('content', valore)
    }
    // L'indirizzo ufficiale della pagina, per evitare contenuti duplicati.
    document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://fantaesagonale.vercel.app${percorso}`)

    registraVisita(percorso)
  }, [pathname])

  return (
    <LazyMotion features={funzionalitaMovimento} strict>
      {/* Il tema del ramo si applica a tutta la pagina, menu e barra di lettura
          compresi: entrare nel Fantacalcio vuol dire entrare nel nero e oro. */}
      <div data-tema={tema} className="min-h-screen bg-brand-black">
        <a href="#contenuto" className="skip-link">
          Salta al contenuto
        </a>

        <SchemaAssociazione />
        <SmoothScroll />
        <ScrollProgress />

        <Nav />
        <main id="contenuto" key={pathname} className="page-transition">
          <SchermoErrore>
            <Outlet />
          </SchermoErrore>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </LazyMotion>
  )
}
