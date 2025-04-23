import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import emojiRegex from 'emoji-regex';

@Directive({
	selector: '[appNoEmojis]',
})
export class NoEmojisDirective {
	private readonly el = inject(ElementRef);
	private readonly emojiRegex = emojiRegex();

	@HostListener('input', ['$event']) onInputChange(event: Event) {
		const input = this.el.nativeElement.value;
		this.el.nativeElement.value = input.replace(this.emojiRegex, '');
		if (input !== this.el.nativeElement.value) {
			event.stopPropagation();
		}
	}
}
