import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { Component, inject } from '@angular/core';
import { HydrateNewVehicleRecordComponent } from './hydrate-new-vehicle-record-v1/hydrate-new-vehicle-record.component';
import { HydrateNewVehicleRecordV2Component } from './hydrate-new-vehicle-record-v2/hydrate-new-vehicle-record-v2.component';

@Component({
	selector: 'app-hydrate-new-vehicle-record-wrapper',
	template: `
    @if (featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
      <app-hydrate-new-vehicle-record-v2 />
    } @else {
      <app-hydrate-new-vehicle-record />
    }
  `,
	imports: [HydrateNewVehicleRecordComponent, HydrateNewVehicleRecordV2Component],
})
export class HydrateNewVehicleRecordWrapperComponent {
	featureToggleService = inject(FeatureToggleService);
}
