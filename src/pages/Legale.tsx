import type { ReactNode } from 'react'
import { PageHero, Section } from '../components/ui'

/**
 * Campo non ancora fornito dal cliente. Evidenziato apposta: in un documento
 * legale un dato mancante deve saltare all'occhio di chi lo revisiona, non
 * confondersi col testo.
 */
function DaCompletare({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-accento-1/15 px-1.5 py-0.5 text-accento-1">[{children}]</mark>
  )
}

function Blocco({ titolo, children }: { titolo: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-sottotitolo text-white">{titolo}</h2>
      <div className="space-y-3 text-corpo text-white/70">{children}</div>
    </section>
  )
}

function Avviso() {
  return (
    <p className="mb-10 rounded-xl border border-accento-1/30 bg-accento-1/[0.06] px-5 py-4 text-corpo text-white/80">
      Bozza da completare con i dati dell'associazione e da verificare con un consulente prima
      della pubblicazione definitiva del sito.
    </p>
  )
}

export function Privacy() {
  return (
    <>
      <PageHero eyebrow="Informazioni legali" title="Privacy" highlight="Policy">
        Come trattiamo i dati personali di chi visita il sito e ci contatta.
      </PageHero>

      <Section alt width="narrow">
        <Avviso />

        <Blocco titolo="Titolare del trattamento">
          <p>
            FantaEsagonale APS, con sede legale in <DaCompletare>indirizzo</DaCompletare>, codice
            fiscale <DaCompletare>codice fiscale</DaCompletare>. Per qualsiasi richiesta sui tuoi
            dati puoi scrivere a <DaCompletare>email dell'associazione</DaCompletare>.
          </p>
        </Blocco>

        <Blocco titolo="Quali dati raccogliamo">
          <p>
            <strong className="font-semibold text-white">Dati che ci fornisci</strong>: quando
            compili il modulo di contatto raccogliamo nome, email, telefono (facoltativo),
            l'argomento scelto e il testo del messaggio.
          </p>
          <p>
            <strong className="font-semibold text-white">Dati di navigazione</strong>: i sistemi
            che fanno funzionare il sito registrano automaticamente alcune informazioni tecniche,
            come l'indirizzo IP e il tipo di browser, necessarie a erogare le pagine e a garantirne
            la sicurezza.
          </p>
        </Blocco>

        <Blocco titolo="Perché li trattiamo">
          <p>
            Usiamo i dati del modulo solo per rispondere alla tua richiesta. La base giuridica è il
            tuo consenso, espresso al momento dell'invio, e la necessità di dare seguito a una
            richiesta che ci hai rivolto. I dati di navigazione servono al funzionamento e alla
            sicurezza del sito.
          </p>
        </Blocco>

        <Blocco titolo="Per quanto tempo">
          <p>
            Conserviamo i dati del modulo per il tempo necessario a gestire la richiesta e comunque
            non oltre <DaCompletare>periodo di conservazione</DaCompletare>.
          </p>
        </Blocco>

        <Blocco titolo="A chi possono essere comunicati">
          <p>
            I dati non vengono venduti né diffusi. Possono essere trattati dai fornitori dei servizi
            tecnici che ci servono per far funzionare il sito, come l'hosting e l'invio delle email,
            nominati responsabili del trattamento: <DaCompletare>elenco dei fornitori</DaCompletare>.
          </p>
        </Blocco>

        <Blocco titolo="I tuoi diritti">
          <p>
            Puoi chiedere in qualsiasi momento di accedere ai tuoi dati, correggerli, cancellarli,
            limitarne il trattamento, opporti o riceverli in un formato portabile (articoli 15-22
            del Regolamento UE 2016/679), e revocare il consenso. Hai inoltre il diritto di proporre
            reclamo al Garante per la protezione dei dati personali.
          </p>
        </Blocco>

        <p className="text-micro text-white/45">
          Ultimo aggiornamento: <DaCompletare>data</DaCompletare>
        </p>
      </Section>
    </>
  )
}

export function Cookie() {
  return (
    <>
      <PageHero eyebrow="Informazioni legali" title="Cookie" highlight="Policy">
        Quali cookie usa questo sito, e quali no.
      </PageHero>

      <Section alt width="narrow">
        <Avviso />

        <Blocco titolo="Nessun cookie di profilazione">
          <p>
            Questo sito non usa cookie di profilazione, né cookie di terze parti a scopo
            pubblicitario o statistico. Per questo non ti chiediamo di accettarne all'ingresso.
          </p>
          <p>
            Anche i caratteri tipografici sono ospitati direttamente sul sito, invece di essere
            caricati da servizi esterni: la tua visita non trasmette dati a terzi per questo motivo.
          </p>
        </Blocco>

        <Blocco titolo="Se in futuro cambiasse">
          <p>
            Se verranno introdotti strumenti di statistica o contenuti di terze parti che usano
            cookie non tecnici, aggiorneremo questa pagina e ti chiederemo il consenso prima di
            attivarli.
          </p>
        </Blocco>

        <p className="text-micro text-white/45">
          Ultimo aggiornamento: <DaCompletare>data</DaCompletare>
        </p>
      </Section>
    </>
  )
}
