import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { STORE_FEATURE_TEST_TYPES_KEY, testTypesReducer } from './reducers/test-types.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TestTypeEffects } from './effects/test-types.effects';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(STORE_FEATURE_TEST_TYPES_KEY, testTypesReducer), EffectsModule.forFeature([TestTypeEffects])]
})
export class TestTypesStateModule {}
