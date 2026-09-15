import { collaboratore, emailConfigurata, json, redis, redisConfigurato } from './_lib/servizi.js'

/**
 * Quali servizi sono configurati su Vercel e l'ultima esecuzione di ogni
 * automazione. Restituisce solo si'/no: i valori delle chiavi non escono mai.
 */
export async function GET(request: Request): Promise<Response> {
  const utente = await collaboratore(request)
  if (!utente) return json({ errore: 'accesso-negato' }, 401)

  const ultime: Record<string, unknown> = {}
  if (redisConfigurato()) {
    const [coppie] = await redis([['HGETALL', 'automazioni:ultime']]).catch(() => [[]])
    const lista = Array.isArray(coppie) ? coppie : []
    for (let i = 0; i < lista.length; i += 2) {
      try {
        ultime[String(lista[i])] = JSON.parse(String(lista[i + 1]))
      } catch {
        /* voce illeggibile: la si ignora */
      }
    }
  }

  return json({
    utente,
    servizi: {
      accesso: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
      statistiche: redisConfigurato(),
      email: emailConfigurata(),
      dominioEmail: Boolean(process.env.EMAIL_MITTENTE),
      pianificazione: Boolean(process.env.CRON_SECRET),
    },
    ultime,
  })
}
