/**
 * Extract data from alldata_1.js and alldata_2.js into structured JSON files.
 *
 * Outputs:
 *   src/lib/data/threads/<id>.json   – one file per thread
 *   src/lib/data/threads-index.json  – lightweight listing index
 *   src/lib/data/categories.json     – category metadata
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function slugify(text) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

// ─── Image URL validation ───────────────────────────────────────────────────────

/**
 * Known bad filenames produced by extracting the last path segment from invalid
 * or placeholder URLs in the scraped forum data (e.g. "https://forum.uo.com/src").
 */
const INVALID_FILENAMES = new Set(['src', 'full', 'download', 'images', '']);

/**
 * Emoji / reaction images from the forum – these are tiny 40x40 sprites.
 * Fine to keep inline in post HTML, but useless as thread thumbnails.
 */
const EMOJI_FILENAMES = new Set([
	'smile.png',
	'lol.png',
	'wink.png',
	'frowning.png',
	'heart.png',
	'smiley.png',
	'tongue.png',
	'cry.png',
	'confused.png',
	'innocent.png',
	'open_mouth.png',
	'sunglasses.png',
	'grimace.png',
	'neutral.png',
	'naughty.png',
	'clear.png',
	'image.png',
	'unknown.png'
]);

/**
 * Extract the filename from a URL (last path segment, stripped of query params).
 */
function filenameFromUrl(url) {
	if (!url) return '';
	return url.split('/').pop().split('?')[0];
}

/**
 * Returns true if the filename looks like a valid, real image file.
 * Rejects known bad filenames and filenames without a recognizable image extension.
 */
function isValidImageFilename(fn) {
	if (!fn) return false;
	if (INVALID_FILENAMES.has(fn)) return false;
	// Reject filenames without a file extension (Google Photos hashes, bare words, etc.)
	if (!/\.\w{2,5}$/.test(fn)) return false;
	return true;
}

/**
 * Returns true if the filename is suitable as a thread thumbnail.
 * Filters out emoji sprites and other non-content images in addition to
 * the basic validity check.
 */
function isValidThumbFilename(fn) {
	if (!isValidImageFilename(fn)) return false;
	if (EMOJI_FILENAMES.has(fn)) return false;
	return true;
}

// ─── Localization helpers ───────────────────────────────────────────────────────

function getThumbFromThread(thread) {
	if (thread.posts && thread.posts.length > 0) {
		const op = thread.posts[0];
		if (op.imageUrls && op.imageUrls.length > 0) {
			// Walk the image list to find the first valid, non-emoji image
			for (const url of op.imageUrls) {
				const fn = filenameFromUrl(url);
				if (isValidThumbFilename(fn)) {
					return 'images/' + fn;
				}
			}
		}
	}
	return '';
}

function localizeImageUrl(url) {
	if (!url) return '';
	const fn = filenameFromUrl(url);
	if (!isValidImageFilename(fn)) return '';
	return '/images/' + fn;
}

function localizeHtmlImages(html) {
	if (!html) return '';
	return html.replace(/src="([^"]+)"/g, (_, url) => {
		const localized = localizeImageUrl(url);
		// If the URL is invalid, clear the src to avoid creating
		// broken paths like /images/src that generate misleading 404s.
		if (!localized) return 'src=""';
		return 'src="' + localized + '"';
	});
}

function parseJsDataFile(filename) {
	console.log(`Reading ${filename}...`);
	const raw = readFileSync(join(ROOT, filename), 'utf8');
	// Strip "const ALL_THREADS_X = " prefix to get pure JSON array
	const jsonStart = raw.indexOf('[');
	if (jsonStart === -1) throw new Error(`Could not find JSON array start in ${filename}`);
	let jsonStr = raw.slice(jsonStart).trimEnd();
	// Strip trailing semicolon if present (these are JS files: `const X = [...];`)
	if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
	console.log(`Parsing JSON from ${filename} (${(raw.length / 1024 / 1024).toFixed(1)} MB)...`);
	return JSON.parse(jsonStr);
}

// ─── Main ───────────────────────────────────────────────────────────────────────

console.log('=== UO Forum Archive Data Extraction ===\n');

const threads1 = parseJsDataFile('alldata_1.js');
const threads2 = parseJsDataFile('alldata_2.js');
const allThreads = [...threads1, ...threads2];

console.log(`\nTotal threads: ${allThreads.length}`);

// Sort by discussionId descending (newest first)
allThreads.sort((a, b) => b.discussionId - a.discussionId);

// ─── Write individual thread files ──────────────────────────────────────────────

const threadsDir = join(ROOT, 'src/lib/data/threads');
mkdirSync(threadsDir, { recursive: true });

console.log(`\nWriting individual thread JSON files to src/lib/data/threads/...`);
let count = 0;
let filteredUrlCount = 0;
for (const thread of allThreads) {
	// Localize image URLs within the thread data
	const processed = {
		...thread,
		posts: thread.posts.map((post) => {
			const localizedUrls = (post.imageUrls || [])
				.map(localizeImageUrl)
				.filter((u) => u !== '');
			filteredUrlCount += (post.imageUrls || []).length - localizedUrls.length;
			return {
				...post,
				avatarUrl: localizeImageUrl(post.avatarUrl),
				messageHtml: localizeHtmlImages(post.messageHtml),
				imageUrls: localizedUrls
			};
		})
	};
	writeFileSync(join(threadsDir, `${thread.discussionId}.json`), JSON.stringify(processed));
	count++;
	if (count % 2000 === 0) console.log(`  ...${count} threads written`);
}
console.log(`  Done: ${count} thread files written.`);
console.log(`  Filtered out ${filteredUrlCount} invalid image URLs.`);

// ─── Build lightweight index ────────────────────────────────────────────────────

console.log('\nBuilding threads index...');
const index = allThreads.map((t) => ({
	id: t.discussionId,
	title: t.title,
	slug: slugify(t.title).slice(0, 80),
	category: t.category,
	categorySlug: slugify(t.category),
	author: t.opAuthor || '',
	date: t.opDate || '',
	datetime: t.opDatetime || '',
	postCount: t.postCount,
	thumb: getThumbFromThread(t)
}));

const thumbCount = index.filter((t) => t.thumb).length;
const emptyThumbCount = index.filter((t) => !t.thumb).length;
writeFileSync(join(ROOT, 'src/lib/data/threads-index.json'), JSON.stringify(index));
console.log(`  threads-index.json: ${index.length} entries (${thumbCount} with thumbnails, ${emptyThumbCount} without)`);

// ─── Build categories ───────────────────────────────────────────────────────────

console.log('\nBuilding categories...');
const catMap = new Map();
for (const t of index) {
	if (!catMap.has(t.category)) {
		catMap.set(t.category, { name: t.category, slug: slugify(t.category), count: 0 });
	}
	catMap.get(t.category).count++;
}

const categories = [...catMap.values()].sort((a, b) => b.count - a.count);
writeFileSync(join(ROOT, 'src/lib/data/categories.json'), JSON.stringify(categories, null, 2));
console.log(`  categories.json: ${categories.length} categories`);
categories.forEach((c) => console.log(`    ${c.name}: ${c.count} threads`));

console.log('\n=== Extraction complete! ===');
