// Odbiór kodu z GitHuba, wymiana na token i przekazanie do panelu CMS.
export async function onRequestGet({ request, env }) {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	if (!code) return new Response('Brak kodu autoryzacji', { status: 400 });

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

	const payload = data.access_token
		? { token: data.access_token, provider: 'github' }
		: { error: data.error_description || 'Nie udało się zalogować' };
	const status = data.access_token ? 'success' : 'error';

	const html = `<!doctype html><html><body><script>
		(function () {
			function send() {
				window.opener && window.opener.postMessage(
					'authorization:github:${status}:' + JSON.stringify(${JSON.stringify(payload)}),
					'${url.origin}'
				);
			}
			window.addEventListener('message', send, { once: true });
			send();
			setTimeout(function () { window.close(); }, 800);
		})();
	</script><p>Logowanie zakończone. Możesz zamknąć to okno.</p></body></html>`;

	return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
