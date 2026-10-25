/*
 * Cennik SVC — jedno źródło prawdy dla generatora, kart pakietów i wyliczenia „ile zyskujesz”.
 */
// Ceny wprost z Cennika Master 2026
export const packages = [
	{ id: 'none',   name: 'Bez pakietu', price: 0,     desc: 'Składam sam z elementów', preset: {} },
	{ id: 'start',  name: 'START',  price: 2500,  desc: 'Stała obecność, bez wideo',
	  preset: { rolki: 6, miniatury: 6, animacja: 1 } },
	{ id: 'pro',    name: 'PRO',    price: 7200,  desc: 'Pełne zaplecze produkcji wideo i grafiki', recommended: true,
	  preset: { montaz: 4, rolki: 8, miniatury: 8, animacja: 3 } },
	{ id: 'studio', name: 'STUDIO', price: 12900, desc: 'Najwyższy poziom + strategia',
	  preset: { montaz: 6, rolki: 12, miniatury: 16, animacja: 5, zdjecia: 1 } },
];

export const groups = [
	{ title: 'Wideo i krótkie formy', items: [
		{ id: 'montaz',    name: 'Montaż długiej formy',      price: 1250, max: 12, hint: 'Odcinki, wywiady, materiały 10–20 min' },
		{ id: 'rolki',     name: 'Rolka z Twoich materiałów',  price: 390,  max: 20, hint: 'Montaż, napisy, dźwięk — najszybszy zasięg', rec: true },
		{ id: 'rolkanagr', name: 'Rolka z nagraniem u Ciebie', price: 550,  max: 20, hint: 'Przyjeżdżamy z kamerą i montujemy' },
		{ id: 'rolkaani',  name: 'Animowana rolka',           price: 850,  max: 12, hint: 'Rolka z pełną oprawą motion', rec: true },
		{ id: 'skrot',     name: 'Skrót meczowy / eventowy',  price: 950,  max: 8 },
		{ id: 'wizerunek', name: 'Materiał wizerunkowy 2 min', price: 4500, max: 4 },
	]},
	{ title: 'Animacja i motion', items: [
		{ id: 'animacja',  name: 'Element animowany (belka, plansza)', price: 675, max: 12, hint: 'Buduje rozpoznawalność' },
		{ id: 'trailer',   name: 'Trailer animowany 30–45 s', price: 4300, max: 4 },
		{ id: 'okladka',   name: 'Animowana okładka / motion cover', price: 1150, max: 8 },
	]},
	{ title: 'Grafika i opakowanie', items: [
		{ id: 'miniatury', name: 'Miniatury / okładki',       price: 220, max: 24, hint: 'Decydują o klikalności', rec: true },
		{ id: 'grafika',   name: 'Grafika statyczna (post, baner)', price: 180, max: 24 },
		{ id: 'postani',   name: 'Animowany post promocyjny', price: 280, max: 12 },
	]},
	{ title: 'Koncepcja, dźwięk, produkcja', items: [
		{ id: 'scenariusz', name: 'Scenariusz materiału',     price: 600, max: 8 },
		{ id: 'dzwiek',     name: 'Opracowanie dźwięku + licencja', price: 400, max: 12 },
		{ id: 'lektor',     name: 'Lektor profesjonalny',     price: 900, max: 8 },
		{ id: 'napisy',     name: 'Napisy',                   price: 150, max: 16 },
		{ id: 'zdjecia',    name: 'Dzień zdjęciowy',          price: 1150, max: 4, hint: 'Świeży materiał zamiast archiwum' },
	]},
];

// Dopłaty i warunki handlowe — zaznaczane „ptaszkiem" (mnożniki wg Cennika, cz. C)
export const extras = [
	{ id: 'system',  name: 'System oprawy graficznej (wdrożenie)', type: 'flat', value: 5500, hint: 'Spójny system: intro, outro, belki, kolory' },
	{ id: 'trans',   name: 'Pakiet oprawy transmisyjnej',          type: 'flat', value: 6000 },
	{ id: 'express', name: 'Tryb ekspresowy (poniżej 48 h)',       type: 'pct',  value: 50 },
	{ id: 'format',  name: 'Dodatkowy format lub wersja językowa', type: 'pct',  value: 15 },
	{ id: 'prawa',   name: 'Rozszerzenie praw o kampanie płatne',  type: 'pct',  value: 25 },
	{ id: 'wylacz',  name: 'Wyłączność w branży na obszarze',      type: 'pct',  value: 30 },
	{ id: 'dojazd',  name: 'Dojazd 40–100 km (raz na dzień nagrań)', type: 'flat', value: 150, hint: 'Do 40 km od Opola lub Nysy dojazd jest w cenie' },
];

