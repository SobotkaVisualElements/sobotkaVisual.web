// Po każdym wdrożeniu zgłasza nowe/zmienione adresy do IndexNow (Bing, Yandex, Seznam, Naver).
// Dzięki temu Bing — a przez to Copilot i ChatGPT — widzi zmiany w minutach, nie w tygodniach.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const HOST = 'sobotkavisual.pl';
const KEY = 'fe3deacc50f01008b5edffa6d52a0531';

async function collect(dir, base = '') {
	const out = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await collect(full, `${base}/${entry.name}`)));
		else if (entry.name === 'index.html') out.push(`https://${HOST}${base || '/'}`);
	}
	return out;
}

try {
	const urls = (await collect('dist')).filter((u) => !u.includes('/admin'));
	if (!urls.length) process.exit(0);
	const res = await fetch('https://api.indexnow.org/indexnow', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
		body: JSON.stringify({
			host: HOST,
			key: KEY,
			keyLocation: `https://${HOST}/${KEY}.txt`,
			urlList: urls.slice(0, 10000),
		}),
	});
	console.log(`IndexNow: zgłoszono ${urls.length} adresów, odpowiedź ${res.status}`);
} catch (e) {
	console.log('IndexNow: pominięto —', e.message);
}
process.exit(0);
