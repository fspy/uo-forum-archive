/**
 * Shared utility functions.
 *
 * Plain JS so both the SvelteKit app (via $lib/utils) and the Node
 * extraction script (via relative import) can consume this module.
 */

/**
 * Convert a string to a URL-friendly slug.
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}
