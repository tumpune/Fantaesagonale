import dati from './dati/legale.json'

/**
 * Dati dell'associazione che compaiono nelle pagine Privacy e Cookie.
 *
 * Finche' un campo resta vuoto la pagina lo mostra evidenziato come "da
 * completare": in un documento legale un dato mancante deve saltare all'occhio
 * di chi lo revisiona, non passare inosservato.
 */
export const LEGALE = {
  sedeLegale: dati.sedeLegale.trim(),
  codiceFiscale: dati.codiceFiscale.trim(),
  email: dati.email.trim(),
  conservazione: dati.conservazione.trim(),
  fornitori: dati.fornitori.trim(),
  ultimoAggiornamento: dati.ultimoAggiornamento.trim(),
}

export const CAMPI_LEGALI_MANCANTI = Object.entries(LEGALE)
  .filter(([, valore]) => !valore)
  .map(([campo]) => campo)

const NOMI: Record<string, string> = {
  sedeLegale: 'sede legale',
  codiceFiscale: 'codice fiscale',
  email: 'email per la privacy',
  conservazione: 'tempo di conservazione',
  fornitori: 'fornitori',
  ultimoAggiornamento: 'data di aggiornamento',
}

export const nomeCampoLegale = (campo: string) => NOMI[campo] ?? campo
