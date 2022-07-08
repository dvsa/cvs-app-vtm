import { createAction, props } from '@ngrx/store';

export const Login = createAction('[User Service] Login', props<{ name: string; username: string; oid: string }>());
export const Logout = createAction('[User Service] Logout');
