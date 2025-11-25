import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';

@Directive({
	selector: '[appFilterByTags]',
})
export class FilterByTagsDirective {
	filters = input.required<string[]>();
	tagNames = input.required<string[]>();

	renderer = inject(Renderer2);
	elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	constructor() {
		effect(() => {
			const element = this.elementRef.nativeElement;
			if (!element) return;

			const filters = this.filters();

			// If no filters are applied, show the element
			if (filters.length === 0) {
				return this.renderer.setStyle(element, 'display', 'initial');
			}

			const tagNames = this.tagNames();

			// If filters have been applied, but none match the tags, hide the element
			if (filters.every((filter) => !tagNames.includes(filter))) {
				return this.renderer.setStyle(element, 'display', 'none');
			}

			// Otherwise, show the element
			this.renderer.setStyle(element, 'display', 'initial');
		});
	}
}
