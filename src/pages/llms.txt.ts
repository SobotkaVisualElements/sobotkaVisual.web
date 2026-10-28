/*
 * /llms.txt — krótka „wizytówka” firmy dla czatów AI (ChatGPT, Perplexity, Claude, Copilot).
 * Generowana przy budowaniu z tych samych danych co strona (cennik, usługi, realizacje),
 * więc nie trzeba jej ręcznie aktualizować.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { packages, groups, zl } from '../lib/pricing';
import { site } from '../site.config';

const files = import.meta.glob('../data/uslugi/*.json', { eager: true }) as Record<string, any>;

export const GET: APIRoute = async () => {
	const S = site.url;
	const pln = (n: number) => zl(n).replace(/ /g, ' ');
	const price: Record<string, number> = Object.fromEntries(groups.flatMap((g) => g.items.map((i) => [i.id, i.price])));
	const uslugi = Object.entries(files)
		.map(([p, m]) => ({ slug: p.split('/').pop()!.replace('.json', ''), ...(m.default ?? m) }))
		.filter((s: any) => !s.draft)
		.sort((a: any, b: any) => (a.order ?? 99) - (b.order ?? 99));
	const work = (await getCollection('work', ({ data }) => !data.draft)).sort((a, b) => (+(b.data.date ?? 0)) - (+(a.data.date ?? 0)));

	const lines = [
		'# Sobotka Visual Creations (SVC)',
		'',
		'> Studio montażu wideo, animacji i motion designu z Opola (firma zarejestrowana w Nysie). Robimy rolki, filmy reklamowe i wizerunkowe, animacje, oprawę graficzną i transmisyjną dla firm, twórców internetowych, wydawnictw i klubów sportowych. Działamy od 2020 roku: Opolszczyzna, Śląsk, Dolny Śląsk, a zdalnie cała Polska.',
		'',
		'Ceny są końcowe: firma jest zwolniona z VAT, więc nie doliczamy 23% VAT.',
		'',
		'Kontakt: kontakt@sobotkavisual.pl, tel. +48 668 472 759. Założyciel: Krzysztof Sobotka (3D Visual & Motion Artist, absolwent ASP we Wrocławiu).',
		'',
		'## Usługi',
		...uslugi.map((s: any) => {
			const from = price[(s.prices?.items ?? [])[0]];
			return `- [${s.name}](${S}/uslugi/${s.slug}/)${from ? `: od ${pln(from)}` : ''}${s.hero?.lead ? ` — ${String(s.hero.lead).replace(/\s+/g, ' ')}` : ''}`;
		}),
		'',
		'## Pakiety abonamentowe (miesięcznie)',
		...packages.filter((p) => p.price > 0).map((p) => `- ${p.name}: ${pln(p.price)} — ${p.desc}`),
		`- Własny pakiet i wycena pojedynczych materiałów: [generator](${S}/generator/)`,
		'',
		'## Oferty',
		`- [Dział wideo dla firmy (pakiet PRO)](${S}/oferta/dzial-wideo/)`,
		`- [Kanał na YouTube pod klucz](${S}/oferta/kanal-youtube/)`,
		`- [Dla wydawnictw: booktrailery i animowane okładki](${S}/oferta/wydawnictwa/)`,
		'',
		'## Realizacje',
		...work.map((w) => `- [${w.data.title}](${S}/work/${w.id}/)${w.data.client ? ` — klient: ${w.data.client}` : ''}`),
		'',
		'## Więcej',
		`- [Ile kosztuje rolka dla firmy w 2026 — cennik i modele](${S}/ile-kosztuje-rolka-dla-firmy/)`,
		`- [O nas — historia studia](${S}/o-nas/)`,
		`- [Manifest — jak pracujemy](${S}/manifest/)`,
		`- [Obszar działania i miasta](${S}/obszar-dzialania/)`,
		`- Profile: ${Object.values(site.profiles).join(', ')}`,
		'',
	];
	return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
