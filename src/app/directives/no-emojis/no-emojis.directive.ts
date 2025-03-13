import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
	selector: '[appNoEmojis]',
})
export class NoEmojisDirective {
	private readonly el = inject(ElementRef);
	private readonly emojiRegex = /\p{Extended_Pictographic}/gu;

	@HostListener('input', ['$event']) onInputChange(event: Event) {
		const input = this.el.nativeElement.value;
		this.el.nativeElement.value = input.replace(this.emojiRegex, '');
		if (input !== this.el.nativeElement.value) {
			event.stopPropagation();
		}
	}
}
