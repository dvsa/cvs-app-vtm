import { BodyTypeCode, vehicleBodyTypeCodeMap } from '@models/body-type-enum';
import { PsvMake } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
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
  addSectionState,
  archiveTechRecord,
  archiveTechRecordFailure,
  archiveTechRecordSuccess,
  clearAllSectionStates,
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
  getTechRecordV3Success,
  removeAxle,
  removeSectionState,
  updateBody,
  updateBrakeForces,
  updateEditingTechRecord,
  updateEditingTechRecordCancel,
  updateTechRecord,
  updateTechRecordFailure,
  updateTechRecordSuccess
} from '../actions/technical-record-service.actions';
//TODO: V3 re-import vehicleBatchCreateReducer from batch-create.reducer
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BatchRecords, initialBatchState } from './batch-create.reducer';

export const STORE_FEATURE_TECHNICAL_RECORDS_KEY = 'TechnicalRecords';

export interface TechnicalRecordServiceState {
  vehicleTechRecord: TechRecordType<'get'> | undefined;
  loading: boolean;
  editingTechRecord?: TechRecordType<'put'>;
  error?: unknown;
  techRecordHistory?: TechRecordSearchSchema[];
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

  on(updateTechRecord, defaultArgs),
  on(updateTechRecordSuccess, successArgs),
  on(updateTechRecordFailure, updateFailureArgs),

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

  on(
    upsertVehicleBatch,
    createVehicleRecordSuccess,
    updateTechRecordSuccess,
    setApplicationId,
    setVehicleStatus,
    setVehicleType,
    setGenerateNumberFlag,
    clearBatch,
    (state, action) => ({
      ...state
      // TODO: V3 for batch vehicles
      // batchVehicles: vehicleBatchCreateReducer(state.batchVehicles, action)
    })
  ),

  on(getTechRecordV3Success, (state, action) => ({ ...state, vehicleTechRecord: action.vehicleTechRecord }))
);

function defaultArgs(state: TechnicalRecordServiceState) {
  return { ...state, loading: true };
}

function successArgs(state: TechnicalRecordServiceState, data: { vehicleTechRecord: TechRecordType<'get'> }) {
  return { ...state, vehicleTechRecord: data.vehicleTechRecord, loading: false };
}

function historyArgs(state: TechnicalRecordServiceState, data: { techRecordHistory: [TechRecordSearchSchema] }) {
  return { ...state, techRecordHistory: data.techRecordHistory, loading: false };
}

function updateFailureArgs(state: TechnicalRecordServiceState, data: { error: any }) {
  return { ...state, error: data.error, loading: false };
}

function failureArgs(state: TechnicalRecordServiceState, data: { error: any }) {
  return { ...state, vehicleTechRecord: undefined, error: data.error, loading: false };
}

function historyFailArgs(state: TechnicalRecordServiceState, data: { techRecordHistory: [TechRecordSearchSchema] }) {
  return { ...state, techRecordHistory: undefined, loading: false };
}

//TODO: remove the anys
function handleUpdateBrakeForces(
  state: TechnicalRecordServiceState,
  data: { grossLadenWeight?: number; grossKerbWeight?: number }
): TechnicalRecordServiceState {
  const newState = cloneDeep(state);
  if (!newState.editingTechRecord) return newState;

  if (data.grossLadenWeight) {
    const prefix = `${Math.round(data.grossLadenWeight / 100)}`;

    (newState.editingTechRecord as any).techRecord_brakes_brakeCode =
      (prefix.length <= 2 ? '0' + prefix : prefix) + (newState.editingTechRecord as any).techRecord_brakes_brakeCodeOriginal;
    (newState.editingTechRecord as any).techRecord_brakes_brakeForceWheelsNotLocked_serviceBrakeForceA = Math.round(
      (data.grossLadenWeight * 16) / 100
    );
    (newState.editingTechRecord as any).techRecord_brakes_brakeForceWheelsNotLocked_secondaryBrakeForceA = Math.round(
      (data.grossLadenWeight * 22.5) / 100
    );
    (newState.editingTechRecord as any).techRecord_brakes_brakeForceWheelsNotLocked_parkingBrakeForceA = Math.round(
      (data.grossLadenWeight * 45) / 100
    );
  }

  if (data.grossKerbWeight) {
    (newState.editingTechRecord as any).techRecord_brakes_brakeForceWheelsUpToHalfLocked_serviceBrakeForceB = Math.round(
      (data.grossKerbWeight * 16) / 100
    );
    (newState.editingTechRecord as any).techRecord_brakes_brakeForceWheelsUpToHalfLocked_secondaryBrakeForceB = Math.round(
      (data.grossKerbWeight * 25) / 100
    );
    (newState.editingTechRecord as any).techRecord_brakes_brakeForceWheelsUpToHalfLocked_parkingBrakeForceB = Math.round(
      (data.grossKerbWeight * 50) / 100
    );
  }

  return newState;
}

