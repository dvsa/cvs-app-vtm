import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TestStationsEffects } from './effects/test-stations.effects';
import { STORE_FEATURE_TEST_STATIONS_KEY, testStationsReducer } from './reducers/test-stations.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([TestStationsEffects]),
    StoreModule.forFeature(STORE_FEATURE_TEST_STATIONS_KEY, testStationsReducer)
  ]
})
export class TestStationsStateModule {}
