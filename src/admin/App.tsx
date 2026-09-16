import { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight, ExternalLink, Menu, Search } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Comandi from './components/Comandi'
import EditorFrame from './components/EditorFrame'
import { anello, pulsanteSecondario } from './components/ui'
import { useAccesso } from './lib/accesso'
import { SITO, leggiLocale, scriviLocale } from './lib/ambiente'
import { titoloVista } from './lib/contenuti'
import Accesso from './pages/Accesso'
import Panoramica from './pages/Panoramica'
import Statistiche from './pages/Statistiche'
import Automazioni from './pages/Automazioni'

const TITOLI: Record<string, string> = {
  '/': 'Panoramica',
  '/statistiche': 'Statistiche',
  '/automazioni': 'Automazioni',
}

const VISTA_PREDEFINITA = 'collections/rami'

export default function App() {
  const { stato } = useAccesso()
  const { pathname } = useLocation()
  const naviga = useNavigate()

  const [menuAperto, setMenuAperto] = useState(false)
  const [compatta, setCompatta] = useState(() => leggiLocale('pannello.barraCompatta', false))
  const [comandiAperti, setComandiAperti] = useState(false)
  // L'editor si carica alla prima visita ai contenuti e poi resta vivo.
  const [editorAvviato, setEditorAvviato] = useState(false)
  const [richiesteMedia, setRichiesteMedia] = useState(0)

  const inEditor = pathname.startsWith('/contenuti')
  const vista = inEditor ? pathname.replace(/^\/contenuti\/?/, '') || VISTA_PREDEFINITA : ''
  const [ultimaVista, setUltimaVista] = useState(VISTA_PREDEFINITA)

  useEffect(() => {
    if (!inEditor) return
    setEditorAvviato(true)
    setUltimaVista(vista)
  }, [inEditor, vista])

  const chiudiMenu = useCallback(() => setMenuAperto(false), [])
  const alternaCompatta = useCallback(() => {
    setCompatta((c) => {
      scriviLocale('pannello.barraCompatta', !c)
      return !c
    })
  }, [])

  /**
   * La libreria immagini vive dentro l'editor, e il suo comando esiste solo
   * negli elenchi: con una scheda aperta si torna prima all'elenco (chiedendo
   * conferma se ci sono modifiche non salvate). Il contatore fa partire la
   * richiesta appena l'editor e' pronto.
   */
  const apriMedia = useCallback(() => {
    const corrente = inEditor ? vista : ultimaVista
    naviga(`/contenuti/${corrente.split('/entries')[0].replace(/\/new$/, '')}`)
    setRichiesteMedia((n) => n + 1)
  }, [inEditor, naviga, ultimaVista, vista])

  useEffect(() => {
    const tasto = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setComandiAperti((a) => !a)
      }
    }
    window.addEventListener('keydown', tasto)
    return () => window.removeEventListener('keydown', tasto)
  }, [])

  const intestazione = inEditor ? titoloVista(vista) : { sezione: 'Pannello', titolo: TITOLI[pathname] ?? 'Pannello' }

  useEffect(() => {
    document.title = `${intestazione.titolo} — Gestione FantaEsagonale`
  }, [intestazione.titolo])

  if (stato.fase !== 'dentro') return <Accesso />

  return (
    <div className="min-h-screen">
      <Sidebar
        aperta={menuAperto}
        chiudi={chiudiMenu}
        compatta={compatta}
        alternaCompatta={alternaCompatta}
        apriComandi={() => setComandiAperti(true)}
        apriMedia={apriMedia}
      />
      <Comandi aperta={comandiAperti} chiudi={() => setComandiAperti(false)} apriMedia={apriMedia} />

      <div className={`flex min-h-screen flex-col transition-[padding] duration-300 ease-out ${compatta ? 'lg:pl-[4.75rem]' : 'lg:pl-[17rem]'}`}>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.06] bg-brand-black/85 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setMenuAperto(true)}
            aria-controls="barra-laterale"
            aria-expanded={menuAperto}
            aria-label="Apri il menu"
            className={`-ml-1.5 rounded-lg p-2 text-white/70 hover:bg-white/5 hover:text-white lg:hidden ${anello}`}
          >
            <Menu size={20} />
          </button>

          <nav aria-label="Posizione" className="flex min-w-0 items-center gap-1.5 text-micro">
            <span className="hidden text-white/40 sm:inline">{intestazione.sezione}</span>
            <ChevronRight size={14} className="hidden shrink-0 text-white/25 sm:inline" aria-hidden="true" />
            <span className="truncate font-semibold text-white">{intestazione.titolo}</span>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {'pagina' in intestazione && intestazione.pagina && (
              <a href={`${SITO}${intestazione.pagina}`} target="_blank" rel="noreferrer" className={`${pulsanteSecondario} !px-3 !py-1.5 text-micro`}>
                <ExternalLink size={14} aria-hidden="true" />
                <span className="hidden sm:inline">Vedi la pagina</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => setComandiAperti(true)}
              aria-label="Cerca o vai a"
              className={`rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white lg:hidden ${anello}`}
            >
              <Search size={18} />
            </button>
          </div>
        </header>

        {editorAvviato && (
          <EditorFrame vista={inEditor ? vista : ultimaVista} visibile={inEditor} richiestaMedia={richiesteMedia} />
        )}

        {!inEditor && (
          <main key={pathname} className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <Routes>
              <Route path="/" element={<Panoramica />} />
              <Route path="/statistiche" element={<Statistiche />} />
              <Route path="/automazioni" element={<Automazioni />} />
              <Route path="*" element={<Panoramica />} />
            </Routes>
          </main>
        )}
      </div>
    </div>
  )
}
