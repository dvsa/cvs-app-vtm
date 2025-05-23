import { GlobalError } from '@core/components/global-error/global-error.interface';
import { TestTypesTaxonomy } from '@models/test-types/testTypesTaxonomy';
import { createAction, props } from '@ngrx/store';

const prefix = '[API/test-types-taxonomy] ';

export const fetchTestTypes = createAction(`${prefix}Fetch All`);
export const fetchTestTypesSuccess = createAction(
	`${prefix}Fetch All Success`,
	props<{ payload: TestTypesTaxonomy }>()
);
export const fetchTestTypesFailed = createAction(`${prefix}Fetch All Failed`, props<GlobalError>());
export const fetchTestTypesComplete = createAction(`${prefix}Fetch All Complete`);
