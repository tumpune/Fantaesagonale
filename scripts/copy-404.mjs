// GitHub Pages non conosce le route del client router: per una richiesta
// diretta a /chi-siamo servirebbe un file che non esiste. Servendo lo stesso
// index.html come 404.html, l'app si avvia e React Router risolve il percorso.
import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
