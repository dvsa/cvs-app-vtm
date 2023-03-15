import { createSelector } from '@ngrx/store';
import { getVehicleTechRecordState } from '../reducers/technical-record-service.reducer';

export const selectBatchVehicles = createSelector(getVehicleTechRecordState, state => state.batchVehicles);
export const selectIsBatch = createSelector(selectBatchVehicles, state => !!state?.length);
