/**
 * Cloudflare Pages Function — GitHub OAuth start for Sveltia/Decap CMS.
 * Route: GET /auth
 *
 * Lives in the SAME Cloudflare Pages project as the site, so there is no separate
 * `sveltia-cms-auth` Worker and no `auth.` subdomain. Set two env vars in the
 * Cloudflare dashboard (Settings → Environment variables):
 *   GITHUB_CLIENT_ID      — from your GitHub OAuth App
 *   GITHUB_CLIENT_SECRET  — from your GitHub OAuth App
 *
 * The GitHub OAuth App's "Authorization callback URL" must be:  https://<domain>/callback
 */
const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider') || 'github';

  if (provider !== 'github') {
    return new Response('Unsupported OAuth provider.', { status: 400 });
  }
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response(
      'OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in the Cloudflare project.',
      { status: 500 },
    );
  }

  // CSRF state, echoed back by GitHub and verified in /callback via cookie.
  const state = crypto.randomUUID();
  const authUrl = new URL(GITHUB_AUTHORIZE);
  authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
  authUrl.searchParams.set('scope', url.searchParams.get('scope') || 'repo,user');
  authUrl.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString(),
      'Set-Cookie': `sv_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
