import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { HazardClassification } from '@dvsa/cvs-type-definitions/types/enums/hazardClassification.enum.js';
import { Vtg15Component } from '@forms/components/vtg15/vtg15.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { techRecord } from '@store/technical-records';
import { toEditOrNotToEdit } from '@store/test-records';

describe('VTG15Component', () => {
	let fixture: ComponentFixture<Vtg15Component>;
	let component: Vtg15Component;
	let formGroupDirective: FormGroupDirective;
	let store: MockStore;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [Vtg15Component],
			providers: [
				{ provide: ControlContainer, useValue: formGroupDirective },
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		fixture = TestBed.createComponent(Vtg15Component);
		component = fixture.componentInstance;
	});

	describe('vtgRequired', () => {
		it('should return true when vtg15Required control value is true', () => {
			component.form.controls.vtg15.controls.vtg15Required.setValue(true);
			expect(component.vtgRequired()).toBe(true);
		});

		it('should return false when vtg15Required control value is false', () => {
			component.form.controls.vtg15.controls.vtg15Required.setValue(false);
			expect(component.vtgRequired()).toBe(false);
		});

		it('should return false when vtg15Required control value is null', () => {
			component.form.controls.vtg15.controls.vtg15Required.setValue(null);
			expect(component.vtgRequired()).toBe(false);
		});

		it('should return false when vtg15Required control value is undefined', () => {
			component.form.controls.vtg15.controls.vtg15Required.setValue(undefined);
			expect(component.vtgRequired()).toBe(false);
		});
	});

	describe('initForm', () => {
		it('should return early when testResult is undefined', () => {
			store.overrideSelector(toEditOrNotToEdit, undefined);
			const patchValueSpy = jest.spyOn(component.form, 'patchValue');
			component.initForm();
			expect(patchValueSpy).not.toHaveBeenCalled();
		});

		it('should return early when testResult is null', () => {
			store.overrideSelector(toEditOrNotToEdit, null as any);
			const patchValueSpy = jest.spyOn(component.form, 'patchValue');
			component.initForm();
			expect(patchValueSpy).not.toHaveBeenCalled();
		});

		it('should patch form with vtg15 data when testResult has vtg15 property', () => {
			const vtg15Data = {
				vtg15Required: true,
				primaryHazardClassification: { code: '1', description: 'Explosive' },
				unNumber: 123,
			};
			const testResultData = {
				vtg15: vtg15Data,
			};
			store.overrideSelector(toEditOrNotToEdit, testResultData as any);
			const patchValueSpy = jest.spyOn(component.form, 'patchValue');
			component.initForm();
			expect(patchValueSpy).toHaveBeenCalledWith({
				vtg15: { ...vtg15Data, secondaryHazardClassification: undefined },
			});
		});

		it('should patch hazard classifications as the HazardClassification members the options are built from', () => {
			// The API returns equivalent but distinct objects; the select matches options by identity, so the
			// patched value has to be the enum member itself or the dropdown renders blank.
			store.overrideSelector(toEditOrNotToEdit, {
				vtg15: {
					vtg15Required: true,
					primaryHazardClassification: { code: '1', description: 'Explosive' },
					secondaryHazardClassification: { code: '4.2', description: 'Spontaneously combustible' },
				},
			} as any);

			component.initForm();

			const { primaryHazardClassification, secondaryHazardClassification } = component.form.controls.vtg15.controls;
			expect(primaryHazardClassification.value).toBe(HazardClassification._1);
			expect(secondaryHazardClassification.value).toBe(HazardClassification['_4.2']);
		});

		it('should keep a hazard classification whose code is not a known member', () => {
			const unknown = { code: '99', description: 'Not a real classification' };
			store.overrideSelector(toEditOrNotToEdit, {
				vtg15: { vtg15Required: true, primaryHazardClassification: unknown },
			} as any);

			component.initForm();

			expect(component.form.controls.vtg15.controls.primaryHazardClassification.value).toEqual(unknown);
		});

		it('should leave hazard classifications unset when the test result has none', () => {
			store.overrideSelector(toEditOrNotToEdit, { vtg15: { vtg15Required: false } } as any);

			component.initForm();

			const { primaryHazardClassification, secondaryHazardClassification } = component.form.controls.vtg15.controls;
			expect(primaryHazardClassification.value).toBeUndefined();
			expect(secondaryHazardClassification.value).toBeUndefined();
		});

		it('should set vtg15Required to true for HGV with dangerous goods', () => {
			store.overrideSelector(toEditOrNotToEdit, {} as any);
			store.overrideSelector(techRecord, {
				techRecord_vehicleType: 'hgv',
				techRecord_adrDetails_dangerousGoods: true,
			} as any);
			const patchValueSpy = jest.spyOn(component.form, 'patchValue');
			component.initForm();
			expect(patchValueSpy).toHaveBeenCalledWith({
				vtg15: { vtg15Required: true },
			});
		});

		it('should set vtg15Required to true for LGV with dangerous goods', () => {
			store.overrideSelector(toEditOrNotToEdit, {} as any);
			store.overrideSelector(techRecord, {
				techRecord_vehicleType: 'lgv',
				techRecord_adrDetails_dangerousGoods: true,
			} as any);
			const patchValueSpy = jest.spyOn(component.form, 'patchValue');
			component.initForm();
			expect(patchValueSpy).toHaveBeenCalledWith({
				vtg15: { vtg15Required: true },
			});
		});

		it('should set vtg15Required to true for TRL with dangerous goods', () => {
			store.overrideSelector(toEditOrNotToEdit, {} as any);
			store.overrideSelector(techRecord, {
				techRecord_vehicleType: 'trl',
				techRecord_adrDetails_dangerousGoods: true,
			} as any);
			const patchValueSpy = jest.spyOn(component.form, 'patchValue');
			component.initForm();
			expect(patchValueSpy).toHaveBeenCalledWith({
				vtg15: { vtg15Required: true },
			});
		});

		it('should not set vtg15Required when vehicle type does not match', () => {
			store.overrideSelector(toEditOrNotToEdit, {} as any);
			store.overrideSelector(techRecord, {
				techRecord_vehicleType: 'car',
				techRecord_adrDetails_dangerousGoods: true,
			} as any);
			const patchValueSpy = jest.spyOn(component.form, 'patchValue');
			component.initForm();
			expect(patchValueSpy).not.toHaveBeenCalled();
		});

		it('should not set vtg15Required when dangerous goods is false', () => {
			store.overrideSelector(toEditOrNotToEdit, {} as any);
			store.overrideSelector(techRecord, {
				techRecord_vehicleType: 'hgv',
				techRecord_adrDetails_dangerousGoods: false,
			} as any);
			const patchValueSpy = jest.spyOn(component.form, 'patchValue');
			component.initForm();
			expect(patchValueSpy).not.toHaveBeenCalled();
		});

		it('should not set vtg15Required when techRecord is undefined', () => {
			store.overrideSelector(toEditOrNotToEdit, {} as any);
			store.overrideSelector(techRecord, undefined);
			const patchValueSpy = jest.spyOn(component.form, 'patchValue');
			component.initForm();
			expect(patchValueSpy).not.toHaveBeenCalled();
		});

		it('should call detectChanges after patching form with vtg15 data', () => {
			const vtg15Data = {
				vtg15Required: true,
			};
			const testResultData = {
				vtg15: vtg15Data,
			};
			store.overrideSelector(toEditOrNotToEdit, testResultData as any);
			const detectChangesSpy = jest.spyOn(component.cdr, 'detectChanges');
			component.initForm();
			expect(detectChangesSpy).toHaveBeenCalled();
		});
	});

	describe('hazard classification dropdowns', () => {
		it('should not render a duplicate option for a retained hazard classification', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				vtg15: {
					vtg15Required: true,
					primaryHazardClassification: { code: '1', description: 'Explosive' },
					secondaryHazardClassification: { code: '1', description: 'Explosive' },
				},
			} as any);
			fixture.componentRef.setInput('edit', true);
			fixture.componentRef.setInput('data', { vin: 'ABC001' });

			fixture.detectChanges();

			const selects = fixture.nativeElement.querySelectorAll('select') as NodeListOf<HTMLSelectElement>;
			expect(selects).toHaveLength(2);

			for (const select of Array.from(selects)) {
				const explosiveOptions = Array.from(select.options).filter((option) => option.text === 'Explosive');
				expect(explosiveOptions).toHaveLength(1);
			}
		});

		it('should select the retained hazard classification rather than the placeholder', async () => {
			store.overrideSelector(toEditOrNotToEdit, {
				vtg15: {
					vtg15Required: true,
					primaryHazardClassification: { code: '4.2', description: 'Spontaneously combustible' },
				},
			} as any);
			fixture.componentRef.setInput('edit', true);
			fixture.componentRef.setInput('data', { vin: 'ABC001' });

			fixture.detectChanges();
			await fixture.whenStable();
			fixture.detectChanges();
			const [primary] = Array.from(fixture.nativeElement.querySelectorAll('select') as NodeListOf<HTMLSelectElement>);
			expect(primary.options[primary.selectedIndex].text).toBe('Spontaneously combustible');
		});
	});
});
