import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { getVehicleTechRecordState } from '../reducers/technical-record-service.reducer';

export const vehicleTechRecords = createSelector(getVehicleTechRecordState, state => state.vehicleTechRecords);

export const editableVehicleTechRecord = createSelector(getVehicleTechRecordState, state => state.editingTechRecord);

export const editableTechRecord = createSelector(editableVehicleTechRecord, state => state?.techRecord[0]);

export const technicalRecordsLoadingState = createSelector(getVehicleTechRecordState, state => state.loading);

export const selectVehicleTechnicalRecordsBySystemNumber = createSelector(
  vehicleTechRecords,
  selectRouteNestedParams,
  (techRecords, { systemNumber }) => {
    const foundRecord = techRecords.find(record => record.systemNumber === systemNumber);

    const sortByDate = function (a: Date, b: Date): number {
      return new Date(b).getTime() - new Date(a).getTime();
    };

    return foundRecord
      ? ({ ...foundRecord, techRecord: [...foundRecord.techRecord].sort((a, b) => sortByDate(a.createdAt, b.createdAt)) } as VehicleTechRecordModel)
      : undefined;
  }
);
