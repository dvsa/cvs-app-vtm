import { GlobalError } from '@core/components/global-error/global-error.interface';
import { createAction, props } from '@ngrx/store';
import { ActionCreator, ActionCreatorProps } from '@ngrx/store/src/models';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '../../../models/vehicle-tech-record.model';
import { TestResultModel } from '@models/test-results/test-result.model';

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

export const putUpdateTechRecords = createAction(`${prefix} putUpdateTechRecords`, props<{ systemNumber: string, oldStatusCode?: StatusCodes  }>());
export const putUpdateTechRecordsSuccess = createOutcomeAction('putUpdateTechRecords', true);
export const putUpdateTechRecordsFailure = createOutcomeAction('putUpdateTechRecords');

export const postProvisionalTechRecord = createAction(`${prefix} postProvisionalTechRecord`, props<{ systemNumber: string}>());
export const postProvisionalTechRecordSuccess = createOutcomeAction('postProvisionalTechRecord', true);
export const postProvisionalTechRecordFailure = createOutcomeAction('postProvisionalTechRecord');

export const updateEditingTechRecord = createAction('[tech-record] Update editing', props<{ techRecord: TechRecordModel }>());
export const updateEditingTechRecordCancel = createAction('[tech-record] Update editing cancelled');

function createOutcomeAction(title: string, isSuccess: boolean = false): ActionCreator<string, (props: any) => any> {
  const suffix = isSuccess ? 'Success' : 'Failure';
  const type = `${prefix} ${title} ${suffix}`;

  const actionCreator: ActionCreatorProps<any> = isSuccess ? props<{ vehicleTechRecords: Array<VehicleTechRecordModel> }>() : props<GlobalError>();

  return createAction(type, actionCreator);
}
