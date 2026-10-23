import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { GovukFormGroupAutocompleteComponent } from '../govuk-form-group-autocomplete.component';

// behaves like the real library: the select keeps its options under a new id and an input takes over the original id
const mockEnhanceSelectElement = jest.fn(({ selectElement, id }: { selectElement: HTMLSelectElement; id: string }) => {
	selectElement.id = `${selectElement.id}-select`;
	const input = document.createElement('input');
	input.id = id;
	selectElement.parentElement?.appendChild(input);
});

jest.mock('accessible-autocomplete/dist/accessible-autocomplete.min', () => ({
	__esModule: true,
	default: { enhanceSelectElement: (params: unknown) => mockEnhanceSelectElement(params as never) },
}));

@Component({
	selector: 'app-host',
	template: `
		<form [formGroup]="form">
			<govuk-form-group-autocomplete label="Country" formControlName="country" [options$]="options$" />
		</form>
	`,
	imports: [GovukFormGroupAutocompleteComponent, ReactiveFormsModule],
})
class HostComponent {
	form = new FormGroup({ country: new FormControl<string | null>('gb') });
	options$ = of([
		{ label: 'United Kingdom', value: 'gb' },
		{ label: 'France', value: 'fr' },
	]);
}

// lets the lazy library import resolve
const settle = () => new Promise((resolve) => setTimeout(resolve));

describe('GovukFormGroupAutocompleteComponent', () => {
	let fixture: ComponentFixture<HostComponent>;

	beforeEach(async () => {
		mockEnhanceSelectElement.mockClear();
		await TestBed.configureTestingModule({
			imports: [HostComponent],
			providers: [provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
		fixture = TestBed.createComponent(HostComponent);
	});

	it('should enhance the select once even if the value changes while the library is loading', async () => {
		fixture.detectChanges();
		fixture.componentInstance.form.patchValue({ country: 'fr' });
		await settle();

		expect(mockEnhanceSelectElement).toHaveBeenCalledTimes(1);
		expect(fixture.nativeElement.querySelectorAll('#country')).toHaveLength(1);
	});

	it('should set the form value from the confirmed option label', async () => {
		fixture.detectChanges();
		await settle();

		const { selectElement, onConfirm } = mockEnhanceSelectElement.mock.calls[0][0] as unknown as {
			selectElement: HTMLSelectElement;
			onConfirm: (selected: string) => void;
		};
		// the library confirms with the option's text content, so use exactly what was rendered
		const france = Array.from(selectElement.options).find((option) => option.value === 'fr');
		onConfirm(france?.textContent ?? '');

		expect(france?.textContent).toBe('France');
		expect(fixture.componentInstance.form.value.country).toBe('fr');
	});
});
