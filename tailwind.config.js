/** @type {import('tailwindcss').Config} */
export default {
  // Il pannello /admin ha una configurazione sua (tailwind.pannello.config.js):
  // le sue classi non finiscono nel CSS scaricato da chi visita il sito.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '!./src/admin/**'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0d0d0d',
          soft: '#161616',
          card: '#1c1c1c',
        },
        /**
         * Accenti tematici. Il questionario (6.2) chiede un sistema comune con
         * variazioni cromatiche controllate per ramo: giallo e rosso per il
         * brand centrale, nero e oro per il Fantacalcio 2026-2027, bianco e
         * nero per FantaMaritati. I valori vivono in variabili CSS impostate
         * dal tema della pagina, quindi gli stessi componenti si ricolorano
         * da soli senza doverne duplicare nessuno.
         */
        accento: {
          1: 'rgb(var(--accento-1) / <alpha-value>)',
          2: 'rgb(var(--accento-2) / <alpha-value>)',
        },
      },

      fontFamily: {
        // Due caratteri soli, uno per i titoli e uno per il testo. Il
        // questionario (6.4) chiede di evitare un registro classico o elegante:
        // il corsivo con grazie usato all'inizio andava proprio in quella
        // direzione. Archivo e' un grottesco da quotidiano, con un disegno
        // riconoscibile che i caratteri predefiniti del web non hanno.
        sans: ['"Archivo Variable"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        display: ['"Bricolage Grotesque Variable"', '"Archivo Variable"', 'system-ui', 'sans-serif'],
      },

      /**
       * Scala tipografica per ruoli: chi scrive il markup sceglie "titolo" o
       * "occhiello" e peso, interlinea e spaziatura arrivano insieme, sempre
       * uguali. Le dimensioni sono fluide con clamp(), cosi' non servono
       * varianti sm: md: lg: ripetute a ogni riga.
       */
      fontSize: {
        occhiello: ['0.75rem', { lineHeight: '1.1', letterSpacing: '0.15em', fontWeight: '700' }],
        meta: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.04em', fontWeight: '600' }],
        micro: ['0.8125rem', { lineHeight: '1.6', fontWeight: '400' }],
        corpo: ['clamp(0.9rem, 0.86rem + 0.2vw, 1rem)', { lineHeight: '1.65', fontWeight: '400' }],
        guida: ['clamp(1rem, 0.94rem + 0.35vw, 1.15rem)', { lineHeight: '1.6', fontWeight: '400' }],
        etichetta: ['0.875rem', { lineHeight: '1.4', fontWeight: '600' }],
        sottotitolo: [
          'clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)',
          { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' },
        ],
        // Livello intermedio fra il titolo di sezione e il sottotitolo: prima
        // ogni h2 del sito aveva esattamente la stessa dimensione.
        sezione: [
          'clamp(1.35rem, 1.15rem + 0.9vw, 1.85rem)',
          { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        titolo: [
          'clamp(1.6rem, 1.2rem + 1.7vw, 2.75rem)',
          { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '700' },
        ],
        display: [
          'clamp(2.25rem, 1.4rem + 3.8vw, 4.75rem)',
          { lineHeight: '0.98', letterSpacing: '-0.035em', fontWeight: '800' },
        ],
        cifra: [
          'clamp(1.6rem, 1.3rem + 1.4vw, 2.4rem)',
          { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '800' },
        ],
      },

      screens: {
        xs: '400px',
      },
    },
  },
  plugins: [],
}
