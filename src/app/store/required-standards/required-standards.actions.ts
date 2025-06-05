import { GlobalError } from '@core/components/global-error/global-error.interface';
import { DefectGETRequiredStandards } from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import { createAction, props } from '@ngrx/store';

const prefix = '[Required Standards]';

export const getRequiredStandards = createAction(
	`${prefix} getRequiredStandards`,
	props<{ euVehicleCategory: string }>()
);
export const getRequiredStandardsSuccess = createAction(
	`${prefix} getRequiredStandards Success`,
	props<{ requiredStandards: DefectGETRequiredStandards }>()
);
export const getRequiredStandardsFailure = createAction(`${prefix} getRequiredStandards Failure`, props<GlobalError>());
export const getRequiredStandardsComplete = createAction(`${prefix} getRequiredStandards Complete`);
