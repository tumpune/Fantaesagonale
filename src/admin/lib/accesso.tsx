import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CHIAVE_UTENTE_DECAP, LOCALE, REPO, leggiLocale, scriviLocale } from './ambiente'

/**
 * Accesso al pannello.
 *
 * Online si entra con GitHub, tramite le funzioni /api/auth e /api/callback, e
 * possono entrare solo i collaboratori con permesso di scrittura sul
 * repository. Il token viene salvato nello stesso formato di Decap: l'editor
 * dei contenuti, caricato nella stessa origine, trova l'utente gia' collegato.
 */

export type Utente = { login: string; nome: string; avatar?: string; token?: string }

type Stato =
  | { fase: 'verifica' }
  | { fase: 'ospite'; errore?: string }
  | { fase: 'negato'; login: string }
  | { fase: 'dentro'; utente: Utente }

type ValoreAccesso = {
  stato: Stato
  utente: Utente | null
  accedi: () => Promise<void>
  esci: () => void
}

type UtenteDecap = { backendName: string; token?: string; login?: string; name?: string; avatar_url?: string }

const Contesto = createContext<ValoreAccesso | null>(null)

const UTENTE_LOCALE: Utente = { login: 'locale', nome: 'Staff in locale' }

/** Apre la finestra di GitHub e aspetta il token con il protocollo di Decap. */
function chiediToken(): Promise<string> {
  return new Promise((risolvi, rifiuta) => {
    const larghezza = 560
    const altezza = 720
    const finestra = window.open(
      '/api/auth?provider=github&scope=repo',
      'accesso-github',
      `width=${larghezza},height=${altezza},left=${window.screenX + (window.outerWidth - larghezza) / 2},top=${window.screenY + (window.outerHeight - altezza) / 2}`,
    )
    if (!finestra) {
      rifiuta(new Error('Il browser ha bloccato la finestra di accesso: consenti i popup per questo sito e riprova.'))
      return
    }

    const origine = window.location.origin
    const pulisci = () => {
      window.clearInterval(controllo)
      window.removeEventListener('message', ascolta)
    }

    function ascolta(evento: MessageEvent) {
      if (evento.origin !== origine || evento.source !== finestra || typeof evento.data !== 'string') return
      if (evento.data === 'authorizing:github') {
        finestra!.postMessage(evento.data, origine)
        return
      }
      const esito = evento.data.match(/^authorization:github:(success|error):([\s\S]*)$/)
      if (!esito) return
      pulisci()
      finestra!.close()
      try {
        const dati = JSON.parse(esito[2]) as { token?: string; message?: string }
        if (esito[1] === 'success' && dati.token) risolvi(dati.token)
        else rifiuta(new Error(dati.message || 'Accesso non riuscito.'))
      } catch {
        rifiuta(new Error('Risposta di accesso non valida.'))
      }
    }

    const controllo = window.setInterval(() => {
      if (finestra.closed) {
        pulisci()
        rifiuta(new Error('La finestra di accesso è stata chiusa prima di completare il login.'))
      }
    }, 600)
    window.addEventListener('message', ascolta)
  })
}

async function verifica(token: string): Promise<Stato> {
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
  const [profilo, repo] = await Promise.all([
    fetch('https://api.github.com/user', { headers }),
    fetch(`https://api.github.com/repos/${REPO}`, { headers }),
  ])
  if (profilo.status === 401) return { fase: 'ospite', errore: 'La sessione è scaduta: accedi di nuovo.' }
  if (!profilo.ok) throw new Error(`GitHub non risponde (${profilo.status}).`)

  const u = (await profilo.json()) as { login: string; name?: string; avatar_url: string }
  const r = repo.ok ? ((await repo.json()) as { permissions?: { push?: boolean } }) : {}
  if (!r.permissions?.push) return { fase: 'negato', login: u.login }

  scriviLocale(CHIAVE_UTENTE_DECAP, {
    backendName: 'github',
    token,
    login: u.login,
    name: u.name || u.login,
    avatar_url: u.avatar_url,
  } satisfies UtenteDecap)
  return { fase: 'dentro', utente: { login: u.login, nome: u.name || u.login, avatar: u.avatar_url, token } }
}

export function ProviderAccesso({ children }: { children: ReactNode }) {
  const [stato, setStato] = useState<Stato>(() => (LOCALE ? { fase: 'dentro', utente: UTENTE_LOCALE } : { fase: 'verifica' }))

  useEffect(() => {
    if (LOCALE) {
      // In locale Decap usa decap-server: gli basta sapere che il backend e'
      // quello, cosi' non mostra la propria schermata di accesso.
      const salvato = leggiLocale<UtenteDecap | null>(CHIAVE_UTENTE_DECAP, null)
      if (salvato?.backendName !== 'proxy') scriviLocale(CHIAVE_UTENTE_DECAP, { backendName: 'proxy' })
      return
    }
    const salvato = leggiLocale<UtenteDecap | null>(CHIAVE_UTENTE_DECAP, null)
    if (salvato?.backendName !== 'github' || !salvato.token) {
      setStato({ fase: 'ospite' })
      return
    }
    verifica(salvato.token)
      .then((nuovo) => {
        if (nuovo.fase !== 'dentro') scriviLocale(CHIAVE_UTENTE_DECAP, undefined)
        setStato(nuovo)
      })
      .catch((errore: Error) => setStato({ fase: 'ospite', errore: errore.message }))
  }, [])

  const accedi = useCallback(async () => {
    setStato({ fase: 'verifica' })
    try {
      setStato(await verifica(await chiediToken()))
    } catch (errore) {
      setStato({ fase: 'ospite', errore: errore instanceof Error ? errore.message : 'Accesso non riuscito.' })
    }
  }, [])

  const esci = useCallback(() => {
    scriviLocale(CHIAVE_UTENTE_DECAP, undefined)
    if (LOCALE) window.location.reload()
    else setStato({ fase: 'ospite' })
  }, [])

  const valore = useMemo<ValoreAccesso>(
    () => ({ stato, utente: stato.fase === 'dentro' ? stato.utente : null, accedi, esci }),
    [stato, accedi, esci],
  )

  return <Contesto.Provider value={valore}>{children}</Contesto.Provider>
}

export function useAccesso() {
  const valore = useContext(Contesto)
  if (!valore) throw new Error('useAccesso va usato dentro ProviderAccesso')
  return valore
}
