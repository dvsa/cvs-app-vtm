import { initialAppState } from '@store/index';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { of } from 'rxjs';
import { FieldErrorMessageComponent } from '../../field-error-message/field-error-message.component';
import { AutocompleteComponent } from '../autocomplete.component';

@Component({
	selector: 'app-autocomplete-host',
	template: `
    <form [formGroup]="form">
      <app-autocomplete [name]="name" [options$]="options$" formControlName="foo"></app-autocomplete>
    </form>
  `,
	imports: [AutocompleteComponent, FieldErrorMessageComponent, FormsModule, ReactiveFormsModule],
})
class AutocompleteHostComponent {
	name = 'autocomplete';
	options$ = of([
		{ label: 'option1', value: 'option1' },
		{ label: 'option2', value: 'option2' },
	]);
	form = new FormGroup({ foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL }, '') });
}

describe('AutocompleteComponent', () => {
	let component: AutocompleteHostComponent;
	let fixture: ComponentFixture<AutocompleteHostComponent>;
	let autocompleteComponent: AutocompleteComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AutocompleteHostComponent],
			providers: [provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AutocompleteHostComponent);
		component = fixture.componentInstance;
		autocompleteComponent = fixture.debugElement.query(By.directive(AutocompleteComponent)).componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it.each([
		['option1', of([{ label: 'option1', value: 'option1' }]), 'option1'],
		[undefined, of([{ label: 'option1', value: 'option1' }]), 'option3'],
	])('should return %s for %o when looking for $s', (expected, options$, label) => {
		component.options$ = options$;
		fixture.detectChanges();
		expect(autocompleteComponent.findOptionValue(label)).toBe(expected);
	});

	it('should call handleChange when input value changes', () => {
		const handleChangeSpy = vi.spyOn(autocompleteComponent, 'handleChange');
		const autocompleteInput: HTMLInputElement = fixture.debugElement.query(By.css(`#${component.name}`)).nativeElement;

		autocompleteInput.dispatchEvent(new Event('change'));

		expect(handleChangeSpy).toHaveBeenCalled();
	});

	it('should find option value by label and propagate to form control', () => {
		const findOptionValueSpy = vi.spyOn(autocompleteComponent, 'findOptionValue');
		const control = component.form.get('foo');

		autocompleteComponent.handleChange({ target: { value: 'option2' } } as unknown as Event);

		expect(findOptionValueSpy).toHaveBeenCalled();
		expect(control?.value).toBe('option2');
		expect(control?.touched).toBeTruthy();
	});

	it('should propagate null and reset to form control when input is cleared', () => {
		const findOptionValueSpy = vi.spyOn(autocompleteComponent, 'findOptionValue');
		const control = component.form.get('foo');

		autocompleteComponent.handleChange({ target: { value: '' } } as unknown as Event);

		expect(findOptionValueSpy).toHaveBeenCalled();
		expect(control?.value).toBeNull(); // use null to indicate the field is empty
		expect(control?.touched).toBe(false);
	});

	it('should propagate "[INVALID_OPTION]" to form control when value is not an option', () => {
		const findOptionValueSpy = vi.spyOn(autocompleteComponent, 'findOptionValue');
		const control = component.form.get('foo');

		autocompleteComponent.handleChange({ target: { value: 'option3' } } as unknown as Event);

		expect(findOptionValueSpy).toHaveBeenCalled();
		expect(control?.value).toBe('[INVALID_OPTION]');
		expect(control?.touched).toBeTruthy();
	});
});
