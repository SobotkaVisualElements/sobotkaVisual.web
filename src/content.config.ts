import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* Warstwy parallaksy (do 3 PNG 1920×1200) i klocki treści z panelu CMS */
const layer = z.object({ image: z.string().optional(), depth: z.number().optional(), scale: z.number().optional(), x: z.number().optional(), y: z.number().optional() });
// puste pole z panelu ('' albo null) = brak wartości — inaczej budowanie strony się wywraca
const empty = (v: unknown) => (v === '' || v === null ? undefined : v);
const blocks = z.array(z.object({ type: z.string() }).passthrough()).optional();

/*
 * ブログ記事コレクション。frontmatter は型付きで検証される。
 * 記事は src/content/blog/ に .md / .mdx で追加する（テーマ利用者のコンテンツ領域）。
 */
const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			author: z.string().optional(),
			/** true の記事は本番ビルドで一覧・詳細から除外される */
			draft: z.boolean().default(false),
			/** アイキャッチ画像（任意）。src/content/blog からの相対パス */
			heroImage: image().optional(),
		}),
});

/*
 * ポートフォリオ（プロジェクト）コレクション。本文はケーススタディ。
 * src/content/work/ に .md / .mdx で追加する。
 */
const work = defineCollection({
	loader: glob({ base: './src/content/work', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			/** フィルタに使う主カテゴリ */
			category: z.string(),
			/** 使用技術・スタック */
			tech: z.array(z.string()).default([]),
			year: z.preprocess(empty, z.coerce.number().default(new Date().getFullYear())),
			role: z.string().optional(),
			client: z.string().optional(),
			/** Logotyp klienta (PNG/SVG, najlepiej przezroczyste tło) */
			clientLogo: z.string().optional(),
			/** Jak wyświetlić logo: ciemne (domyślnie, przyciemnia białe logo), oryginalne kolory */
			clientLogoTone: z.string().optional(),
			/** 公開サイト・リポジトリ（任意） */
			url: z.preprocess(empty, z.string().url().optional()),
			repo: z.preprocess(empty, z.string().url().optional()),
			/** サムネイル（任意）。無い場合はグラデーションのプレースホルダを表示 */
			thumbnail: image().optional(),
			/** Okładka wgrana przez panel CMS (ścieżka w /public/uploads) */
			cover: z.string().optional(),
			coverFocalX: z.preprocess(empty, z.coerce.number().optional()),
			coverFocalY: z.preprocess(empty, z.coerce.number().optional()),
			/** Data realizacji — strona sortuje od najnowszych */
			date: z.preprocess(empty, z.coerce.date().optional()),
			/** Współpraca stała: aktywna (od kiedy) albo zakończona (od – do) */
			collab: z.preprocess(empty, z.boolean().optional()),
			collabStatus: z.preprocess(empty, z.string().optional()),
			collabFrom: z.preprocess(empty, z.coerce.date().optional()),
			collabTo: z.preprocess(empty, z.coerce.date().optional()),
			/** Okładka pionowa 1200×1920 do karuzeli na stronie głównej */
			poster: z.string().optional(),
			/** Film w nagłówku case study zamiast baneru: YouTube albo własny MP4 (pętla, bez kontrolek) */
			youtube: z.string().optional(),
			video: z.string().optional(),
			/** albo link do filmu z Cloudflare R2 (https://media.sobotkavisual.pl/...) */
			videoUrl: z.string().optional(),
			layers: z.array(layer).optional(),
			parallaxStrength: z.preprocess(empty, z.coerce.number().optional()),
			blocks,
			featured: z.boolean().default(false),
			/** 並び順（小さいほど前）。同値は year の新しい順 */
			order: z.preprocess(empty, z.coerce.number().default(0)),
			draft: z.boolean().default(false),
		}),
});


/* Podstrony tworzone z panelu CMS (src/content/pages). Dostępne pod /<slug>. */
const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		heading: z.string().optional(),
		eyebrow: z.string().optional(),
		draft: z.boolean().default(false),
		noindex: z.boolean().default(false),
		/** artykuł/poradnik: data aktualizacji → widoczna na stronie + dane Article dla Google i AI */
		updated: z.preprocess((v) => (v === '' || v == null ? undefined : v), z.coerce.date().optional()),
		/** pytania i odpowiedzi pod artykułem (dane FAQPage dla Google) */
		faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
		blocks,
	}),
});

export const collections = { blog, work, pages };
