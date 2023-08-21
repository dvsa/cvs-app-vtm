import { GlobalError } from '@core/components/global-error/global-error.interface';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { PsvMake } from '@models/reference-data.model';
import { VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { ActionCreator, ActionCreatorProps, createAction, props } from '@ngrx/store';

const prefix = '[Technical Record Service]';

export const getBySystemNumber = createAction(`${prefix} getBySystemNumber`, props<{ systemNumber: string }>());
export const getBySystemNumberSuccess = createOutcomeAction('getBySystemNumber', true);
export const getBySystemNumberFailure = createOutcomeAction('getBySystemNumber');

export const getTechRecordV3 = createAction(`${prefix} getTechRecordV3`, props<{ systemNumber: string; createdTimestamp: string }>());
export const getTechRecordV3Success = createOutcomeAction('getTechRecordV3', true);
export const getTechRecordV3Failure = createOutcomeAction('getTechRecordV3');

export const createVehicleRecord = createAction(`${prefix} createVehicleRecord`, props<{ vehicle: TechRecordType<'put'> }>());
export const createVehicleRecordSuccess = createOutcomeAction('createVehicleRecord', true);
export const createVehicleRecordFailure = createOutcomeAction('createVehicleRecord');

export const updateTechRecord = createAction(`${prefix} updateTechRecords`, props<{ vehicleTechRecord: TechRecordType<'put'> }>());
export const updateTechRecordSuccess = createOutcomeAction('updateTechRecords', true);
export const updateTechRecordFailure = createOutcomeAction('updateTechRecords');

export const amendVrm = createAction(
  `${prefix} amendVrm`,
  props<{ newVrm: string; cherishedTransfer: boolean; systemNumber: string; createdTimestamp: string }>()
);
export const amendVrmSuccess = createOutcomeAction('amendVrm', true);
export const amendVrmFailure = createOutcomeAction('amendVrm');

export const archiveTechRecord = createAction(
  `${prefix} archiveTechRecord`,
  props<{ systemNumber: string; createdTimestamp: string; reasonForArchiving: string }>()
);
export const archiveTechRecordSuccess = createOutcomeAction('archiveTechRecord', true);
export const archiveTechRecordFailure = createOutcomeAction('archiveTechRecord');

export const promoteTechRecord = createAction(
  `${prefix} promoteTechRecord`,
  props<{ systemNumber: string; createdTimestamp: string; reasonForPromoting: string }>()
);
export const promoteTechRecordSuccess = createOutcomeAction('promoteTechRecord', true);
export const promoteTechRecordFailure = createOutcomeAction('promoteTechRecord');

export const updateEditingTechRecord = createAction(`${prefix} updateEditingTechRecord`, props<{ vehicleTechRecord: TechRecordType<'put'> }>());
export const updateEditingTechRecordCancel = createAction(`${prefix} updateEditingTechRecordCancel`);

export const changeVehicleType = createAction(`${prefix} changeVehicleType`, props<{ techRecord_vehicleType: VehicleTypes }>());

export const createVehicle = createAction(`${prefix} createVehicle`, props<{ techRecord_vehicleType: VehicleTypes }>());

export const generatePlate = createAction(`${prefix} generatePlate`, props<{ reason: string }>());
export const generatePlateSuccess = createAction(`${prefix} generatePlate Success`);
export const generatePlateFailure = createOutcomeAction('generatePlate');

export const generateLetter = createAction(`${prefix} generateLetter`, props<{ letterType: string; paragraphId: number }>());
export const generateLetterSuccess = createAction(`${prefix} generateLetter Success`);
export const generateLetterFailure = createOutcomeAction('generateLetter');

export const updateBrakeForces = createAction(`${prefix} updateBrakesForces`, props<{ grossLadenWeight?: number; grossKerbWeight?: number }>());

export const updateBody = createAction(`${prefix} updatebody`, props<{ psvMake: PsvMake }>());

export const addAxle = createAction(`${prefix} addAxle`);
export const removeAxle = createAction(`${prefix} removeAxle`, props<{ index: number }>());

export const addSectionState = createAction(`${prefix} addSectionState`, props<{ section: string | number }>());
export const removeSectionState = createAction(`${prefix} removeSectionState`, props<{ section: string | number }>());
export const clearAllSectionStates = createAction(`${prefix} clearAllSectionState`);

function createOutcomeAction(title: string, isSuccess: boolean = false): ActionCreator<string, (props: any) => any> {
  const suffix = isSuccess ? 'Success' : 'Failure';
  const type = `${prefix} ${title} ${suffix}`;

  const actionCreator: ActionCreatorProps<any> = isSuccess ? props<{ vehicleTechRecord: Array<VehicleTechRecordModel> }>() : props<GlobalError>();

  return createAction(type, actionCreator);
}
