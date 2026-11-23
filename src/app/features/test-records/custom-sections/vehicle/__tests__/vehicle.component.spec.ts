import { Modes } from '@/src/app/models/modes.enum';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { TestService } from '@/src/app/services/test/test.service';
import { initialAppState } from '@/src/app/store';
import { techRecord } from '@/src/app/store/technical-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HazardClassification } from '@dvsa/cvs-type-definitions/types/enums/hazardClassification.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { toEditOrNotToEdit } from '@store/test-records';
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
					useValue: { getOptions: vi.fn(), loadOptions: vi.fn() },
				},
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		testService = TestBed.inject(TestService);
		testService.isAbandoning.set(false);
		fixture = TestBed.createComponent(VehicleComponent);
		component = fixture.componentInstance;
		testService.mode.set(Modes.EDIT);
		testService.initialMode.set(Modes.EDIT);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('validation', () => {
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

			it('rejects free text even when the test is being abandoned', () => {
				testService.isAbandoning.set(true);
				testService.countryOfRegistration.setValue('[INVALID_OPTION]');
				expect(testService.countryOfRegistration.errors).toHaveProperty(
					'invalidOption.message',
					'Country Of Registration is invalid'
				);
			});
		});

		it('accepts No for VTG15 and only validates hazard details when Yes is selected', () => {
			store.overrideSelector(techRecord, {
				techRecord_vehicleType: 'hgv',
				techRecord_adrDetails_dangerousGoods: true,
			} as TechRecordType<'get'>);
			store.refreshState();
			const vtg15 = testService.form.controls.vtg15;

			expect(testService.vtg15Required.errors).toHaveProperty('required.message', 'Select if a VTG15 is required');

			testService.vtg15Required.setValue(false);
			TestBed.tick();
			expect(vtg15.valid).toBe(true);

			testService.vtg15Required.setValue(true);
			TestBed.tick();
			expect(vtg15.invalid).toBe(true);
			expect(testService.primaryHazardClassification.errors).toHaveProperty('required');
			expect(testService.unNumber.errors).toHaveProperty('required');

			testService.primaryHazardClassification.setValue(HazardClassification._1);
			testService.unNumber.setValue('012');
			expect(testService.unNumber.errors).toHaveProperty('minLength.message', 'UN number must be 4 digits');
			testService.unNumber.setValue('0123');
			TestBed.tick();
			expect(vtg15.valid).toBe(true);
			expect(vtg15.getRawValue()).toMatchObject({
				vtg15Required: true,
				primaryHazardClassification: HazardClassification._1,
				unNumber: '0123',
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
				const control = component.form.controls.odometerReading;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('required');
			});

			it('should be invalid when exceeding max value', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				const control = component.form.controls.odometerReading;
				control.setValue(10000000);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.getError('max')?.message).toBe('Odometer Reading must be less than or equal to 9999999');
			});

			it('should be valid when within range', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				const control = component.form.controls.odometerReading;
				control.setValue(9999999);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('should not have validators when vehicle is a TRL', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'trl' } as TechRecordType<'get'>);
				store.refreshState();
				const control = component.form.controls.odometerReading;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('should not carry validators over from a previously viewed non-TRL vehicle', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();

				store.overrideSelector(techRecord, { techRecord_vehicleType: 'trl' } as TechRecordType<'get'>);
				store.refreshState();

				const control = component.form.controls.odometerReading;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('should be valid when empty and the test is being abandoned', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
				store.refreshState();
				testService.isAbandoning.set(true);

				const control = component.form.controls.odometerReading;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('should still enforce the max value when the test is being abandoned', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
				store.refreshState();
				testService.isAbandoning.set(true);

				const control = component.form.controls.odometerReading;
				control.setValue(10000000);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('max');
			});
		});

		describe('odometerReadingUnits', () => {
			it('should be invalid when empty and vehicle is not a TRL', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				const control = component.form.controls.odometerReadingUnits;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('required');
			});

			it('should be valid when a value is provided', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				const control = component.form.controls.odometerReadingUnits;
				control.setValue('kilometres');
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('should not have validators when vehicle is a TRL', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'trl' } as TechRecordType<'get'>);
				store.refreshState();
				const control = component.form.controls.odometerReadingUnits;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('should not carry validators over from a previously viewed non-TRL vehicle', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();

				store.overrideSelector(techRecord, { techRecord_vehicleType: 'trl' } as TechRecordType<'get'>);
				store.refreshState();

				const control = component.form.controls.odometerReadingUnits;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('should be valid when empty and the test is being abandoned', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
				store.refreshState();
				testService.isAbandoning.set(true);

				const control = component.form.controls.odometerReadingUnits;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});
		});
	});

	describe('handlePrepopulateEuVehicleCategory', () => {
		it('should set euVehicleCategory to M1 if the vehicle type is CAR', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
			store.refreshState();
			component.form.controls.euVehicleCategory.setValue(null);
			component.handlePrepopulateEuVehicleCategory();
			expect(component.form.controls.euVehicleCategory.value).toBe(EUVehicleCategory.M1);
			expect(component.form.controls.euVehicleCategory.disabled).toBe(true);
		});

		it('should set euVehicleCategory to N1 if the vehicle type is LGV', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'lgv' } as TechRecordType<'get'>);
			store.refreshState();
			component.form.controls.euVehicleCategory.setValue(null);
			component.handlePrepopulateEuVehicleCategory();
			expect(component.form.controls.euVehicleCategory.value).toBe(EUVehicleCategory.N1);
			expect(component.form.controls.euVehicleCategory.disabled).toBe(true);
		});

		it('should not set euVehicleCategory if the vehicle type is not CAR or LGV', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
			store.refreshState();
			component.form.controls.euVehicleCategory.setValue(null);
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

			const patchSpy = vi.spyOn(vtg15, 'patchValue');
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

			const patchSpy = vi.spyOn(vtg15, 'patchValue');
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

			const patchSpy = vi.spyOn(vtg15, 'patchValue');
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

	describe('odometer signal rules', () => {
		const setTest = (vehicle: 'hgv' | 'trl', testTypeId: string, testResult: TestResults) => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: vehicle } as TechRecordType<'get'>);
			store.overrideSelector(toEditOrNotToEdit, { testTypes: [{ testTypeId, testResult }] } as TestResultSchema);
			store.refreshState();
		};

		it('requires the reading and units on a standard amendment', () => {
			testService.mode.set(Modes.AMEND);
			setTest('hgv', '59', TestResults.PASS);
			expect(testService.odometerReading.getError('required')?.message).toBe('Odometer Reading is required');
			expect(testService.odometerReadingUnits.getError('required')?.message).toBe('Odometer Reading Units is required');
		});

		it('revalidates each IVA/MSVA field immediately when its partner changes, including a zero reading', () => {
			testService.mode.set(Modes.AMEND);
			setTest('hgv', '186', TestResults.PASS);
			const { odometerReading: reading, odometerReadingUnits: units } = testService;
			expect(reading.errors).toBeNull();
			expect(units.errors).toBeNull();

			reading.setValue(0);
			expect(units.getError('required')?.message).toBe('Odometer Reading Units is required with Odometer Reading');
			units.setValue('miles');
			expect(units.errors).toBeNull();
			reading.setValue(null);
			expect(reading.getError('required')?.message).toBe('Odometer Reading is required with Odometer Reading Units');

			setTest('hgv', '186', TestResults.ABANDONED);
			expect(reading.errors).toBeNull();
		});

		it('requires only the reading for abandoned group 12/14 amendments, and hides both fields for trailers', () => {
			testService.mode.set(Modes.AMEND);
			setTest('hgv', '117', TestResults.ABANDONED);
			const { odometerReading: reading, odometerReadingUnits: units } = testService;
			expect(reading.hasError('required')).toBe(true);
			expect(units.errors).toBeNull();

			setTest('trl', '117', TestResults.ABANDONED);
			expect(reading.fieldTree().hidden()).toBe(true);
			expect(units.fieldTree().hidden()).toBe(true);
			expect(reading.errors).toBeNull();
		});
	});
});
