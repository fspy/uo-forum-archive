import type { PageServerLoad } from './$types';
import { getCategoryGroups, threadsIndex } from '$lib/data';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const groups = getCategoryGroups();

	return {
		groups,
		totalThreads: threadsIndex.length
	};
};
