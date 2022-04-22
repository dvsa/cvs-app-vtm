import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { VehicleTechRecordModel } from 'src/app/models/vehicle-tech-record.model';
import { getByVIN, getByVINFailure, getByVINSuccess } from './technical-record-service.actions';

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
  on(getByVIN, (state) => ({ ...state, vehicleTechRecords: [] })),
  on(getByVINSuccess, (state, { vehicleTechRecords }) => ({ ...state, vehicleTechRecords })),
  on(getByVINFailure, (state, { message }) => ({ ...state, vehicleTechRecords: [], message }))
);
