import { BodyTypeCode, vehicleBodyTypeCodeMap } from '@models/body-type-enum';
import { PsvMake } from '@models/reference-data.model';
import { Axle, V3TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
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
  addSectionState,
  removeSectionState,
  clearAllSectionStates,
  getTechRecordV3Success
} from '../actions/technical-record-service.actions';
//TODO: re-import vehicleBatchCreateReducer

import { BatchRecords, initialBatchState } from './batch-create.reducer';
import { Action } from 'rxjs/internal/scheduler/Action';

export const STORE_FEATURE_TECHNICAL_RECORDS_KEY = 'TechnicalRecords';

export interface TechnicalRecordServiceState {
  vehicleTechRecord: V3TechRecordModel | undefined;
  loading: boolean;
  editingTechRecord?: V3TechRecordModel;
  error?: unknown;
  techRecordHistory?: V3TechRecordModel[];
  batchVehicles: BatchRecords;
  sectionState?: (string | number)[];
}

export const initialState: TechnicalRecordServiceState = {
  vehicleTechRecord: undefined,
  batchVehicles: initialBatchState,
  loading: false,
  sectionState: []
};

export const getTechRecordState = createFeatureSelector<TechnicalRecordServiceState>(STORE_FEATURE_TECHNICAL_RECORDS_KEY);

export const vehicleTechRecordReducer = createReducer(
  initialState,

  on(getBySystemNumber, defaultArgs),
  on(getBySystemNumberSuccess, historyArgs),
  on(getBySystemNumberFailure, historyFailArgs),

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

  on(updateEditingTechRecord, (state, action) => updateEditingTechRec(state, action)),
  on(updateEditingTechRecordCancel, state => ({ ...state, editingTechRecord: undefined })),

  on(updateBrakeForces, (state, action) => handleUpdateBrakeForces(state, action)),

  on(updateBody, (state, action) => handleUpdateBody(state, action)),

  on(addAxle, state => handleAddAxle(state)),
  on(removeAxle, (state, action) => handleRemoveAxle(state, action)),

  on(addSectionState, (state, action) => handleAddSection(state, action)),
  on(removeSectionState, (state, action) => handleRemoveSection(state, action)),
  on(clearAllSectionStates, state => ({ ...state, sectionState: [] })),

  // on(updateVin, defaultArgs),
  // on(updateVinSuccess, state => ({ ...state, loading: false })),
  // on(updateVinFailure, updateFailureArgs),

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
      ...state
      // batchVehicles: vehicleBatchCreateReducer(state.batchVehicles, action)
    })
  ),

  on(getTechRecordV3Success, (state, action) => ({ ...state, vehicleTechRecord: action.vehicleTechRecords }))
);

function defaultArgs(state: TechnicalRecordServiceState) {
  return { ...state, loading: true };
}

function successArgs(state: TechnicalRecordServiceState, data: { vehicleTechRecords: V3TechRecordModel }) {
  return { ...state, vehicleTechRecords: data.vehicleTechRecords, loading: false };
}

function historyArgs(state: TechnicalRecordServiceState, data: { techRecordHistory: [V3TechRecordModel] }) {
  return { ...state, techRecordHistory: data.techRecordHistory, loading: false };
}

function updateFailureArgs(state: TechnicalRecordServiceState, data: { error: any }) {
  return { ...state, error: data.error, loading: false };
}

function failureArgs(state: TechnicalRecordServiceState, data: { error: any }) {
  return { ...state, vehicleTechRecords: undefined, error: data.error, loading: false };
}

function historyFailArgs(state: TechnicalRecordServiceState, data: { error: any }) {
  return { ...state, techRecordHistory: undefined, error: data.error, loading: false };
}

