import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/archivo'
import '@fontsource-variable/bricolage-grotesque'
import './admin.css'
import App from './App'
import { ProviderAccesso } from './lib/accesso'

/**
 * Il pannello usa indirizzi con "#" (es. /admin/#/statistiche): tutto resta
 * nella pagina /admin, senza regole aggiuntive sul server.
 */
ReactDOM.createRoot(document.getElementById('pannello')!).render(
  <React.StrictMode>
    <HashRouter>
      <ProviderAccesso>
        <App />
      </ProviderAccesso>
    </HashRouter>
  </React.StrictMode>,
)
