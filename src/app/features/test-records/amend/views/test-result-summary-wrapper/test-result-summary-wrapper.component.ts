import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { Component, inject } from '@angular/core';
import { TestResultSummaryComponent } from '@features/test-records/amend/views/test-result-summary/test-result-summary.component';
import { TestRecordV2Component } from '@features/test-records/create/views/create-test-record-wrapper/create-test-record-v2/test-record-v2.component';
import { Modes } from '@models/modes.enum';
import { TEST_TYPES_GROUP9_10_CENTRAL_DOCS } from '@models/testTypeId.enum';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-test-result-summary-wrapper',
	template: `
    @if (featureToggleService.isFeatureEnabled('testresultamend') && testTypeIdAllowList.includes(testType()?.testTypes?.[0]?.testTypeId || '')) {
      <app-test-record-v2 [initialMode]="Modes.VIEW" />
    } @else {
      <app-test-result-summary />
    }
  `,
	imports: [TestRecordV2Component, TestResultSummaryComponent],
})
export class TestResultSummaryWrapperComponent {
	store = inject(Store);
	featureToggleService = inject(FeatureToggleService);

	testType = this.store.selectSignal(toEditOrNotToEdit);
	testTypeIdAllowList = [...TEST_TYPES_GROUP9_10_CENTRAL_DOCS];
	protected readonly Modes = Modes;
}
