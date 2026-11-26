import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { TestService } from '@/src/app/services/test/test.service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { Component, OnInit, inject } from '@angular/core';
import { TestResultSummaryComponent } from '@features/test-records/amend/views/test-result-summary/test-result-summary.component';
import { TestRecordV2Component } from '@features/test-records/create/views/create-test-record-wrapper/create-test-record-v2/test-record-v2.component';
import { Modes } from '@models/modes.enum';
import { TEST_TYPES_GROUP1_SPEC_TEST, TEST_TYPES_GROUP9_10_CENTRAL_DOCS } from '@models/testTypeId.enum';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-test-result-summary-wrapper',
	template: `
    @if (featureToggleService.isFeatureEnabled('testresultamend') && testTypeIdAllowList.includes(testType()?.testTypes?.[0]?.testTypeId || '')) {
      <app-test-record-v2 />
    } @else {
      <app-test-result-summary />
    }
  `,
	imports: [TestRecordV2Component, TestResultSummaryComponent],
})
export class TestResultSummaryWrapperComponent implements OnInit {
	readonly store = inject(Store);
	readonly testService = inject(TestService);
	readonly featureToggleService = inject(FeatureToggleService);

	readonly testType = this.store.selectSignal(toEditOrNotToEdit);
	readonly testTypeIdAllowList = [...TEST_TYPES_GROUP9_10_CENTRAL_DOCS, ...TEST_TYPES_GROUP1_SPEC_TEST];
	readonly Modes = Modes;

	ngOnInit(): void {
		this.testService.mode.set(Modes.VIEW);
		this.testService.initialMode.set(Modes.VIEW);
	}
}
