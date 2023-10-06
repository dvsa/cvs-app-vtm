import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DefectsEffects } from './effects/defects.effects';
import { defectsReducer, STORE_FEATURE_DEFECTS_KEY } from './reducers/defects.reducer';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(STORE_FEATURE_DEFECTS_KEY, defectsReducer), EffectsModule.forFeature([DefectsEffects])],
})
export class DefectsStateModule {}
