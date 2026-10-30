// IndexNow (Bing, Yandex, Seznam, Naver) — zgłasza adresy strony po wdrożeniu.
// Dzięki temu Bing — a przez to Copilot i ChatGPT — widzi zmiany w minutach, nie w tygodniach.
//
// Dwa tryby:
//  • przy budowaniu (Cloudflare Pages): tylko zapisuje dist/build.txt z numerem commita.
//    Nie zgłaszamy z builda, bo strona (i plik z kluczem) nie jest jeszcze wtedy na żywo
//    — Bing sprawdza klucz od razu i odrzuca zgłoszenie (403).
//  • `node scripts/indexnow.mjs --live` (GitHub Action po wdrożeniu): czeka, aż na stronie
//    jest nowa wersja, bierze adresy z mapy strony i zgłasza je do IndexNow.
import { writeFile } from 'node:fs/promises';

const HOST = 'sobotkavisual.pl';
const KEY = '5cd1e4fb34174428a4d5b1ba8787dbc6'; // klucz z Bing Webmaster Tools (plik /<klucz>.txt w public/)

if (!process.argv.includes('--live')) {
	const sha = process.env.CF_PAGES_COMMIT_SHA || 'local';
	await writeFile('dist/build.txt', sha).catch(() => {});
	console.log(`IndexNow: zapisano build.txt (${sha.slice(0, 7)}); zgłoszenie po wdrożeniu robi GitHub Action`);
	process.exit(0);
}

// komunikaty widoczne w GitHubie jako adnotacje (Actions → podsumowanie przebiegu)
const note = (m, bad = false) => console.log(`::${bad ? 'error' : 'notice'}::${m}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const want = process.env.GITHUB_SHA;

// 1) czekamy, aż Cloudflare opublikuje tę wersję (maks. 15 min)
if (want) {
	for (let i = 0; ; i++) {
		const live = await fetch(`https://${HOST}/build.txt?t=${Date.now()}`).then((r) => (r.ok ? r.text() : '')).catch(() => '');
		if (live.trim() === want) { console.log('Nowa wersja jest na żywo.'); break; }
		if (i >= 45) { note('Nie doczekałem się nowej wersji — zgłaszam to, co jest.'); break; }
		await sleep(20000);
	}
}

// 2) klucz musi być dostępny publicznie
const key = await fetch(`https://${HOST}/${KEY}.txt`).then((r) => r.text()).catch(() => '');
if (key.trim() !== KEY) { note(`Plik z kluczem nie odpowiada (dostałem: ${key.slice(0, 60)}) — przerywam.`, true); process.exit(1); }

// 3) adresy z mapy strony (tylko strony do indeksowania)
const xml = await fetch(`https://${HOST}/sitemap-0.xml`).then((r) => r.text());
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) { console.log('Pusta mapa strony.'); process.exit(0); }

const res = await fetch('https://api.indexnow.org/indexnow', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json; charset=utf-8' },
	body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls.slice(0, 10000) }),
});
note(`IndexNow: zgłoszono ${urls.length} adresów, odpowiedź ${res.status} ${(await res.text()).slice(0, 200)}`, res.status >= 300);
process.exit(res.status < 300 ? 0 : 1);
