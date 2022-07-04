import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ReferenceDataEffects } from './effects/reference-data.effects';
import { STORE_FEATURE_REFERENCE_DATA_KEY, referenceDataReducer } from './reducers/reference-data.reducer';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(STORE_FEATURE_REFERENCE_DATA_KEY, referenceDataReducer), EffectsModule.forFeature([ReferenceDataEffects])]
})
export class ReferenceDataStateModule {}
