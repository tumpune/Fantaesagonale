/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Giallo e rosso campionati dal logo ufficiale (img/logo.png).
        brand: {
          black: '#0d0d0d',
          soft: '#161616',
          card: '#1c1c1c',
          yellow: '#fcd70c',
          red: '#e61a1a',
          redDark: '#c41414',
        },
      },

      /**
       * Scala tipografica per ruoli.
       *
       * Prima ogni componente sceglieva per conto suo dimensione, peso e
       * spaziatura: undici misure diverse, cinque pesi e cinque spaziature,
       * alcune scritte a mano nello stile inline. Il risultato sembrava usare
       * font diversi ovunque, pur essendocene solo due.
       *
       * Qui ogni voce e' un ruolo, non una misura: chi scrive il markup sceglie
       * "titolo" o "occhiello", e peso, interlinea e spaziatura arrivano
       * insieme, sempre uguali.
       *
       * Le dimensioni sono fluide con clamp(): crescono con la finestra senza
       * bisogno di ripetere varianti sm: md: lg: a ogni riga, che erano l'altra
       * fonte di incoerenza fra una pagina e l'altra.
       */
      fontSize: {
        occhiello: ['0.75rem', { lineHeight: '1.1', letterSpacing: '0.15em', fontWeight: '800' }],
        meta: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.04em', fontWeight: '600' }],
        micro: ['0.8125rem', { lineHeight: '1.6', fontWeight: '400' }],
        corpo: ['clamp(0.9rem, 0.86rem + 0.2vw, 1rem)', { lineHeight: '1.65', fontWeight: '400' }],
        guida: [
          'clamp(1rem, 0.94rem + 0.35vw, 1.15rem)',
          { lineHeight: '1.6', fontWeight: '400' },
        ],
        etichetta: ['0.875rem', { lineHeight: '1.4', fontWeight: '600' }],
        sottotitolo: [
          'clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)',
          { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '800' },
        ],
        titolo: [
          'clamp(1.5rem, 1.15rem + 1.5vw, 2.5rem)',
          { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' },
        ],
        display: [
          'clamp(2rem, 1.3rem + 3.2vw, 4rem)',
          { lineHeight: '0.98', letterSpacing: '-0.035em', fontWeight: '800' },
        ],
        cifra: [
          'clamp(1.6rem, 1.3rem + 1.4vw, 2.4rem)',
          { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '800' },
        ],
      },

      screens: {
        // Molti Android stanno sotto i 375px: senza questo breakpoint l'unica
        // alternativa e' dimensionare tutto sul caso peggiore.
        xs: '400px',
      },
    },
  },
  plugins: [],
}
