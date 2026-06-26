/**
 * Cloudflare Pages Function — GitHub OAuth callback for Sveltia/Decap CMS.
 * Route: GET /callback
 *
 * Verifies the CSRF state, exchanges the code for an access token, and returns a
 * tiny HTML page that hands the token back to the CMS window via the standard
 * Decap/Sveltia postMessage handshake.
 */
const TOKEN_URL = 'https://github.com/login/oauth/access_token';

function resultPage(status, payload) {
  // status: 'success' | 'error'
  const data = JSON.stringify(payload);
  return `<!doctype html>
<html><head><meta charset="utf-8" /><title>Authorizing…</title></head>
<body>
<p>Authorizing… you can close this window.</p>
<script>
  (function () {
    var status = ${JSON.stringify(status)};
    var data = ${data};
    function send(origin) {
      window.opener &&
        window.opener.postMessage('authorization:github:' + status + ':' + JSON.stringify(data), origin);
    }
    // Decap/Sveltia handshake: announce, wait for the opener, then send the result.
    window.addEventListener('message', function (e) {
      send(e.origin);
      window.close();
    }, { once: true });
    if (window.opener) {
      window.opener.postMessage('authorizing:github', '*');
    } else {
      document.body.innerHTML = '<p>No opener window. Open the CMS from /admin.</p>';
    }
  })();
</script>
</body></html>`;
}

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  // verify CSRF state against the cookie set in /auth
  const cookie = request.headers.get('Cookie') || '';
  const saved = /(?:^|;\s*)sv_oauth_state=([^;]+)/.exec(cookie)?.[1];

  if (!code || !state || !saved || state !== saved) {
    return html(resultPage('error', { message: 'Invalid OAuth state or missing code.' }), 400);
  }
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return html(resultPage('error', { message: 'OAuth not configured on the server.' }), 500);
  }

  let token;
  try {
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const json = await res.json();
    if (json.error || !json.access_token) {
      return html(resultPage('error', { message: json.error_description || 'Token exchange failed.' }), 401);
    }
    token = json.access_token;
  } catch (e) {
    return html(resultPage('error', { message: 'Token request error.' }), 502);
  }

  return new Response(resultPage('success', { token, provider: 'github' }), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // clear the state cookie
      'Set-Cookie': 'sv_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}
