import { Directive, HostListener } from '@angular/core';

@Directive({ selector: '[appNoSpace]' })
export class NoSpaceDirective {
	@HostListener('keydown', ['$event'])
	public onKeyDown(e: KeyboardEvent): void {
		if (e.key === ' ' || e.key === 'Space') {
			e.preventDefault();
		}
	}

	@HostListener('focusout', ['$event'])
	public onBlur(event: Event): void {
		const input = event.target as HTMLInputElement;
		const oldValue = input.value;
		input.value = input.value.replace(/\s/g, '');

		if (input.value !== oldValue) input.dispatchEvent(new Event('input'));
	}

	@HostListener('input', ['$event'])
	public onInput(event: Event): void {
		const input = event.target as HTMLInputElement;
		const oldValue = input.value;
		input.value = input.value.replace(/\s/g, '');

		if (input.value !== oldValue) input.dispatchEvent(new Event('input'));
	}

	@HostListener('paste', ['$event'])
	onPaste(event: ClipboardEvent): void {
		// Pasted text not part of the input value yet, so delay the cut
		setTimeout(() => {
			if (!(event.target instanceof HTMLInputElement)) return;

			const oldValue = event.target.value;
			event.target.value = event.target.value.replace(/\s/g, '');

			if (event.target.value !== oldValue) event.target.dispatchEvent(new Event('input'));
		}, 0);
	}
}
