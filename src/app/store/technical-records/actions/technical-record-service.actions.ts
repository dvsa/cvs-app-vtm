import { GlobalError } from '@core/components/global-error/global-error.interface';
import { PsvMake } from '@models/reference-data.model';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { ActionCreator, ActionCreatorProps, createAction, props } from '@ngrx/store';

const prefix = '[Technical Record Service]';

export const getByVin = createAction(`${prefix} getByVin`, props<{ vin: string }>());
export const getByVinSuccess = createOutcomeAction('getByVin', true);
export const getByVinFailure = createOutcomeAction('getByVin');

export const getByPartialVin = createAction(`${prefix} getByPartialVin`, props<{ partialVin: string }>());
export const getByPartialVinSuccess = createOutcomeAction('getByPartialVin', true);
export const getByPartialVinFailure = createOutcomeAction('getByPartialVin');

export const getByVrm = createAction(`${prefix} getByVrm`, props<{ vrm: string }>());
export const getByVrmSuccess = createOutcomeAction('getByVrm', true);
export const getByVrmFailure = createOutcomeAction('getByVrm');

export const getByTrailerId = createAction(`${prefix} getByTrailerId`, props<{ trailerId: string }>());
export const getByTrailerIdSuccess = createOutcomeAction('getByTrailerId', true);
export const getByTrailerIdFailure = createOutcomeAction('getByTrailerId');

export const getBySystemNumber = createAction(`${prefix} getBySystemNumber`, props<{ systemNumber: string }>());
export const getBySystemNumberSuccess = createOutcomeAction('getBySystemNumber', true);
export const getBySystemNumberFailure = createOutcomeAction('getBySystemNumber');

export const getByAll = createAction(`${prefix} getByAll`, props<{ all: string }>());
export const getByAllSuccess = createOutcomeAction('getByAll', true);
export const getByAllFailure = createOutcomeAction('getByAll');

export const createVehicleRecord = createAction(`${prefix} createVehicleRecord`);
export const createVehicleRecordSuccess = createOutcomeAction('createVehicleRecord', true);
export const createVehicleRecordFailure = createOutcomeAction('createVehicleRecord');

export const createProvisionalTechRecord = createAction(`${prefix} createProvisionalTechRecord`, props<{ systemNumber: string }>());
export const createProvisionalTechRecordSuccess = createOutcomeAction('createProvisionalTechRecord', true);
export const createProvisionalTechRecordFailure = createOutcomeAction('createProvisionalTechRecord');

export const updateTechRecords = createAction(
  `${prefix} updateTechRecords`,
  props<{ systemNumber: string; recordToArchiveStatus?: StatusCodes; newStatus?: StatusCodes }>()
);
export const updateTechRecordsSuccess = createOutcomeAction('updateTechRecords', true);
export const updateTechRecordsFailure = createOutcomeAction('updateTechRecords');

export const archiveTechRecord = createAction(`${prefix} archiveTechRecord`, props<{ systemNumber: string; reasonForArchiving: string }>());
export const archiveTechRecordSuccess = createOutcomeAction('archiveTechRecord', true);
export const archiveTechRecordFailure = createOutcomeAction('archiveTechRecord');

export const updateEditingTechRecord = createAction(`${prefix} updateEditingTechRecord`, props<{ vehicleTechRecord: VehicleTechRecordModel }>());
export const updateEditingTechRecordCancel = createAction(`${prefix} updateEditingTechRecordCancel`);

export const changeVehicleType = createAction(`${prefix} changeVehicleType`, props<{ vehicleType: VehicleTypes }>());

export const createVehicle = createAction(`${prefix} createVehicle`, props<{ vehicleType: VehicleTypes }>());

export const generatePlate = createAction(
  `${prefix} generatePlate`,
  props<{ vehicleRecord: VehicleTechRecordModel; techRecord: TechRecordModel; reason: string }>()
);
export const generatePlateSuccess = createOutcomeAction('generatePlate', true);
export const generatePlateFailure = createOutcomeAction('generatePlate');

export const generateLetter = createAction(`${prefix} generateLetter`, props<{ techRecord: TechRecordModel; letterType: string }>());
export const generateLetterSuccess = createOutcomeAction('generateLetter', true);
export const generateLetterFailure = createOutcomeAction('generateLetter');

export const updateBrakeForces = createAction(`${prefix} updateBrakesForces`, props<{ grossLadenWeight?: number; grossKerbWeight?: number }>());

export const updateBody = createAction(`${prefix} updatebody`, props<{ psvMake: PsvMake }>());

export const addAxle = createAction(`${prefix} addAxle`);
export const removeAxle = createAction(`${prefix} removeAxle`, props<{ index: number }>());

function createOutcomeAction(title: string, isSuccess: boolean = false): ActionCreator<string, (props: any) => any> {
  const suffix = isSuccess ? 'Success' : 'Failure';
  const type = `${prefix} ${title} ${suffix}`;

  const actionCreator: ActionCreatorProps<any> = isSuccess ? props<{ vehicleTechRecords: Array<VehicleTechRecordModel> }>() : props<GlobalError>();

  return createAction(type, actionCreator);
}
