import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { StatusCodes, TrailerFormType, VehicleTypes } from '@models/vehicle-tech-record.model';
import * as actions from '../batch-create.actions';
import { batchAdapter, initialBatchState } from '../batch-create.reducer';
import * as selectors from '../batch-create.selectors';
import { createVehicleRecordSuccess, updateTechRecordSuccess } from '../technical-record-service.actions';
import {
	STORE_FEATURE_TECHNICAL_RECORDS_KEY,
	initialState,
	vehicleTechRecordReducer,
} from '../technical-record-service.reducer';

describe('Technical record batch state', () => {
	const root = (batchVehicles = initialBatchState) => ({
		[STORE_FEATURE_TECHNICAL_RECORDS_KEY]: { ...initialState, batchVehicles },
	});
	const batch = () =>
		batchAdapter.setAll(
			[
				{ vin: 'created', created: true, amendedRecord: false },
				{ vin: 'updated', created: true, amendedRecord: true },
				{ vin: 'pending', pending: true, created: false, amendedRecord: false },
				{ vin: 'failed', failed: true, created: false, amendedRecord: true },
				{ vin: 'unstarted' },
			],
			initialBatchState
		);

	it('replaces a vehicle batch without retaining obsolete VINs', () => {
		const state = { ...initialState, batchVehicles: batch() };
		const result = vehicleTechRecordReducer(state, actions.upsertVehicleBatch({ vehicles: [{ vin: 'new-vin' }] }));
		expect(selectors.selectAllBatch(root(result.batchVehicles))).toEqual([{ vin: 'new-vin' }]);
		expect(state.batchVehicles.ids).toHaveLength(5);
	});

	it('updates all batch configuration through the parent technical-record reducer', () => {
		let state = { ...initialState, batchVehicles: batch() };
		for (const action of [
			actions.setGenerateNumberFlag({ generateNumber: true }),
			actions.setApplicationId({ applicationId: 'application-1' }),
			actions.setVehicleStatus({ vehicleStatus: StatusCodes.PROVISIONAL }),
			actions.setVehicleType({ vehicleType: VehicleTypes.TRL }),
			actions.setTrailerFormType({ trlFormType: TrailerFormType.TES1 }),
		])
			state = vehicleTechRecordReducer(state, action);
		const stateRoot = root(state.batchVehicles);
		expect(selectors.selectApplicationId(stateRoot)).toBe('application-1');
		expect(selectors.selectGenerateNumber(stateRoot)).toBe(true);
		expect(selectors.selectVehicleStatus(stateRoot)).toBe(StatusCodes.PROVISIONAL);
		expect(selectors.selectVehicleType(stateRoot)).toBe(VehicleTypes.TRL);
		expect(selectors.selectTrailerFormType(stateRoot)).toBe(TrailerFormType.TES1);
		state = vehicleTechRecordReducer(
			state,
			actions.setBatchDetails({ vehicleType: VehicleTypes.HGV, vehicleStatus: StatusCodes.CURRENT })
		);
		expect(state.batchVehicles).toMatchObject({
			vehicleType: VehicleTypes.HGV,
			vehicleStatus: StatusCodes.CURRENT,
			applicationId: 'application-1',
		});
	});

	it('clears vehicles and batch identity when cancelled while retaining the number-generation preference', () => {
		const state = {
			...initialState,
			batchVehicles: {
				...batch(),
				applicationId: 'application-1',
				generateNumber: true,
				vehicleType: VehicleTypes.TRL,
				vehicleStatus: StatusCodes.PROVISIONAL,
				trlFormType: TrailerFormType.TES1,
			},
		};
		const result = vehicleTechRecordReducer(state, actions.clearBatch());
		expect(result.batchVehicles).toEqual({
			ids: [],
			entities: {},
			generateNumber: true,
			applicationId: '',
			vehicleType: undefined,
			vehicleStatus: undefined,
			trlFormType: undefined,
		});
		expect(selectors.selectIsBatch(root(result.batchVehicles))).toBe(false);
	});

	describe.each(['create', 'update'] as const)('%s success', (operation) => {
		it.each([
			[VehicleTypes.TRL, { trailerId: 'C123456' }, 'C123456'],
			[VehicleTypes.HGV, { primaryVrm: 'AB12CDE' }, 'AB12CDE'],
			[VehicleTypes.HGV, {}, ''],
		] as const)('maps a successful %s result to its VIN', (vehicleType, identifiers, trailerIdOrVrm) => {
			const vehicleTechRecord = {
				vin: 'pending',
				systemNumber: 'system-1',
				createdTimestamp: 'timestamp',
				techRecord_vehicleType: vehicleType,
				...identifiers,
			} as TechRecordType<'get'>;
			const state = { ...initialState, batchVehicles: batch() };
			const action =
				operation === 'create'
					? createVehicleRecordSuccess({ vehicleTechRecord })
					: updateTechRecordSuccess({ vehicleTechRecord, groupType: 'batch' });
			const result = vehicleTechRecordReducer(state, action);
			expect(result.batchVehicles.entities['pending']).toMatchObject({
				vin: 'pending',
				created: true,
				amendedRecord: operation === 'update',
				systemNumber: 'system-1',
				createdTimestamp: 'timestamp',
				vehicleType,
				status: undefined,
				trailerIdOrVrm,
			});
			expect(state.batchVehicles.entities['pending']?.created).toBe(false);
		});
	});

	it.each([
		['pending', selectors.selectBatchPending, selectors.selectBatchPendingCount, ['pending']],
		['failed', selectors.selectBatchFailed, selectors.selectBatchFailedCount, ['failed']],
		['successful', selectors.selectBatchSuccess, selectors.selectBatchSuccessCount, ['created', 'updated']],
		['create attempts', selectors.selectBatchCreated, selectors.selectBatchCreatedCount, ['created', 'pending']],
		[
			'successful creations',
			selectors.selectBatchCreatedSuccess,
			selectors.selectBatchCreatedSuccessCount,
			['created'],
		],
		['update attempts', selectors.selectBatchUpdated, selectors.selectBatchUpdatedCount, ['updated', 'failed']],
		['successful updates', selectors.selectBatchUpdatedSuccess, selectors.selectBatchUpdatedSuccessCount, ['updated']],
	] as const)('selects and counts %s', (_label, selectVehicles, selectCount, expected) => {
		const state = root(batch());
		expect(selectVehicles(state).map((vehicle) => vehicle.vin)).toEqual(expected);
		expect(selectCount(state)).toBe(expected.length);
		expect(selectors.selectBatchCount(state)).toBe(5);
		expect(selectors.selectIsBatch(state)).toBe(true);
	});
});
