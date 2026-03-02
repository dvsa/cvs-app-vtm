import slugify from 'slugify';

export function formatHtmlId(id: string): string {
	return slugify(id, { lower: true, trim: true });
}
