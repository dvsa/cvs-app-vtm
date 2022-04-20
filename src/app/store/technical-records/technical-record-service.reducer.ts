import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { VehicleTechRecordModel } from 'src/app/models/vehicle-tech-record.model';
import * as TechnicalRecordServiceActions from './technical-record-service.actions';

export const STORE_FEATURE_TECHNICAL_RECORDS_KEY = 'TechnicalRecords';

export interface TechnicalRecordServiceState {
  vehicleTechRecords: Array<VehicleTechRecordModel>;
}

export const initialState: TechnicalRecordServiceState = {
  vehicleTechRecords: []
};

export const getVehicleTechRecordState = createFeatureSelector<TechnicalRecordServiceState>(STORE_FEATURE_TECHNICAL_RECORDS_KEY);

export const vehicleTechRecordReducer = createReducer(
  initialState,
  on(TechnicalRecordServiceActions.getByVIN, (state) => ({ ...state, vehicleTechRecords: [] })),
  on(TechnicalRecordServiceActions.getByVINSuccess, (state, { vehicleTechRecords }) => ({ ...state, vehicleTechRecords }))
);
