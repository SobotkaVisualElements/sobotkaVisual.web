// Wersja Markdown każdej strony dla agentów AI („Markdown for Agents” bez planu Pro w Cloudflare).
// Po zbudowaniu: z <main> każdej indeksowanej strony robimy dist/<ścieżka>/index.md.
// functions/_middleware.js podaje ten plik, gdy agent prosi o „Accept: text/markdown”.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import TurndownService from 'turndown';

const D = 'dist';
const SITE = 'https://sobotkavisual.pl';
const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced', emDelimiter: '*' });
td.remove(['script', 'style', 'svg', 'noscript', 'iframe', 'button', 'form', 'video', 'template', 'canvas', 'select', 'input']);
// ozdobne obrazki (alt="") pomijamy, opisane zostawiamy
td.addRule('img', { filter: 'img', replacement: (_c, n) => { const a = n.getAttribute('alt'); return a ? `![${a}](${n.getAttribute('src') || ''})` : ''; } });
// nawigacja, spis treści, przyciski udostępniania i panel boczny — zbędne dla agenta
td.addRule('chrome', { filter: (n) => n.nodeName === 'NAV' || /\b(ar-toc-m|ar-share|ar-side|ar-crumbs|c3d-bar|c3d-dots)\b/.test(n.getAttribute?.('class') || ''), replacement: () => '' });
// tabele → tabela Markdown
td.addRule('table', { filter: 'table', replacement: (_c, n) => {
	const rows = byTag(n, ['TR']).map((tr) => Array.from(tr.childNodes).filter((c) => c.nodeName === 'TH' || c.nodeName === 'TD').map((c) => td.turndown(c.innerHTML).replace(/\n+/g, ' ').replace(/\|/g, '\\|').trim()));
	if (!rows.length) return '';
	const w = Math.max(...rows.map((r) => r.length));
	const line = (r) => '| ' + Array.from({ length: w }, (_, i) => r[i] ?? '').join(' | ') + ' |';
	return '\n\n' + [line(rows[0]), '|' + ' --- |'.repeat(w), ...rows.slice(1).map(line)].join('\n') + '\n\n';
} });
// meta autora (imię, data, czas czytania) w jednej linijce
td.addRule('meta', { filter: (n) => /\bar-meta\b/.test(n.getAttribute?.('class') || ''), replacement: (_c, n) => `

*${leaves(n).join(' · ')}*

` });
// elementy ukryte przed czytnikami (aria-hidden) to dekoracje
td.addRule('hidden', { filter: (n) => n.getAttribute && n.getAttribute('aria-hidden') === 'true', replacement: () => '' });

// teksty liści drzewa (bez kropek-separatorów)
const leaves = (n, out = []) => { for (const c of Array.from(n.childNodes)) { if (c.nodeType === 3) { const t = c.textContent.trim(); if (t) out.push(t); } else if (c.nodeType === 1 && !/ar-dot/.test(c.getAttribute('class') || '') && c.nodeName !== 'IMG') leaves(c, out); } return out; };
const byTag = (n, tags, out = []) => { for (const c of Array.from(n.childNodes)) { if (c.nodeType === 1) { if (tags.includes(c.nodeName)) out.push(c); else byTag(c, tags, out); } } return out; };
const attr = (s, re) => (s.match(re)?.[1] ?? '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
async function walk(dir) {
	const out = [];
	for (const e of await readdir(dir, { withFileTypes: true })) {
		const p = join(dir, e.name);
		if (e.isDirectory()) { if (!/^(admin|pagefind|_astro|podpis)$/.test(e.name)) out.push(...(await walk(p))); }
		else if (e.name === 'index.html') out.push(p);
	}
	return out;
}
let n = 0;
for (const f of await walk(D)) {
	const html = await readFile(f, 'utf8');
	if (/<meta name="robots" content="noindex/.test(html)) continue;
	const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/)?.[1];
	if (!main) continue;
	const path = f.slice(D.length).replace(/index\.html$/, '');
	const title = attr(html, /<title>([^<]*)<\/title>/);
	const desc = attr(html, /<meta name="description" content="([^"]*)"/);
	let body = td.turndown(main).replace(/\]\(\//g, `](${SITE}/`).replace(/\n{3,}/g, '\n\n').trim();
	const md = `# ${title}\n\n> ${desc}\n\nAdres: ${SITE}${path}\n\n---\n\n${body}\n`;
	await writeFile(join(D, path, 'index.md'), md);
	n++;
}
console.log(`Markdown dla agentów: ${n} stron`);
