import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { State, initialAppState } from '@/src/app/store';
import { selectTechRecord } from '@/src/app/store/technical-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { WeightsComponent } from '../weights.component';

describe('WeightsComponent', () => {
	let component: WeightsComponent;
	let fixture: ComponentFixture<WeightsComponent>;
	let store: MockStore<State>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WeightsComponent],
			providers: [provideMockStore({ initialState: initialAppState }), provideRouter([])],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		fixture = TestBed.createComponent(WeightsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('initForm', () => {
		beforeEach(() => {
			fixture.componentRef.setInput('edit', true);
			component.form.controls.weights.controls.designGrossVehicleWeight.patchValue(null);
			component.form.controls.weights.controls.designGrossVehicleWeight.enable();
			component.form.controls.weights.controls.designGrossAxleWeight.patchValue(undefined);
			component.form.controls.weights.controls.designGrossAxleWeight.enable();
			component.form.controls.weights.controls.designGrossTrainWeight.patchValue(undefined);
			component.form.controls.weights.controls.designGrossTrainWeight.enable();
		});

		describe('HGV behaviour', () => {
			it('should populate and disable the design gross vehicle weight field when it exists on the tech record', () => {
				store.overrideSelector(selectTechRecord, {
					techRecord_vehicleType: VehicleTypes.HGV,
					techRecord_grossDesignWeight: 1000,
				} as TechRecordType<'hgv'>);
				store.refreshState();

				component.initForm();
				expect(component.form.get('weights')?.get('designGrossVehicleWeight')?.getRawValue()).toBe(1000);
				expect(component.form.get('weights')?.get('designGrossVehicleWeight')?.disabled).toBe(true);
			});

			it('should populate and disable the design gross train weight field when it exists on the tech record', () => {
				store.overrideSelector(selectTechRecord, {
					techRecord_vehicleType: VehicleTypes.HGV,
					techRecord_trainDesignWeight: 1000,
				} as TechRecordType<'hgv'>);
				store.refreshState();

				component.initForm();
				expect(component.form.get('weights')?.get('designGrossTrainWeight')?.getRawValue()).toBe(1000);
				expect(component.form.get('weights')?.get('designGrossTrainWeight')?.disabled).toBe(true);
			});

			it('should not populate or disable the design gross train weight field when its value is 0', () => {
				store.overrideSelector(selectTechRecord, {
					techRecord_vehicleType: VehicleTypes.HGV,
					techRecord_trainDesignWeight: 0,
				} as TechRecordType<'hgv'>);
				store.refreshState();

				component.initForm();
				expect(component.form.get('weights')?.get('designGrossTrainWeight')?.getRawValue()).toBe(undefined);
				expect(component.form.get('weights')?.get('designGrossTrainWeight')?.disabled).toBe(false);
			});

			it('should not populate or disable the design gross train weight field when its value is null', () => {
				store.overrideSelector(selectTechRecord, {
					techRecord_vehicleType: VehicleTypes.HGV,
					techRecord_trainDesignWeight: null,
				} as TechRecordType<'hgv'>);
				store.refreshState();

				component.initForm();
				expect(component.form.get('weights')?.get('designGrossTrainWeight')?.getRawValue()).toBe(undefined);
				expect(component.form.get('weights')?.get('designGrossTrainWeight')?.disabled).toBe(false);
			});
		});

		describe('TRL behaviour', () => {
			it('should populate and disable the design gross vehicle weight field when it exists on the tech record', () => {
				store.overrideSelector(selectTechRecord, {
					techRecord_vehicleType: VehicleTypes.TRL,
					techRecord_grossDesignWeight: 1000,
				} as TechRecordType<'trl'>);
				store.refreshState();

				component.initForm();
				expect(component.form.get('weights')?.get('designGrossVehicleWeight')?.getRawValue()).toBe(1000);
				expect(component.form.get('weights')?.get('designGrossVehicleWeight')?.disabled).toBe(true);
			});

			it('should populate and disable the design gross total axle weight field when it exists on the tech record', () => {
				store.overrideSelector(selectTechRecord, {
					techRecord_vehicleType: VehicleTypes.TRL,
					techRecord_axles: [
						{
							weights_designWeight: 1000,
						},
						{
							weights_designWeight: 1000,
						},
					],
				} as TechRecordType<'trl'>);
				store.refreshState();

				component.initForm();
				expect(component.form.get('weights')?.get('designGrossAxleWeight')?.getRawValue()).toBe(2000);
				expect(component.form.get('weights')?.get('designGrossAxleWeight')?.disabled).toBe(true);
			});

			it('should not populate or disable the design total axle weight field when its value is 0', () => {
				store.overrideSelector(selectTechRecord, {
					techRecord_vehicleType: VehicleTypes.TRL,
					techRecord_axles: [
						{
							weights_designWeight: 0,
						},
						{
							weights_designWeight: 0,
						},
					],
				} as TechRecordType<'trl'>);
				store.refreshState();

				component.initForm();
				expect(component.form.get('weights')?.get('designGrossAxleWeight')?.getRawValue()).toBe(undefined);
				expect(component.form.get('weights')?.get('designGrossAxleWeight')?.disabled).toBe(false);
			});

			it('should not populate or disable the design total axle weight field when its value is null', () => {
				store.overrideSelector(selectTechRecord, {
					techRecord_vehicleType: VehicleTypes.TRL,
					techRecord_axles: [
						{
							weights_designWeight: null,
						},
						{
							weights_designWeight: null,
						},
					],
				} as TechRecordType<'trl'>);
				store.refreshState();

				component.initForm();
				expect(component.form.get('weights')?.get('designGrossAxleWeight')?.getRawValue()).toBe(undefined);
				expect(component.form.get('weights')?.get('designGrossAxleWeight')?.disabled).toBe(false);
			});
		});
	});

	describe('handleTrainWeightNotApplicable', () => {
		it('should set the designGrossTrainWeight to null when the value is true', () => {
			component.form.controls.weights.controls.designGrossTrainWeight.patchValue(1000);
			component.form.controls.weights.controls.designTrainWeightRequired.patchValue(undefined);
			component.handleTrainWeightNotApplicable(true);
			expect(component.form.controls.weights.controls.designGrossTrainWeight.getRawValue()).toBe(null);
			expect(component.form.controls.weights.controls.designTrainWeightRequired.getRawValue()).toBe(
				component.NOT_APPLICABLE
			);
		});

		it('should set the designTrainWeightRequired to undefined when the value is false', () => {
			component.form.controls.weights.controls.designGrossTrainWeight.patchValue(1000);
			component.form.controls.weights.controls.designTrainWeightRequired.patchValue(undefined);
			component.handleTrainWeightNotApplicable(false);
			expect(component.form.controls.weights.controls.designGrossTrainWeight.getRawValue()).toBe(1000);
			expect(component.form.controls.weights.controls.designTrainWeightRequired.getRawValue()).toBe(undefined);
		});
	});
});
