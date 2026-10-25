// Cloudflare Pages Function — odbiera zamówienie z generatora i wysyła mail przez Resend.
// Wymaga zmiennych środowiskowych w Cloudflare: RESEND_API_KEY (i opcjonalnie MAIL_TO, MAIL_FROM).

export async function onRequestPost({ request, env }) {
	const cors = {
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json',
	};
	try {
		const data = await request.json();
		const { email, firma, nip, telefon, zamowienie, temat } = data || {};
		const probna = temat === 'probna';

		if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
			return new Response(JSON.stringify({ ok: false, error: 'Niepoprawny e-mail' }), { status: 400, headers: cors });
		}
		if (data.firma_www) { // honeypot na boty
			return new Response(JSON.stringify({ ok: true }), { headers: cors });
		}

		const TO = env.MAIL_TO || 'kontakt@sobotkavisual.pl';
		const FROM = env.MAIL_FROM || 'Generator SVC <generator@sobotkavisual.pl>';

		const html = `
			<h2>${probna ? 'Darmowa rolka próbna — nowe zgłoszenie' : 'Nowe zapytanie z generatora'}</h2>
			<p><b>Firma:</b> ${esc(firma) || '-'}<br>
			<b>NIP:</b> ${esc(nip) || '-'}<br>
			<b>E-mail:</b> ${esc(email)}<br>
			<b>Telefon:</b> ${esc(telefon) || '-'}</p>
			<pre style="font-family:ui-monospace,monospace;white-space:pre-wrap">${esc(zamowienie) || ''}</pre>
		`;

		// 1) mail do Ciebie
		const r = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject: `${probna ? 'Rolka próbna' : 'Zapytanie z generatora'} — ${firma || email}`, html }),
		});
		if (!r.ok) {
			const t = await r.text();
			return new Response(JSON.stringify({ ok: false, error: 'Wysyłka nie powiodła się', detail: t }), { status: 502, headers: cors });
		}

		// 2) automatyczna odpowiedź do klienta
		await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({
				from: FROM,
				to: [email],
				subject: probna ? 'Mamy Twój materiał — darmowa rolka próbna' : 'Dziękujemy za zapytanie — Sobotka Visual Creations',
				html: `<p>Dzień dobry,</p>
				<p>${probna ? 'dziękujemy za zgłoszenie do darmowej rolki próbnej. Sprawdzimy materiał i odezwiemy się <b>do 24 godzin</b> w dni robocze.' : 'dziękujemy za przesłanie konfiguracji. Odezwiemy się z odpowiedzią <b>do 48 godzin</b>.'}</p>
				<p>Poniżej kopia Państwa zapytania:</p>
				<pre style="font-family:ui-monospace,monospace;white-space:pre-wrap">${esc(zamowienie) || ''}</pre>
				<p>Pozdrawiamy,<br>Sobotka Visual Creations<br>kontakt@sobotkavisual.pl · 668 472 759</p>`,
			}),
		});

		return new Response(JSON.stringify({ ok: true }), { headers: cors });
	} catch (e) {
		return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: cors });
	}
}

function esc(s) {
	return String(s ?? '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
}
