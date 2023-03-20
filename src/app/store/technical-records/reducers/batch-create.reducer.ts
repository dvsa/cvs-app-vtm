import { StatusCodes, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { clearBatch, setApplicationId, setGenerateNumberFlag, upsertVehicleBatch } from '../actions/batch-create.actions';
import { createVehicleRecordSuccess } from '../actions/technical-record-service.actions';

export type BatchRecord = { vin: string; systemNumber?: string; trailerId?: string; vehicleType?: string; status?: StatusCodes; created?: boolean };

export interface BatchRecords extends EntityState<BatchRecord> {
  generateNumber: boolean;
  applicationId?: string;
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
  on(createVehicleRecordSuccess, (state, action) => batchAdapter.updateOne(vehicleRecordsToBatchRecordMapper(action.vehicleTechRecords)[0], state)),
  on(clearBatch, state => batchAdapter.removeAll(state))
);

function vehicleRecordsToBatchRecordMapper(vehicles: VehicleTechRecordModel[], created = true): Update<BatchRecord>[] {
  return vehicles.map(v => {
    const { vin, systemNumber, techRecord, trailerId } = v;
    return {
      id: vin,
      changes: {
        vin,
        systemNumber,
        trailerId,
        vehicleType: techRecord[0].vehicleType,
        status: techRecord[0].statusCode,
        created
      } as BatchRecord
    };
  });
}
