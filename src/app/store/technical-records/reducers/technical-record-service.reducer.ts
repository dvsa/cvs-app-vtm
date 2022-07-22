import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { VehicleTechRecordModel } from 'src/app/models/vehicle-tech-record.model';
import {
  getByPartialVin,
  getByPartialVinFailure,
  getByPartialVinSuccess,
  getByTrailerId,
  getByTrailerIdFailure,
  getByTrailerIdSuccess,
  getByVin,
  getByVinFailure,
  getByVinSuccess,
  getByVrm,
  getByVrmFailure,
  getByVrmSuccess,
  getBySystemNumber,
  getBySystemNumberFailure,
  getBySystemNumberSuccess,
  getByAll,
  getByAllFailure,
  getByAllSuccess
} from '../actions/technical-record-service.actions';

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

  on(getByVin, defaultArgs),
  on(getByVinSuccess, successArgs),
  on(getByVinFailure, failureArgs),

  on(getByPartialVin, defaultArgs),
  on(getByPartialVinSuccess, successArgs),
  on(getByPartialVinFailure, failureArgs),

  on(getByVrm, defaultArgs),
  on(getByVrmSuccess, successArgs),
  on(getByVrmFailure, failureArgs),

  on(getByTrailerId, defaultArgs),
  on(getByTrailerIdSuccess, successArgs),
  on(getByTrailerIdFailure, failureArgs),

  on(getBySystemNumber, defaultArgs),
  on(getBySystemNumberSuccess, successArgs),
  on(getBySystemNumberFailure, failureArgs),

  on(getByAll, defaultArgs),
  on(getByAllSuccess, successArgs),
  on(getByAllFailure, failureArgs)
);

function defaultArgs(state: TechnicalRecordServiceState) {
  return { ...state, vehicleTechRecords: [], loading: true };
}

function successArgs(state: TechnicalRecordServiceState, data: { vehicleTechRecords: Array<VehicleTechRecordModel> }) {
  return { ...state, vehicleTechRecords: data.vehicleTechRecords, loading: false };
}

function failureArgs(state: TechnicalRecordServiceState, data: { error: any }) {
  return { ...state, vehicleTechRecords: [], error: data.error, loading: false };
}
