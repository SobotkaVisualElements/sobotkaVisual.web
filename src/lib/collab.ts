/*
 * Współpraca stała przy realizacji: aktywna (od kiedy, trwa) albo zakończona (od – do).
 * Zwraca gotowe napisy do kafelka i do ramki „Zakres / Klient / …” w case study.
 */
const MIES = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
const fmt = (d: Date) => `${MIES[d.getMonth()]} ${d.getFullYear()}`;
const toDate = (v: unknown) => { if (!v) return undefined; const d = new Date(v as any); return isNaN(+d) ? undefined : d; };

export function collabInfo(d: any) {
	if (!d?.collab) return null;
	const from = toDate(d.collabFrom);
	const ended = d.collabStatus === 'zakonczona';
	const to = ended ? toDate(d.collabTo) : undefined;
	const end = to ?? new Date();
	const months = from ? Math.max(1, (end.getFullYear() - from.getFullYear()) * 12 + end.getMonth() - from.getMonth() + (ended ? 1 : 0)) : 0;
	const len = months ? (months >= 12 && months % 12 === 0 ? `${months / 12} ${months === 12 ? 'rok' : months / 12 < 5 ? 'lata' : 'lat'}` : `${months} mies.`) : '';
	const range = ended
		? (from ? fmt(from) : '') + (to ? ` – ${fmt(to)}` : '')
		: from ? `od ${fmt(from)}` : '';
	return {
		active: !ended,
		status: ended ? 'Zakończona' : 'Trwa',
		range,
		len,
		short: ended ? (range || 'zakończona') : (from ? `od ${String(from.getMonth() + 1).padStart(2, '0')}.${from.getFullYear()}` : 'aktywna'),
	};
}