/* Strefy dojazdu — opłata raz na dzień nagrań, nie za każdą rolkę. */
export const dojazd = [
	{ zone: 'Do 40 km od Opola lub Nysy', price: 'w cenie', note: 'Opole, Nysa, Brzeg, Prudnik, Krapkowice, Głuchołazy' },
	{ zone: '40–100 km', price: '150 zł', note: 'np. Wrocław, Kędzierzyn-Koźle, Gliwice, Kluczbork' },
	{ zone: 'Powyżej 100 km', price: '1,20 zł / km', note: 'liczone w obie strony, raz na dzień nagrań' },
];

/* „Dzień contentowy”: jeden dzień nagrań u klienta = treści na cały miesiąc. Zamówienie jednorazowe, liczone jak w generatorze. */
export const dzienPreset: Record<string, number> = { zdjecia: 1, rolki: 10, grafika: 4 };

const priceOf: Record<string, number> = Object.fromEntries(groups.flatMap((g) => g.items.map((i) => [i.id, i.price])));
/** Wartość zawartości pakietu przy zamawianiu każdego elementu osobno (cennik jednostkowy SVC). */
export function packageValue(slug: string): number {
	const p: any = packages.find((x) => x.id === slug);
	if (!p) return 0;
	return Object.entries(p.preset as Record<string, number>).reduce((sum, [id, q]) => sum + (priceOf[id] ?? 0) * q, 0);
}
/** „7 200 zł” → 7200 */
export const toNum = (v: unknown) => Number(String(v ?? '').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
export const zl = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0zł';

/** Wartość „dla porównania” dla karty cenowej z panelu: pole value albo — dla kart START/PRO/STUDIO w cenie pakietu — wycena osobno. */
export function cardValue(c: any): number {
	const v = toNum(c?.value);
	if (v) return v;
	const name = String(c?.name ?? '').replace(/\*\*/g, '').trim().toUpperCase();
	const p: any = packages.find((x) => x.id !== 'none' && name === x.name);
	return p ? packageValue(p.id) : 0;
}

/*
 * Cena pakietu taka sama jak w generatorze: rabat = 4% za każdy element (pakiet + każda pozycja w środku), max 30%.
 * Zmienisz cenę lub zawartość pakietu w tym pliku → zmienia się w generatorze, na głównej i na landingach.
 */
export function packageDeal(slug: string) {
	const p: any = packages.find((x) => x.id === slug);
	if (!p || !p.price) return null;
	const n = Object.values(p.preset as Record<string, number>).filter((q) => q > 0).length;
	const disc = Math.min(30, (1 + n) * 4);
	const final = Math.round(p.price * (1 - disc / 100));
	return { list: p.price as number, final, disc, value: packageValue(slug), name: p.name as string };
}
/** Karta cenowa z panelu nazwana dokładnie START / PRO / STUDIO → cena i przecena biorą się z generatora (karta z panelu nie musi być aktualizowana). */
export function cardDeal(c: any) {
	const name = String(c?.name ?? '').replace(/\*\*/g, '').trim().toUpperCase();
	const p: any = packages.find((x) => x.id !== 'none' && name === x.name);
	return p ? packageDeal(p.id) : null;
}

/** Zestaw jednorazowy liczony dokładnie jak generator w trybie „jednorazowa”: suma pozycji, rabat 4% za każdą pozycję, max 30%. */
export function oneoffDeal(preset: Record<string, number>) {
	const items = Object.entries(preset).filter(([, q]) => q > 0);
	const list = items.reduce((s, [id, q]) => s + (priceOf[id] ?? 0) * q, 0);
	const disc = Math.min(30, items.length * 4);
	const final = Math.round(list * (1 - disc / 100));
	const link = '/generator?tryb=jednorazowa&' + items.map(([id, q]) => `${id}=${q}`).join('&');
	return { list, final, disc, link };
}
