import { createSelector } from '@ngrx/store';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { getVehicleTechRecordState } from '../reducers/technical-record-service.reducer';

export const vehicleTechRecords = createSelector(getVehicleTechRecordState, (state) => state.vehicleTechRecords);
export const technicalRecordsLoadingState = createSelector(getVehicleTechRecordState, (state) => state.loading);
export const selectVehicleTechnicalRecordByVin = createSelector(vehicleTechRecords, selectRouteNestedParams, (state, { vin }) => {
    return state.find((record) => record.vin === vin)
});

