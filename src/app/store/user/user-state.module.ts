import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { UserServiceEffects } from './user-service.effects';
import { STORE_FEATURE_USER_KEY, userServiceReducer } from './user-service.reducer';

export function localStorageSyncReducer(reducer: ActionReducer<unknown>): ActionReducer<unknown> {
	return localStorageSync({ keys: ['name', 'userEmail', 'oid', 'roles', 'jobTitle'], rehydrate: true })(reducer);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(STORE_FEATURE_USER_KEY, userServiceReducer, { metaReducers }),
		EffectsModule.forFeature([UserServiceEffects]),
	],
})
export class UserStateModule {}
