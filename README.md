# FantaEsagonale APS — sito e pannello di gestione

Sito dell'associazione (React + TypeScript + Vite + Tailwind) con un pannello di
gestione dei contenuti su `/admin`, statistiche anonime e alcune automazioni.

## Indirizzi

| Dove | Cosa |
| --- | --- |
| `/` | il sito pubblico |
| `/admin` | il pannello di gestione (accesso con GitHub) |
| `/admin/editor` | l'editor dei contenuti (Decap CMS), usato dentro il pannello |

## Lavorare in locale

```bash
npm install
npm run pannello   # sito su http://localhost:5173 e pannello su /admin, senza accesso
npm run dev        # solo il sito
npm run build      # controlli dei tipi + compilazione in dist/
```

`npm run pannello` avvia anche `decap-server`, che salva le modifiche fatte dal
pannello direttamente nei file del progetto. Ascolta solo su `127.0.0.1`: dalla
rete locale nessun altro puo' usarlo.

## Dove stanno i contenuti

Tutti i testi modificabili sono in `src/content/dati/`:

| File | Contenuto |
| --- | --- |
| `associazione.json` | slogan, testi della home e del pie' di pagina, storia, principi, FAQ generali |
| `contatti.json` | email, telefono, indirizzo e profili social |
| `legale.json` | dati che compaiono nella Privacy Policy |
| `evidenza.json` | iniziative in home, con le date di inizio e fine |
| `automazioni.json` | impostazioni delle automazioni |
| `rami/*.json` | una pagina per progetto |
| `testimonianze/*.json` | una scheda per testimonianza |

I moduli in `src/content/*.ts` leggono questi file e li mettono a disposizione
delle pagine: aggiungere un campo significa toccare il file JSON, il modulo che
lo legge e `public/admin/editor/config.yml`, che descrive il modulo di modifica.

## Funzioni sul server (`api/`)

Sono funzioni Vercel con firma standard del web (`export function GET/POST`).
Ogni servizio e' facoltativo: senza le sue variabili d'ambiente la funzione
risponde "non configurato" e il pannello mostra l'automazione come da
configurare.

| Funzione | A cosa serve |
| --- | --- |
| `auth.ts`, `callback.ts` | accesso al pannello con GitHub |
| `visita.ts` | conteggio anonimo delle visite, senza cookie |
| `statistiche.ts` | statistiche per il pannello, solo per i collaboratori |
| `contatto.ts` | invio del modulo contatti via email |
| `automazioni.ts` | promemoria delle scadenze e riepilogo settimanale |
| `stato.ts` | quali servizi sono configurati |

### Variabili d'ambiente su Vercel

| Variabile | Serve a |
| --- | --- |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | accesso al pannello |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | archivio delle statistiche (Upstash Redis) |
| `RESEND_API_KEY`, `EMAIL_STAFF` | invio delle email |
| `EMAIL_MITTENTE` | mittente con dominio proprio (facoltativo) |
| `CRON_SECRET` | protegge le automazioni pianificate |

## Chi puo' modificare il sito

Chi ha accesso in scrittura al repository su GitHub. Si aggiunge o si toglie una
persona dai collaboratori: non ci sono password del sito da consegnare.

## Scelte da non perdere di vista

- Nessun cookie e nessun servizio di terze parti sulle pagine pubbliche: i
  caratteri sono ospitati nel sito e le visite si contano in forma aggregata.
- I contenuti non ancora disponibili non vengono inventati: compaiono come
  "Presto disponibile" o vengono nascosti.
- Le testimonianze si pubblicano solo con il consenso di chi le ha scritte.
