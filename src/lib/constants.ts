// I file in public/ non passano dal bundler: sotto GitHub Pages il sito vive in
// una sottocartella, quindi il percorso assoluto va prefissato con il base path.
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const CAMPAIGN_START = new Date(2026, 2, 31)
export const CAMPAIGN_END = new Date(2030, 6, 21)
export const CAMPAIGN_TOTAL_DAYS = 1572
