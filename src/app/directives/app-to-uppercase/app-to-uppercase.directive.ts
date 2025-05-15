import { Directive, HostListener, input } from '@angular/core';

@Directive({ selector: '[appToUppercase]' })
export class ToUppercaseDirective {
	readonly uppercase = input<boolean | undefined>(true);

	@HostListener('focusout', ['$event.target'])
	public onBlur(input: HTMLInputElement): void {
		if (!this.uppercase()) return;
		input.value = input.value.toUpperCase();
		input.dispatchEvent(new Event('input'));
	}
}
