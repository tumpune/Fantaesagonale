import base from './tailwind.config.js'

/** Stessi colori, caratteri e scala del sito, applicati alle pagine del pannello. */
export default {
  ...base,
  content: ['./admin/index.html', './src/admin/**/*.{ts,tsx}'],
}
