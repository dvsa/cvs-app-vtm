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
export const selectCreatedBatch = createSelector(selectAllBatch, state => state.filter(v => v.created));
export const selectCreatedBatchCount = createSelector(selectCreatedBatch, state => state.length);
