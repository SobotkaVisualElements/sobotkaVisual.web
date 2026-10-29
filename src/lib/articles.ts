// Poradniki: wspólne pomocnicze funkcje (kategoria z nadtytułu, czas czytania, obrazek)
export const cat = (e = '') => (e.split('·').pop() || 'Poradnik').trim();
export const readMin = (d: any) => {
	const t = (d.blocks ?? []).filter((b: any) => b?.type === 'tekst').map((b: any) => String(b.text || '')).join(' ');
	const f = (d.faq ?? []).map((x: any) => `${x.q} ${x.a}`).join(' ');
	return Math.max(2, Math.round(`${t} ${f}`.split(/\s+/).length / 200));
};
export const firstImg = (d: any) => d.blocks?.find((b: any) => b?.type === 'zdjecie' && b.image)?.image as string | undefined;
export const firstIcon = (d: any) => (d.blocks?.find((b: any) => b?.type === 'zdjecie' && b.icon)?.icon as string) || 'kamera';
