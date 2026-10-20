import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
	selector: '[appSanitiseUnicode]',
})
export class SanitiseUnicodeDirective {
	private readonly el = inject(ElementRef);

	private sanitise(input: string): string {
		if (!input) return input;

		return (
			input
				.normalize('NFKC')
				.replace(/\p{Zs}/gu, ' ')
				// biome-ignore lint/suspicious/noMisleadingCharacterClass: regex intentionally contains unicode character sequences
				.replace(/[​-‍﻿]/g, '')
				.replace(/[^\x20-\x7E\r\n\t]/g, '')
				.trim()
		);
	}

	private applyClean(): void {
		const input = this.el.nativeElement as HTMLInputElement | HTMLTextAreaElement;

		const cleaned = this.sanitise(input.value);
		if (cleaned === input.value) return;

		input.value = cleaned;
		input.dispatchEvent(new Event('input', { bubbles: true }));
	}

	@HostListener('blur')
	onBlur(): void {
		this.applyClean();
	}

	@HostListener('paste')
	onPaste(): void {
		// Defer until pasted content is in the field
		setTimeout(() => this.applyClean());
	}
}
