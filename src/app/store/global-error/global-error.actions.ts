import { GlobalError } from '@core/components/global-error/global-error.interface';
import { createAction, props } from '@ngrx/store';

export const clearError = createAction('[Global Error Service] Clear Error');
export const addError = createAction('[Global Error Service] Add error', props<GlobalError>());
export const setErrors = createAction('[Global Error Service] Set errors', props<{ errors: GlobalError[] }>());
export const patchErrors = createAction('[Global Error Service] Patch errors', props<{ errors: GlobalError[] }>());
