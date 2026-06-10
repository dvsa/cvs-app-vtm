import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { initialAppState } from '@/src/app/store';
import { techRecord } from '@/src/app/store/technical-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { VehicleComponent } from '../vehicle.component';

describe('VehicleComponent', () => {
	let fixture: ComponentFixture<VehicleComponent>;
	let component: VehicleComponent;
	let store: MockStore;
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
		fixture = TestBed.createComponent(VehicleComponent);
		component = fixture.componentInstance;
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
				component.form.controls.odometerReading.clearValidators();
				component.addValidators();
				const control = component.form.controls.odometerReading;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(true);
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
				component.form.controls.odometerReadingUnits.clearValidators();
				component.addValidators();
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
	});
});
