import { Directive, HostListener } from '@angular/core';

@Directive({ selector: '[appTrimWhitespace]' })
export class TrimWhitespaceDirective {
	@HostListener('focusout', ['$event'])
	public onBlur(event: FocusEvent): void {
		const input = event.target as HTMLInputElement;
		const oldValue = input.value;
		input.value = input.value.trim();

		if (input.value !== oldValue) input.dispatchEvent(new Event('input'));
	}

	@HostListener('input', ['$event'])
	public onInput(event: Event): void {
		const input = event.target as HTMLInputElement;
		const oldValue = input.value;
		input.value = input.value.trim();

		if (input.value !== oldValue) input.dispatchEvent(new Event('input'));
	}

	@HostListener('paste', ['$event'])
	onPaste(event: ClipboardEvent): void {
		// Pasted text not part of the input value yet, so delay the trim
		setTimeout(() => {
			if (!(event.target instanceof HTMLInputElement)) return;

			const oldValue = event.target.value;
			event.target.value = event.target.value.trim();

			if (event.target.value !== oldValue) event.target.dispatchEvent(new Event('input'));
		}, 0);
	}
}
