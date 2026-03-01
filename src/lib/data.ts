import type { ThreadIndex, Category, CategoryGroup, Thread } from '$lib/types';
import { slugify } from '$lib/utils';
import { readFileSync } from 'fs';
import { join } from 'path';

// These are small enough to import statically
import categoriesData from '$lib/data/categories.json';

// Read the index via fs to avoid bundling a 5MB JSON into the client
const indexPath = join(process.cwd(), 'src/lib/data/threads-index.json');
const indexRaw = readFileSync(indexPath, 'utf-8');

export const categories: Category[] = categoriesData as Category[];
export const threadsIndex: ThreadIndex[] = JSON.parse(indexRaw) as ThreadIndex[];

const categoryBySlug = new Map<string, Category>();
for (const cat of categories) {
	categoryBySlug.set(cat.slug, cat);
}

export function getCategoryBySlug(slug: string): Category | undefined {
	return categoryBySlug.get(slug);
}

export function getThreadsByCategory(categorySlug: string): ThreadIndex[] {
	return threadsIndex.filter((t) => t.categorySlug === categorySlug);
}

export function paginate<T>(items: T[], page: number, perPage: number): { items: T[]; totalPages: number } {
	const totalPages = Math.ceil(items.length / perPage);
	const start = (page - 1) * perPage;
	return {
		items: items.slice(start, start + perPage),
		totalPages
	};
}

export function getThread(id: number): Thread {
	const filePath = join(process.cwd(), 'src/lib/data/threads', `${id}.json`);
	const raw = readFileSync(filePath, 'utf-8');
	return JSON.parse(raw) as Thread;
}

export { slugify };

export const THREADS_PER_PAGE = 60;

// Category group definitions matching the original forum.uo.com structure
const CATEGORY_GROUP_DEFS: { name: string; description: string; childSlugs: string[] }[] = [
	{
		name: 'General Discussions',
		description: 'Talk about anything and everything UO!',
		childSlugs: ['general-discussions']
	},
	{
		name: 'New Legacy',
		description: 'Discuss all things Ultima Online: New Legacy',
		childSlugs: ['new-legacy', 'new-legacy-bugs']
	},
	{
		name: 'PvP / VvV',
		description: 'Discuss the tactics, trade, and fun of Player versus Player combat!',
		childSlugs: ['pvp-vvv']
	},
	{
		name: 'Roleplay',
		description: 'Stories, planning, and information relating to the RP community.',
		childSlugs: ['roleplay']
	},
	{
		name: 'Skills and Stats',
		description: 'Discuss your favorite build, get help from experts, learn how best to level.',
		childSlugs: ['skills-and-stats']
	},
	{
		name: 'Homes & Castles',
		description: 'Share decorating guides, building tips, and anything else house-related!',
		childSlugs: ['homes-amp-castles']
	},
	{
		name: 'Trade Forums',
		description: 'Buy and Sell!',
		childSlugs: ['general-trade', 'rares']
	},
	{
		name: 'Shard Forums',
		description: 'Discussion for specific shards/languages.',
		childSlugs: [
			'atlantic', 'arirang', 'asuka', 'baja', 'balhae', 'catskills', 'chesapeake',
			'drachenfels', 'europa', 'formosa', 'great-lakes', 'hokuto', 'izumo', 'lake-austin',
			'lake-superior', 'legends', 'mizuho', 'mugen', 'napa-valley', 'oceania', 'origin',
			'pacific', 'sakura', 'siege', 'sonoma', 'wakoku', 'yamato'
		]
	},
	{
		name: 'ClassicUO Web Client',
		description: 'For discussion & feedback on the ClassicUO Web Client',
		childSlugs: ['classicuo-web-client']
	},
	{
		name: 'Customer Service',
		description: 'Need help from the team? This is the place to ask.',
		childSlugs: ['customer-service', 'bugs', 'dev-feed', 'forum-feedback', 'test-center']
	}
];

export function getCategoryGroups(): CategoryGroup[] {
	return CATEGORY_GROUP_DEFS.map((def) => {
		const children = def.childSlugs
			.map((slug) => categoryBySlug.get(slug))
			.filter((c): c is Category => c !== undefined);
		return {
			name: def.name,
			description: def.description,
			children,
			totalCount: children.reduce((sum, c) => sum + c.count, 0)
		};
	});
}
