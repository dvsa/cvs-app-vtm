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
			store.overrideSelector(toEditOrNotToEdit, undefined as any);
			const patchValueSpy = jest.spyOn(component.form, 'patchValue');
			component.initForm();
			expect(patchValueSpy).not.toHaveBeenCalled();
		});

		it('should map hazard classifications to enum members when present', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				vtg15: {
					vtg15Required: true,
					primaryHazardClassification: { code: '1', description: 'Explosive' },
					secondaryHazardClassification: { code: '4.2', description: 'Spontaneously combustible' },
				},
			} as any);

			component.initForm();

			const primary = component.form.controls.vtg15.controls.primaryHazardClassification.value;
			const secondary = component.form.controls.vtg15.controls.secondaryHazardClassification.value;

			expect(primary).toBe(HazardClassification._1);
			expect(secondary).toBe(HazardClassification['_4.2']);
		});

		it('should keep unknown hazard classification objects as-is', () => {
			const unknown = { code: '99', description: 'Not real' };
			store.overrideSelector(toEditOrNotToEdit, {
				vtg15: { vtg15Required: true, primaryHazardClassification: unknown },
			} as any);

			component.initForm();

			expect(component.form.controls.vtg15.controls.primaryHazardClassification.value).toEqual(unknown);
		});

		it('should call detectChanges after patching', () => {
			store.overrideSelector(toEditOrNotToEdit, { vtg15: { vtg15Required: true } } as any);
			const detectSpy = jest.spyOn(component.cdr, 'detectChanges');
			component.initForm();
			expect(detectSpy).toHaveBeenCalled();
		});
	});

	describe('isVTGRequiredMandatory', () => {
		it('returns false when amend input is true', () => {
			fixture.componentRef.setInput('amend', true);
			fixture.detectChanges();
			expect(component.isVTGRequiredMandatory()).toBe(false);
		});

		it.each(['hgv', 'lgv', 'trl'])('returns true when vehicle type %s and dangerous goods true', (type) => {
			fixture.componentRef.setInput('amend', false);
			store.overrideSelector(techRecord, {
				techRecord_vehicleType: type,
				techRecord_adrDetails_dangerousGoods: true,
			} as any);
			expect(component.isVTGRequiredMandatory()).toBe(true);
		});

		it('returns false when vehicle type does not match', () => {
			fixture.componentRef.setInput('amend', false);
			store.overrideSelector(techRecord, {
				techRecord_vehicleType: 'car',
				techRecord_adrDetails_dangerousGoods: true,
			} as any);
			expect(component.isVTGRequiredMandatory()).toBe(false);
		});

		it('returns false when dangerous goods false', () => {
			fixture.componentRef.setInput('amend', false);
			store.overrideSelector(techRecord, {
				techRecord_vehicleType: 'hgv',
				techRecord_adrDetails_dangerousGoods: false,
			} as any);
			expect(component.isVTGRequiredMandatory()).toBe(false);
		});

		it('returns false when techRecord undefined', () => {
			fixture.componentRef.setInput('amend', false);
			store.overrideSelector(techRecord, undefined);
			expect(component.isVTGRequiredMandatory()).toBe(false);
		});
	});
});
