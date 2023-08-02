import { StatusCodes, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import {
  clearBatch,
  setApplicationId,
  setGenerateNumberFlag,
  upsertVehicleBatch,
  setVehicleStatus,
  setVehicleType
} from '../actions/batch-create.actions';
import { createVehicleRecordSuccess, updateTechRecordsSuccess } from '../actions/technical-record-service.actions';

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
//TODO: Batch to use V3 records
// export const vehicleBatchCreateReducer = createReducer(
//   initialBatchState,
//   on(upsertVehicleBatch, (state, action) => batchAdapter.setAll(action.vehicles, state)),
//   on(setGenerateNumberFlag, (state, { generateNumber }) => ({ ...state, generateNumber })),
//   on(setApplicationId, (state, { applicationId }) => ({ ...state, applicationId })),
//   on(setVehicleStatus, (state, { vehicleStatus }) => ({ ...state, vehicleStatus })),
//   on(setVehicleType, (state, { vehicleType }) => ({ ...state, vehicleType })),
//   on(createVehicleRecordSuccess, (state, action) => batchAdapter.updateOne(vehicleRecordsToBatchRecordMapper(action.vehicleTechRecords)[0], state)),
//   on(updateTechRecordsSuccess, (state, action) =>
//     batchAdapter.updateOne(vehicleRecordsToBatchRecordMapper(action.vehicleTechRecords, true, true)[0], state)
//   ),
//   on(clearBatch, state => batchAdapter.removeAll({ ...state, vehicleStatus: '', applicationId: '', vehicleType: undefined }))
// );

// function vehicleRecordsToBatchRecordMapper(vehicles: VehicleTechRecordModel[], created = true, amendedRecord = false): Update<BatchRecord>[] {
//   return vehicles.map(v => {
//     const { vin, systemNumber, techRecord, trailerId, vrms } = v;
//     return {
//       id: vin,
//       changes: {
//         vin,
//         systemNumber,
//         trailerIdOrVrm: trailerId ?? vrms[0]?.vrm,
//         vehicleType: techRecord[0].vehicleType,
//         status: techRecord[0].statusCode,
//         created,
//         amendedRecord
//       } as BatchRecord
//     };
//   });
// }
