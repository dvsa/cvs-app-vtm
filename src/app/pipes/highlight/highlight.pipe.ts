import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
	private sanitizer = inject(DomSanitizer);

	transform(value: string | null | undefined, term: string | null | undefined): SafeHtml {
		const text = value ?? '';
		const search = (term ?? '').trim();

		const escaped = this.escapeHtml(text);

		if (!search) {
			return this.sanitizer.bypassSecurityTrustHtml(escaped);
		}

		// match in the same escaped space as the text, otherwise a term containing
		// an escaped character (e.g. "&") would show it's raw form like "&amp;
		const pattern = new RegExp(`(${this.escapeRegExp(this.escapeHtml(search))})`, 'gi');

		const highlighted = escaped.replace(pattern, '<mark class="defect-tree__highlight">$1</mark>');

		return this.sanitizer.bypassSecurityTrustHtml(highlighted);
	}

	private escapeHtml(value: string): string {
		return value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	private escapeRegExp(value: string): string {
		return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}
}
