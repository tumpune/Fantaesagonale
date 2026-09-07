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
      screens: {
        // Molti Android stanno sotto i 375px: senza questo breakpoint l'unica
        // alternativa e' dimensionare tutto sul caso peggiore.
        xs: '400px',
      },
    },
  },
  plugins: [],
}
