/**
 * Ritorno da GitHub: scambia il codice con il token e lo consegna al pannello.
 *
 * La consegna segue il protocollo di Decap CMS: la finestra di login annuncia
 * "authorizing:github", il pannello risponde, e solo allora il token viene
 * inviato, e solo alla pagina dello stesso indirizzo del sito. Nessun'altra
 * pagina che avesse aperto questa finestra puo' riceverlo.
 */

const cookie = (request: Request, nome: string) =>
  request.headers
    .get('cookie')
    ?.split(';')
    .map((parte) => parte.trim().split('='))
    .find(([chiave]) => chiave === nome)?.[1]

function pagina(origine: string, esito: 'success' | 'error', contenuto: object): Response {
  // JSON dentro uno <script>: "<" va neutralizzato perche' non chiuda il tag.
  const messaggio = JSON.stringify(`authorization:github:${esito}:${JSON.stringify(contenuto)}`).replace(
    /</g,
    '\\u003c',
  )
  const html = `<!doctype html>
<meta charset="utf-8">
<title>Accesso al pannello</title>
<p>${esito === 'success' ? 'Accesso eseguito, puoi chiudere questa finestra.' : 'Accesso non riuscito.'}</p>
<script>
  (function () {
    var origine = ${JSON.stringify(origine)};
    function rispondi(evento) {
      if (evento.origin !== origine) return;
      window.removeEventListener('message', rispondi);
      window.opener.postMessage(${messaggio}, origine);
    }
    if (!window.opener) return;
    window.addEventListener('message', rispondi);
    window.opener.postMessage('authorizing:github', origine);
  })();
</script>`

  return new Response(html, {
    status: esito === 'success' ? 200 : 401,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': 'pannello_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
      'Referrer-Policy': 'no-referrer',
    },
  })
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const origine = url.origin
  const codice = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  if (!codice || !state || state !== cookie(request, 'pannello_state')) {
    return pagina(origine, 'error', { message: 'Richiesta di accesso non valida o scaduta. Riprova.' })
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return pagina(origine, 'error', { message: 'Login non configurato su Vercel.' })
  }

  const risposta = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: codice,
      redirect_uri: `${origine}/api/callback`,
    }),
  })
  const dati = (await risposta.json().catch(() => ({}))) as { access_token?: string; error_description?: string }

  if (!dati.access_token) {
    return pagina(origine, 'error', { message: dati.error_description || 'GitHub non ha concesso l\'accesso.' })
  }

  return pagina(origine, 'success', { token: dati.access_token, provider: 'github' })
}
