import { V3TechRecordModel } from '@/src/app/models/vehicle-tech-record.model';
import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { Component, inject, input } from '@angular/core';
import { VehicleTechnicalRecordComponent } from './vehicle-technical-record-v1/vehicle-technical-record.component';
import { VehicleTechnicalRecordV2Component } from './vehicle-technical-record-v2/vehicle-technical-record-v2.component';

@Component({
	selector: 'app-vehicle-technical-record-wrapper',
	template: `
    @if (featureToggleService.isFeatureEnabled('techrecordredesigncreatedetails')) {
      <app-vehicle-technical-record-v2 [techRecord]="techRecord()" />
    } @else {
      <app-vehicle-technical-record [techRecord]="techRecord()" />
    }
  `,
	imports: [VehicleTechnicalRecordComponent, VehicleTechnicalRecordV2Component],
})
export class VehicleTechnicalRecordWrapperComponent {
	featureToggleService = inject(FeatureToggleService);

	readonly techRecord = input<V3TechRecordModel>();
}
