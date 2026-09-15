import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import temaEditor from '../tema-editor.css?inline'
import interUrl from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url'
import interEstesoUrl from '@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2?url'

/**
 * L'editor dei contenuti (Decap CMS) dentro il pannello.
 *
 * Decap resta una pagina a se' in /admin/editor, con la sua copia di React,
 * caricata in un iframe della stessa origine. Il pannello:
 * - gli applica i colori e i caratteri del sito;
 * - ne nasconde intestazione e menu, sostituiti dalla barra laterale;
 * - tiene sincronizzati l'indirizzo dell'editor e quello del pannello, cosi'
 *   i link diretti e il tasto "indietro" funzionano.
 *
 * L'iframe resta montato anche quando si passa ad altre sezioni: le
 * modifiche non salvate non si perdono.
 */

const EVENTO_MEDIA = 'pannello:media'

export const apriLibreriaMedia = () => window.dispatchEvent(new Event(EVENTO_MEDIA))

const caratteri = `
@font-face { font-family: 'Inter Variable'; font-style: normal; font-display: swap; font-weight: 100 900; src: url(${interEstesoUrl}) format('woff2-variations'); unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
@font-face { font-family: 'Inter Variable'; font-style: normal; font-display: swap; font-weight: 100 900; src: url(${interUrl}) format('woff2-variations'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
`

const hashDi = (vista: string) => `#/${vista}`

export default function EditorFrame({ vista, visibile }: { vista: string; visibile: boolean }) {
  const naviga = useNavigate()
  const iframe = useRef<HTMLIFrameElement>(null)
  const [pronto, setPronto] = useState(false)
  const [indirizzoIniziale] = useState(() => `/admin/editor/${hashDi(vista)}`)
  const vistaCorrente = useRef(vista)
  vistaCorrente.current = vista

  // Il pannello chiede una vista: se l'editor e' altrove, lo si sposta.
  useEffect(() => {
    const finestra = iframe.current?.contentWindow
    if (!finestra || !pronto) return
    if (finestra.location.hash !== hashDi(vista)) finestra.location.hash = hashDi(vista)
  }, [vista, pronto])

  useEffect(() => {
    const apri = () => {
      const documento = iframe.current?.contentDocument
      const pulsante = [...(documento?.querySelectorAll<HTMLElement>('[class*="-AppHeaderButton"]') ?? [])].find((b) =>
        b.textContent?.trim().toLowerCase().startsWith('media'),
      )
      pulsante?.click()
    }
    const quandoPronto = () => (pronto ? apri() : window.setTimeout(quandoPronto, 250))
    window.addEventListener(EVENTO_MEDIA, quandoPronto)
    return () => window.removeEventListener(EVENTO_MEDIA, quandoPronto)
  }, [pronto])

  const alCaricamento = () => {
    const finestra = iframe.current?.contentWindow
    const documento = iframe.current?.contentDocument
    if (!finestra || !documento) return

    const stile = documento.createElement('style')
    stile.dataset.pannello = 'tema'
    stile.textContent = caratteri + temaEditor
    documento.head.appendChild(stile)
    documento.documentElement.classList.add('nel-pannello')

    finestra.addEventListener('hashchange', () => {
      const nuova = finestra.location.hash.replace(/^#\/?/, '')
      if (nuova && nuova !== vistaCorrente.current) naviga(`/contenuti/${nuova}`, { replace: true })
    })

    // Decap impiega un momento a leggere la configurazione e i contenuti:
    // il pannello mostra il caricamento finche' non compare l'interfaccia.
    const attendi = () => {
      if (documento.querySelector('[class*="-AppMainContainer"], [class*="-EditorContainer"], [class*="ErrorContainer"]')) setPronto(true)
      else window.setTimeout(attendi, 120)
    }
    attendi()
  }

  return (
    <div className={visibile ? 'relative flex-1' : 'hidden'}>
      {!pronto && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-brand-black">
          <div className="flex flex-col items-center gap-4">
            <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-accento-1" />
            <p className="text-micro text-white/50">Apertura dell'editor…</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframe}
        src={indirizzoIniziale}
        onLoad={alCaricamento}
        title="Editor dei contenuti"
        className="absolute inset-0 h-full w-full border-0 bg-brand-black"
      />
    </div>
  )
}
