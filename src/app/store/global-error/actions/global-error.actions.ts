import { createAction, props } from "@ngrx/store";
import { GlobalError } from "src/app/features/global-error/global-error.service";


export const clearError = createAction('[Global Error Service] Clear Error');
export const addError = createAction('[Global Error Service] Add error', props<GlobalError>())