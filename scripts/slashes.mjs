// Po zbudowaniu: linki wewnętrzne bez końcowego „/” (np. /work, /generator?pakiet=pro) zamieniamy
// na wersję ze slashem (/work/, /generator/?pakiet=pro). Cloudflare i tak przekierowuje na adres ze slashem,
// a każde przekierowanie to strata dla Google (audyt Ahrefs: „Page has links to redirect”).
// Działa też dla treści z panelu CMS, więc nie trzeba pilnować slashy ręcznie.
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const D = 'dist';
const isDir = async (p) => stat(join(D, p, 'index.html')).then(() => true).catch(() => false);
const cache = new Map();
const fix = async (path) => {
	if (!path || path.endsWith('/') || /\.[a-z0-9]{2,5}$/i.test(path)) return path;
	if (!cache.has(path)) cache.set(path, await isDir(path));
	return cache.get(path) ? path + '/' : path;
};
async function walk(dir) {
	const out = [];
	for (const e of await readdir(dir, { withFileTypes: true })) {
		const p = join(dir, e.name);
		if (e.isDirectory()) { if (!/^(admin|pagefind|_astro)$/.test(e.name)) out.push(...(await walk(p))); }
		else if (e.name.endsWith('.html')) out.push(p);
	}
	return out;
}
let changed = 0;
for (const f of await walk(D)) {
	const s = await readFile(f, 'utf8');
	// href="/sciezka?..."  oraz  "href":"/sciezka" (dane JSON karuzel)
	const re = /(href="|"href":")(\/[^"?#\s]*)([?#][^"]*)?"/g;
	const parts = [];
	let last = 0, m, dirty = false;
	while ((m = re.exec(s))) {
		const p = await fix(m[2]);
		if (p !== m[2]) { parts.push(s.slice(last, m.index), m[1], p, m[3] || '', '"'); last = m.index + m[0].length; dirty = true; }
	}
	if (dirty) { parts.push(s.slice(last)); await writeFile(f, parts.join('')); changed++; }
}
console.log(`Slashe: poprawiono linki w ${changed} plikach`);
