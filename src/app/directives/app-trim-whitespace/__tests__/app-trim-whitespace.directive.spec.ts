import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TrimWhitespaceDirective } from '../app-trim-whitespace.directive';

@Component({
	template: ` <form [formGroup]="form"><input id="bar" appTrimWhitespace formControlName="foo" /></form>
    <input id="baz" appTrimWhitespace />`,
	imports: [FormsModule, ReactiveFormsModule, TrimWhitespaceDirective],
})
class TestComponent {
	form = new FormGroup({
		foo: new FormControl(),
	});
}

describe('TrimWhitespaceDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let input1: HTMLInputElement;
	let input2: HTMLInputElement;
	let component: TestComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		input1 = fixture.debugElement.query(By.css('#bar')).nativeElement;
		input2 = fixture.debugElement.query(By.css('#baz')).nativeElement;
		component = fixture.componentInstance;
	});

	describe('should trim whitespaces on focusout', () => {
		it('with form', () => {
			input1.value = 'this has spaces   ';
			input1.dispatchEvent(new Event('focusout'));

			expect(input1.value).toBe('this has spaces');
			expect(component.form.get('foo')?.value).toBe('this has spaces');
		});

		it('without form', () => {
			input2.value = 'this has spaces   ';
			input2.dispatchEvent(new Event('focusout'));

			expect(input2.value).toBe('this has spaces');
		});

		describe('it should dispatch the appropriate number of events', () => {
			it('if the value has changed', () => {
				const dispatchEventSpy = jest.spyOn(input1, 'dispatchEvent');
				input1.value = 'this has spaces   ';
				input1.dispatchEvent(new Event('focusout'));

				expect(dispatchEventSpy).toHaveBeenCalledTimes(2);
			});

			it('if the value has not changed', () => {
				const dispatchEventSpy = jest.spyOn(input1, 'dispatchEvent');
				input1.value = 'this has spaces';
				input1.dispatchEvent(new Event('focusout'));

				expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('should trim whitespaces on input', () => {
		it('should trim the values and update the form', () => {
			input1.value = 'this has spaces   ';
			input1.dispatchEvent(new Event('input'));

			expect(input1.value).toBe('this has spaces');
			expect(component.form.get('foo')?.value).toBe('this has spaces');
		});

		it('without form', () => {
			input2.value = 'this has spaces   ';
			input2.dispatchEvent(new Event('input'));

			expect(input2.value).toBe('this has spaces');
		});

		describe('it should dispatch the appropriate number of input events', () => {
			it('if the value has changed', () => {
				const dispatchEventSpy = jest.spyOn(input1, 'dispatchEvent');
				input1.value = 'this has spaces   ';
				input1.dispatchEvent(new Event('input'));

				expect(dispatchEventSpy).toHaveBeenCalledTimes(2);
			});

			it('if the value has not changed', () => {
				const dispatchEventSpy = jest.spyOn(input1, 'dispatchEvent');
				input1.value = 'this has spaces';
				input1.dispatchEvent(new Event('input'));

				expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
			});
		});
	});
});
