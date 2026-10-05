import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { initialAppState } from '@/src/app/store';
import { selectBatchFailed } from '@/src/app/store/batch/batch.selectors';
import { createVehicleRecord, editingTechRecord } from '@/src/app/store/technical-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BatchSummaryComponent } from '../batch-summary.component';

describe('BatchSummaryComponent', () => {
	let component: BatchSummaryComponent;
	let fixture: ComponentFixture<BatchSummaryComponent>;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BatchSummaryComponent],
			providers: [provideRouter([]), provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		fixture = TestBed.createComponent(BatchSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('handleRetryFailed', () => {
		it('should not carry over a trailer ID from the editing tech record when creating a failed trailer', () => {
			store.overrideSelector(editingTechRecord, {
				techRecord_vehicleType: VehicleTypes.TRL,
				vin: 'PREVIOUSVIN',
				trailerId: 'C000001',
			} as any);
			store.overrideSelector(selectBatchFailed, [{ id: 'vehicle-1', vin: 'NEWVIN', failed: true } as any]);
			store.refreshState();
			const dispatchSpy = jest.spyOn(store, 'dispatch');

			component.handleRetryFailed();

			const action = dispatchSpy.mock.calls.find(([a]) => a.type === createVehicleRecord.type)?.[0] as ReturnType<
				typeof createVehicleRecord
			>;
			expect(action.vehicle.vin).toBe('NEWVIN');
			expect(action.vehicle).not.toHaveProperty('trailerId');
		});

		it('should use the vehicle trailer ID when provided', () => {
			store.overrideSelector(editingTechRecord, {
				techRecord_vehicleType: VehicleTypes.TRL,
				trailerId: 'C000001',
			} as any);
			store.overrideSelector(selectBatchFailed, [
				{ id: 'vehicle-1', vin: 'NEWVIN', trailerIdOrVrm: 'C000002', failed: true } as any,
			]);
			store.refreshState();
			const dispatchSpy = jest.spyOn(store, 'dispatch');

			component.handleRetryFailed();

			const action = dispatchSpy.mock.calls.find(([a]) => a.type === createVehicleRecord.type)?.[0] as ReturnType<
				typeof createVehicleRecord
			>;
			expect(action.vehicle).toHaveProperty('trailerId', 'C000002');
		});

		it('should not carry over a primary VRM from the editing tech record when creating a failed non-trailer', () => {
			store.overrideSelector(editingTechRecord, {
				techRecord_vehicleType: VehicleTypes.HGV,
				primaryVrm: 'AB12CDE',
			} as any);
			store.overrideSelector(selectBatchFailed, [{ id: 'vehicle-1', vin: 'NEWVIN', failed: true } as any]);
			store.refreshState();
			const dispatchSpy = jest.spyOn(store, 'dispatch');

			component.handleRetryFailed();

			const action = dispatchSpy.mock.calls.find(([a]) => a.type === createVehicleRecord.type)?.[0] as ReturnType<
				typeof createVehicleRecord
			>;
			expect(action.vehicle).not.toHaveProperty('primaryVrm');
		});
	});
});
