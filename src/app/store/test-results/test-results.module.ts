import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TestResultsEffects } from './effects/test-results.effects';
import { STORE_FEATURE_TEST_RESULTS_KEY, testResultsReducer } from './reducers/test-results.reducer';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(STORE_FEATURE_TEST_RESULTS_KEY, testResultsReducer), EffectsModule.forFeature([TestResultsEffects])]
})
export class TestResultsStateModule {}
