/*
 * Polska typografia dla tekstów z panelu.
 *  - krótkie słowa (i, w, z, o, a, u, je, na, do, od, po, we, ze, że, to…) nie zostają na końcu linii
 *  - liczby trzymają się jednostek („7 200 zł”, „30 minut”), myślnik nie zaczyna linii
 *  - Enter w polu tekstowym = nowa linia, **tekst** = pogrubienie
 */
const NB = '\u00A0';
const SHORT = /(?<=^|[\s(„"])([A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]{1,2})[ \t]+/g;

export function nbsp(s: string): string {
	return s.replace(SHORT, (_m, w) => `${w}${NB}`)
		.replace(/(\d)\s(?=\d{3}\b)/g, `$1${NB}`) // 7 200
		.replace(/(\d)\s+(?=(zł|%|mln|mld|tys\.|dni|min|h|s|godz\.|mies\.)(?![\wąćęłńóśźż]))/g, `$1${NB}`)
		.replace(/\s+([—–])\s/g, `${NB}$1 `); // myślnik zostaje przy poprzednim słowie
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Tekst z panelu → bezpieczny HTML z polską typografią. */
export function tx(s: string | undefined | null): string {
	if (!s) return '';
	return nbsp(esc(String(s)).trim())
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\r?\n/g, '<br />');
}

/** Klasa wyrównania z pola „Wyrównanie” w panelu. */
export const alignCls = (a?: string) =>
	a === 'srodek' ? 'text-center mx-auto' : a === 'justuj' ? 'svc-justify' : a === 'prawo' ? 'text-right ml-auto' : '';

/** Gotowy HTML (np. treść realizacji z Markdown) → ta sama polska typografia, tylko w tekście (poza tagami, kodem i tabelami liczb). */
export function nbspHtml(html: string): string {
	let skip = 0;
	return html.split(/(<[^>]+>)/g).map((part) => {
		if (part.startsWith('<')) {
			if (/^<(pre|code|script|style)\b/i.test(part)) skip++;
			else if (/^<\/(pre|code|script|style)>/i.test(part)) skip = Math.max(0, skip - 1);
			return part;
		}
		return skip ? part : nbsp(part);
	}).join('');
}
