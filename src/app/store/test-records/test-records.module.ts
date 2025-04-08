import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TestResultsEffects } from './test-records.effects';
import { STORE_FEATURE_TEST_RESULTS_KEY, testResultsReducer } from './test-records.reducer';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(STORE_FEATURE_TEST_RESULTS_KEY, testResultsReducer),
		EffectsModule.forFeature([TestResultsEffects]),
	],
})
export class TestRecordsStateModule {}
