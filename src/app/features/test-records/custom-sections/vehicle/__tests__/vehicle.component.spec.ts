import { Modes } from '@/src/app/models/modes.enum';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { TestService } from '@/src/app/services/test/test.service';
import { initialAppState } from '@/src/app/store';
import { techRecord } from '@/src/app/store/technical-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HazardClassification } from '@dvsa/cvs-type-definitions/types/enums/hazardClassification.enum.js';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { VehicleComponent } from '../vehicle.component';

describe('VehicleComponent', () => {
	let fixture: ComponentFixture<VehicleComponent>;
	let component: VehicleComponent;
	let store: MockStore;
	let testService: TestService;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [VehicleComponent],
			providers: [
				{ provide: ActivatedRoute, useValue: { params: of([{}]) } },
				{ provide: ControlContainer, useValue: formGroupDirective },
				{
					provide: MultiOptionsService,
					useValue: { getOptions: jest.fn(), loadOptions: jest.fn() },
				},
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		testService = TestBed.inject(TestService);
		testService.isAbandoning.set(false);
		fixture = TestBed.createComponent(VehicleComponent);
		component = fixture.componentInstance;
		// set required input prior to change detection to satisfy input.required<>() in the component
		fixture.componentRef.setInput('mode', Modes.CREATE);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('addValidators', () => {
		describe('countryOfRegistration', () => {
			it('should be invalid when empty', () => {
				const control = component.form.controls.countryOfRegistration;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('required');
			});

			it('should be valid when a value is provided', () => {
				const control = component.form.controls.countryOfRegistration;
				control.setValue('gb');
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('should be valid when empty and the test is being abandoned', () => {
				testService.isAbandoning.set(true);
				const control = component.form.controls.countryOfRegistration;
				control.setValue(null);
				control.markAsTouched();
				control.updateValueAndValidity();
				expect(control.valid).toBe(true);
			});
		});

		describe('euVehicleCategory', () => {
			it('should be invalid when empty', () => {
				const control = component.form.controls.euVehicleCategory;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('required');
			});

			it('should be valid when a value is provided', () => {
				const control = component.form.controls.euVehicleCategory;
				control.setValue(EUVehicleCategory.M1);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});
		});

		describe('odometerReading', () => {
			it('should be invalid when empty and vehicle is not a TRL', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				component.addValidators();
				const control = component.form.controls.odometerReading;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('required');
			});

			it('should be invalid when exceeding max value', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				component.addValidators();
				const control = component.form.controls.odometerReading;
				control.setValue(10000000);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('max');
			});

			it('should be valid when within range', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				component.addValidators();
				const control = component.form.controls.odometerReading;
				control.setValue(50000);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('should not have validators when vehicle is a TRL', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'trl' } as TechRecordType<'get'>);
				store.refreshState();
				component.addValidators();
				const control = component.form.controls.odometerReading;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('should not carry validators over from a previously viewed non-TRL vehicle', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				component.addValidators();

				store.overrideSelector(techRecord, { techRecord_vehicleType: 'trl' } as TechRecordType<'get'>);
				store.refreshState();
				component.addValidators();

				const control = component.form.controls.odometerReading;
				control.setValue(null);
				control.markAsTouched();
				control.updateValueAndValidity();
				expect(control.valid).toBe(true);
			});

			it('should be valid when empty and the test is being abandoned', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
				store.refreshState();
				component.addValidators();
				testService.isAbandoning.set(true);

				const control = component.form.controls.odometerReading;
				control.setValue(null);
				control.markAsTouched();
				control.updateValueAndValidity();
				expect(control.valid).toBe(true);
			});

			it('should still enforce the max value when the test is being abandoned', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
				store.refreshState();
				component.addValidators();
				testService.isAbandoning.set(true);

				const control = component.form.controls.odometerReading;
				control.setValue(10000000);
				control.markAsTouched();
				control.updateValueAndValidity();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('max');
			});
		});

		describe('odometerReadingUnits', () => {
			it('should be invalid when empty and vehicle is not a TRL', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				component.addValidators();
				const control = component.form.controls.odometerReadingUnits;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('required');
			});

			it('should be valid when a value is provided', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				component.addValidators();
				const control = component.form.controls.odometerReadingUnits;
				control.setValue('kilometres');
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('should not have validators when vehicle is a TRL', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'trl' } as TechRecordType<'get'>);
				store.refreshState();
				component.addValidators();
				const control = component.form.controls.odometerReadingUnits;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('should not carry validators over from a previously viewed non-TRL vehicle', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				component.addValidators();

				store.overrideSelector(techRecord, { techRecord_vehicleType: 'trl' } as TechRecordType<'get'>);
				store.refreshState();
				component.addValidators();

				const control = component.form.controls.odometerReadingUnits;
				control.setValue(null);
				control.markAsTouched();
				control.updateValueAndValidity();
				expect(control.valid).toBe(true);
			});

			it('should be valid when empty and the test is being abandoned', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
				store.refreshState();
				component.addValidators();
				testService.isAbandoning.set(true);

				const control = component.form.controls.odometerReadingUnits;
				control.setValue(null);
				control.markAsTouched();
				control.updateValueAndValidity();
				expect(control.valid).toBe(true);
			});
		});
	});

	describe('handlePrepopulateEuVehicleCategory', () => {
		it('should set euVehicleCategory to M1 if the vehicle type is CAR', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
			store.refreshState();
			component.form.controls.euVehicleCategory.setValue(null);
			component.form.controls.euVehicleCategory.enable();
			component.handlePrepopulateEuVehicleCategory();
			expect(component.form.controls.euVehicleCategory.value).toBe(EUVehicleCategory.M1);
			expect(component.form.controls.euVehicleCategory.disabled).toBe(true);
		});

		it('should set euVehicleCategory to N1 if the vehicle type is LGV', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'lgv' } as TechRecordType<'get'>);
			store.refreshState();
			component.form.controls.euVehicleCategory.setValue(null);
			component.form.controls.euVehicleCategory.enable();
			component.handlePrepopulateEuVehicleCategory();
			expect(component.form.controls.euVehicleCategory.value).toBe(EUVehicleCategory.N1);
			expect(component.form.controls.euVehicleCategory.disabled).toBe(true);
		});

		it('should not set euVehicleCategory if the vehicle type is not CAR or LGV', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
			store.refreshState();
			component.form.controls.euVehicleCategory.setValue(null);
			component.form.controls.euVehicleCategory.enable();
			component.handlePrepopulateEuVehicleCategory();
			expect(component.form.controls.euVehicleCategory.value).toBeNull();
			expect(component.form.controls.euVehicleCategory.disabled).toBe(false);
		});
	});

	describe('prepopulateHazardClassificationOptions', () => {
		it('should set undefined hazard classifications to null', () => {
			const vtg15 = component.form.controls.vtg15;
			// ensure controls are undefined
			vtg15.controls.primaryHazardClassification.setValue(undefined);
			vtg15.controls.secondaryHazardClassification.setValue(undefined);

			const patchSpy = jest.spyOn(vtg15, 'patchValue');
			component.prepopulateHazardClassificationOptions();

			expect(patchSpy).toHaveBeenCalledWith(
				{ primaryHazardClassification: null, secondaryHazardClassification: null },
				{ emitEvent: false }
			);

			expect(vtg15.controls.primaryHazardClassification.value).toBeNull();
			expect(vtg15.controls.secondaryHazardClassification.value).toBeNull();
		});

		it('should not patch when values are already normalized (unknown codes kept as-is)', () => {
			const vtg15 = component.form.controls.vtg15;
			const unknownPrimary = { code: '99', description: 'Not real' } as any;
			const unknownSecondary = { code: '98', description: 'Also not real' } as any;

			vtg15.controls.primaryHazardClassification.setValue(unknownPrimary);
			vtg15.controls.secondaryHazardClassification.setValue(unknownSecondary);

			const patchSpy = jest.spyOn(vtg15, 'patchValue');
			component.prepopulateHazardClassificationOptions();

			expect(patchSpy).not.toHaveBeenCalled();
			expect(vtg15.controls.primaryHazardClassification.value).toEqual(unknownPrimary);
			expect(vtg15.controls.secondaryHazardClassification.value).toEqual(unknownSecondary);
		});

		it('should replace plain objects with matching enum members', () => {
			const vtg15 = component.form.controls.vtg15;
			const plainPrimary = {
				code: HazardClassification._1.code,
				description: HazardClassification._1.description,
			} as any;
			const plainSecondary = {
				code: HazardClassification['_4.2'].code,
				description: HazardClassification['_4.2'].description,
			} as any;

			vtg15.controls.primaryHazardClassification.setValue(plainPrimary);
			vtg15.controls.secondaryHazardClassification.setValue(plainSecondary);

			const patchSpy = jest.spyOn(vtg15, 'patchValue');
			component.prepopulateHazardClassificationOptions();

			expect(patchSpy).toHaveBeenCalledWith(
				{
					primaryHazardClassification: HazardClassification._1,
					secondaryHazardClassification: HazardClassification['_4.2'],
				},
				{ emitEvent: false }
			);

			// confirm controls now reference the canonical enum members
			expect(vtg15.controls.primaryHazardClassification.value).toBe(HazardClassification._1);
			// secondary may be available under different property name depending on enum key; assert code match
			expect(vtg15.controls.secondaryHazardClassification.value.code).toBe(plainSecondary.code);
		});
	});

	describe('isOdometerReadingRequired', () => {
		it('should return true if the techRecord is not a TRL', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
			store.refreshState();
			expect(component.isOdometerReadingRequired()).toBe(true);
		});

		it('should return false if the techRecord is a TRL', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'trl' } as TechRecordType<'get'>);
			store.refreshState();
			expect(component.isOdometerReadingRequired()).toBe(false);
		});

		it('should return false if there is no techRecord', () => {
			store.overrideSelector(techRecord, null);
			store.refreshState();
			expect(component.isOdometerReadingRequired()).toBe(false);
		});

		it('should return false if the test is being abandoned', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
			store.refreshState();
			testService.isAbandoning.set(true);
			expect(component.isOdometerReadingRequired()).toBe(false);
		});
	});

	describe('isOdometerReadingUnitsRequired', () => {
		it('should return true if the techRecord is not a TRL', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
			store.refreshState();
			expect(component.isOdometerReadingUnitsRequired()).toBe(true);
		});

		it('should return false if the techRecord is a TRL', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'trl' } as TechRecordType<'get'>);
			store.refreshState();
			expect(component.isOdometerReadingUnitsRequired()).toBe(false);
		});

		it('should return false if there is no techRecord', () => {
			store.overrideSelector(techRecord, null);
			store.refreshState();
			expect(component.isOdometerReadingUnitsRequired()).toBe(false);
		});

		it('should return false if the test is being abandoned', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
			store.refreshState();
			testService.isAbandoning.set(true);
			expect(component.isOdometerReadingUnitsRequired()).toBe(false);
		});
	});
});
