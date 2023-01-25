import { GlobalError } from '@core/components/global-error/global-error.interface';
import { createAction, props } from '@ngrx/store';
import { ActionCreator, ActionCreatorProps } from '@ngrx/store/src/models';
import { StatusCodes, VehicleTechRecordModel, VehicleTypes } from '../../../models/vehicle-tech-record.model';

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

export const updateEditingTechRecord = createAction('[tech-record] Update editing', props<{ vehicleTechRecord: VehicleTechRecordModel }>());
export const updateEditingTechRecordCancel = createAction('[tech-record] Update editing cancelled');

export const changeVehicleType = createAction('[tech-record] vehicle type changed', props<{ vehicleType: VehicleTypes }>());

export const createVehicle = createAction('[tech-record] create vehicle', props<{ vehicleType: VehicleTypes }>());

function createOutcomeAction(title: string, isSuccess: boolean = false): ActionCreator<string, (props: any) => any> {
  const suffix = isSuccess ? 'Success' : 'Failure';
  const type = `${prefix} ${title} ${suffix}`;

  const actionCreator: ActionCreatorProps<any> = isSuccess ? props<{ vehicleTechRecords: Array<VehicleTechRecordModel> }>() : props<GlobalError>();

  return createAction(type, actionCreator);
}
