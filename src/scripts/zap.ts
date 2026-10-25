
// wolne łącze albo tryb oszczędzania danych → wersja lite (bez cząsteczek i błyskawic)
const cn = (navigator as any).connection;
if (cn && (cn.saveData || /(^|-)2g|3g/.test(cn.effectiveType || ''))) document.documentElement.classList.add('ob-lite');
/*
 * Piorun jak z After Effects (Trim Paths + Wiggle Paths + Roughen Edges + Glow):
 *  - nieregularna ścieżka przez cały przycisk (co przejście inna),
 *  - widoczny odcinek płynie od lewej do prawej z łagodnym startem i hamowaniem (Easy Ease), 60 klatek = 2,5 s przy 24 kl./s,
 *  - kształt drga „komiksowo”: wiggle zmienia się co 2 klatki (Posterize Time), brzegi postrzępione, końce zwężone,
 *  - cieńsze odgałęzienie biegnie po tej samej ścieżce, całość ma podwójną cyjanową poświatę.
 * Działa na każdym elemencie z [data-zap] (wartość = skala grubości), który ma w środku <Zap />.
 * Tylko pełna wersja: komputer, bez „ogranicz ruch”, dobre łącze.
 */
const full = matchMedia('(hover: hover) and (min-width: 768px) and (prefers-reduced-motion: no-preference)');
const PAD = 26, NS = 'http://www.w3.org/2000/svg', FPS = 24, ANIM = 60, GAP = 8;
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const noise = (x: number, seed: number) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return (hash(i + seed * 57) * (1 - u) + hash(i + 1 + seed * 57) * u) * 2 - 1; };
const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
document.querySelectorAll<HTMLElement>('[data-zap]').forEach((btn) => {
	if ((btn as any)._zap) return; (btn as any)._zap = 1;
	const svg = btn.querySelector<SVGSVGElement>('svg[data-zap-svg]');
	if (!svg) return;
	const core = svg.querySelector('[data-zap-core]')!;
	const SC = parseFloat(btn.dataset.zap || '1') || 1; // grubość/drgania dla większych elementów
	let W = 0, H = 0, run = false, frame = -1, cycle = 0;
	let base: { x: number; y: number }[] = [];
	const size = () => { W = btn.offsetWidth; H = btn.offsetHeight; };
	// nowa nieregularna ścieżka bazowa (jak narysowana Piórem) — przez cały przycisk
	const newBase = () => {
		const k = 6, ctrl = Array.from({ length: k }, (_, i) => ({ x: -18 + (W + 36) * (i / (k - 1)) + (i && i < k - 1 ? (Math.random() - 0.5) * 18 : 0), y: H * (0.5 + (Math.random() - 0.5) * (H > 120 ? 0.7 : 0.85)) }));
		base = [];
		for (let i = 0; i < k - 1; i++) {
			const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(k - 1, i + 2)];
			for (let j = 0; j < 24; j++) {
				const t = j / 24, t2 = t * t, t3 = t2 * t;
				base.push({ x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
					y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3) });
			}
		}
		base.push(ctrl[k - 1]);
	};
	const sample = (u: number) => {
		const f = Math.min(base.length - 1.001, Math.max(0, u * (base.length - 1))), i = Math.floor(f), r = f - i;
		const a = base[i], b = base[i + 1];
		const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
		return { x: a.x + dx * r, y: a.y + dy * r, nx: -dy / l, ny: dx / l };
	};
	// pas o zmiennej grubości: wiggle (szum płynny) + postrzępienie (szum ostry) + zwężone końce
	const ribbon = (u0: number, u1: number, amp: number, wMax: number, seed: number, step: number) => {
		if (u1 - u0 < 0.01) return '';
		const n = Math.max(6, Math.round((u1 - u0) * 70)), top: string[] = [], bot: string[] = [];
		for (let i = 0; i <= n; i++) {
			const k = i / n, u = u0 + (u1 - u0) * k, p = sample(u);
			const off = (noise(u * 9 + step * 0.9, seed) * amp + noise(u * 34 + step * 1.7, seed + 9) * amp * 0.45) * (i === 0 || i === n ? 0.3 : 1);
			const w = Math.pow(Math.sin(Math.PI * k), 0.6) * wMax * (0.45 + hash(i * 13.1 + step * 7.7 + seed) * 0.95);
			const cx = p.x + p.nx * off + PAD, cy = p.y + p.ny * off + PAD;
			top.push(`${(cx + p.nx * w).toFixed(1)},${(cy + p.ny * w).toFixed(1)}`);
			bot.unshift(`${(cx - p.nx * w).toFixed(1)},${(cy - p.ny * w).toFixed(1)}`);
		}
		return `M${top.join(' L')} L${bot.join(' L')} Z`;
	};
	const draw = () => {
		const f = frame % (ANIM + GAP);
		let d = '';
		if (f < ANIM) {
			const t = f / ANIM;
			const head = ease(Math.min(1, t * 1.35)), tail = ease(Math.max(0, t * 1.35 - 0.35));
			const step = Math.floor(f / 2); // Posterize Time: drgania co 2 klatki = 12 kl./s, kreska „rysowana”
			d += ribbon(tail, head, 7 * SC, 3.4 * SC, cycle * 3, step);
			const mid = (tail + head) / 2, half = (head - tail) * 0.32;
			d += ribbon(mid - half, mid + half, 11 * SC, 1.3 * SC, cycle * 3 + 1, step); // cieńsze odgałęzienie po tej samej ścieżce
			if (hash(step + cycle) > 0.55) d += ribbon(tail + (head - tail) * 0.15, tail + (head - tail) * 0.55, 13 * SC, 0.9 * SC, cycle * 3 + 2, step);
		}
		core.innerHTML = '';
		if (!d) return;
		const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); core.appendChild(p);
	};
	// zegar 24 kl./s liczony z czasu (nie z liczby odświeżeń ekranu) — 60 klatek trwa zawsze 2,5 s
	let t0 = 0, cycleSeen = -1;
	const loop = () => {
		if (!run) return;
		const now = performance.now();
		if (!t0) t0 = now;
		const F = Math.floor(((now - t0) / 1000) * FPS);
		if (F !== frame) {
			frame = F;
			const c = Math.floor(F / (ANIM + GAP));
			if (c !== cycleSeen) { cycleSeen = c; cycle++; newBase(); }
			draw();
		}
		requestAnimationFrame(loop);
	};
	const start = () => { if (run || !full.matches || document.documentElement.classList.contains('ob-lite')) return; size(); newBase(); t0 = 0; frame = -1; cycleSeen = -1; run = true; requestAnimationFrame(loop); };
	new IntersectionObserver(([e]) => { if (e.isIntersecting) start(); else run = false; }).observe(btn);
	addEventListener('resize', () => { size(); newBase(); }, { passive: true });
});

