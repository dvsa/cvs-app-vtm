import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { StatusCodes, TrailerFormType, VehicleTypes } from '@models/vehicle-tech-record.model';
import { updateTechRecordSuccess } from '../../technical-records';
import { updateBatch, upsertBatchVehicles } from '../batch.actions';
import { STORE_FEATURE_BATCH_KEY } from '../batch.feature';
import { batchReducer } from '../batch.reducer';
import * as selectors from '../batch.selectors';

describe('Batch selectors', () => {
	function createState() {
		const details = batchReducer(
			undefined,
			updateBatch({
				changes: {
					vehicleType: VehicleTypes.TRL,
					vehicleStatus: StatusCodes.PROVISIONAL,
					trlFormType: TrailerFormType.TES1,
					batchSize: 6,
				},
			})
		);
		const state = batchReducer(
			details,
			upsertBatchVehicles({
				vehicles: [
					{ id: 1, vin: 'VIN-CREATED', created: true },
					{ id: 2, vin: 'VIN-UPDATED', updated: true },
					{ id: 3, vin: 'VIN-PENDING', pending: true },
					{ id: 4, vin: 'VIN-FAILED', failed: true },
					{ id: 5, vin: '' },
					{ id: 6 },
				],
			})
		);
		return { [STORE_FEATURE_BATCH_KEY]: state };
	}

	it('returns batch details and vehicles in entity order', () => {
		const state = createState();
		const vehicles = selectors.selectBatchVehicles(state);
		expect(vehicles.map((vehicle) => vehicle.id)).toEqual([1, 2, 3, 4, 5, 6]);
		expect(selectors.selectBatchDetails(state)).toEqual({
			vehicleType: VehicleTypes.TRL,
			vehicleStatus: StatusCodes.PROVISIONAL,
			trlFormType: TrailerFormType.TES1,
			batchSize: 6,
			vehicles,
		});
		expect(selectors.selectBatchCount(state)).toBe(6);
	});

	it('excludes empty and missing VINs from complete vehicles', () => {
		expect(selectors.selectCompleteBatchVehicles(createState()).map((vehicle) => vehicle.id)).toEqual([1, 2, 3, 4]);
	});

	it.each([
		['pending', selectors.selectBatchPending, selectors.selectBatchPendingCount, [3]],
		['successful', selectors.selectBatchSuccess, selectors.selectBatchSuccessCount, [1, 2]],
		['failed', selectors.selectBatchFailed, selectors.selectBatchFailedCount, [4]],
		['created', selectors.selectBatchCreated, selectors.selectBatchCreatedCount, [1]],
		['updated', selectors.selectBatchUpdated, selectors.selectBatchUpdatedCount, [2]],
		['created successfully', selectors.selectBatchCreatedSuccess, selectors.selectBatchCreatedSuccessCount, [1]],
	] as const)('selects and counts %s vehicles', (_label, selectVehicles, selectCount, expectedIds) => {
		const state = createState();
		expect(selectVehicles(state).map((vehicle) => vehicle.id)).toEqual(expectedIds);
		expect(selectCount(state)).toBe(expectedIds.length);
	});

	it('counts successful updates produced by the reducer', () => {
		const rootState = createState();
		const state = batchReducer(
			rootState[STORE_FEATURE_BATCH_KEY],
			updateTechRecordSuccess({
				batchRecordId: 3,
				groupType: 'batch',
				vehicleTechRecord: {
					systemNumber: 'system-3',
					createdTimestamp: '2026-11-09T12:00:00Z',
					techRecord_vehicleType: VehicleTypes.TRL,
					techRecord_statusCode: StatusCodes.CURRENT,
					trailerId: 'C123456',
				} as TechRecordType<'get'>,
			})
		);
		const updatedRoot = { [STORE_FEATURE_BATCH_KEY]: state };

		expect(selectors.selectBatchUpdatedSuccess(updatedRoot).map((vehicle) => vehicle.id)).toEqual([2, 3]);
		expect(selectors.selectBatchUpdatedSuccessCount(updatedRoot)).toBe(2);
	});

	it('returns empty lists and zero counts for a new batch', () => {
		const state = { [STORE_FEATURE_BATCH_KEY]: batchReducer(undefined, { type: 'init' }) };
		expect(selectors.selectCompleteBatchVehicles(state)).toEqual([]);
		for (const selectCount of [
			selectors.selectBatchCount,
			selectors.selectBatchPendingCount,
			selectors.selectBatchSuccessCount,
			selectors.selectBatchFailedCount,
			selectors.selectBatchCreatedCount,
			selectors.selectBatchCreatedSuccessCount,
			selectors.selectBatchUpdatedCount,
			selectors.selectBatchUpdatedSuccessCount,
		]) {
			expect(selectCount(state)).toBe(0);
		}
	});

	it.each([
		[VehicleTypes.HGV, 'HGV'],
		[VehicleTypes.PSV, 'PSV'],
		[VehicleTypes.TRL, 'trailer'],
		[null, 'vehicle'],
	] as const)('describes a %s batch as %s', (vehicleType, descriptor) => {
		const state = batchReducer(undefined, updateBatch({ changes: { vehicleType } }));
		expect(selectors.selectBatchVehicleTypeDescriptor({ [STORE_FEATURE_BATCH_KEY]: state })).toBe(descriptor);
	});
});
