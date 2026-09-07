import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Il sito vive sotto https://tumpune.github.io/Fantaesagonale/, quindi serve il
// base path, che deve corrispondere al nome del repository maiuscole comprese:
// i percorsi di GitHub Pages sono case-sensitive. È applicato anche in dev e
// preview, così l'ambiente locale si comporta come la produzione (con un base
// condizionale un asset rotto in sottocartella si vedrebbe solo una volta
// online). Da cambiare se il repository viene rinominato o si usa un dominio.
export default defineConfig({
  plugins: [react()],
  base: '/Fantaesagonale/',
  server: {
    port: 5173,
  },
})
