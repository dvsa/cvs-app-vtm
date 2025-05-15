import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MultiOption } from '@models/options.model';
import { CustomFormControl, FormNodeTypes, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { Observable, of } from 'rxjs';
import { FieldErrorMessageComponent } from '../../field-error-message/field-error-message.component';
import { SuggestiveInputComponent } from '../suggestive-input.component';

@Component({
	selector: 'app-host-component',
	template: `<form [formGroup]="form">
    <app-suggestive-input name="foo" formControlName="foo" [options$]="options$"></app-suggestive-input>
  </form> `,
	imports: [FormsModule, ReactiveFormsModule, SuggestiveInputComponent, FieldErrorMessageComponent],
})
class HostComponent {
	form = new FormGroup({
		foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, ''),
	});
	options$: Observable<MultiOption[]> = of([
		{ label: 'Banana', value: 'banana' },
		{ label: 'Apple', value: 'apple' },
	]);
}

describe('SuggestiveInputComponent', () => {
	let component: HostComponent;
	let fixture: ComponentFixture<HostComponent>;
	let suggestiveInput: SuggestiveInputComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HostComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HostComponent);
		component = fixture.componentInstance;
		suggestiveInput = fixture.debugElement.query(By.directive(SuggestiveInputComponent)).componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('getters', () => {
		it('should retutn the correct class', () => {
			jest.spyOn(suggestiveInput, 'width').mockReturnValue(FormNodeWidth.L);
			expect(suggestiveInput.style).toBe('govuk-input govuk-input--width-10');
			jest.spyOn(suggestiveInput, 'width').mockReturnValue(undefined);
			expect(suggestiveInput.style).toBe('govuk-input');
		});
	});

	describe('SuggestiveInputComponent.prototype.handleChangeForOption.name', () => {
		it('should find matching option and patch value', async () => {
			await suggestiveInput.handleChangeForOption('Banana');
			expect(component.form.get('foo')?.value).toBe('banana');
		});

		it('should not find matching option and patch `[INVALID_OPTION]`, control should also be invalid', async () => {
			await suggestiveInput.handleChangeForOption('Orange');
			const foo = component.form.get('foo');
			expect(foo?.value).toBe('[INVALID_OPTION]');
			expect(foo?.invalid).toBeTruthy();
		});

		it('should not find matching option and patch empty string', async () => {
			await suggestiveInput.handleChangeForOption('');
			expect(component.form.get('foo')?.value).toBe('');
		});
	});
});
