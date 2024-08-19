import { GlobalWarning } from '@core/components/global-warning/global-warning.interface';
import { createAction, props } from '@ngrx/store';

export const clearWarning = createAction('[Global Warning Service] Clear Warning');
export const setWarnings = createAction(
	'[Global Warning Service] Set warnings',
	props<{ warnings: GlobalWarning[] }>()
);
