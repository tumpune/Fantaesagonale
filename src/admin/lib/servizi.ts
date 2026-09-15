import { useCallback, useEffect, useState } from 'react'
import { LOCALE, REPO } from './ambiente'
import { useAccesso } from './accesso'

/* --------------------------------------------------------------- /api */

export type EsitoApi<T> =
  | { stato: 'caricamento' }
  | { stato: 'ok'; dati: T }
  | { stato: 'locale' }
  | { stato: 'non-configurato' }
  | { stato: 'errore'; messaggio: string }

/**
 * Chiama una funzione riservata di /api con il token dell'utente.
 * In locale le funzioni non esistono: si restituisce subito "locale".
 */
export function useApi<T>(percorso: string | null) {
  const { utente } = useAccesso()
  const [esito, setEsito] = useState<EsitoApi<T>>({ stato: LOCALE ? 'locale' : 'caricamento' })
  const [giro, setGiro] = useState(0)

  useEffect(() => {
    if (LOCALE || !percorso) return
    let annullato = false
    setEsito({ stato: 'caricamento' })
    fetch(percorso, { headers: { Authorization: `Bearer ${utente?.token ?? ''}` } })
      .then(async (risposta) => {
        const dati = (await risposta.json().catch(() => ({}))) as T & { errore?: string }
        if (annullato) return
        if (risposta.ok) setEsito({ stato: 'ok', dati })
        else if (dati.errore === 'non-configurato') setEsito({ stato: 'non-configurato' })
        else setEsito({ stato: 'errore', messaggio: dati.errore ?? `Errore ${risposta.status}` })
      })
      .catch(() => !annullato && setEsito({ stato: 'errore', messaggio: 'Servizio non raggiungibile' }))
    return () => {
      annullato = true
    }
  }, [percorso, utente?.token, giro])

  return { esito, ricarica: useCallback(() => setGiro((g) => g + 1), []) }
}

export async function inviaApi<T>(percorso: string, token: string | undefined, corpo: unknown): Promise<T> {
  const risposta = await fetch(percorso, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token ?? ''}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  })
  const dati = (await risposta.json().catch(() => ({}))) as T & { errore?: string }
  if (!risposta.ok) throw new Error(dati.errore ?? `Errore ${risposta.status}`)
  return dati
}

/* ------------------------------------------------------------- GitHub */

export type Modifica = {
  sha: string
  messaggio: string
  autore: string
  avatar?: string
  data: string
  url: string
  dalPannello: boolean
}

export type StatoPubblicazione = 'pubblicato' | 'in-corso' | 'errore' | 'sconosciuto'

type RispostaCommit = {
  sha: string
  html_url: string
  commit: { message: string; author: { name: string; date: string } }
  author?: { login: string; avatar_url: string } | null
}

const cache = new Map<string, { scade: number; dati: unknown }>()

/**
 * Richiesta all'API di GitHub con una piccola cache: senza login (in locale)
 * il limite e' di 60 richieste all'ora, e il pannello non deve esaurirlo.
 */
async function github<T>(percorso: string, token?: string): Promise<T> {
  const chiave = `${percorso}|${token ? 'autenticato' : 'anonimo'}`
  const salvato = cache.get(chiave)
  if (salvato && salvato.scade > Date.now()) return salvato.dati as T

  const risposta = await fetch(`https://api.github.com/repos/${REPO}${percorso}`, {
    headers: { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  })
  if (!risposta.ok) throw new Error(risposta.status === 403 ? 'Limite di richieste a GitHub raggiunto' : `GitHub ${risposta.status}`)
  const dati = (await risposta.json()) as T
  cache.set(chiave, { scade: Date.now() + 60_000, dati })
  return dati
}

export async function ultimeModifiche(token?: string, quante = 8): Promise<Modifica[]> {
  const commit = await github<RispostaCommit[]>(`/commits?per_page=${quante}`, token)
  return commit.map((c) => {
    const messaggio = c.commit.message.split('\n')[0]
    return {
      sha: c.sha,
      messaggio,
      autore: c.author?.login ?? c.commit.author.name,
      avatar: c.author?.avatar_url,
      data: c.commit.author.date,
      url: c.html_url,
      dalPannello: messaggio.startsWith('Pannello:'),
    }
  })
}

/** Stato della pubblicazione su Vercel, che lo registra sul commit. */
export async function statoPubblicazione(sha: string, token?: string): Promise<StatoPubblicazione> {
  const stato = await github<{ state: string; total_count: number }>(`/commits/${sha}/status`, token)
  if (!stato.total_count) return 'sconosciuto'
  if (stato.state === 'success') return 'pubblicato'
  if (stato.state === 'pending') return 'in-corso'
  return 'errore'
}

/** Carica un dato asincrono con stato di caricamento ed errore. */
export function useCaricamento<T>(carica: () => Promise<T>, dipendenze: unknown[]) {
  const [stato, setStato] = useState<{ dati?: T; errore?: string; caricamento: boolean }>({ caricamento: true })
  useEffect(() => {
    let annullato = false
    setStato((s) => ({ ...s, caricamento: true }))
    carica()
      .then((dati) => !annullato && setStato({ dati, caricamento: false }))
      .catch((e: Error) => !annullato && setStato({ errore: e.message, caricamento: false }))
    return () => {
      annullato = true
    }
  }, dipendenze)
  return stato
}
