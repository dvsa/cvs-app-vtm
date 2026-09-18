import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VehicleTypes } from '../../models/vehicle-tech-record.model';
import { STORE_FEATURE_BATCH_KEY } from './batch.feature';
import { BatchState } from './batch.models';
import { batchAdapter } from './batch.reducer';

export const { selectAll } = batchAdapter.getSelectors();

export const selectBatchFeature = createFeatureSelector<BatchState>(STORE_FEATURE_BATCH_KEY);

export const selectBatchDetails = createSelector(selectBatchFeature, (state) => ({
	vehicleType: state.vehicleType,
	vehicleStatus: state.vehicleStatus,
	trlFormType: state.trlFormType,
	batchSize: state.batchSize,
	vehicles: selectAll(state),
}));
export const selectBatchVehicles = createSelector(selectBatchFeature, (state) => selectAll(state));
export const selectBatchCount = createSelector(selectBatchDetails, (details) => details.vehicles.length);
export const selectBatchPending = createSelector(selectBatchVehicles, (state) => state.filter((v) => v.pending));
export const selectBatchPendingCount = createSelector(selectBatchPending, (state) => state.length);

export const selectBatchSuccess = createSelector(selectBatchVehicles, (state) =>
	state.filter((v) => v.created || v.updated)
);
export const selectBatchSuccessCount = createSelector(selectBatchSuccess, (state) => state.length);

export const selectBatchFailed = createSelector(selectBatchVehicles, (state) => state.filter((v) => v.failed));
export const selectBatchFailedCount = createSelector(selectBatchFailed, (state) => state.length);

export const selectBatchCreated = createSelector(selectBatchVehicles, (state) => state.filter((v) => v.created));
export const selectBatchCreatedCount = createSelector(selectBatchCreated, (state) => state.length);
export const selectBatchCreatedSuccess = createSelector(selectBatchCreated, (state) => state.filter((v) => v.created));
export const selectBatchCreatedSuccessCount = createSelector(selectBatchCreatedSuccess, (state) => state.length);

export const selectBatchUpdated = createSelector(selectBatchVehicles, (state) => state.filter((v) => v.updated));
export const selectBatchUpdatedCount = createSelector(selectBatchUpdated, (state) => state.length);
export const selectBatchUpdatedSuccess = createSelector(selectBatchUpdated, (state) => state.filter((v) => v.created));
export const selectBatchUpdatedSuccessCount = createSelector(selectBatchUpdatedSuccess, (state) => state.length);

export const selectBatchVehicleTypeDescriptor = createSelector(selectBatchFeature, (state) => {
	switch (state.vehicleType) {
		case VehicleTypes.HGV:
			return 'HGV';
		case VehicleTypes.PSV:
			return 'PSV';
		case VehicleTypes.TRL:
			return 'trailer';
		default:
			return 'vehicle';
	}
});
