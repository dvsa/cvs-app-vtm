import { GlobalError } from '@core/components/global-error/global-error.interface';
import { DefectGETIVA } from '@dvsa/cvs-type-definitions/types/iva/defects/get';
import { createAction, props } from '@ngrx/store';

const prefix = '[Required Standards]';

export const getRequiredStandards = createAction(`${prefix} getRequiredStandards`, props<{ euVehicleCategory: string }>());
export const getRequiredStandardsSuccess = createAction(`${prefix} getRequiredStandards Success`, props<{ requiredStandards: DefectGETIVA }>());
export const getRequiredStandardsFailure = createAction(`${prefix} getRequiredStandards Failure`, props<GlobalError>());
