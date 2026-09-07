export const SPOTLIGHT_R = 260

// I file in public/ non passano dal bundler: sotto GitHub Pages il sito vive in
// una sottocartella, quindi il percorso assoluto va prefissato con il base path.
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

// Stessa foto del team su entrambi i layer: la base è desaturata e scurita,
// il layer rivelato è a colori pieni, così lo spotlight "accende" il gruppo.
export const HERO_PHOTO = `url('${asset('img/team.jpg')}')`

export const BG_IMAGE_1 = HERO_PHOTO
export const BG_IMAGE_2 = HERO_PHOTO

export const HERO_BASE_FILTER = 'grayscale(1) brightness(0.38) contrast(1.05)'
export const HERO_REVEAL_FILTER = 'saturate(1.18) brightness(1.04)'

// Senza cursore lo spotlight non si attiva mai: su touch la foto va mostrata
// gia' a colori, altrimenti resterebbe in bianco e nero per sempre.
export const HERO_TOUCH_FILTER = 'saturate(1.1) brightness(0.62)'

export const CAMPAIGN_START = new Date(2026, 2, 31)
export const CAMPAIGN_END = new Date(2030, 6, 21)
export const CAMPAIGN_TOTAL_DAYS = 1572
