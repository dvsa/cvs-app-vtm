import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TechnicalRecordServiceEffects } from './effects/technical-record-service.effects';
import { STORE_FEATURE_TECHNICAL_RECORDS_KEY, vehicleTechRecordReducer } from './reducers/technical-record-service.reducer';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(STORE_FEATURE_TECHNICAL_RECORDS_KEY, vehicleTechRecordReducer), EffectsModule.forFeature([TechnicalRecordServiceEffects])]
})
export class TechnicalRecordsStateModule {}
