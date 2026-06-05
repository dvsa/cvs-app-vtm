import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { environment } from '@environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { GlobalErrorStateModule } from '@store/global-error/global-error-state.module';
import { reducers } from '@store/index';
import { STORE_FEATURE_LOGS_KEY } from '@store/logs/logs.feature';
import { LogsModule } from '@store/logs/logs.module';
import { localStorageSync } from 'ngrx-store-localstorage';
import { DefectsStateModule } from './defects/defects-state.module';
import { FeatureFlagsEffects } from './feature-flags/feature-flags.effects';
import { GlobalWarningStateModule } from './global-warning/global-warning-state.module';
import { LoadingEffects } from './loading/loading.effects';
import { ReferenceDataStateModule } from './reference-data/reference-data.module';
import { RequiredStandardsStateModule } from './required-standards/required-standards.module';
import { RouterStateModule } from './router/router-state.module';
import { TechRecordSearchStateModule } from './tech-record-search/tech-record-search-state.module';
import { TechnicalRecordsStateModule } from './technical-records/technical-records-state.module';
import { TestRecordsStateModule } from './test-records/test-records.module';
import { TestStationsStateModule } from './test-stations/test-stations-state.module';
import { TestTypesStateModule } from './test-types/test-types.module';
import { UserStateModule } from './user/user-state.module';

function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
	return localStorageSync({ keys: [STORE_FEATURE_LOGS_KEY], rehydrate: true })(reducer);
}

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forRoot(reducers, { metaReducers: [localStorageSyncReducer] }),
		EffectsModule.forRoot([FeatureFlagsEffects, LoadingEffects]),
		environment.EnableDevTools
			? StoreDevtoolsModule.instrument({
					name: 'VTM Web Dev Tools',
					maxAge: 25, // Retains last 25 states
					logOnly: environment.production, // Log-only mode in production
				})
			: [],
		DefectsStateModule,
		GlobalErrorStateModule,
		GlobalWarningStateModule,
		ReferenceDataStateModule,
		RouterStateModule,
		TechnicalRecordsStateModule,
		TestRecordsStateModule,
		TestStationsStateModule,
		TestTypesStateModule,
		UserStateModule,
		TechRecordSearchStateModule,
		RequiredStandardsStateModule,
		LogsModule,
	],
})
export class AppStoreModule {}
