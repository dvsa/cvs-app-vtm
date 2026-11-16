import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { StatusCodes, TrailerFormType, VehicleTypes } from '@models/vehicle-tech-record.model';
import {
	createVehicleRecord,
	createVehicleRecordFailure,
	createVehicleRecordSuccess,
	updateTechRecord,
	updateTechRecordFailure,
	updateTechRecordSuccess,
} from '../../technical-records';
import { cancelBatch, updateBatch, upsertBatchVehicles } from '../batch.actions';
import { batchReducer, initialBatchState } from '../batch.reducer';

describe('Batch reducer', () => {
	function createState() {
		return batchReducer(
			undefined,
			upsertBatchVehicles({
				vehicles: [
					{ id: 1, vin: 'VIN-1', failed: true },
					{ id: 2, vin: 'VIN-2', pending: true },
				],
			})
		);
	}

	it('initialises an empty batch and ignores unrelated actions', () => {
		expect(batchReducer(undefined, { type: 'init' })).toEqual(initialBatchState);
		const state = createState();
		expect(batchReducer(state, { type: 'unrelated' })).toBe(state);
	});

	it('updates only the supplied batch details', () => {
		const state = createState();
		const result = batchReducer(
			state,
			updateBatch({
				changes: {
					vehicleType: VehicleTypes.TRL,
					vehicleStatus: StatusCodes.PROVISIONAL,
					trlFormType: TrailerFormType.TES1,
					batchSize: 2,
				},
			})
		);
		const resized = batchReducer(result, updateBatch({ changes: { batchSize: 3 } }));
		expect(resized).toEqual({
			...state,
			vehicleType: VehicleTypes.TRL,
			vehicleStatus: StatusCodes.PROVISIONAL,
			trlFormType: TrailerFormType.TES1,
			batchSize: 3,
		});
		expect(resized.entities).toBe(state.entities);
		expect(state.vehicleType).toBeNull();
	});

	it('merges existing vehicles by row ID and adds new rows without discarding other vehicles', () => {
		const state = createState();
		const result = batchReducer(
			state,
			upsertBatchVehicles({
				vehicles: [
					{ id: 1, vin: 'CORRECTED-VIN' },
					{ id: 3, vin: 'VIN-3' },
				],
			})
		);
		expect(result.ids).toEqual([1, 2, 3]);
		expect(result.entities[1]).toEqual({ id: 1, vin: 'CORRECTED-VIN', failed: true });
		expect(result.entities[2]).toBe(state.entities[2]);
		expect(state.entities[1]?.vin).toBe('VIN-1');
	});

	it('clears vehicles and all batch details on cancellation', () => {
		const state = batchReducer(
			createState(),
			updateBatch({
				changes: {
					vehicleType: VehicleTypes.HGV,
					vehicleStatus: StatusCodes.CURRENT,
					batchSize: 2,
				},
			})
		);
		expect(batchReducer(state, cancelBatch())).toEqual(initialBatchState);
		expect(state.ids).toEqual([1, 2]);
	});

	it.each([
		createVehicleRecord({ batchRecordId: 1, vehicle: { vin: 'VIN-1' } as TechRecordType<'put'> }),
		updateTechRecord({ batchRecordId: 1, systemNumber: 'system-1', createdTimestamp: 'timestamp', groupType: 'batch' }),
	])('marks only the requested row as pending for $type', (action) => {
		const state = createState();
		const result = batchReducer(state, action);
		expect(result.entities[1]).toEqual({ ...state.entities[1], pending: true });
		expect(result.entities[2]).toBe(state.entities[2]);
		expect(state.entities[1]?.pending).toBeUndefined();
	});

	describe.each([
		['create', true, false],
		['update', false, true],
	] as const)('%s success', (operation, created, updated) => {
		it.each([
			[VehicleTypes.TRL, { trailerId: 'C123456', primaryVrm: 'IGNORED' }, 'C123456'],
			[VehicleTypes.HGV, { primaryVrm: 'AB12CDE' }, 'AB12CDE'],
			[VehicleTypes.HGV, {}, ''],
		] as const)(
			'stores the returned identifiers and clears pending/failure for %s',
			(vehicleType, identifiers, trailerIdOrVrm) => {
				const state = batchReducer(
					createState(),
					upsertBatchVehicles({ vehicles: [{ id: 1, pending: true, created: !created, updated: !updated }] })
				);
				const vehicleTechRecord = {
					vin: 'VIN-1',
					systemNumber: 'system-1',
					createdTimestamp: '2026-11-09T12:00:00Z',
					techRecord_vehicleType: vehicleType,
					techRecord_statusCode: StatusCodes.CURRENT,
					...identifiers,
				} as TechRecordType<'get'>;
				const result = batchReducer(
					state,
					operation === 'create'
						? createVehicleRecordSuccess({ batchRecordId: 1, vehicleTechRecord })
						: updateTechRecordSuccess({ batchRecordId: 1, vehicleTechRecord, groupType: 'batch' })
				);

				expect(result.entities[1]).toEqual({
					id: 1,
					vin: 'VIN-1',
					pending: false,
					failed: false,
					created,
					updated,
					systemNumber: 'system-1',
					createdTimestamp: '2026-11-09T12:00:00Z',
					status: StatusCodes.CURRENT,
					trailerIdOrVrm,
				});
				expect(result.entities[2]).toBe(state.entities[2]);
				expect(state.entities[1]?.pending).toBe(true);
				expect(state.entities[1]?.failed).toBe(true);
			}
		);
	});

	it.each([
		createVehicleRecordFailure({
			batchRecordId: 2,
			vehicleRecord: {} as TechRecordType<'put'>,
			error: 'Create failed',
		}),
		updateTechRecordFailure({ batchRecordId: 2, error: 'Update failed' }),
	])('clears pending and records failure only for the affected row on $type', (action) => {
		const state = createState();
		const result = batchReducer(state, action);
		expect(result.entities[2]).toEqual({ id: 2, vin: 'VIN-2', pending: false, failed: true });
		expect(result.entities[1]).toBe(state.entities[1]);
		expect(state.entities[2]?.pending).toBe(true);
	});

	it.each([undefined, 99])('ignores actions with no matching batch row (%s)', (batchRecordId) => {
		const state = createState();
		const vehicleTechRecord = {
			systemNumber: 'single-record',
			techRecord_vehicleType: VehicleTypes.HGV,
		} as TechRecordType<'get'>;
		for (const action of [
			createVehicleRecord({ batchRecordId, vehicle: {} as TechRecordType<'put'> }),
			updateTechRecord({
				batchRecordId,
				systemNumber: 'single-record',
				createdTimestamp: 'timestamp',
				groupType: 'single',
			}),
			createVehicleRecordSuccess({ batchRecordId, vehicleTechRecord }),
			updateTechRecordSuccess({ batchRecordId, vehicleTechRecord, groupType: 'single' }),
			createVehicleRecordFailure({ batchRecordId, vehicleRecord: {} as TechRecordType<'put'>, error: 'Failed' }),
			updateTechRecordFailure({ batchRecordId, error: 'Failed' }),
		]) {
			expect(batchReducer(state, action)).toBe(state);
		}
	});
});
