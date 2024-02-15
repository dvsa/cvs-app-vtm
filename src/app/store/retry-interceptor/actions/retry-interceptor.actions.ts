import { createAction, props } from '@ngrx/store';

export const retryInterceptorFailure = createAction('[retry-interceptor] retryInterceptorFailure', props<{ error: string }>());
