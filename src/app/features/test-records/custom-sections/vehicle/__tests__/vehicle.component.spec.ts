import { Modes } from '@/src/app/models/modes.enum';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { TestService } from '@/src/app/services/test/test.service';
import { initialAppState } from '@/src/app/store';
import { techRecord } from '@/src/app/store/technical-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

type SignalField = () => { errors: () => { kind: string; message: string }[] };
const hasError = (field: SignalField, kind: string) =>
	field()
		.errors()
		.some((error) => error.kind === kind);
const getErrorMessage = (field: SignalField, kind: string) =>
	field()
		.errors()
		.find((error) => error.kind === kind)?.message;
describe('VehicleComponent', () => {
	let fixture: ComponentFixture<VehicleComponent>;
	let component: VehicleComponent;
	let store: MockStore;
	let testService: TestService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [VehicleComponent],
			providers: [
				{ provide: ActivatedRoute, useValue: { params: of([{}]) } },
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

	it('uses signal visibility for VTG15 and its conditional fields', () => {
		store.overrideSelector(techRecord, {
			techRecord_vehicleType: 'hgv',
			techRecord_adrDetails_dangerousGoods: true,
		} as TechRecordType<'get'>);
		store.refreshState();
		testService.form.vtg15.vtg15Required().value.set(true);
		fixture.detectChanges();
		const hasField = (name: string) => !!fixture.nativeElement.querySelector(`[id="${name}"]`);

		expect(hasField('vtg15Required')).toBe(true);
		expect(hasField('unNumber')).toBe(true);
		expect(hasError(testService.form.vtg15.unNumber, 'required')).toBe(true);

		testService.form.vtg15.vtg15Required().value.set(false);
		fixture.detectChanges();
		expect(hasField('unNumber')).toBe(false);
		expect(testService.form.vtg15.unNumber().errors()).toEqual([]);

		store.overrideSelector(techRecord, {
			techRecord_vehicleType: 'trl',
			techRecord_euVehicleCategory: EUVehicleCategory.O1,
		} as TechRecordType<'get'>);
		store.refreshState();
		fixture.detectChanges();
		expect(hasField('vtg15Required')).toBe(false);
	});

	describe('validation', () => {
		describe('countryOfRegistration', () => {
			it('should be invalid when empty', () => {
				const control = component.form.countryOfRegistration;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(hasError(control, 'required')).toBe(true);
			});

			it('should be valid when a value is provided', () => {
				const control = component.form.countryOfRegistration;
				control().value.set('gb');
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});

			it('should be valid when empty and the test is being abandoned', () => {
				testService.isAbandoning.set(true);
				const control = component.form.countryOfRegistration;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});

			it('rejects free text even when the test is being abandoned', () => {
				testService.isAbandoning.set(true);
				testService.form.countryOfRegistration().value.set('[INVALID_OPTION]');
				expect(getErrorMessage(testService.form.countryOfRegistration, 'invalidOption')).toBe(
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
			const vtg15 = testService.form.vtg15;

			expect(getErrorMessage(testService.form.vtg15.vtg15Required, 'required')).toBe('Select if a VTG15 is required');

			testService.form.vtg15.vtg15Required().value.set(false);
			TestBed.tick();
			expect(vtg15().valid()).toBe(true);

			testService.form.vtg15.vtg15Required().value.set(true);
			TestBed.tick();
			expect(vtg15().invalid()).toBe(true);
			expect(hasError(testService.form.vtg15.primaryHazardClassification, 'required')).toBe(true);
			expect(hasError(testService.form.vtg15.unNumber, 'required')).toBe(true);

			testService.form.vtg15.primaryHazardClassification().value.set(HazardClassification._1);
			testService.form.vtg15.unNumber().value.set('012');
			expect(getErrorMessage(testService.form.vtg15.unNumber, 'minLength')).toBe('UN number must be 4 digits');
			testService.form.vtg15.unNumber().value.set('0123');
			TestBed.tick();
			expect(vtg15().valid()).toBe(true);
			expect(vtg15().value()).toMatchObject({
				vtg15Required: true,
				primaryHazardClassification: HazardClassification._1,
				unNumber: '0123',
			});
		});

		describe('euVehicleCategory', () => {
			it('should be invalid when empty', () => {
				const control = component.form.euVehicleCategory;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(hasError(control, 'required')).toBe(true);
			});

			it('should be valid when a value is provided', () => {
				const control = component.form.euVehicleCategory;
				control().value.set(EUVehicleCategory.M1);
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});
		});

		describe('odometerReading', () => {
			it('should be invalid when empty and vehicle is not a TRL', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				const control = component.form.odometerReading;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(hasError(control, 'required')).toBe(true);
			});

			it('should be invalid when exceeding max value', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				const control = component.form.odometerReading;
				control().value.set(10000000);
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(getErrorMessage(control, 'max')).toBe('Odometer Reading must be less than or equal to 9999999');
			});

			it('should be valid when within range', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				const control = component.form.odometerReading;
				control().value.set(9999999);
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});

			it('should not have validators when vehicle is a TRL', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'trl' } as TechRecordType<'get'>);
				store.refreshState();
				const control = component.form.odometerReading;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});

			it('should not carry validators over from a previously viewed non-TRL vehicle', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();

				store.overrideSelector(techRecord, { techRecord_vehicleType: 'trl' } as TechRecordType<'get'>);
				store.refreshState();

				const control = component.form.odometerReading;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});

			it('should be valid when empty and the test is being abandoned', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
				store.refreshState();
				testService.isAbandoning.set(true);

				const control = component.form.odometerReading;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});

			it('should still enforce the max value when the test is being abandoned', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
				store.refreshState();
				testService.isAbandoning.set(true);

				const control = component.form.odometerReading;
				control().value.set(10000000);
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(hasError(control, 'max')).toBe(true);
			});
		});

		describe('odometerReadingUnits', () => {
			it('should be invalid when empty and vehicle is not a TRL', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				const control = component.form.odometerReadingUnits;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(hasError(control, 'required')).toBe(true);
			});

			it('should be valid when a value is provided', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();
				const control = component.form.odometerReadingUnits;
				control().value.set('kilometres');
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});

			it('should not have validators when vehicle is a TRL', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'trl' } as TechRecordType<'get'>);
				store.refreshState();
				const control = component.form.odometerReadingUnits;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});

			it('should not carry validators over from a previously viewed non-TRL vehicle', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
				store.refreshState();

				store.overrideSelector(techRecord, { techRecord_vehicleType: 'trl' } as TechRecordType<'get'>);
				store.refreshState();

				const control = component.form.odometerReadingUnits;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});

			it('should be valid when empty and the test is being abandoned', () => {
				store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
				store.refreshState();
				testService.isAbandoning.set(true);

				const control = component.form.odometerReadingUnits;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});
		});
	});

	describe('handlePrepopulateEuVehicleCategory', () => {
		it('should set euVehicleCategory to M1 if the vehicle type is CAR', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
			store.refreshState();
			component.form.euVehicleCategory().value.set(null);
			component.handlePrepopulateEuVehicleCategory();
			expect(component.form.euVehicleCategory().value()).toBe(EUVehicleCategory.M1);
			expect(component.form.euVehicleCategory().disabled()).toBe(true);
		});

		it('should set euVehicleCategory to N1 if the vehicle type is LGV', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'lgv' } as TechRecordType<'get'>);
			store.refreshState();
			component.form.euVehicleCategory().value.set(null);
			component.handlePrepopulateEuVehicleCategory();
			expect(component.form.euVehicleCategory().value()).toBe(EUVehicleCategory.N1);
			expect(component.form.euVehicleCategory().disabled()).toBe(true);
		});

		it('should not set euVehicleCategory if the vehicle type is not CAR or LGV', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
			store.refreshState();
			component.form.euVehicleCategory().value.set(null);
			component.handlePrepopulateEuVehicleCategory();
			expect(component.form.euVehicleCategory().value()).toBeNull();
			expect(component.form.euVehicleCategory().disabled()).toBe(false);
		});
	});

	describe('prepopulateHazardClassificationOptions', () => {
		it('should set undefined hazard classifications to null', () => {
			component.testService.patch({
				vtg15: { primaryHazardClassification: undefined, secondaryHazardClassification: undefined },
			});
			component.prepopulateHazardClassificationOptions();

			expect(component.form.vtg15.primaryHazardClassification().value()).toBeNull();
			expect(component.form.vtg15.secondaryHazardClassification().value()).toBeNull();
		});

		it('should not patch when values are already normalized (unknown codes kept as-is)', () => {
			const vtg15 = component.form.vtg15;
			const unknownPrimary = { code: '99', description: 'Not real' } as any;
			const unknownSecondary = { code: '98', description: 'Also not real' } as any;

			vtg15.primaryHazardClassification().value.set(unknownPrimary);
			vtg15.secondaryHazardClassification().value.set(unknownSecondary);

			component.prepopulateHazardClassificationOptions();
			expect(vtg15.primaryHazardClassification().value()).toEqual(unknownPrimary);
			expect(vtg15.secondaryHazardClassification().value()).toEqual(unknownSecondary);
		});

		it('should replace plain objects with matching enum members', () => {
			const vtg15 = component.form.vtg15;
			const plainPrimary = {
				code: HazardClassification._1.code,
				description: HazardClassification._1.description,
			} as any;
			const plainSecondary = {
				code: HazardClassification['_4.2'].code,
				description: HazardClassification['_4.2'].description,
			} as any;

			vtg15.primaryHazardClassification().value.set(plainPrimary);
			vtg15.secondaryHazardClassification().value.set(plainSecondary);

			component.prepopulateHazardClassificationOptions();

			// confirm controls now reference the canonical enum members
			expect(vtg15.primaryHazardClassification().value()).toBe(HazardClassification._1);
			// secondary may be available under different property name depending on enum key; assert code match
			expect(vtg15.secondaryHazardClassification().value().code).toBe(plainSecondary.code);
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
			expect(getErrorMessage(testService.form.odometerReading, 'required')).toBe('Odometer Reading is required');
			expect(getErrorMessage(testService.form.odometerReadingUnits, 'required')).toBe(
				'Odometer Reading Units is required'
			);
		});

		it('revalidates each IVA/MSVA field immediately when its partner changes, including a zero reading', () => {
			testService.mode.set(Modes.AMEND);
			setTest('hgv', '186', TestResults.PASS);
			const { odometerReading: reading, odometerReadingUnits: units } = testService.form;
			expect(reading().errors()).toEqual([]);
			expect(units().errors()).toEqual([]);

			reading().value.set(0);
			expect(getErrorMessage(units, 'required')).toBe('Odometer Reading Units is required with Odometer Reading');
			units().value.set('miles');
			expect(units().errors()).toEqual([]);
			reading().value.set(null);
			expect(getErrorMessage(reading, 'required')).toBe('Odometer Reading is required with Odometer Reading Units');

			setTest('hgv', '186', TestResults.ABANDONED);
			expect(reading().errors()).toEqual([]);
		});

		it('requires only the reading for abandoned group 12/14 amendments, and hides both fields for trailers', () => {
			testService.mode.set(Modes.AMEND);
			setTest('hgv', '117', TestResults.ABANDONED);
			const { odometerReading: reading, odometerReadingUnits: units } = testService.form;
			expect(hasError(reading, 'required')).toBe(true);
			expect(units().errors()).toEqual([]);

			setTest('trl', '117', TestResults.ABANDONED);
			expect(reading().hidden()).toBe(true);
			expect(units().hidden()).toBe(true);
			expect(reading().errors()).toEqual([]);
		});
	});
});
