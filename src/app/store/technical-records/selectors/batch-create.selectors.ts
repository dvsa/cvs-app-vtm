import { createSelector } from '@ngrx/store';
import { getVehicleTechRecordState } from '../reducers/technical-record-service.reducer';

export const selectBatchVehicles = createSelector(getVehicleTechRecordState, state => state.batchVehicles);
export const selectBatchCount = createSelector(selectBatchVehicles, state => state?.length);
export const selectIsBatch = createSelector(selectBatchCount, state => !!state);
