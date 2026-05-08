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

	describe('handlePrepopulateEuVehicleCategory', () => {
		it('should set euVehicleCategory to M1 if the vehicle type is CAR', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'car' } as TechRecordType<'get'>);
			store.refreshState();
			component.form.get('euVehicleCategory')?.setValue(null);
			component.handlePrepopulateEuVehicleCategory();
			expect(component.form.get('euVehicleCategory')?.value).toBe(EUVehicleCategory.M1);
		});

		it('should set euVehicleCategory to N1 if the vehicle type is LGV', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'lgv' } as TechRecordType<'get'>);
			store.refreshState();
			component.form.get('euVehicleCategory')?.setValue(null);
			component.handlePrepopulateEuVehicleCategory();
			expect(component.form.get('euVehicleCategory')?.value).toBe(EUVehicleCategory.N1);
		});

		it('should not set euVehicleCategory if the vehicle type is not CAR or LGV', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as TechRecordType<'get'>);
			store.refreshState();
			component.form.get('euVehicleCategory')?.setValue(null);
			component.handlePrepopulateEuVehicleCategory();
			expect(component.form.get('euVehicleCategory')?.value).toBeNull();
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
	});
});
