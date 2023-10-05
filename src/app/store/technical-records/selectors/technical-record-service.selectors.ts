import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import { selectRouteDataProperty } from '@store/router/selectors/router.selectors';
import { getTechRecordState } from '../reducers/technical-record-service.reducer';

export const techRecord = createSelector(getTechRecordState, (state) => state.vehicleTechRecord);

export const getSingleVehicleType = createSelector(getTechRecordState, (state) => state.vehicleTechRecord?.techRecord_vehicleType);

export const editingTechRecord = createSelector(getTechRecordState, (state) => state.editingTechRecord);

export const technicalRecordsLoadingState = createSelector(getTechRecordState, (state) => state.loading);

export const getCanGeneratePlate = createSelector(getTechRecordState, (state) => state.canGeneratePlate);

export const selectTechRecordHistory = createSelector(getTechRecordState, (state) =>
  state.techRecordHistory?.sort((a, b) => {
    const aTimeCode = new Date(a.createdTimestamp).getTime();
    const bTimeCode = new Date(b.createdTimestamp).getTime();
    // return aTimeCode < bTimeCode ? 1 : aTimeCode > bTimeCode ? -1 : 0;
    if (aTimeCode < bTimeCode) {
      return 1;
    } if (aTimeCode > bTimeCode) {
      return -1;
    }
    return 0;
  }));

export const selectTechRecord = createSelector(
  techRecord,
  selectRouteDataProperty('isEditing'),
  editingTechRecord,
  (viewableTechRecord, isEditing, editableTechRecord): V3TechRecordModel | undefined => {
    return isEditing ? editableTechRecord : viewableTechRecord;
  },
);

export const selectSectionState = createSelector(getTechRecordState, (state) => state.sectionState);

export const selectScrollPosition = createSelector(getTechRecordState, (state) => state.scrollPosition);
