import { PlatformLocation } from '@angular/common';
import { MockPlatformLocation } from '@angular/common/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToUppercaseDirective } from '../app-to-uppercase.directive';

@Component({
	template: `
		<form [formGroup]="form">
			<input appToUppercase formControlName="foo" />
			<input appToUppercase formControlName="bar" />
		</form>
	`,
	imports: [FormsModule, ReactiveFormsModule, ToUppercaseDirective],
})
class TestComponent {
	form = new FormGroup({
		foo: new FormControl(),
		bar: new FormControl(null, { updateOn: 'blur' }),
	});
}

describe('ToUppercaseDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let input: HTMLInputElement;
	let blurInput: HTMLInputElement;
	let component: TestComponent;

	function type(target: HTMLInputElement, value: string) {
		target.value = value;
		target.dispatchEvent(new Event('input', { bubbles: true }));
	}

	beforeEach(() => {
		fixture = TestBed.configureTestingModule({
			imports: [TestComponent],
			providers: [{ provide: PlatformLocation, useClass: MockPlatformLocation }],
		}).createComponent(TestComponent);
		fixture.detectChanges();

		[input, blurInput] = fixture.debugElement
			.queryAll(By.directive(ToUppercaseDirective))
			.map((element) => element.nativeElement);
		component = fixture.componentInstance;
	});

	it('should make the text uppercase on input', () => {
		input.value = 'lowercase';
		input.dispatchEvent(new Event('focusout'));

		expect(input.value).toBe('LOWERCASE');
		expect(component.form.get('foo')?.value).toBe('LOWERCASE');
	});

	it('should make the text uppercase as it is typed', () => {
		type(input, 'lowercase');

		expect(input.value).toBe('LOWERCASE');
		expect(component.form.get('foo')?.value).toBe('LOWERCASE');
	});

	it('should make the text uppercase for a control that takes its value on blur', () => {
		type(blurInput, 'lowercase');
		blurInput.dispatchEvent(new Event('blur'));
		blurInput.dispatchEvent(new Event('focusout'));

		expect(component.form.get('bar')?.value).toBe('LOWERCASE');
	});

	it('should leave the control alone when the field is left without being changed', () => {
		type(blurInput, 'lowercase');
		blurInput.dispatchEvent(new Event('blur'));
		blurInput.dispatchEvent(new Event('focusout'));

		const changes = jest.fn();
		component.form.get('bar')?.valueChanges.subscribe(changes);

		blurInput.dispatchEvent(new Event('blur'));
		blurInput.dispatchEvent(new Event('focusout'));

		expect(changes).not.toHaveBeenCalled();
	});

	it('should keep the cursor in place when typing into the middle of a value', () => {
		type(input, 'abcdef');

		// typing leaves the cursor after the character that was entered
		input.value = 'abcxdef';
		input.setSelectionRange(4, 4);
		input.dispatchEvent(new Event('input', { bubbles: true }));

		expect(input.value).toBe('ABCXDEF');
		expect(input.selectionStart).toBe(4);
	});
});
