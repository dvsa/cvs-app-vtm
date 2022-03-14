import { createAction, props } from '@ngrx/store';

export const setUsername = createAction('[User Service] Set Username', props<{ name: string; }>());