function handleUpdateBrakeForces(
  state: TechnicalRecordServiceState,
  data: { grossLadenWeight?: number; grossKerbWeight?: number }
): TechnicalRecordServiceState {
  const newState = cloneDeep(state);
  if (!newState.editingTechRecord) return newState;

  if (data.grossLadenWeight) {
    const prefix = `${Math.round(data.grossLadenWeight / 100)}`;

    (newState.editingTechRecord as any).techRecord_brakes = {
      ...(newState.editingTechRecord as any).techRecord[0].brakes,
      brakeCode: (prefix.length <= 2 ? '0' + prefix : prefix) + (newState.editingTechRecord as any).techRecord[0].brakes?.brakeCodeOriginal,
      brakeForceWheelsNotLocked: {
        serviceBrakeForceA: Math.round((data.grossLadenWeight * 16) / 100),
        secondaryBrakeForceA: Math.round((data.grossLadenWeight * 22.5) / 100),
        parkingBrakeForceA: Math.round((data.grossLadenWeight * 45) / 100)
      }
    };
  }

  if (data.grossKerbWeight) {
    (newState.editingTechRecord as any).techRecord[0].brakes = {
      ...(newState.editingTechRecord as any).techRecord[0].brakes,
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

  (newState.editingTechRecord as any).techRecord[0] = {
    ...(newState.editingTechRecord as any).techRecord[0],
    bodyType: { code, description: vehicleBodyTypeCodeMap.get(VehicleTypes.PSV)?.get(code) },
    bodyMake: action.psvMake.psvBodyMake,
    chassisMake: action.psvMake.psvChassisMake,
    chassisModel: action.psvMake.psvChassisModel
  };

  return newState;
}

function handleAddAxle(state: TechnicalRecordServiceState): TechnicalRecordServiceState {
  const newState = cloneDeep(state);
  const vehicleType = (newState.editingTechRecord as any).techRecord[0].vehicleType;

  if (!newState.editingTechRecord) return newState;
  if ((!newState.editingTechRecord as any).techRecord[0].axles) (newState.editingTechRecord as any).techRecord[0].axles = [];

  const newAxle: Axle = {
    axleNumber: (newState.editingTechRecord as any).techRecord[0].axles.length + 1,
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

  (newState.editingTechRecord as any).techRecord[0].axles.push(newAxle);

  (newState.editingTechRecord as any).techRecord[0].noOfAxles = (newState.editingTechRecord as any).techRecord[0].axles.length;

  (newState.editingTechRecord as any).techRecord[0].dimensions ??= {};

  if (vehicleType === VehicleTypes.HGV || vehicleType === VehicleTypes.TRL) {
    (newState.editingTechRecord as any).techRecord[0].dimensions.axleSpacing = new AxlesService().generateAxleSpacing(
      (newState.editingTechRecord as any).techRecord[0].axles.length,
      (newState.editingTechRecord as any).techRecord[0].dimensions.axleSpacing
    );
  }

  return newState;
}

function handleRemoveAxle(state: TechnicalRecordServiceState, action: { index: number }): TechnicalRecordServiceState {
  const newState = cloneDeep(state);

  if (!(newState.editingTechRecord as any).techRecord[0].axles) return newState;

  (newState.editingTechRecord as any).techRecord[0].axles.splice(action.index, 1);

  (newState.editingTechRecord as any).techRecord[0].axles.forEach((axle: any, i: any) => (axle.axleNumber = i + 1));

  (newState.editingTechRecord as any).techRecord[0].noOfAxles = (newState.editingTechRecord as any).techRecord[0].axles.length;

  (newState.editingTechRecord as any).techRecord[0].dimensions ??= {};

  const vehicleType = (newState.editingTechRecord as any).techRecord[0].vehicleType;
  if (vehicleType === VehicleTypes.HGV || vehicleType === VehicleTypes.TRL) {
    (newState.editingTechRecord as any).techRecord[0].dimensions.axleSpacing = new AxlesService().generateAxleSpacing(
      (newState.editingTechRecord as any).techRecord[0].axles.length
    );
  }

  return newState;
}

function handleAddSection(state: TechnicalRecordServiceState, action: { section: string | number }) {
  const newState = cloneDeep(state);
  if (newState.sectionState?.includes(action.section)) return newState;
  return { ...newState, sectionState: newState.sectionState?.concat(action.section) };
}

function handleRemoveSection(state: TechnicalRecordServiceState, action: { section: string | number }) {
  const newState = cloneDeep(state);
  if (!newState.sectionState?.includes(action.section)) return newState;
  return { ...newState, sectionState: newState.sectionState?.filter(section => section !== action.section) };
}

function updateEditingTechRec(state: TechnicalRecordServiceState, action: { vehicleTechRecord: V3TechRecordModel }) {
  const newState = { ...state };
  const { editingTechRecord } = state;
  const { vehicleTechRecord } = action;
  console.log(vehicleTechRecord);

  newState.editingTechRecord = { ...editingTechRecord, ...vehicleTechRecord };

  return newState;
}
