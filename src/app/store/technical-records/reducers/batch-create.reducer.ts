import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { StatusCodes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { EntityAdapter, EntityState, Update, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import {
  clearBatch,
  setApplicationId,
  setGenerateNumberFlag,
  setVehicleStatus,
  setVehicleType,
  upsertVehicleBatch
} from '../actions/batch-create.actions';
import { createVehicleRecordSuccess, updateTechRecordSuccess } from '../actions/technical-record-service.actions';

export type BatchRecord = {
  vin: string;
  systemNumber?: string;
  trailerIdOrVrm?: string;
  vehicleType?: string;
  status?: StatusCodes;
  created?: boolean;
  amendedRecord?: boolean;
  oldVehicleStatus?: string;
};

export interface BatchRecords extends EntityState<BatchRecord> {
  vehicleType?: VehicleTypes;
  generateNumber: boolean;
  applicationId?: string;
  vehicleStatus?: string;
}

const selectId = (a: BatchRecord): string => {
  return a.vin;
};

export const batchAdapter: EntityAdapter<BatchRecord> = createEntityAdapter<BatchRecord>({ selectId });

export const initialBatchState: BatchRecords = batchAdapter.getInitialState({
  generateNumber: false
});

export const vehicleBatchCreateReducer = createReducer(
  initialBatchState,
  on(upsertVehicleBatch, (state, action) => batchAdapter.setAll(action.vehicles, state)),
  on(setGenerateNumberFlag, (state, { generateNumber }) => ({ ...state, generateNumber })),
  on(setApplicationId, (state, { applicationId }) => ({ ...state, applicationId })),
  on(setVehicleStatus, (state, { vehicleStatus }) => ({ ...state, vehicleStatus })),
  on(setVehicleType, (state, { vehicleType }) => ({ ...state, vehicleType })),
  on(createVehicleRecordSuccess, (state, action) => batchAdapter.updateOne(vehicleRecordsToBatchRecordMapper([action.vehicleTechRecord])[0], state)),
  on(updateTechRecordSuccess, (state, action) =>
    batchAdapter.updateOne(vehicleRecordsToBatchRecordMapper([action.vehicleTechRecord], true, true)[0], state)
  ),
  on(clearBatch, state => batchAdapter.removeAll({ ...state, vehicleStatus: '', applicationId: '', vehicleType: undefined }))
);

function vehicleRecordsToBatchRecordMapper(technicalRecords: TechRecordType<'get'>[], created = true, amendedRecord = false): Update<BatchRecord>[] {
  return technicalRecords.map(record => {
    const { vin, systemNumber } = record;
    return {
      id: vin,
      changes: {
        vin,
        systemNumber,
        trailerIdOrVrm: record.techRecord_vehicleType !== 'trl' ? record.primaryVrm : record.trailerId,
        vehicleType: record.techRecord_vehicleType,
        status: record.techRecord_statusCode,
        created,
        amendedRecord
      } as BatchRecord
    };
  });
}
