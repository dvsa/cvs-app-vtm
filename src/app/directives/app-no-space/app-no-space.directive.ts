import { Directive, HostListener } from '@angular/core';

@Directive({ selector: '[appNoSpace]' })
export class NoSpaceDirective {
	@HostListener('keydown', ['$event'])
	public onKeyDown(e: KeyboardEvent): void {
		if (e.key === ' ' || e.key === 'Space') {
			e.preventDefault();
		}
	}

	@HostListener('focusout', ['$event.target'])
	public onBlur(input: HTMLInputElement): void {
		const oldValue = input.value;
		input.value = input.value.replace(/\s/g, '');

		if (input.value !== oldValue) input.dispatchEvent(new Event('input'));
	}

	@HostListener('input', ['$event.target'])
	public onInput(input: HTMLInputElement): void {
		const oldValue = input.value;
		input.value = input.value.replace(/\s/g, '');

		if (input.value !== oldValue) input.dispatchEvent(new Event('input'));
	}
}
