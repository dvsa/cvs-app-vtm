import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { VehicleTechRecordModel } from 'src/app/models/vehicle-tech-record.model';
import { getByPartialVIN, getByPartialVINFailure, getByPartialVINSuccess, getByVIN, getByVINFailure, getByVINSuccess } from '../actions/technical-record-service.actions';

export const STORE_FEATURE_TECHNICAL_RECORDS_KEY = 'TechnicalRecords';

export interface TechnicalRecordServiceState {
  vehicleTechRecords: Array<VehicleTechRecordModel>;
  loading: boolean;
}

export const initialState: TechnicalRecordServiceState = {
  vehicleTechRecords: [],
  loading: false
};

export const getVehicleTechRecordState = createFeatureSelector<TechnicalRecordServiceState>(STORE_FEATURE_TECHNICAL_RECORDS_KEY);

export const vehicleTechRecordReducer = createReducer(
  initialState,
  on(getByVIN, (state) => ({ ...state, vehicleTechRecords: [], loading: true })),
  on(getByVINSuccess, (state, { vehicleTechRecords }) => ({ ...state, vehicleTechRecords, loading: false })),
  on(getByVINFailure, (state, { error }) => ({ ...state, vehicleTechRecords: [], error, loading: false })),
  on(getByPartialVIN, (state) => ({ ...state, vehicleTechRecords: [], loading: true })),
  on(getByPartialVINSuccess, (state, { vehicleTechRecords }) => ({ ...state, vehicleTechRecords, loading: false })),
  on(getByPartialVINFailure, (state, { error }) => ({ ...state, vehicleTechRecords: [], error, loading: false })),);
