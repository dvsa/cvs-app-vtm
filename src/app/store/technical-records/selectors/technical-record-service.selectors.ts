import { createSelector } from '@ngrx/store';
import { selectRouteDataProperty, selectRouteNestedParams, selectUrl } from '@store/router/selectors/router.selectors';
import { getTechRecordState } from '../reducers/technical-record-service.reducer';
import { StatusCodes, TechRecordModel, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

export const techRecord = createSelector(getTechRecordState, state => state.vehicleTechRecord);

export const getSingleVehicleType = createSelector(getTechRecordState, state => state.vehicleTechRecord?.techRecord_vehicleType);

export const editingTechRecord = createSelector(getTechRecordState, state => state.editingTechRecord);

export const technicalRecordsLoadingState = createSelector(getTechRecordState, state => state.loading);

export const selectTechRecordHistory = createSelector(getTechRecordState, state => state.techRecordHistory);

export const selectTechRecord = createSelector(
  techRecord,
  selectRouteDataProperty('isEditing'),
  editingTechRecord,
  (techRecord, isEditing, editableTechRecord): V3TechRecordModel | undefined => {
    return isEditing ? editableTechRecord : techRecord;
  }
);

export const selectSectionState = createSelector(getTechRecordState, state => state.sectionState);
