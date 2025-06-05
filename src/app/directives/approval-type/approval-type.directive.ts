import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[appFocusOnCharacterLimit]',
})
export class FocusOnCharacterLimitDirective {
	@Input() nextElement: ElementRef | undefined;
	@Input() characterLimit = 0;

	@HostListener('input', ['$event.target.value'])
	onInput(value: string): void {
		if (value.length >= this.characterLimit && this.nextElement) {
			this.nextElement.nativeElement.focus();
		}
	}
}
