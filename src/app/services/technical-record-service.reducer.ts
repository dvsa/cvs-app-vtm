import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { VehicleTechRecordModel } from '../models/vehicle-tech-record.model';
import * as TechnicalRecordServiceActions from './technical-record-service.actions';

export interface TechnicalRecordServiceState {
  vehicleTechRecord?: VehicleTechRecordModel;
}

const initialState: TechnicalRecordServiceState = {
  vehicleTechRecord: undefined,
};

const getVehicleTechRecordState = createFeatureSelector<TechnicalRecordServiceState>('vehicletechrecord');

export const vehicleTechRecord = createSelector(getVehicleTechRecordState, (state) => state.vehicleTechRecord);

const _vehicleTechRecordReducer = createReducer(
  initialState,
  on(TechnicalRecordServiceActions.getByVIN, (state) => ({ vehicleTechRecord: undefined })),
  on(TechnicalRecordServiceActions.getByVINSuccess, (state, props) => ({ vehicleTechRecord: props.vehicleTechRecord })),
);

export function VehicleTechRecordServiceReducer(state: TechnicalRecordServiceState, action: any) {
  return _vehicleTechRecordReducer(state, action);
}
