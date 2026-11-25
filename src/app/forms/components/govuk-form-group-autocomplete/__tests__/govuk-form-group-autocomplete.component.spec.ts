import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ACCESSIBLE_AUTOCOMPLETE_LOADER } from '@forms/components/autocomplete/load-accessible-autocomplete';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import type { AutocompleteEnhanceParams } from 'accessible-autocomplete/dist/accessible-autocomplete.min';
import { Subject, defer, of } from 'rxjs';
import { vi } from 'vitest';
import { GovukFormGroupAutocompleteComponent } from '../govuk-form-group-autocomplete.component';

const enhanceCalls: AutocompleteEnhanceParams[] = [];
const mockEnhanceSelectElement = (params: AutocompleteEnhanceParams): void => {
	enhanceCalls.push(params);
	params.selectElement.id = `${params.selectElement.id}-select`;
	const input = document.createElement('input');
	input.id = params.id;
	params.selectElement.parentElement?.appendChild(input);
};

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

describe('GovukFormGroupAutocompleteComponent', () => {
	let fixture: ComponentFixture<HostComponent>;

	beforeEach(async () => {
		enhanceCalls.length = 0;
		await TestBed.configureTestingModule({
			imports: [HostComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				{
					provide: ACCESSIBLE_AUTOCOMPLETE_LOADER,
					useValue: vi.fn(() => Promise.resolve({ enhanceSelectElement: mockEnhanceSelectElement })),
				},
			],
		}).compileComponents();
		fixture = TestBed.createComponent(HostComponent);
	});

	it('should enhance the select once even if the value changes while the library is loading', async () => {
		fixture.detectChanges();
		fixture.componentInstance.form.patchValue({ country: 'fr' });
		await vi.waitFor(() => expect(enhanceCalls).toHaveLength(1));

		expect(enhanceCalls).toHaveLength(1);
		expect(fixture.nativeElement.querySelectorAll('#country')).toHaveLength(1);
	});

	it('should subscribe to options while the library loads and retain the latest form value', async () => {
		const library = Promise.withResolvers<{ enhanceSelectElement: typeof mockEnhanceSelectElement }>();
		vi.mocked(TestBed.inject(ACCESSIBLE_AUTOCOMPLETE_LOADER)).mockReturnValue(library.promise);
		const options = new Subject<{ label: string; value: string }[]>();
		const subscribe = vi.fn(() => options);
		fixture.componentInstance.options$ = defer(subscribe);
		fixture.detectChanges();

		expect(subscribe).toHaveBeenCalledOnce();
		options.next([{ label: 'France', value: 'fr' }]);
		fixture.componentInstance.form.patchValue({ country: 'fr' });
		expect(enhanceCalls).toHaveLength(0);
		library.resolve({ enhanceSelectElement: mockEnhanceSelectElement });
		await fixture.whenStable();
		expect(enhanceCalls).toHaveLength(1);
		expect(enhanceCalls[0].defaultValue).toBe('fr');
		expect(enhanceCalls[0].selectElement.querySelector('option[value="fr"]')?.textContent).toBe('France');
	});

	it('should render the plain select options if the library fails to load', async () => {
		vi.mocked(TestBed.inject(ACCESSIBLE_AUTOCOMPLETE_LOADER)).mockRejectedValue(new Error('chunk unavailable'));
		fixture.detectChanges();
		await fixture.whenStable();

		expect(enhanceCalls).toHaveLength(0);
		const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
		expect(select.querySelector('option[value="fr"]')?.textContent).toBe('France');
	});

	it('should not enhance a component destroyed while the library is loading', async () => {
		const library = Promise.withResolvers<{ enhanceSelectElement: typeof mockEnhanceSelectElement }>();
		vi.mocked(TestBed.inject(ACCESSIBLE_AUTOCOMPLETE_LOADER)).mockReturnValue(library.promise);
		fixture.detectChanges();
		fixture.destroy();
		library.resolve({ enhanceSelectElement: mockEnhanceSelectElement });
		await library.promise;
		await Promise.resolve();
		expect(enhanceCalls).toHaveLength(0);
	});

	it('should set the form value from the confirmed option label', async () => {
		fixture.detectChanges();
		await vi.waitFor(() => expect(enhanceCalls).toHaveLength(1));

		const { selectElement, onConfirm } = enhanceCalls[0];
		// the library confirms with the option's text content, so use exactly what was rendered
		const france = Array.from(selectElement.options).find((option) => option.value === 'fr');
		onConfirm(france?.textContent ?? '');

		expect(france?.textContent).toBe('France');
		expect(fixture.componentInstance.form.value.country).toBe('fr');
	});
});
