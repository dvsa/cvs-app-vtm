import { createSelector } from '@ngrx/store';
import { batchAdapter } from '../reducers/batch-create.reducer';
import { getVehicleTechRecordState } from '../reducers/technical-record-service.reducer';

const { selectAll, selectTotal } = batchAdapter.getSelectors();

export const selectBatchState = createSelector(getVehicleTechRecordState, state => state.batchVehicles);
export const selectAllBatch = createSelector(selectBatchState, state => selectAll(state));
export const selectBatchCount = createSelector(selectBatchState, state => selectTotal(state));
export const selectIsBatch = createSelector(selectBatchCount, state => !!state);
export const selectApplicationId = createSelector(selectBatchState, state => state.applicationId);
export const selectGenerateNumber = createSelector(selectBatchState, state => state.generateNumber);
export const selectVehicleStatus = createSelector(selectBatchState, state => state.vehicleStatus);

export const selectBatchSuccess = createSelector(selectAllBatch, state => state.filter(v => v.created));
export const selectBatchSuccessCount = createSelector(selectBatchSuccess, state => state.length);

export const selectBatchCreated = createSelector(selectAllBatch, state => state.filter(v => !v.amendedRecord));
export const selectBatchCreatedCount = createSelector(selectBatchCreated, state => state.length);
export const selectBatchCreatedSuccess = createSelector(selectBatchCreated, state => state.filter(v => v.created));
export const selectBatchCreatedSuccessCount = createSelector(selectBatchCreatedSuccess, state => state.length);

export const selectBatchUpdated = createSelector(selectAllBatch, state => state.filter(v => v.amendedRecord));
export const selectBatchUpdatedCount = createSelector(selectBatchUpdated, state => state.length);
export const selectBatchUpdatedSuccess = createSelector(selectBatchUpdated, state => state.filter(v => v.created));
export const selectBatchUpdatedSuccessCount = createSelector(selectBatchUpdatedSuccess, state => state.length);
