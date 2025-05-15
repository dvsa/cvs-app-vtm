import { Directive, ElementRef, HostListener, OnInit, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import emojiRegex from 'emoji-regex';

@Directive({
	selector: '[appNoEmojis]',
})
export class NoEmojisDirective implements OnInit {
	private readonly el = inject(ElementRef);
	private readonly ngControl = inject(NgControl, { optional: true });
	private readonly emojiRegex = emojiRegex();

	ngOnInit() {
		// Prevents emojis being kept in ngModel see: https://angular.love/angular-forms-why-is-ngmodelchange-late-when-updating-ngmodel-value
		if (this.ngControl) {
			const initialOnChange = (this.ngControl.valueAccessor as any).onChange;
			(this.ngControl.valueAccessor as any).onChange = (value: string) =>
				initialOnChange(value.replace(this.emojiRegex, ''));
		}
	}

	@HostListener('input', ['$event'])
	onInput(event: Event) {
		const input = this.el.nativeElement;
		if (typeof input.value !== 'string') return;

		const value = input.value.replace(this.emojiRegex, '');
		this.el.nativeElement.value = value;

		event?.preventDefault();
		event?.stopPropagation();
		event?.stopImmediatePropagation();
	}
}
