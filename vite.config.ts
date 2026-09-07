import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Il sito vive sotto https://<utente>.github.io/fantaesagonale/, quindi serve
// il base path. È applicato anche in dev e preview, così l'ambiente locale si
// comporta come la produzione (con base condizionale un asset rotto sotto
// sottocartella non si vedrebbe finché non è online).
// Da cambiare se il repository viene rinominato o si usa un dominio custom.
export default defineConfig({
  plugins: [react()],
  base: '/fantaesagonale/',
  server: {
    port: 5173,
  },
})
