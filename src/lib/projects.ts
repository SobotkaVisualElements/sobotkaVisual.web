import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './posts';

export type Project = CollectionEntry<'work'>;

/**
 * 公開プロジェクトを表示順で返す。
 * Od najnowszych (data → rok), przy remisie wg pola „Kolejność”. Szkice ukryte w buildzie.
 */
export async function getPublishedProjects(): Promise<Project[]> {
	const projects = await getCollection('work', ({ data }) =>
		import.meta.env.PROD ? !data.draft : true,
	);
	// Najnowsze na górze: data realizacji (a gdy jej brak — rok), potem pole „Kolejność”
	const t = (p: Project) => (p.data.date ? new Date(p.data.date).getTime() : new Date(p.data.year, 0, 1).getTime());
	return projects.sort((a, b) => t(b) - t(a) || a.data.order - b.data.order);
}

export interface CategoryInfo {
	name: string;
	slug: string;
	count: number;
}

/** 出現カテゴリを件数付きで返す（件数の多い順 → 名前順） */
export function collectCategories(projects: Project[]): CategoryInfo[] {
	const map = new Map<string, CategoryInfo>();
	for (const project of projects) {
		const name = project.data.category;
		const slug = slugify(name);
		const existing = map.get(slug);
		if (existing) existing.count += 1;
		else map.set(slug, { name, slug, count: 1 });
	}
	return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
