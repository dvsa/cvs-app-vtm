import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ReferenceDataEffects } from './reference-data.effects';
import { STORE_FEATURE_REFERENCE_DATA_KEY, referenceDataReducer } from './reference-data.reducer';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(STORE_FEATURE_REFERENCE_DATA_KEY, referenceDataReducer),
		EffectsModule.forFeature([ReferenceDataEffects]),
	],
})
export class ReferenceDataStateModule {}
