import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToUppercaseDirective } from '../app-to-uppercase.directive';

@Component({
	template: ' <form [formGroup]="form"><input appToUppercase formControlName="foo" /></form>',
	imports: [FormsModule, ReactiveFormsModule, ToUppercaseDirective],
})
class TestComponent {
	form = new FormGroup({
		foo: new FormControl(),
	});
}

describe('ToUppercaseDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let input: HTMLInputElement;
	let component: TestComponent;

	beforeEach(() => {
		fixture = TestBed.configureTestingModule({
			imports: [TestComponent],
		}).createComponent(TestComponent);
		fixture.detectChanges();

		input = fixture.debugElement.query(By.directive(ToUppercaseDirective)).nativeElement;
		component = fixture.componentInstance;
	});

	it('should make the text uppercase on input', () => {
		input.value = 'lowercase';
		input.dispatchEvent(new Event('focusout'));

		expect(input.value).toBe('LOWERCASE');
		expect(component.form.get('foo')?.value).toBe('LOWERCASE');
	});
});
