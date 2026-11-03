// „Markdown for Agents”: gdy agent AI prosi o Markdown (nagłówek Accept: text/markdown),
// zamiast HTML dostaje czysty tekst strony (plik index.md tworzony przy budowaniu).
// Przeglądarki dostają zwykły HTML — dla nich nic się nie zmienia.
export async function onRequest({ request, next, env }) {
	const accept = request.headers.get('Accept') || '';
	if (request.method !== 'GET' || !/text\/markdown/i.test(accept)) return next();
	const url = new URL(request.url);
	if (!url.pathname.endsWith('/') || url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return next();
	const md = await env.ASSETS.fetch(new URL(url.pathname + 'index.md', url.origin));
	if (!md.ok) return next();
	return new Response(md.body, {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Vary': 'Accept', 'Cache-Control': 'public, max-age=3600', 'X-Robots-Tag': 'noindex' },
	});
}
