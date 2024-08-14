import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FeatureToggleRoutingModule } from './feature-toggle-routing.module';
import { FeatureToggleComponent } from './feature-toggle/feature-toggle.component';

@NgModule({
	declarations: [FeatureToggleComponent],
	imports: [CommonModule, SharedModule, FeatureToggleRoutingModule],
})
export class FeatureToggleModule {}
