import { GlobalError } from '@core/components/global-error/global-error.interface';
import { createAction, props } from '@ngrx/store';
import { ActionCreator, ActionCreatorProps } from '@ngrx/store/src/models';
import { VehicleTechRecordModel } from '../../../models/vehicle-tech-record.model';

const prefix = '[Technical Record Service]'

export const getByVin = createAction(`${prefix} getByVin`, props<{ vin: string }>());
export const getByVinSuccess = createOutcomeAction('getByVin', true);
export const getByVinFailure = createOutcomeAction('getByVin');

export const getByPartialVin = createAction(`${prefix} getByPartialVin`, props<{ partialVin: string }>());
export const getByPartialVinSuccess = createOutcomeAction('getByPartialVin', true);
export const getByPartialVinFailure = createOutcomeAction('getByPartialVin');

export const getByVrm = createAction(`${prefix} getByVrm`, props<{ vrm: string }>());
export const getByVrmSuccess = createOutcomeAction('getByVrm', true);
export const getByVrmFailure = createOutcomeAction('getByVrm');

function createOutcomeAction(title: string, isSuccess: boolean = false): ActionCreator<string, (props: any) => any> {
  const suffix = isSuccess ? 'Success' : 'Failure';
  const type = `${prefix} ${title} ${suffix}`;

  const actionCreator: ActionCreatorProps<any> = isSuccess
    ? props<{ vehicleTechRecords: Array<VehicleTechRecordModel> }>()
    : props<GlobalError>();

  return createAction(type, actionCreator);
}
