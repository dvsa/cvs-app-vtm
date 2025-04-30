import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoSpaceDirective } from '../app-no-space.directive';

@Component({
	template: ` <form [formGroup]="form"><input id="bar" appNoSpace formControlName="foo" /></form>
    <input id="baz" appNoSpace />`,
	imports: [FormsModule, ReactiveFormsModule, NoSpaceDirective],
})
class TestComponent {
	form = new FormGroup({
		foo: new FormControl(),
	});
}

describe('NoSpaceDirective', () => {
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

	it('should create an instance', () => {
		expect(input1).toBeTruthy();
		expect(input2).toBeTruthy();
	});

	it('should prevent default event behaviour if a prohibited key is pressed', () => {
		const $event = new KeyboardEvent('keydown', { key: 'Space', cancelable: true });

		expect(input1.dispatchEvent($event)).toBe(false);
		expect($event.defaultPrevented).toBe(true);

		expect(input2.dispatchEvent($event)).toBe(false);
		expect($event.defaultPrevented).toBe(true);
	});

	it('should not prevent default event behaviour if a prohibited key is pressed', () => {
		const $event = new KeyboardEvent('keydown', { key: 'a', cancelable: true });

		expect(input1.dispatchEvent($event)).toBe(true);
		expect($event.defaultPrevented).toBe(false);

		expect(input2.dispatchEvent($event)).toBe(true);
		expect($event.defaultPrevented).toBe(false);
	});

	describe('should remove all whitespaces on focusout', () => {
		it('with form', () => {
			input1.value = 'this has spaces   ';
			input1.dispatchEvent(new Event('focusout'));

			expect(input1.value).toBe('thishasspaces');
			expect(component.form.get('foo')?.value).toBe('thishasspaces');
		});

		it('without form', () => {
			input2.value = 'this has spaces   ';
			input2.dispatchEvent(new Event('focusout'));

			expect(input2.value).toBe('thishasspaces');
		});

		describe('it should dispatch the appropriate number of input events', () => {
			it('if the value has changed', () => {
				const dispatchEventSpy = jest.spyOn(input1, 'dispatchEvent');
				input1.value = 'this has spaces   ';
				input1.dispatchEvent(new Event('focusout'));

				expect(dispatchEventSpy).toHaveBeenCalledTimes(2);
			});

			it('if the value has not changed', () => {
				const dispatchEventSpy = jest.spyOn(input1, 'dispatchEvent');
				input1.value = 'thishasspaces';
				input1.dispatchEvent(new Event('focusout'));

				expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('should remove all whitespaces on input', () => {
		it('with form', () => {
			input1.value = 'this has spaces   ';
			input1.dispatchEvent(new Event('input'));

			expect(input1.value).toBe('thishasspaces');
			expect(component.form.get('foo')?.value).toBe('thishasspaces');
		});

		it('without form', () => {
			input2.value = 'this has spaces   ';
			input2.dispatchEvent(new Event('input'));

			expect(input2.value).toBe('thishasspaces');
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
				input1.value = 'thishasspaces';
				input1.dispatchEvent(new Event('input'));

				expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
			});
		});
	});
});
