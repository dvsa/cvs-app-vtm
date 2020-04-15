import { createSelector, createFeatureSelector } from '@ngrx/store';

import {
  VehicleTechRecordModel,
  VehicleTechRecordEdit
} from '@app/models/vehicle-tech-record.model';
import { TechRecord } from '@app/models/tech-record.model';
import { VrmModel } from '@app/models/vrm.model';
import { VehicleTechRecordState } from '../state/VehicleTechRecordModel.state';
import { RECORD_STATUS } from '@app/app.enums';

export const selectFeature = createFeatureSelector<VehicleTechRecordState>(
  'vehicleTechRecordModel'
);

export const selectVehicleTechRecordModelHavingStatusAll = createSelector(
  selectFeature,
  (state: VehicleTechRecordState) => state.vehicleTechRecordModel
);

export const getSelectedVehicleTechRecord = createSelector(
  selectFeature,
  (state: VehicleTechRecordState) => state.selectedVehicleTechRecord
);

export const getActiveVehicleTechRecord = createSelector(
  // getUserDetails,
  getSelectedVehicleTechRecord,
  (vehicleTechRecord) => (searchRecord: TechRecord = null): VehicleTechRecordEdit => {
    if (vehicleTechRecord) {
      const primaryVrm: VrmModel = vehicleTechRecord.vrms.find((vrm) => vrm.isPrimary);

      return {
        msUserDetails: null,
        vin: vehicleTechRecord.vin,
        primaryVrm: primaryVrm ? primaryVrm.vrm : '',
        secondaryVrms: vehicleTechRecord.vrms
          .filter((vrm) => !vrm.isPrimary)
          .map((secondaryVrm) => secondaryVrm.vrm),
        trailerId: vehicleTechRecord.trailerId,
        techRecord: [getTechRecord(vehicleTechRecord.techRecord, searchRecord)]
      };
    }
  }
);

export const getVehicleTechRecordMetaData = createSelector(
  getSelectedVehicleTechRecord,
  (vRecord: VehicleTechRecordModel) => vRecord.metadata
);

export const getTechViewState = createSelector(
  selectFeature,
  (state: VehicleTechRecordState) => state.viewState
);

const getTechRecord = (techRecords: TechRecord[], searchRecord: TechRecord): TechRecord => {
  if (searchRecord) {
    return techRecords.find(
      (vRecord) => getDateNumber(vRecord.createdAt) === getDateNumber(searchRecord.createdAt)
    );
  }

  return getActiveRecord(techRecords);
};

const getActiveRecord = (techRecords: TechRecord[]): TechRecord => {
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

const getDateNumber = (strDate: string) => new Date(strDate).getTime();
