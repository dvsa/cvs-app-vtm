import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
	selector: '[appFocusNextApprovalType]',
	standalone: true,
})
export class ApprovalTypeFocusNextDirective {
	el = inject(ElementRef);

	readonly nextInputId = input('', { alias: 'appFocusNextApprovalType' });
	readonly characterLimit = input(0);

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
