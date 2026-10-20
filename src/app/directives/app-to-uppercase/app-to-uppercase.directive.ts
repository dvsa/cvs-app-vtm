import { Directive, HostListener, input } from '@angular/core';

@Directive({ selector: '[appToUppercase]' })
export class ToUppercaseDirective {
	readonly uppercase = input<boolean | undefined>(true);

	@HostListener('focusout', ['$event'])
	public onBlur(event: Event): void {
		this.applyUppercase(event);
	}

	private applyUppercase(event: Event): void {
		if (!this.uppercase()) return;

		const input = event.target as HTMLInputElement;
		const uppercased = input.value.toUpperCase();
		if (uppercased === input.value) return;

		// Uppercasing does not change the length of the value, so the cursor can keep its place
		const { selectionStart, selectionEnd } = input;
		input.value = uppercased;
		if (selectionStart !== null) input.setSelectionRange(selectionStart, selectionEnd);

		input.dispatchEvent(new Event('input'));
	}
}
