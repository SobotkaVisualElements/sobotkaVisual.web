/*
 * Silnik ruchu SVC — jeden plik dla całej strony.
 *  [data-layers]  kafelek z warstwami: każda warstwa [data-depth] rusza się za kursorem i przy scrollu
 *  [data-float]   element unoszący się lekko względem tła przy scrollu (np. wykresy)
 *  [data-count]   licznik od 0 do wartości, odpalany przy wejściu w ekran
 *  .svc-anim      dostaje klasę .is-in przy wejściu w ekran (rysowanie wykresów, ikon)
 */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover)').matches;

type Layer = { el: HTMLElement; depth: number; scale: number };
type Tile = { root: HTMLElement; layers: Layer[]; strength: number; px: number; py: number };

const tiles: Tile[] = [];
document.querySelectorAll<HTMLElement>('[data-layers]').forEach((root) => {
	if ((root as any)._svc) return;
	(root as any)._svc = true;
	const strength = parseFloat(root.dataset.strength || '100') / 100;
	const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => ({
		el,
		depth: parseFloat(el.dataset.depth || '0'),
		scale: parseFloat(el.dataset.scale || '110') / 100,
	}));
	const t: Tile = { root, layers, strength, px: 0, py: 0 };
	tiles.push(t);
	if (reduce) return;
	// kursor: nasłuchujemy na całej karcie (jeśli jest), nie tylko na obrazku
	const host = (root.closest('.liquid-card') as HTMLElement) || root;
	if (canHover) {
		host.addEventListener('pointermove', (e: PointerEvent) => {
			const r = root.getBoundingClientRect();
			t.px = (e.clientX - r.left) / r.width - 0.5;
			t.py = (e.clientY - r.top) / r.height - 0.5;
			paint(t);
		});
		host.addEventListener('pointerleave', () => { t.px = 0; t.py = 0; paint(t); });
	}
});

const floats = Array.from(document.querySelectorAll<HTMLElement>('[data-float]'));

function scrollOffset(el: HTMLElement) {
	const r = el.getBoundingClientRect();
	const vh = window.innerHeight || 1;
	// -1 (element na dole ekranu) … 0 (środek) … 1 (u góry)
	return Math.max(-1.5, Math.min(1.5, (vh / 2 - (r.top + r.height / 2)) / vh));
}

function paint(t: Tile) {
	const s = scrollOffset(t.root);
	t.layers.forEach((l) => {
		const k = (l.depth / 100) * t.strength;
		const x = -t.px * 40 * k;
		const y = -t.py * 40 * k + s * 60 * k;
		l.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${l.scale})`;
	});
}

let ticking = false;
function onScroll() {
	if (ticking) return;
	ticking = true;
	requestAnimationFrame(() => {
		tiles.forEach(paint);
		floats.forEach((el) => {
			const k = parseFloat(el.dataset.float || '40');
			el.style.transform = `translate3d(0, ${(scrollOffset(el) * k).toFixed(1)}px, 0)`;
		});
		ticking = false;
	});
}
if (!reduce) {
	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll, { passive: true });
}
tiles.forEach((t) => t.layers.forEach((l) => (l.el.style.transform = `scale(${l.scale})`)));
onScroll();

// liczniki i animacje „przy wejściu w ekran”
const fmt = (v: number, dec: number) => v.toLocaleString('pl-PL', { minimumFractionDigits: dec, maximumFractionDigits: dec });
function runCount(el: HTMLElement) {
	const to = parseFloat(el.dataset.count || '0');
	const dec = (el.dataset.count || '').includes('.') ? 1 : 0;
	const pre = el.dataset.prefix || '';
	const suf = el.dataset.suffix || '';
	if (reduce) { el.textContent = pre + fmt(to, dec) + suf; return; }
	const dur = 1600;
	const t0 = performance.now();
	const step = (now: number) => {
		const p = Math.min(1, (now - t0) / dur);
		const e = 1 - Math.pow(1 - p, 3);
		el.textContent = pre + fmt(to * e, dec) + suf;
		if (p < 1) requestAnimationFrame(step);
	};
	requestAnimationFrame(step);
}
const io = new IntersectionObserver((entries) => {
	entries.forEach((en) => {
		if (!en.isIntersecting) return;
		const el = en.target as HTMLElement;
		el.classList.add('is-in');
		el.querySelectorAll<HTMLElement>('[data-count]').forEach(runCount);
		io.unobserve(el);
	});
}, { threshold: 0, rootMargin: '0px 0px -18% 0px' });
document.querySelectorAll<HTMLElement>('.svc-anim').forEach((el) => io.observe(el));
