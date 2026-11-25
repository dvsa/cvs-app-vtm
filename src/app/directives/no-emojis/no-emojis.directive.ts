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
		const valueAccessor = this.ngControl?.valueAccessor as { onChange?: (value: unknown) => void } | null;
		const initialOnChange = valueAccessor?.onChange;
		if (!valueAccessor || !initialOnChange) return;

		valueAccessor.onChange = (value: unknown) =>
			initialOnChange(typeof value === 'string' ? value.replace(this.emojiRegex, '') : value);
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
