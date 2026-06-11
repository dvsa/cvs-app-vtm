import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { DefectV2Component } from './defect-v2/defect-v2.component';
import { DefectComponent } from './defect/defect.component';

@Component({
	selector: 'app-defect-wrapper',
	imports: [DefectComponent, DefectV2Component],
	template: `
      @if (useV2) {
      <app-defect-v2></app-defect-v2>
    } @else {
      <app-defect></app-defect>
    }
  `,
})
export class DefectWrapperComponent {
	store = inject(Store);
	featureToggleService = inject(FeatureToggleService);

	testType = this.store.selectSignal(toEditOrNotToEdit);
	useV2 = this.featureToggleService.shouldUseV2TestResults(this.testType()?.testTypes?.[0]?.testTypeId);
}
