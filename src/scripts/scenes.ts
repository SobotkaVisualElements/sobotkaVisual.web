/*
 * Silnik scen sterowanych przewijaniem (szablon „kinetyczny”).
 * [data-scene]       — wysoka sekcja; jej wnętrze [data-sticky] przykleja się do ekranu,
 *                      a postęp przewijania 0→1 trafia do zmiennej CSS --p (wygładzony).
 * [data-reveal]      — element dostaje --r: 0→1, gdy przejeżdża przez ekran (bez przyklejania).
 * [data-words]       — akapit dzielony na słowa; słowa „zapalają się” wraz z --p sceny/rodzica.
 * [data-tilt]        — obiekt obraca się lekko za kursorem.
 * Wszystkie animacje to transformacje GPU; przy „ogranicz ruch” sceny są statyczne.
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// słowa
document.querySelectorAll<HTMLElement>('[data-words]').forEach((el) => {
	if (el.dataset.split) return;
	el.dataset.split = '1';
	const walk = (node: Node) => {
		Array.from(node.childNodes).forEach((ch) => {
			if (ch.nodeType === 3) {
				const parts = (ch.textContent || '').split(/(\s+)/);
				const frag = document.createDocumentFragment();
				parts.forEach((p) => {
					if (!p) return;
					if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
					else { const s = document.createElement('span'); s.className = 'kw'; s.textContent = p; frag.appendChild(s); }
				});
				ch.replaceWith(frag);
			} else if (ch.nodeType === 1 && (ch as HTMLElement).tagName !== 'BR') walk(ch);
		});
	};
	walk(el);
	const words = el.querySelectorAll<HTMLElement>('.kw');
	words.forEach((w, i) => w.style.setProperty('--i', String(i / Math.max(1, words.length - 1))));
});

const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]')).map((el) => ({ el, cur: 0 }));
const bds = Array.from(document.querySelectorAll<HTMLElement>('[data-bd]')).map((el) => ({ el, sp: parseFloat(el.dataset.bd || '0.2'), rot: parseFloat(el.dataset.rot || '0') }));
let mx = 0, my = 0;
const steps = Array.from(document.querySelectorAll<HTMLElement>('[data-steps]')).map((el) => ({ el, scene: el.closest<HTMLElement>('[data-scene]'), items: Array.from(el.querySelectorAll<HTMLElement>('[data-step]')), dots: Array.from(el.querySelectorAll<HTMLElement>('[data-dot]')), active: -1 }));
const reveals = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]')).map((el) => ({ el, cur: 0 }));

function target(el: HTMLElement) {
	const r = el.getBoundingClientRect();
	const vh = innerHeight;
	const total = r.height - vh;
	return total > 0 ? clamp(-r.top / total) : clamp((vh - r.top) / (vh + r.height));
}
function revealTarget(el: HTMLElement) {
	const r = el.getBoundingClientRect();
	return clamp((innerHeight - r.top) / (innerHeight * 0.75));
}

let raf = 0;
function frame() {
	let moving = false;
	for (const s of scenes) {
		const t = target(s.el);
		s.cur += (t - s.cur) * 0.14;
		if (Math.abs(t - s.cur) < 0.0005) s.cur = t; else moving = true;
		s.el.style.setProperty('--p', s.cur.toFixed(4));
	}
	for (const r of reveals) {
		const t = revealTarget(r.el);
		r.cur += (t - r.cur) * 0.16;
		if (Math.abs(t - r.cur) < 0.0005) r.cur = t; else moving = true;
		r.el.style.setProperty('--r', r.cur.toFixed(4));
	}
	// tło za szkłem: postęp całej strony + lekki ruch za kursorem
	if (bds.length) {
		const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
		const P = scrollY / max;
		for (const b of bds) {
			const y = (0.5 - P) * innerHeight * 1.6 * b.sp;
			b.el.style.transform = `translate3d(${(mx * 40 * b.sp).toFixed(1)}px, ${(y + my * 30 * b.sp).toFixed(1)}px, 0) rotate(${(b.rot + P * b.rot * 3).toFixed(1)}deg)`;
		}
	}
	// kroki: skokowo, zawsze jeden czytelny
	for (const st of steps) {
		const sc = scenes.find((x) => x.el === st.scene);
		const pv = sc ? sc.cur : 0;
		const i = Math.min(st.items.length - 1, Math.floor(pv * st.items.length * 0.999));
		if (i !== st.active) { st.active = i; st.items.forEach((it, k) => it.classList.toggle('is-active', k === i)); st.dots.forEach((d, k) => d.classList.toggle('is-active', k === i)); st.el.style.setProperty('--ai', String(i)); }
	}
	raf = moving ? requestAnimationFrame(frame) : 0;
}
const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

if (reduce) {
	scenes.forEach((s) => s.el.style.setProperty('--p', '1'));
	steps.forEach((st) => st.items.forEach((it) => it.classList.add('is-active')));
	reveals.forEach((r) => r.el.style.setProperty('--r', '1'));
	document.documentElement.classList.add('k-reduce');
} else {
	addEventListener('scroll', kick, { passive: true });
	addEventListener('resize', kick, { passive: true });
	if (bds.length) addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; kick(); }, { passive: true });
	kick();
	// obrót za kursorem
	document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
		addEventListener('pointermove', (e) => {
			const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
			el.style.setProperty('--tx', x.toFixed(3));
			el.style.setProperty('--ty', y.toFixed(3));
		}, { passive: true });
	});
}
