import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DefectsEffects } from './defects.effects';
import { STORE_FEATURE_DEFECTS_KEY, defectsReducer } from './defects.reducer';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(STORE_FEATURE_DEFECTS_KEY, defectsReducer),
		EffectsModule.forFeature([DefectsEffects]),
	],
})
export class DefectsStateModule {}