//TODO: remove the anys
function handleUpdateBody(state: TechnicalRecordServiceState, action: { psvMake: PsvMake }): TechnicalRecordServiceState {
  const newState = cloneDeep(state);

  if (!newState.editingTechRecord) return newState;

  const code = action.psvMake.psvBodyType.toLowerCase() as BodyTypeCode;

  (newState.editingTechRecord as any).techRecord_bodyType_code = code;
  (newState.editingTechRecord as any).techRecord_bodyType_description = vehicleBodyTypeCodeMap.get(VehicleTypes.PSV)?.get(code);
  (newState.editingTechRecord as any).techRecord_bodyMake = action.psvMake.psvBodyMake;
  (newState.editingTechRecord as any).techRecord_chassisMake = action.psvMake.psvChassisMake;
  (newState.editingTechRecord as any).techRecord_chassisModel = action.psvMake.psvChassisModel;

  return newState;
}

//TODO: remove the anys
function handleAddAxle(state: TechnicalRecordServiceState): TechnicalRecordServiceState {
  const newState = cloneDeep(state);
  const vehicleType = (newState.editingTechRecord as any).techRecord_vehicleType;

  if (!newState.editingTechRecord) return newState;
  if ((!newState.editingTechRecord as any).techRecord_axles) (newState.editingTechRecord as any).techRecord_axles = [];

  const newAxle: any = {
    axleNumber: (newState.editingTechRecord as any).techRecord_axles.length + 1,
    tyres_tyreSize: null,
    tyres_fitmentCode: null,
    tyres_dataTrAxles: null,
    tyres_plyRating: null,
    tyres_tyreCode: null,
    weights_gbWeight: null,
    weights_designWeight: null,
    parkingBrakeMrk: false
  };

  if (vehicleType === VehicleTypes.HGV || vehicleType === VehicleTypes.TRL) {
    newAxle.weights_eecWeight = null;
  }
  if (vehicleType === VehicleTypes.PSV) {
    newAxle.weights_kerbWeight = null;
    newAxle.weights_ladenWeight = null;
    newAxle.tyres_speedCategorySymbol = null;
  }

  (newState.editingTechRecord as any).techRecord_axles.push(newAxle);

  (newState.editingTechRecord as any).techRecord_noOfAxles = (newState.editingTechRecord as any).techRecord_axles.length;

  if (vehicleType === VehicleTypes.HGV || vehicleType === VehicleTypes.TRL) {
    (newState.editingTechRecord as any).techRecord_dimensions_axleSpacing = new AxlesService().generateAxleSpacing(
      (newState.editingTechRecord as any).techRecord_axles.length,
      (newState.editingTechRecord as any).techRecord_dimensions_axleSpacing
    );
  }

  return newState;
}

//TODO: remove the anys
function handleRemoveAxle(state: TechnicalRecordServiceState, action: { index: number }): TechnicalRecordServiceState {
  const newState = cloneDeep(state);

  if (!(newState.editingTechRecord as any).techRecord_axles) return newState;

  (newState.editingTechRecord as any).techRecord_axles.splice(action.index, 1);

  (newState.editingTechRecord as any).techRecord_axles.forEach((axle: any, i: any) => (axle.axleNumber = i + 1));

  (newState.editingTechRecord as any).techRecord_noOfAxles = (newState.editingTechRecord as any).techRecord_axles.length;

  const vehicleType = (newState.editingTechRecord as any).techRecord_vehicleType;
  if (vehicleType === VehicleTypes.HGV || vehicleType === VehicleTypes.TRL) {
    (newState.editingTechRecord as any).techRecord_dimensions_axleSpacing = new AxlesService().generateAxleSpacing(
      (newState.editingTechRecord as any).techRecord_axles.length
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

function updateEditingTechRec(state: TechnicalRecordServiceState, action: { vehicleTechRecord: TechRecordType<'put'> }) {
  const newState = { ...state };
  const { editingTechRecord } = state;
  const { vehicleTechRecord } = action;

  newState.editingTechRecord = { ...editingTechRecord, ...vehicleTechRecord } as TechRecordType<'put'>;

  return newState;
}
