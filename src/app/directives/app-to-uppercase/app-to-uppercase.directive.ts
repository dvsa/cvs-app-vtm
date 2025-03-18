import { Directive, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[appToUppercase]',
})
export class ToUppercaseDirective {
	@Input() uppercase?: boolean = true;

	@HostListener('focusout', ['$event.target'])
	public onBlur(input: HTMLInputElement): void {
		if (!this.uppercase) return;
		input.value = input.value.toUpperCase();
		input.dispatchEvent(new Event('input'));
	}
}
