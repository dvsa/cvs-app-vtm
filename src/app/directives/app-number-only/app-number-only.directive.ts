import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
	selector: '[appNumberOnly]',
	standalone: true,
})
export class NumberOnlyDirective {
	inputElement: HTMLInputElement;

	private navigationKeys = [
		'Backspace',
		'Delete',
		'Tab',
		'Escape',
		'Enter',
		'Home',
		'End',
		'ArrowLeft',
		'ArrowRight',
		'Clear',
		'Copy',
		'Paste',
	];

	constructor(private el: ElementRef) {
		this.inputElement = el.nativeElement;
	}

	@HostListener('keydown', ['$event'])
	onKeyDown(e: KeyboardEvent) {
		if (
			this.navigationKeys.indexOf(e.key) > -1 ||
			(e.key === 'a' && e.ctrlKey === true) ||
			(e.key === 'c' && e.ctrlKey === true) ||
			(e.key === 'v' && e.ctrlKey === true) ||
			(e.key === 'x' && e.ctrlKey === true) ||
			(e.key === 'a' && e.metaKey === true) ||
			(e.key === 'c' && e.metaKey === true) ||
			(e.key === 'v' && e.metaKey === true) ||
			(e.key === 'x' && e.metaKey === true)
		) {
			return;
		}
		if (e.key === ' ' || Number.isNaN(Number(e.key))) {
			e.preventDefault();
		}
	}
}
