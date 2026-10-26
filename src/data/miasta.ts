/*
 * Miasta, w których działamy na miejscu (dojazd), i ich podstrony.
 * Jedno źródło dla: mapy na /obszar-dzialania, bloku „Dojazd” na podstronach i linków „Inne miasta”.
 * Strefy dojazdu jak w cenniku (src/lib/pricing.ts → dojazd): do 40 km od Opola lub Nysy w cenie, 40–100 km 150 zł.
 */
export type Miasto = { name: string; gen: string; lab?: [number, number, string]; lon: number; lat: number; km: string; dojazd: string; free: boolean; note: string; pages: [string, string][] };

export const miasta: Miasto[] = [
	{ name: 'Opole', gen: 'Opola', lon: 17.93, lat: 50.67, km: 'na miejscu', dojazd: 'w cenie', free: true, note: 'Tu pracujemy na co dzień — spotkanie albo nagranie nawet tego samego tygodnia.',
	  pages: [['/uslugi/montaz-wideo-opole', 'Montaż wideo'], ['/uslugi/film-reklamowy-opole', 'Film reklamowy'], ['/uslugi/animacje-opole', 'Animacje'], ['/uslugi/motion-design-opole', 'Motion design'], ['/uslugi/grafika-opole', 'Grafika'], ['/uslugi/rolki-social-media-opole', 'Rolki na social media']] },
	{ name: 'Nysa', gen: 'Nysy', lab: [-8, 3, 'end'], lon: 17.33, lat: 50.47, km: 'na miejscu', dojazd: 'w cenie', free: true, note: 'Tu jest zarejestrowana firma — znamy lokalny rynek i ludzi.',
	  pages: [['/uslugi/montaz-wideo-nysa', 'Montaż wideo'], ['/uslugi/film-reklamowy-nysa', 'Film reklamowy'], ['/uslugi/animacje-nysa', 'Animacje'], ['/uslugi/grafika-nysa', 'Grafika'], ['/uslugi/projektowanie-graficzne-nysa', 'Projektowanie graficzne'], ['/uslugi/social-media-nysa', 'Social media']] },
	{ name: 'Prudnik', gen: 'Prudnika', lab: [-7, 3, 'end'], lon: 17.58, lat: 50.32, km: 'ok. 30 km od Nysy', dojazd: 'w cenie', free: true, note: 'Dojazd z Nysy w pół godziny — bez dopłat.',
	  pages: [['/uslugi/film-reklamowy-prudnik', 'Film reklamowy i rolki']] },
	{ name: 'Brzeg', gen: 'Brzegu', lab: [-7, 3, 'end'], lon: 17.47, lat: 50.86, km: 'ok. 45 km od Opola', dojazd: '150 zł', free: false, note: 'Jedna dopłata za cały dzień nagrań, bez względu na liczbę materiałów.',
	  pages: [['/uslugi/film-reklamowy-brzeg', 'Film reklamowy i rolki']] },
	{ name: 'Kluczbork', gen: 'Kluczborka', lon: 18.22, lat: 50.97, km: 'ok. 45 km od Opola', dojazd: '150 zł', free: false, note: 'Jedna dopłata za cały dzień nagrań.',
	  pages: [['/uslugi/film-reklamowy-kluczbork', 'Film reklamowy i rolki']] },
	{ name: 'Kędzierzyn-Koźle', gen: 'Kędzierzyna-Koźla', lab: [0, -8, 'middle'], lon: 18.21, lat: 50.35, km: 'ok. 45 km od Opola', dojazd: '150 zł', free: false, note: 'Jedna dopłata za cały dzień nagrań, montaż zdalnie.',
	  pages: [['/uslugi/montaz-wideo-kedzierzyn-kozle', 'Montaż wideo']] },
	{ name: 'Racibórz', gen: 'Raciborza', lon: 18.22, lat: 50.09, km: 'ok. 75 km od Opola', dojazd: '150 zł', free: false, note: 'Jedna dopłata za dzień nagrań — resztę robimy zdalnie.',
	  pages: [['/uslugi/film-reklamowy-raciborz', 'Film reklamowy i rolki']] },
	{ name: 'Gliwice', gen: 'Gliwic', lab: [0, 12, 'middle'], lon: 18.67, lat: 50.29, km: 'ok. 75 km od Opola', dojazd: '150 zł', free: false, note: 'Autostradą A4 w godzinę — jedna dopłata za dzień nagrań.',
	  pages: [['/uslugi/film-reklamowy-gliwice', 'Film reklamowy i rolki']] },
	{ name: 'Wrocław', gen: 'Wrocławia', lab: [-7, 3, 'end'], lon: 17.04, lat: 51.11, km: 'ok. 90 km od Opola', dojazd: '150 zł', free: false, note: 'Autostradą A4 w godzinę — jedna dopłata za dzień nagrań.',
	  pages: [['/uslugi/montaz-wideo-wroclaw', 'Montaż wideo'], ['/uslugi/animacje-wroclaw', 'Animacje'], ['/uslugi/film-reklamowy-wroclaw', 'Film reklamowy']] },
	{ name: 'Katowice', gen: 'Katowic', lab: [0, -8, 'middle'], lon: 19.02, lat: 50.26, km: 'ok. 100 km od Opola', dojazd: '150 zł', free: false, note: 'Autostradą A4 — jedna dopłata za dzień nagrań.',
	  pages: [['/uslugi/motion-design-katowice', 'Motion design'], ['/uslugi/film-reklamowy-katowice', 'Film reklamowy']] },
];

/** Usługi zdalne — dla całej Polski (bez dojazdu). */
export const zdalnie: [string, string, string][] = [
	['/uslugi/montaz-wideo/', 'Montaż wideo', 'Wysyłasz nagrania, dostajesz gotowy materiał.'],
	['/uslugi/animacja-motion-design/', 'Animacja i motion design', 'Logo, trailery, animowane rolki — w całości zdalnie.'],
	['/uslugi/rolki-i-krotkie-formy/', 'Rolki i krótkie formy', 'Montaż rolek z Twoich materiałów, co tydzień.'],
	['/uslugi/oprawa-graficzna/', 'Oprawa graficzna', 'Miniatury, okładki i system graficzny marki.'],
	['/uslugi/oprawa-transmisyjna/', 'Oprawa transmisyjna', 'Intro, belki i statystyki dla klubów z całej Polski.'],
	['/uslugi/grafika-miniatury-youtube/', 'Miniatury YouTube', 'Miniatury, które podnoszą klikalność.'],
	['/oferta/wydawnictwa/', 'Dla wydawnictw', 'Booktrailery, animowane okładki i rolki z ilustracji.'],
];

export const miastoBy = (name = '') => miasta.find((m) => m.name.toLowerCase() === name.toLowerCase());
