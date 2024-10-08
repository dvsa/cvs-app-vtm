import { createAction, props } from '@ngrx/store';

export const Login = createAction(
	'[User Service] Login',
	props<{ name: string; userEmail: string; oid: string; roles?: string[] }>()
);
export const Logout = createAction('[User Service] Logout');
