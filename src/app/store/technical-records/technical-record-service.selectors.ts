import { createSelector } from '@ngrx/store';
import { getVehicleTechRecordState } from './technical-record-service.reducer';

export const vehicleTechRecords = createSelector(getVehicleTechRecordState, (state) => state.vehicleTechRecords);
