// I file in public/ non passano dal bundler: sotto GitHub Pages il sito vive in
// una sottocartella, quindi il percorso assoluto va prefissato con il base path.
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const CAMPAIGN_START = new Date(2026, 2, 31)
export const CAMPAIGN_END = new Date(2030, 6, 21)
/** Giorni fra le due date, estremi compresi: cosi' il totale non puo' sfasarsi. */
export const CAMPAIGN_TOTAL_DAYS =
  Math.round((CAMPAIGN_END.getTime() - CAMPAIGN_START.getTime()) / 86_400_000) + 1
