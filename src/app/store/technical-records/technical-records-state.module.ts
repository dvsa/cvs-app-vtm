import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { STORE_FEATURE_TECHNICAL_RECORDS_KEY, vehicleTechRecordReducer } from './technical-record-service.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TechnicalRecordServiceEffects } from './technical-record-service.effects';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(STORE_FEATURE_TECHNICAL_RECORDS_KEY, vehicleTechRecordReducer),
    EffectsModule.forFeature([TechnicalRecordServiceEffects])
  ]
})
export class TechnicalRecordsStateModule { }
