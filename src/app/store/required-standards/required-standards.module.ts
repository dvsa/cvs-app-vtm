import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { RequiredStandardsEffects } from './required-standards.effects';
import { STORE_FEATURE_REQUIRED_STANDARDS_KEY, requiredStandardsReducer } from './required-standards.reducer';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(STORE_FEATURE_REQUIRED_STANDARDS_KEY, requiredStandardsReducer),
		EffectsModule.forFeature([RequiredStandardsEffects]),
	],
})
export class RequiredStandardsStateModule {}
