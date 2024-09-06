import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[appFocusNext]',
})
export class DateFocusNextDirective {
	@Input() displayTime = false;

	constructor(private el: ElementRef) {}

	@HostListener('input', ['$event'])
	onInput() {
		const {
			nativeElement: { id, value },
		} = this.el;
		const segments = id.split('-');
		const next = this.getNextElement(segments.splice(-1)[0], value);

		if (next) {
			document.getElementById(`${segments.join('-')}${next}`)?.focus();
		}
	}

	private getNextElement(currentSegment: string, value: string): string | undefined {
		let nextEl;

		if (value.length === 2) {
			switch (currentSegment) {
				case 'day':
					nextEl = '-month';
					break;
				case 'month':
					nextEl = '-year';
					break;
				case 'hour':
					nextEl = '-minute';
					break;
				default:
			}
		} else if (value.length === 4 && this.displayTime && currentSegment === 'year') {
			nextEl = '-hour';
		}

		return nextEl;
	}
}
