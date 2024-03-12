import { TestTypesTaxonomy } from '@api/test-types';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { createAction, props } from '@ngrx/store';

const prefix = '[API/test-types-taxonomy] ';

export const fetchTestTypes = createAction(`${prefix}Fetch All`);
export const fetchTestTypesSuccess = createAction(`${prefix}Fetch All Success`, props<{ payload: TestTypesTaxonomy }>());
export const fetchTestTypesFailed = createAction(`${prefix}Fetch All Failed`, props<GlobalError>());

export const setTestTypesLoading = createAction(`${prefix}Set Loading`, props<{ loading: boolean }>());
