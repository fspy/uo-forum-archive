import type { PageServerLoad, EntryGenerator } from './$types';
import { getThread, threadsIndex, slugify } from '$lib/data';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const entries: EntryGenerator = () => {
	return threadsIndex.map((t) => ({
		id: String(t.id),
		slug: t.slug
	}));
};

export const load: PageServerLoad = ({ params }) => {
	const id = parseInt(params.id, 10);
	if (isNaN(id)) throw error(404, 'Invalid thread ID');

	try {
		const thread = getThread(id);
		return {
			thread,
			slug: slugify(thread.title).slice(0, 80),
			categorySlug: slugify(thread.category)
		};
	} catch {
		throw error(404, 'Thread not found');
	}
};
