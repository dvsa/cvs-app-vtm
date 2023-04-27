import { createSelector } from '@ngrx/store';
import { selectRouteNestedParams, selectUrl } from '@store/router/selectors/router.selectors';
import { getVehicleTechRecordState } from '../reducers/technical-record-service.reducer';
import { selectQueryParams, selectRouteData } from '@store/router/selectors/router.selectors';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

export const vehicleTechRecords = createSelector(getVehicleTechRecordState, state => state.vehicleTechRecords);

export const editableVehicleTechRecord = createSelector(getVehicleTechRecordState, state => state.editingTechRecord);

export const editableTechRecord = createSelector(editableVehicleTechRecord, vehicle => vehicle?.techRecord[0]);

export const technicalRecordsLoadingState = createSelector(getVehicleTechRecordState, state => state.loading);

export const selectVehicleTechnicalRecordsBySystemNumber = createSelector(
  vehicleTechRecords,
  selectRouteNestedParams,
  (techRecords, { systemNumber }) => {
    const foundRecord = techRecords.find(record => record.systemNumber === systemNumber);

    const sortByDate = function (a: Date, b: Date): number {
      return new Date(b).getTime() - new Date(a).getTime();
    };

    return foundRecord ? { ...foundRecord, techRecord: [...foundRecord.techRecord].sort((a, b) => sortByDate(a.createdAt, b.createdAt)) } : undefined;
  }
);

export const selectTechRecord = createSelector(
  selectVehicleTechnicalRecordsBySystemNumber,
  selectRouteNestedParams,
  selectUrl,
  (vehicle, { techCreatedAt }, url) => {
    const lastTwoUrlParts = url?.split('/').slice(-2);

    if (lastTwoUrlParts?.includes(StatusCodes.PROVISIONAL)) {
      return vehicle?.techRecord.find(techRecord => techRecord.statusCode === StatusCodes.PROVISIONAL);
    }

    if (techCreatedAt) {
      return vehicle?.techRecord.find(
        techRecord => new Date(techRecord.createdAt).getTime() == techCreatedAt && techRecord.statusCode === StatusCodes.ARCHIVED
      );
    }
    return vehicle && TechnicalRecordService.filterTechRecordByStatusCode(vehicle);
  }
);
