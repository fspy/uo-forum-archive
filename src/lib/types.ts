export interface ThreadIndex {
	id: number;
	title: string;
	slug: string;
	category: string;
	categorySlug: string;
	author: string;
	date: string;
	datetime: string;
	postCount: number;
	thumb: string;
}

export interface Post {
	postId: string;
	isOriginalPost: boolean;
	author: string;
	avatarUrl: string;
	datetime: string;
	displayDate: string;
	messageHtml: string;
	messageText: string;
	signature: string;
	imageUrls: string[];
}

export interface Thread {
	discussionId: number;
	title: string;
	category: string;
	url: string;
	postCount: number;
	opAuthor: string;
	opDate: string;
	opDatetime: string;
	posts: Post[];
}

export interface Category {
	name: string;
	slug: string;
	count: number;
}

export interface CategoryGroup {
	name: string;
	description: string;
	children: Category[];
	totalCount: number;
}
