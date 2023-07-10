import { BodyTypeCode, vehicleBodyTypeCodeMap } from '@models/body-type-enum';
import { PsvMake } from '@models/reference-data.model';
import { Axle, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { AxlesService } from '@services/axles/axles.service';
import { cloneDeep } from 'lodash';
import {
  clearBatch,
  setApplicationId,
  setGenerateNumberFlag,
  setVehicleStatus,
  setVehicleType,
  upsertVehicleBatch
} from '../actions/batch-create.actions';
import {
  addAxle,
  archiveTechRecord,
  archiveTechRecordFailure,
  archiveTechRecordSuccess,
  createProvisionalTechRecord,
  createProvisionalTechRecordFailure,
  createProvisionalTechRecordSuccess,
  createVehicleRecord,
  createVehicleRecordFailure,
  createVehicleRecordSuccess,
  generateLetter,
  generateLetterFailure,
  generateLetterSuccess,
  generatePlate,
  generatePlateFailure,
  generatePlateSuccess,
  getBySystemNumber,
  getBySystemNumberFailure,
  getBySystemNumberSuccess,
  removeAxle,
  updateBody,
  updateBrakeForces,
  updateEditingTechRecord,
  updateEditingTechRecordCancel,
  updateTechRecords,
  updateTechRecordsFailure,
  updateTechRecordsSuccess,
  updateVin,
  updateVinSuccess,
  updateVinFailure
} from '../actions/technical-record-service.actions';
import { BatchRecords, initialBatchState, vehicleBatchCreateReducer } from './batch-create.reducer';

export const STORE_FEATURE_TECHNICAL_RECORDS_KEY = 'TechnicalRecords';

export interface TechnicalRecordServiceState {
  vehicleTechRecords: Array<VehicleTechRecordModel>;
  loading: boolean;
  editingTechRecord?: VehicleTechRecordModel;
  error?: unknown;
  batchVehicles: BatchRecords;
}

export const initialState: TechnicalRecordServiceState = {
  vehicleTechRecords: [],
  batchVehicles: initialBatchState,
  loading: false
};

export const getVehicleTechRecordState = createFeatureSelector<TechnicalRecordServiceState>(STORE_FEATURE_TECHNICAL_RECORDS_KEY);

export const vehicleTechRecordReducer = createReducer(
  initialState,

  on(getBySystemNumber, defaultArgs),
  on(getBySystemNumberSuccess, successArgs),
  on(getBySystemNumberFailure, failureArgs),

  on(createVehicleRecord, defaultArgs),
  on(createVehicleRecordSuccess, successArgs),
  on(createVehicleRecordFailure, state => ({ ...state, loading: false })),

  on(createProvisionalTechRecord, defaultArgs),
  on(createProvisionalTechRecordSuccess, successArgs),
  on(createProvisionalTechRecordFailure, updateFailureArgs),

  on(updateTechRecords, defaultArgs),
  on(updateTechRecordsSuccess, successArgs),
  on(updateTechRecordsFailure, updateFailureArgs),

  on(archiveTechRecord, defaultArgs),
  on(archiveTechRecordSuccess, successArgs),
  on(archiveTechRecordFailure, updateFailureArgs),

  on(generatePlate, defaultArgs),
  on(generatePlateSuccess, state => ({ ...state, editingTechRecord: undefined, loading: false })),
  on(generatePlateFailure, failureArgs),

  on(generateLetter, defaultArgs),
  on(generateLetterSuccess, state => ({ ...state, editingTechRecord: undefined })),
  on(generateLetterFailure, failureArgs),

  on(updateEditingTechRecord, (state, action) => ({ ...state, editingTechRecord: action.vehicleTechRecord })),
  on(updateEditingTechRecordCancel, state => ({ ...state, editingTechRecord: undefined })),

  on(updateBrakeForces, (state, action) => handleUpdateBrakeForces(state, action)),

  on(updateBody, (state, action) => handleUpdateBody(state, action)),

  on(addAxle, state => handleAddAxle(state)),
  on(removeAxle, (state, action) => handleRemoveAxle(state, action)),

  on(updateVin, defaultArgs),
  on(updateVinSuccess, state => ({ ...state, loading: false })),
  on(updateVinFailure, updateFailureArgs),

  on(
    upsertVehicleBatch,
    createVehicleRecordSuccess,
    updateTechRecordsSuccess,
    setApplicationId,
    setVehicleStatus,
    setVehicleType,
    setGenerateNumberFlag,
    clearBatch,
    (state, action) => ({
      ...state,
      batchVehicles: vehicleBatchCreateReducer(state.batchVehicles, action)
    })
  )
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

function handleUpdateBrakeForces(
  state: TechnicalRecordServiceState,
  data: { grossLadenWeight?: number; grossKerbWeight?: number }
): TechnicalRecordServiceState {
  const newState = cloneDeep(state);
  if (!newState.editingTechRecord) return newState;

  if (data.grossLadenWeight) {
    const prefix = `${Math.round(data.grossLadenWeight / 100)}`;

    newState.editingTechRecord.techRecord[0].brakes = {
      ...newState.editingTechRecord?.techRecord[0].brakes,
      brakeCode: (prefix.length <= 2 ? '0' + prefix : prefix) + newState.editingTechRecord.techRecord[0].brakes?.brakeCodeOriginal,
      brakeForceWheelsNotLocked: {
        serviceBrakeForceA: Math.round((data.grossLadenWeight * 16) / 100),
        secondaryBrakeForceA: Math.round((data.grossLadenWeight * 22.5) / 100),
        parkingBrakeForceA: Math.round((data.grossLadenWeight * 45) / 100)
      }
    };
  }

  if (data.grossKerbWeight) {
    newState.editingTechRecord.techRecord[0].brakes = {
      ...newState.editingTechRecord?.techRecord[0].brakes,
      brakeForceWheelsUpToHalfLocked: {
        serviceBrakeForceB: Math.round((data.grossKerbWeight * 16) / 100),
        secondaryBrakeForceB: Math.round((data.grossKerbWeight * 25) / 100),
        parkingBrakeForceB: Math.round((data.grossKerbWeight * 50) / 100)
      }
    };
  }
  return newState;
}

function handleUpdateBody(state: TechnicalRecordServiceState, action: { psvMake: PsvMake }): TechnicalRecordServiceState {
  const newState = cloneDeep(state);

  if (!newState.editingTechRecord) return newState;

  const code = action.psvMake.psvBodyType.toLowerCase() as BodyTypeCode;

  newState.editingTechRecord.techRecord[0] = {
    ...newState.editingTechRecord.techRecord[0],
    bodyType: { code, description: vehicleBodyTypeCodeMap.get(VehicleTypes.PSV)?.get(code) },
    bodyMake: action.psvMake.psvBodyMake,
    chassisMake: action.psvMake.psvChassisMake,
    chassisModel: action.psvMake.psvChassisModel
  };

  return newState;
}

function handleAddAxle(state: TechnicalRecordServiceState): TechnicalRecordServiceState {
  const newState = cloneDeep(state);
  const vehicleType = newState.editingTechRecord?.techRecord[0].vehicleType;

  if (!newState.editingTechRecord) return newState;
  if (!newState.editingTechRecord?.techRecord[0].axles) newState.editingTechRecord.techRecord[0].axles = [];

  const newAxle: Axle = {
    axleNumber: newState.editingTechRecord.techRecord[0].axles.length + 1,
    tyres: { tyreSize: null, fitmentCode: null, dataTrAxles: null, plyRating: null, tyreCode: null },
    weights: { gbWeight: null, designWeight: null },
    parkingBrakeMrk: false
  };

  if (vehicleType === VehicleTypes.HGV || vehicleType === VehicleTypes.TRL) {
    newAxle.weights!.eecWeight = null;
  }
  if (vehicleType === VehicleTypes.PSV) {
    newAxle.weights!.kerbWeight = null;
    newAxle.weights!.ladenWeight = null;
    newAxle.tyres!.speedCategorySymbol = null;
  }

  newState.editingTechRecord.techRecord[0].axles.push(newAxle);

  newState.editingTechRecord.techRecord[0].noOfAxles = newState.editingTechRecord.techRecord[0].axles.length;

  newState.editingTechRecord.techRecord[0].dimensions ??= {};

  if (vehicleType === VehicleTypes.HGV || vehicleType === VehicleTypes.TRL) {
    newState.editingTechRecord.techRecord[0].dimensions.axleSpacing = new AxlesService().generateAxleSpacing(
      newState.editingTechRecord?.techRecord[0].axles.length,
      newState.editingTechRecord?.techRecord[0].dimensions.axleSpacing
    );
  }

  return newState;
}

function handleRemoveAxle(state: TechnicalRecordServiceState, action: { index: number }): TechnicalRecordServiceState {
  const newState = cloneDeep(state);

  if (!newState.editingTechRecord?.techRecord[0].axles) return newState;

  newState.editingTechRecord.techRecord[0].axles.splice(action.index, 1);

  newState.editingTechRecord.techRecord[0].axles.forEach((axle, i) => (axle.axleNumber = i + 1));

  newState.editingTechRecord.techRecord[0].noOfAxles = newState.editingTechRecord.techRecord[0].axles.length;

  newState.editingTechRecord.techRecord[0].dimensions ??= {};

  const vehicleType = newState.editingTechRecord?.techRecord[0].vehicleType;
  if (vehicleType === VehicleTypes.HGV || vehicleType === VehicleTypes.TRL) {
    newState.editingTechRecord.techRecord[0].dimensions.axleSpacing = new AxlesService().generateAxleSpacing(
      newState.editingTechRecord?.techRecord[0].axles.length
    );
  }

  return newState;
}
