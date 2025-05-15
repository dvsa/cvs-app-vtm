import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TechnicalRecordServiceEffects } from './technical-record-service.effects';
import { STORE_FEATURE_TECHNICAL_RECORDS_KEY, vehicleTechRecordReducer } from './technical-record-service.reducer';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(STORE_FEATURE_TECHNICAL_RECORDS_KEY, vehicleTechRecordReducer),
		EffectsModule.forFeature([TechnicalRecordServiceEffects]),
	],
})
export class TechnicalRecordsStateModule {}
