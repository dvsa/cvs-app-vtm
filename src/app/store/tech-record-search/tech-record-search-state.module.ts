import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TechSearchResultsEffects } from './tech-record-search.effect';
import { STORE_FEATURE_SEARCH_TECH_RESULTS_KEY, techSearchResultReducer } from './tech-record-search.reducer';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(STORE_FEATURE_SEARCH_TECH_RESULTS_KEY, techSearchResultReducer),
		EffectsModule.forFeature([TechSearchResultsEffects]),
	],
})
export class TechRecordSearchStateModule {}
