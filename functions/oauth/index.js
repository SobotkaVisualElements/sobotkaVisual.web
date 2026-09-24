// Start logowania GitHubem do panelu CMS.
export async function onRequestGet({ request, env }) {
	const url = new URL(request.url);
	const redirect = `${url.origin}/oauth/callback`;
	const auth = new URL('https://github.com/login/oauth/authorize');
	auth.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
	auth.searchParams.set('redirect_uri', redirect);
	auth.searchParams.set('scope', 'repo,user');
	return Response.redirect(auth.toString(), 302);
}
