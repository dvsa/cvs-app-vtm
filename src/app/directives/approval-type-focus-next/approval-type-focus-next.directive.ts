import { Directive, ElementRef, HostListener, input } from '@angular/core';

@Directive({
	selector: '[appFocusNextApprovalType]',
	standalone: true,
})
export class ApprovalTypeFocusNextDirective {
	readonly nextInputId = input('', { alias: 'appFocusNextApprovalType' });
	readonly characterLimit = input(0);

	constructor(private el: ElementRef) {}

	@HostListener('input', ['$event'])
	onInput() {
		const { value } = this.el.nativeElement;
		if (value.length === this.characterLimit()) {
			const nextInput = document.getElementById(this.nextInputId());
			if (nextInput) {
				nextInput.focus();
			}
		}
	}
}
