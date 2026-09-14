import { FeatureFlags, FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { Component, inject } from '@angular/core';
import { TechRecordSummaryChangesComponent } from './tech-record-summary-changes-v1/tech-record-summary-changes.component';
import { TechRecordSummaryChangesV2Component } from './tech-record-summary-changes-v2/tech-record-summary-changes-v2.component';

@Component({
	selector: 'app-tech-record-summary-changes-wrapper',
	template: `
    @if (featureToggleService.isFeatureEnabled(FeatureFlags.TECH_RECORD_REDESIGN_CREATE_DETAILS)) {
      <app-tech-record-summary-changes-v2 />
    } @else {
      <app-tech-record-summary-changes />
    }
  `,
	imports: [TechRecordSummaryChangesComponent, TechRecordSummaryChangesV2Component],
})
export class TechRecordSummaryChangesWrapperComponent {
	featureToggleService = inject(FeatureToggleService);
	FeatureFlags = FeatureFlags;
}
