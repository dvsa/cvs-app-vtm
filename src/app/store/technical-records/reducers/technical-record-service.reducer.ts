import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
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
  getByAllSuccess,
  updateTechRecords,
  updateTechRecordsSuccess,
  updateTechRecordsFailure,
  createProvisionalTechRecord,
  createProvisionalTechRecordSuccess,
  createProvisionalTechRecordFailure,
  archiveTechRecord,
  archiveTechRecordSuccess,
  archiveTechRecordFailure,
  updateEditingTechRecord,
  updateEditingTechRecordCancel,
  createVehicleRecord,
  createVehicleRecordFailure,
  createVehicleRecordSuccess
} from '../actions/technical-record-service.actions';

export const STORE_FEATURE_TECHNICAL_RECORDS_KEY = 'TechnicalRecords';

export interface TechnicalRecordServiceState {
  vehicleTechRecords: Array<VehicleTechRecordModel>;
  loading: boolean;
  editingTechRecord?: VehicleTechRecordModel;
  error?: unknown;
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
  on(getByAllFailure, failureArgs),

  on(createVehicleRecord, defaultArgs),
  on(createVehicleRecordSuccess, successArgs),
  on(createVehicleRecordFailure, updateFailureArgs),

  on(createProvisionalTechRecord, defaultArgs),
  on(createProvisionalTechRecordSuccess, successArgs),
  on(createProvisionalTechRecordFailure, updateFailureArgs),

  on(updateTechRecords, defaultArgs),
  on(updateTechRecordsSuccess, successArgs),
  on(updateTechRecordsFailure, updateFailureArgs),

  on(archiveTechRecord, defaultArgs),
  on(archiveTechRecordSuccess, successArgs),
  on(archiveTechRecordFailure, updateFailureArgs),

  on(updateEditingTechRecord, (state: TechnicalRecordServiceState, data: { vehicleTechRecord: VehicleTechRecordModel }) => ({
    ...state,
    editingTechRecord: data.vehicleTechRecord
  })),
  on(updateEditingTechRecordCancel, (state: TechnicalRecordServiceState) => ({ ...state, editingTechRecord: undefined }))
);

function defaultArgs(state: TechnicalRecordServiceState) {
  return { ...state, loading: true };
}

function successArgs(state: TechnicalRecordServiceState, data: { vehicleTechRecords: Array<VehicleTechRecordModel> }) {
  return { ...state, vehicleTechRecords: data.vehicleTechRecords, loading: false };
}

function updateFailureArgs(state: TechnicalRecordServiceState, data: { error: any }) {
  return { ...state, error: data.error, loading: false };
}

function failureArgs(state: TechnicalRecordServiceState, data: { error: any }) {
  return { ...state, vehicleTechRecords: [], error: data.error, loading: false };
}
