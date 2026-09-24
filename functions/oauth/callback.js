// Odbiór kodu z GitHuba, wymiana na token i przekazanie go do panelu CMS.
export async function onRequestGet({ request, env }) {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	if (!code) return html(`<p>Brak kodu autoryzacji.</p>`);

	let payload;
	let status = 'error';
	try {
		const res = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify({
				client_id: env.GITHUB_CLIENT_ID,
				client_secret: env.GITHUB_CLIENT_SECRET,
				code,
			}),
		});
		const data = await res.json();
		if (data.access_token) {
			status = 'success';
			payload = { token: data.access_token, provider: 'github' };
		} else {
			payload = { message: data.error_description || 'Brak tokenu w odpowiedzi GitHuba' };
		}
	} catch (e) {
		payload = { message: String(e) };
	}

	// Kolejność zgodna z protokołem Netlify/Decap/Sveltia:
	// 1) okno mówi "authorizing:github", 2) po odpowiedzi rodzica wysyła token.
	const script = `
		(function () {
			var payload = ${JSON.stringify(JSON.stringify(payload))};
			var msg = 'authorization:github:${status}:' + payload;
			function receive(e) {
				if (!e.data || typeof e.data !== 'string') return;
				window.opener.postMessage(msg, e.origin);
				window.removeEventListener('message', receive, false);
				setTimeout(function () { window.close(); }, 500);
			}
			window.addEventListener('message', receive, false);
			window.opener && window.opener.postMessage('authorizing:github', '*');
		})();
	`;
	return html(`<p>Logowanie w toku…</p><script>${script}<\/script>`);
}

function html(body) {
	return new Response(
		`<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>SVC</title></head><body>${body}</body></html>`,
		{ headers: { 'Content-Type': 'text/html; charset=utf-8' } }
	);
}
