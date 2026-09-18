import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import temaEditor from '../tema-editor.css?inline'
import carattereUrl from '@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2?url'
import carattereEstesoUrl from '@fontsource-variable/archivo/files/archivo-latin-ext-wght-normal.woff2?url'

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
 * Passando da una voce all'altra l'editor viene riaperto: cambiando solo la
 * parte dopo "#", Decap aggiorna le etichette ma non ricarica i contenuti e i
 * campi resterebbero vuoti. Se ci sono modifiche non salvate si chiede prima
 * conferma. Uscendo dalla sezione Contenuti, invece, l'iframe resta com'e':
 * si torna alla voce aperta senza perdere niente.
 */

const caratteri = `
@font-face { font-family: 'Archivo Variable'; font-style: normal; font-display: swap; font-weight: 100 900; src: url(${carattereEstesoUrl}) format('woff2-variations'); unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
@font-face { font-family: 'Archivo Variable'; font-style: normal; font-display: swap; font-weight: 100 900; src: url(${carattereUrl}) format('woff2-variations'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
`

const hashDi = (vista: string) => `#/${vista}`

export default function EditorFrame({
  vista,
  visibile,
  richiestaMedia,
}: {
  vista: string
  visibile: boolean
  /** Contatore: a ogni aumento il pannello chiede di aprire la libreria immagini. */
  richiestaMedia: number
}) {
  const naviga = useNavigate()
  const iframe = useRef<HTMLIFrameElement>(null)
  const [pronto, setPronto] = useState(false)
  const [indirizzoIniziale] = useState(() => `/admin/editor/${hashDi(vista)}`)
  /** La voce che l'editor sta mostrando davvero. */
  const vistaCaricata = useRef(vista)
  const aperture = useRef(0)

  useEffect(() => {
    if (vistaCaricata.current === vista || !iframe.current) return

    const nonSalvate = iframe.current.contentDocument?.querySelector('[class*="BackStatusChanged"]')
    if (nonSalvate && !window.confirm('Ci sono modifiche non salvate in questa scheda. Vuoi uscire senza pubblicarle?')) {
      naviga(`/contenuti/${vistaCaricata.current}`, { replace: true })
      return
    }

    vistaCaricata.current = vista
    setPronto(false)
    // Il contatore serve a cambiare l'indirizzo anche prima del "#": senza,
    // il browser si limiterebbe a saltare dentro la pagina gia' aperta.
    aperture.current += 1
    iframe.current.src = `/admin/editor/?apertura=${aperture.current}${hashDi(vista)}`
  }, [vista, naviga])

  /**
   * La libreria immagini di Decap si apre dal suo menu, che il pannello
   * nasconde: si preme il pulsante originale appena l'editor e' disponibile.
   * L'editor puo' essere ancora in caricamento, quindi si riprova per qualche
   * secondo invece di arrendersi al primo tentativo.
   */
  const mediaServita = useRef(0)
  useEffect(() => {
    if (richiestaMedia === mediaServita.current) return
    mediaServita.current = richiestaMedia

    const apri = (tentativi = 60) => {
      const pulsante = [...(iframe.current?.contentDocument?.querySelectorAll<HTMLElement>('[class*="-AppHeaderButton"]') ?? [])].find(
        (b) => b.textContent?.trim().toLowerCase().startsWith('media'),
      )
      if (pulsante) pulsante.click()
      else if (tentativi > 0) window.setTimeout(() => apri(tentativi - 1), 250)
    }
    apri()
  }, [richiestaMedia])

  const alCaricamento = () => {
    const finestra = iframe.current?.contentWindow
    const documento = iframe.current?.contentDocument
    if (!finestra || !documento) return

    const stile = documento.createElement('style')
    stile.dataset.pannello = 'tema'
    stile.textContent = caratteri + temaEditor
    documento.head.appendChild(stile)
    documento.documentElement.classList.add('nel-pannello')

    // Navigazione fatta dentro l'editor (elenco, tasto indietro, salvataggio):
    // il pannello la segue, senza riaprire l'editor.
    finestra.addEventListener('hashchange', () => {
      const nuova = finestra.location.hash.replace(/^#\/?/, '')
      if (!nuova || nuova === vistaCaricata.current) return
      vistaCaricata.current = nuova
      naviga(`/contenuti/${nuova}`, { replace: true })
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
