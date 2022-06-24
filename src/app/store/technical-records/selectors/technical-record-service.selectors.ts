import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { getVehicleTechRecordState } from '../reducers/technical-record-service.reducer';

export const vehicleTechRecords = createSelector(getVehicleTechRecordState, (state) => state.vehicleTechRecords);

export const technicalRecordsLoadingState = createSelector(getVehicleTechRecordState, (state) => state.loading);

export const selectVehicleTechnicalRecordsByVin = createSelector(vehicleTechRecords, selectRouteNestedParams, (state, { vin }) => {
  let foundRecord = state.find((record) => record.vin === vin);
  let sortedRecord: VehicleTechRecordModel | undefined;
  if (foundRecord) {
    sortedRecord = {
      ...foundRecord,
      techRecord: [...foundRecord.techRecord].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    };
  }
  return sortedRecord;
});
