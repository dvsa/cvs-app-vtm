import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TestTypeEffects } from './effects/test-types.effects';
import { STORE_FEATURE_TEST_TYPES_KEY, testTypesReducer } from './reducers/test-types.reducer';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		StoreModule.forFeature(STORE_FEATURE_TEST_TYPES_KEY, testTypesReducer),
		EffectsModule.forFeature([TestTypeEffects]),
	],
})
export class TestTypesStateModule {}
