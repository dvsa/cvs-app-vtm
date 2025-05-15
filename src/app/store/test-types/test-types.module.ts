import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TestTypeEffects } from './test-types.effects';
import { STORE_FEATURE_TEST_TYPES_KEY, testTypesReducer } from './test-types.reducer';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(STORE_FEATURE_TEST_TYPES_KEY, testTypesReducer),
		EffectsModule.forFeature([TestTypeEffects]),
	],
})
export class TestTypesStateModule {}
