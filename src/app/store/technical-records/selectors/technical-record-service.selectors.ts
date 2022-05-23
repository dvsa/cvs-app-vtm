import { createSelector } from '@ngrx/store';
import { getVehicleTechRecordState } from '../reducers/technical-record-service.reducer';

export const vehicleTechRecords = createSelector(getVehicleTechRecordState, (state) => state.vehicleTechRecords);
export const technicalRecordsLoadingState = createSelector(getVehicleTechRecordState, (state) => state.loading);
