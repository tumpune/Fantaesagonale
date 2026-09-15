import { useEffect, useState } from 'react'
import { GitCommitHorizontal, PenLine } from 'lucide-react'
import { useAccesso } from '../lib/accesso'
import { tempoFa } from '../lib/formato'
import { statoPubblicazione, ultimeModifiche, useCaricamento, type StatoPubblicazione } from '../lib/servizi'
import { Avatar, Pillola, Scheletro, Vuoto, anello, type Tono } from './ui'

const PUBBLICAZIONE: Record<StatoPubblicazione, { tono: Tono; testo: string }> = {
  pubblicato: { tono: 'ok', testo: 'Online' },
  'in-corso': { tono: 'attenzione', testo: 'In pubblicazione' },
  errore: { tono: 'critico', testo: 'Pubblicazione non riuscita' },
  sconosciuto: { tono: 'neutro', testo: 'Stato sconosciuto' },
}

/** Pulisce il messaggio automatico di Decap: "Pannello: aggiorna rami "eventi"". */
const leggibile = (messaggio: string) =>
  messaggio
    .replace(/^Pannello:\s*/, '')
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/"([^"]+)"/g, '«$1»')

/**
 * Ultime modifiche al sito, con lo stato della pubblicazione di quella piu'
 * recente: dopo un salvataggio si vede quando la modifica e' davvero online.
 */
export default function Modifiche({ quante = 6 }: { quante?: number }) {
  const { utente } = useAccesso()
  const [giro, setGiro] = useState(0)
  const { dati, errore, caricamento } = useCaricamento(() => ultimeModifiche(utente?.token, quante), [utente?.token, quante, giro])
  const [stati, setStati] = useState<Record<string, StatoPubblicazione>>({})

  useEffect(() => {
    if (!dati?.length) return
    let annullato = false
    Promise.all(dati.slice(0, 3).map(async (m) => [m.sha, await statoPubblicazione(m.sha, utente?.token).catch(() => 'sconosciuto' as const)] as const)).then(
      (coppie) => !annullato && setStati(Object.fromEntries(coppie)),
    )
    return () => {
      annullato = true
    }
  }, [dati, utente?.token])

  // Mentre una pubblicazione e' in corso si ricontrolla ogni 20 secondi.
  useEffect(() => {
    if (!Object.values(stati).includes('in-corso')) return
    const attesa = window.setTimeout(() => setGiro((g) => g + 1), 20_000)
    return () => window.clearTimeout(attesa)
  }, [stati])

  if (caricamento && !dati)
    return (
      <ul className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <li key={i} className="flex items-center gap-3">
            <Scheletro className="h-8 w-8 !rounded-full" />
            <div className="flex-1 space-y-2">
              <Scheletro className="h-3.5 w-3/4" />
              <Scheletro className="h-3 w-1/3" />
            </div>
          </li>
        ))}
      </ul>
    )

  if (errore || !dati) return <Vuoto Icon={GitCommitHorizontal} titolo="Modifiche non disponibili" testo={errore} />

  return (
    <ol className="relative space-y-1">
      {dati.map((m) => {
        const pubblicazione = stati[m.sha]
        return (
          <li key={m.sha}>
            <a
              href={m.url}
              target="_blank"
              rel="noreferrer"
              className={`group -mx-2 flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.03] ${anello}`}
            >
              <Avatar nome={m.autore} immagine={m.avatar} />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-micro text-white/85">
                  {m.dalPannello && <PenLine size={13} className="shrink-0 text-accento-1" aria-label="Dal pannello" />}
                  <span className="truncate">{leggibile(m.messaggio)}</span>
                </p>
                <p className="mt-0.5 text-meta font-normal text-white/40">
                  {m.autore} · {tempoFa(m.data)}
                </p>
              </div>
              {pubblicazione && pubblicazione !== 'sconosciuto' && (
                <Pillola tono={PUBBLICAZIONE[pubblicazione].tono} punto pulsa={pubblicazione === 'in-corso'}>
                  {PUBBLICAZIONE[pubblicazione].testo}
                </Pillola>
              )}
            </a>
          </li>
        )
      })}
    </ol>
  )
}
