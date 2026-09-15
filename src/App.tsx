import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import ChiSiamo from './pages/ChiSiamo'
import Contatti from './pages/Contatti'
import Faq from './pages/Faq'
import Ramo from './pages/Ramo'
import ItaliaCampione2030 from './pages/ItaliaCampione2030'
import NonTrovata from './pages/NonTrovata'
import { Cookie, Privacy } from './pages/Legale'
import { RAMI } from './content/rami'

/**
 * Pagine rimosse dalla struttura precedente. Il reindirizzamento evita che i
 * link gia' condivisi finiscano sulla pagina di errore.
 */
const PERCORSI_DISMESSI: Record<string, string> = {
  '/area-soci': '/',
  '/blog': '/',
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chi-siamo" element={<ChiSiamo />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contatti" element={<Contatti />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookie" element={<Cookie />} />

        {RAMI.map((ramo) => (
          <Route
            key={ramo.slug}
            path={`/${ramo.slug}`}
            element={ramo.paginaDedicata ? <ItaliaCampione2030 /> : <Ramo ramo={ramo} />}
          />
        ))}

        {/* Indirizzi brevi per materiali stampati, merch e QR (questionario 2.2):
            chi arriva da /maritati atterra direttamente su FantaMaritati. */}
        {RAMI.flatMap((ramo) =>
          (ramo.alias ?? []).map((alias) => (
            <Route key={alias} path={`/${alias}`} element={<Navigate to={`/${ramo.slug}`} replace />} />
          )),
        )}

        {Object.entries(PERCORSI_DISMESSI).map(([da, a]) => (
          <Route key={da} path={da} element={<Navigate to={a} replace />} />
        ))}

        <Route path="*" element={<NonTrovata />} />
      </Route>
    </Routes>
  )
}
