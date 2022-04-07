import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { STORE_FEATURE_TEST_RECORD_KEY, testRecordServiceReducer } from './test-record-service.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TestRecordServiceEffects } from './test-record-service.effects';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(STORE_FEATURE_TEST_RECORD_KEY, testRecordServiceReducer), EffectsModule.forFeature([TestRecordServiceEffects])]
})
export class TestRecordStateModule {}
