import { createAction, props } from '@ngrx/store';

export const setSpinnerState = createAction('[UI/spinner] set spinner state', props<{ showSpinner: boolean }>());
