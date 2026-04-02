import { Directive, HostListener, input } from '@angular/core';

@Directive({ selector: '[appToUppercase]' })
export class ToUppercaseDirective {
	readonly uppercase = input<boolean | undefined>(true);

	@HostListener('focusout', ['$event'])
	public onBlur(event: Event): void {
		if (!this.uppercase()) return;
		const input = event.target as HTMLInputElement;
		input.value = input.value.toUpperCase();
		input.dispatchEvent(new Event('input'));
	}
}
