const numeri = new Intl.NumberFormat('it-IT')

export const numero = (valore: number) => numeri.format(Math.round(valore))

export const decimale = (valore: number, cifre = 1) =>
  new Intl.NumberFormat('it-IT', { minimumFractionDigits: cifre, maximumFractionDigits: cifre }).format(valore)

export const percentuale = (valore: number) =>
  new Intl.NumberFormat('it-IT', { style: 'percent', maximumFractionDigits: 1 }).format(valore)

/** Variazione rispetto al periodo precedente; null se non confrontabile. */
export function variazione(attuale: number, precedente: number): number | null {
  if (!precedente) return attuale ? null : 0
  return (attuale - precedente) / precedente
}

const dataBreve = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' })
const dataBreveAnno = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
const dataLunga = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })

/** Le date "YYYY-MM-DD" sono giorni di calendario: si leggono a mezzogiorno per non slittare. */
const daIso = (iso: string) => new Date(`${iso}T12:00:00`)

/** L'anno compare solo se diverso da quello in corso: "1 mag 2027", ma "21 set". */
export const giornoBreve = (iso: string) =>
  (daIso(iso).getFullYear() === new Date().getFullYear() ? dataBreve : dataBreveAnno).format(daIso(iso))
export const giornoLungo = (iso: string) => dataLunga.format(daIso(iso))

const relativo = new Intl.RelativeTimeFormat('it-IT', { numeric: 'auto' })

export function tempoFa(data: string | Date): string {
  const secondi = (new Date(data).getTime() - Date.now()) / 1000
  const unita: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [nome, durata] of unita) if (Math.abs(secondi) >= durata) return relativo.format(Math.round(secondi / durata), nome)
  return 'adesso'
}

export function saluto(ora = new Date().getHours()) {
  if (ora < 6) return 'Buonanotte'
  if (ora < 13) return 'Buongiorno'
  if (ora < 18) return 'Buon pomeriggio'
  return 'Buonasera'
}
