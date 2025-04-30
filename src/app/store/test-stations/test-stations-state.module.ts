import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TestStationsEffects } from './test-stations.effects';
import { STORE_FEATURE_TEST_STATIONS_KEY, testStationsReducer } from './test-stations.reducer';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(STORE_FEATURE_TEST_STATIONS_KEY, testStationsReducer),
		EffectsModule.forFeature([TestStationsEffects]),
	],
})
export class TestStationsStateModule {}
