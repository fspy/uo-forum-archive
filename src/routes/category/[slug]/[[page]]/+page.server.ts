import type { PageServerLoad, EntryGenerator } from './$types';
import { categories, getCategoryBySlug, getThreadsByCategory, paginate, THREADS_PER_PAGE } from '$lib/data';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const entries: EntryGenerator = () => {
	const result: { slug: string; page?: string }[] = [];
	for (const cat of categories) {
		// Page 1 (no page param)
		result.push({ slug: cat.slug });
		// Additional pages
		const totalPages = Math.ceil(cat.count / THREADS_PER_PAGE);
		for (let p = 2; p <= totalPages; p++) {
			result.push({ slug: cat.slug, page: String(p) });
		}
	}
	return result;
};

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;
	const page = params.page ? parseInt(params.page, 10) : 1;

	const category = getCategoryBySlug(slug);
	if (!category) throw error(404, 'Category not found');

	const allThreads = getThreadsByCategory(slug);
	const { items: threads, totalPages } = paginate(allThreads, page, THREADS_PER_PAGE);

	return {
		category,
		threads,
		currentPage: page,
		totalPages,
		totalThreads: allThreads.length
	};
};
