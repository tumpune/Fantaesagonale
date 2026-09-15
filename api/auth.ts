/**
 * Primo passo del login al pannello /admin: manda l'utente su GitHub.
 *
 * Il valore `state` casuale resta in un cookie HttpOnly e viene confrontato al
 * ritorno in /api/callback: una risposta che non parte da qui viene rifiutata.
 */
export function GET(request: Request): Response {
  const clientId = process.env.GITHUB_CLIENT_ID
  if (!clientId) {
    return new Response('Login non configurato: manca GITHUB_CLIENT_ID su Vercel.', { status: 500 })
  }

  const origine = new URL(request.url).origin
  const state = crypto.randomUUID()

  const github = new URL('https://github.com/login/oauth/authorize')
  github.searchParams.set('client_id', clientId)
  github.searchParams.set('redirect_uri', `${origine}/api/callback`)
  github.searchParams.set('scope', process.env.GITHUB_SCOPE || 'repo')
  github.searchParams.set('state', state)

  return new Response(null, {
    status: 302,
    headers: {
      Location: github.toString(),
      'Set-Cookie': `pannello_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
  })
}
