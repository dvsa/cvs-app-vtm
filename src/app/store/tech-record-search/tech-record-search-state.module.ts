import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { STORE_FEATURE_SEARCH_TECH_RESULTS_KEY, techSearchResultReducer } from './reducer/tech-record-search.reducer';
import { TechSearchResultsEffects } from './effects/tech-record-search.effect';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(STORE_FEATURE_SEARCH_TECH_RESULTS_KEY, techSearchResultReducer),
    EffectsModule.forFeature([TechSearchResultsEffects]),
  ],
})
export class TechRecordSearchStateModule {}
