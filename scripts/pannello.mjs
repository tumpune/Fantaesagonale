/**
 * `npm run pannello`: avvia il sito e il pannello /admin in locale.
 *
 * decap-server scrive direttamente nei file del progetto e non chiede login,
 * quindi resta in ascolto solo su questo computer (127.0.0.1): dalla rete
 * locale nessuno puo' usarlo per modificare i file.
 */
import { spawn } from 'node:child_process'

const avvia = (comando, argomenti, env = {}) =>
  spawn(comando, argomenti, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...env },
  })

const processi = [
  avvia('npx', ['decap-server'], { BIND_HOST: '127.0.0.1', PORT: '8081' }),
  avvia('npx', ['vite']),
]

console.log('\n  Sito:    http://localhost:5173/\n  Pannello: http://localhost:5173/admin/\n')

const chiudi = () => processi.forEach((p) => p.kill())
process.on('SIGINT', chiudi)
process.on('SIGTERM', chiudi)
processi.forEach((p) => p.on('exit', chiudi))
