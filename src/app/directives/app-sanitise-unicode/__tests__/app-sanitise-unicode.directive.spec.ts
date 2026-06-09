import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SanitiseUnicodeDirective } from '../app-sanitise-unicode.directive';

@Component({
	template: `
		<textarea id="textarea1" appSanitiseUnicode></textarea>
		<input id="input1" type="text" appSanitiseUnicode />
	`,
	imports: [FormsModule, ReactiveFormsModule, SanitiseUnicodeDirective],
})
class TestComponent {}

describe('SanitiseUnicodeDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let textarea: HTMLTextAreaElement;
	let input: HTMLInputElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		textarea = fixture.debugElement.query(By.css('#textarea1')).nativeElement;
		input = fixture.debugElement.query(By.css('#input1')).nativeElement;
	});

	describe('Whitespace normalization', () => {
		it('converts narrow no-break space (U+202F) to regular space', () => {
			textarea.value = 'weight range';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('weight range');
		});

		it('converts non-breaking space (U+00A0) to regular space', () => {
			textarea.value = 'test value';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('test value');
		});

		it('converts en quad (U+2000) to regular space', () => {
			textarea.value = 'test value';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('test value');
		});

		it('converts ideographic space (U+3000) to regular space', () => {
			textarea.value = 'test　value';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('test value');
		});

		it('removes zero-width space (U+200B)', () => {
			textarea.value = 'test​value';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('testvalue');
		});

		it('removes zero-width joiner (U+200D)', () => {
			textarea.value = 'test‍value';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('testvalue');
		});

		it('removes BOM (U+FEFF)', () => {
			textarea.value = 'test﻿value';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('testvalue');
		});
	});

	describe('Non-ASCII stripping', () => {
		it('strips smart single quotes', () => {
			textarea.value = 'test‘value’';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('testvalue');
		});

		it('strips smart double quotes', () => {
			textarea.value = 'test“value”';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('testvalue');
		});

		it('strips en dash (U+2013)', () => {
			textarea.value = '2700–3500';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('27003500');
		});

		it('strips em dash (U+2014)', () => {
			textarea.value = 'test—value';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('testvalue');
		});

		it('normalises ellipsis (U+2026) to three dots via NFKC', () => {
			textarea.value = 'test…value';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('test...value');
		});

		it('preserves ASCII printable chars', () => {
			textarea.value = 'abc 123 !@#$%^&*()_+-=[]{}|;:,.<>?/';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('abc 123 !@#$%^&*()_+-=[]{}|;:,.<>?/');
		});

		it('preserves newlines and tabs', () => {
			textarea.value = 'line1\nline2\tindented';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('line1\nline2\tindented');
		});
	});

	describe('Unicode normalization (NFKC)', () => {
		it('decomposes ligature fi (U+FB01) to ASCII fi', () => {
			textarea.value = 'ﬁle';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('file');
		});
	});

	describe('Trim', () => {
		it('trims leading whitespace', () => {
			textarea.value = '   test';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('test');
		});

		it('trims trailing whitespace', () => {
			textarea.value = 'test   ';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('test');
		});
	});

	describe('Event handling', () => {
		it('triggers on blur', () => {
			textarea.value = 'test value';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('test value');
		});

		it('triggers on paste (after setTimeout)', (done) => {
			textarea.value = 'test value';
			textarea.dispatchEvent(new Event('paste'));
			setTimeout(() => {
				expect(textarea.value).toBe('test value');
				done();
			}, 0);
		});

		it('dispatches synthetic input event when value changes', () => {
			const spy = jest.spyOn(textarea, 'dispatchEvent');
			textarea.value = 'test value';
			textarea.dispatchEvent(new Event('blur'));

			const inputCalls = spy.mock.calls.filter((call) => call[0].type === 'input');
			expect(inputCalls.length).toBeGreaterThan(0);
		});

		it('does not dispatch input event when value unchanged', () => {
			const spy = jest.spyOn(textarea, 'dispatchEvent');
			textarea.value = 'clean value';
			textarea.dispatchEvent(new Event('blur'));

			const inputCalls = spy.mock.calls.filter((call) => call[0].type === 'input');
			expect(inputCalls.length).toBe(0);
		});
	});

	describe('Element compatibility', () => {
		it('works with textarea', () => {
			textarea.value = 'test value';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('test value');
		});

		it('works with input', () => {
			input.value = 'test value';
			input.dispatchEvent(new Event('blur'));
			expect(input.value).toBe('test value');
		});
	});

	describe('Edge cases', () => {
		it('handles empty string', () => {
			textarea.value = '';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('');
		});

		it('handles clean ASCII string', () => {
			textarea.value = 'already clean';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('already clean');
		});

		it('handles real-world Word paste with narrow no-break spaces', () => {
			textarea.value = 'weight range =  2700 - 3500kg';
			textarea.dispatchEvent(new Event('blur'));
			expect(textarea.value).toBe('weight range =  2700 - 3500kg');
		});
	});
});
