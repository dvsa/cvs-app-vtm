import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FeatureToggleRoutingModule } from './feature-toggle-routing.module';
import { FeatureToggleComponent } from './feature-toggle/feature-toggle.component';

@NgModule({
	imports: [CommonModule, FeatureToggleRoutingModule, FeatureToggleComponent],
})
export class FeatureToggleModule {}
