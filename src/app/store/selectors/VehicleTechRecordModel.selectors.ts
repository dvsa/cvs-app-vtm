import { createSelector, createFeatureSelector } from '@ngrx/store';

import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { TechRecord } from '@app/models/tech-record.model';
import { IVehicleTechRecordModelState } from '../state/VehicleTechRecordModel.state';
import { RECORD_STATUS } from '@app/app.enums';

export const selectFeature = createFeatureSelector<IVehicleTechRecordModelState>(
  'vehicleTechRecordModel'
);

export const selectVehicleTechRecordModelHavingStatusAll = createSelector(
  selectFeature,
  (state: IVehicleTechRecordModelState) => state.vehicleTechRecordModel
);

export const getSelectedVehicleTechRecord = createSelector(
  selectFeature,
  (state: IVehicleTechRecordModelState) => state.selectedVehicleTechRecord
);

export const getTechRecord = createSelector(
  getSelectedVehicleTechRecord,
  (vehicleTechRecord) => (techRecord: TechRecord = null): TechRecord => {
    if (techRecord) {
      return vehicleTechRecord.techRecord.find(
        (vRecord) => getDateNumber(vRecord.createdAt) === getDateNumber(techRecord.createdAt)
      );
    }

    return getActiveTechRecord(vehicleTechRecord.techRecord);
  }
);

export const getVehicleTechRecordMetaData = createSelector(
  getSelectedVehicleTechRecord,
  (vRecord: VehicleTechRecordModel) => vRecord.metadata
);

export const getViewState = createSelector(
  selectFeature,
  (state: IVehicleTechRecordModelState) => state.viewState
);

const getDateNumber = (strDate: string) => new Date(strDate).getTime();

const getActiveTechRecord = (techRecords: TechRecord[]): TechRecord => {
  let record: TechRecord;

  record = techRecords.find((tRecord) => tRecord.statusCode === RECORD_STATUS.CURRENT);
  if (record) {
    return record;
  }

  record = techRecords.find((tRecord) => tRecord.statusCode === RECORD_STATUS.PROVISIONAL);
  if (record) {
    return record;
  }

  record = techRecords
    .filter((tRecord) => tRecord.statusCode === RECORD_STATUS.ARCHIVED)
    .sort((a, b) => getDateNumber(b.createdAt) - getDateNumber(a.createdAt))[0];
  if (record) {
    return record;
  }
};
