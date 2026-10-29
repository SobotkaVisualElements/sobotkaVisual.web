/*
 * Mały konwerter Markdown → HTML dla klocków „Tekst” z panelu.
 * Obsługuje: ## / ### nagłówki, akapity, listy „- ” i „1. ”, cytat „> ”, tabele „| a | b |”, **pogrubienie**, *kursywę*, [link](adres).
 */
import { nbsp } from './typo';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const inline = (s: string) =>
	nbsp(esc(s))
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<em>$2</em>')
		.replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/|#|mailto:)[^)\s]*)\)/g, '<a href="$2">$1</a>');

export function md(src: string = ''): string {
	const out: string[] = [];
	const blocks = String(src).replace(/\r\n/g, '\n').split(/\n{2,}/);
	for (const raw of blocks) {
		const b = raw.trim();
		if (!b) continue;
		const lines = b.split('\n');
		if (lines.length >= 2 && lines.every((l) => /^\s*\|.*\|\s*$/.test(l)) && /^\s*\|[\s:|-]+\|\s*$/.test(lines[1])) {
			const cells = (l: string) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => inline(c.trim()));
			const [head, , ...rows] = lines;
			out.push('<div class="md-table"><table><thead><tr>' + cells(head).map((c) => `<th>${c}</th>`).join('') + '</tr></thead><tbody>' +
				rows.map((r) => '<tr>' + cells(r).map((c) => `<td>${c}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>');
		} else if (lines.every((l) => /^\s*>/.test(l))) {
			out.push(`<blockquote><p>${lines.map((l) => inline(l.replace(/^\s*>\s?/, ''))).join('<br />')}</p></blockquote>`);
		} else if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
			out.push('<ol>' + lines.map((l) => `<li>${inline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>`).join('') + '</ol>');
		} else if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
			out.push('<ul>' + lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('') + '</ul>');
		} else if (/^###\s+/.test(b)) {
			out.push(`<h3>${inline(b.replace(/^###\s+/, ''))}</h3>`);
		} else if (/^##?\s+/.test(b)) {
			out.push(`<h2>${inline(b.replace(/^##?\s+/, ''))}</h2>`);
		} else {
			out.push(`<p>${lines.map(inline).join('<br />')}</p>`);
		}
	}
	return out.join('\n');
}
