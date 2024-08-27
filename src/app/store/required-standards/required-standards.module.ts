import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { RequiredStandardsEffects } from './effects/required-standards.effects';
import { STORE_FEATURE_REQUIRED_STANDARDS_KEY, requiredStandardsReducer } from './reducers/required-standards.reducer';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		StoreModule.forFeature(STORE_FEATURE_REQUIRED_STANDARDS_KEY, requiredStandardsReducer),
		EffectsModule.forFeature([RequiredStandardsEffects]),
	],
})
export class RequiredStandardsStateModule {}
