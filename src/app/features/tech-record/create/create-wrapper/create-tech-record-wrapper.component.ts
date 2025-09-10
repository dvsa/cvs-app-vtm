import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { Component, inject } from '@angular/core';
import { CreateTechRecordComponent } from './create-v1/create-tech-record.component';
import { CreateTechRecordV2Component } from './create-v2/create-tech-record-v2.component';

@Component({
	selector: 'app-create-tech-record-wrapper',
	template: `
    @if (featureToggleService.isFeatureEnabled('techrecordredesigncreate')) {
      <app-create-tech-record-v2 />
    } @else {
      <app-create />
    }
  `,
	imports: [CreateTechRecordComponent, CreateTechRecordV2Component],
})
export class CreateTechRecordWrapperComponent {
	featureToggleService = inject(FeatureToggleService);
}
