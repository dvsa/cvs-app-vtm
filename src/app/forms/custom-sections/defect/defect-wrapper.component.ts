import { TEST_TYPES_GROUP9_10_CENTRAL_DOCS } from '@/src/app/models/testTypeId.enum';
import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { selectQueryParam } from '@/src/app/store/router/router.selectors';
import { Component, Signal, inject } from '@angular/core';
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

	testTypeId = this.store.selectSignal(selectQueryParam('testType')) as Signal<string>;
	testTypeIdAllowList = [...TEST_TYPES_GROUP9_10_CENTRAL_DOCS];

	useV2 =
		this.featureToggleService.isFeatureEnabled('testresultcreate') &&
		this.testTypeIdAllowList.includes(this.testTypeId());
}
