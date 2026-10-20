import { createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { StatusCodes, VehicleTypes } from '../../models/vehicle-tech-record.model';
import {
	createVehicleRecord,
	createVehicleRecordFailure,
	createVehicleRecordSuccess,
	updateTechRecord,
	updateTechRecordFailure,
	updateTechRecordSuccess,
} from '../technical-records';
import { cancelBatch, updateBatch, upsertBatchVehicles } from './batch.actions';
import { BatchRecord, BatchState } from './batch.models';

export const batchAdapter = createEntityAdapter<BatchRecord>({
	selectId: (a) => a.id,
});

export const initialBatchState: BatchState = batchAdapter.getInitialState({
	vehicleType: null,
	vehicleStatus: null,
	trlFormType: null,
	batchSize: null,
});

export const batchReducer = createReducer(
	initialBatchState,
	on(updateBatch, (state, { changes }) => {
		return { ...state, ...changes };
	}),
	on(upsertBatchVehicles, (state, { vehicles }) => {
		return batchAdapter.upsertMany(vehicles, state);
	}),
	on(cancelBatch, () => {
		return { ...initialBatchState };
	}),
	on(createVehicleRecord, updateTechRecord, (state, action) => {
		return batchAdapter.updateOne({ id: action.batchRecordId!, changes: { pending: true } }, state);
	}),
	on(createVehicleRecordSuccess, (state, { batchRecordId, vehicleTechRecord: techRecord }) => {
		return batchAdapter.updateOne(
			{
				id: batchRecordId!,
				changes: {
					pending: false,
					created: true,
					updated: false,
					failed: false,
					systemNumber: techRecord.systemNumber,
					createdTimestamp: techRecord.createdTimestamp,
					status: techRecord.techRecord_statusCode as StatusCodes,
					trailerIdOrVrm:
						techRecord.techRecord_vehicleType === VehicleTypes.TRL ? techRecord.trailerId : techRecord.primaryVrm || '',
				},
			},
			state
		);
	}),
	on(updateTechRecordSuccess, (state, { batchRecordId, vehicleTechRecord: techRecord }) => {
		return batchAdapter.updateOne(
			{
				id: batchRecordId!,
				changes: {
					pending: false,
					created: false,
					updated: true,
					failed: false,
					systemNumber: techRecord.systemNumber,
					createdTimestamp: techRecord.createdTimestamp,
					status: techRecord.techRecord_statusCode as StatusCodes,
					trailerIdOrVrm:
						techRecord.techRecord_vehicleType === VehicleTypes.TRL ? techRecord.trailerId : techRecord.primaryVrm || '',
				},
			},
			state
		);
	}),
	on(createVehicleRecordFailure, updateTechRecordFailure, (state, { batchRecordId }) => {
		return batchAdapter.updateOne(
			{
				id: batchRecordId!,
				changes: {
					pending: false,
					failed: true,
				},
			},
			state
		);
	})
);
