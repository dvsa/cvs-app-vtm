import { Directive, HostListener } from '@angular/core';

@Directive({ selector: '[appTrimWhitespace]' })
export class TrimWhitespaceDirective {
	@HostListener('focusout', ['$event.target'])
	public onBlur(input: HTMLInputElement): void {
		const oldValue = input.value;
		input.value = input.value.trim();

		if (input.value !== oldValue) input.dispatchEvent(new Event('input'));
	}

	@HostListener('input', ['$event.target'])
	public onInput(input: HTMLInputElement): void {
		const oldValue = input.value;
		input.value = input.value.trim();

		if (input.value !== oldValue) input.dispatchEvent(new Event('input'));
	}
}
