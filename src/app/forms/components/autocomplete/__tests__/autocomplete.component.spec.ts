import { initialAppState } from '@/src/app/store';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { Subject, of } from 'rxjs';
import { vi } from 'vitest';
import { FieldErrorMessageComponent } from '../../field-error-message/field-error-message.component';
import { AutocompleteComponent } from '../autocomplete.component';
import { ACCESSIBLE_AUTOCOMPLETE_LOADER } from '../load-accessible-autocomplete';

@Component({
	selector: 'app-host-component',
	template: `
    <form [formGroup]="form">
      <app-autocomplete [name]="name" [options$]="options$" formControlName="foo"></app-autocomplete>
    </form>
  `,
	imports: [AutocompleteComponent, FieldErrorMessageComponent, FormsModule, ReactiveFormsModule],
})
class HostComponent {
	name = 'autocomplete';
	options$ = of([
		{ label: 'option1', value: 'option1' },
		{ label: 'option2', value: 'option2' },
	]);
	form = new FormGroup({ foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL }, '') });
}

describe('AutocompleteComponent', () => {
	let component: HostComponent;
	let fixture: ComponentFixture<HostComponent>;
	let autocompleteComponent: AutocompleteComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HostComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				{
					provide: ACCESSIBLE_AUTOCOMPLETE_LOADER,
					useValue: vi.fn(() => Promise.resolve({ enhanceSelectElement: () => {} })),
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HostComponent);
		component = fixture.componentInstance;
		autocompleteComponent = fixture.debugElement.query(By.directive(AutocompleteComponent)).componentInstance;
		fixture.detectChanges();
	});

	it('should render option text exactly as the labels, as accessible-autocomplete matches on it', async () => {
		await fixture.whenStable();
		fixture.detectChanges();

		const select: HTMLSelectElement = fixture.debugElement.query(By.css(`#${component.name}`)).nativeElement;

		expect(Array.from(select.options).map((option) => option.textContent)).toEqual(['', 'option1', 'option2']);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load the library while options are pending and enhance only after both are ready', async () => {
		await fixture.whenStable();
		fixture.destroy();
		const options = new Subject<{ label: string; value: string }[]>();
		const enhanceSelectElement = vi.fn();
		const loader = vi.mocked(TestBed.inject(ACCESSIBLE_AUTOCOMPLETE_LOADER));
		loader.mockClear().mockResolvedValue({ enhanceSelectElement });
		fixture = TestBed.createComponent(HostComponent);
		fixture.componentInstance.options$ = options;
		fixture.detectChanges();

		expect(loader).toHaveBeenCalledOnce();
		await Promise.resolve();
		expect(enhanceSelectElement).not.toHaveBeenCalled();
		options.next([{ label: 'Ready', value: 'ready' }]);
		await fixture.whenStable();
		expect(enhanceSelectElement).toHaveBeenCalledOnce();
		expect(fixture.nativeElement.querySelector('option[value="ready"]').textContent).toBe('Ready');
	});

	it('should still render the options if the library fails to load', async () => {
		await fixture.whenStable();
		fixture.destroy();
		vi.mocked(TestBed.inject(ACCESSIBLE_AUTOCOMPLETE_LOADER)).mockRejectedValue(new Error('chunk unavailable'));
		fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(fixture.nativeElement.querySelector('option[value="option2"]').textContent).toBe('option2');
	});

	it.each([
		['option1', of([{ label: 'option1', value: 'option1' }]), 'option1'],
		[undefined, of([{ label: 'option1', value: 'option1' }]), 'option3'],
	])('should return %s for %o when looking for $s', (expected, options$, label) => {
		component.options$ = options$;
		fixture.detectChanges();
		expect(autocompleteComponent.findOptionValue(label)).toBe(expected);
	});

	it('should call handleChange when input value changes', async () => {
		await fixture.whenStable();
		fixture.detectChanges();

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
