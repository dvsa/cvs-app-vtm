import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { Component, inject } from '@angular/core';
import { TestRecordV2Component } from '@features/test-records/amend/views/test-record-wrapper/test-record-v2/test-record-v2.component';
import { TestRecordComponent } from '@features/test-records/amend/views/test-record-wrapper/test-record/test-record.component';
import { TEST_TYPES_GROUP9_10_CENTRAL_DOCS } from '@models/testTypeId.enum';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-test-record-wrapper',
	template: `
    @if (featureToggleService.isFeatureEnabled('testresultamend') && testTypeIdAllowList.includes(testType()?.testTypes?.[0]?.testTypeId || '')) {
      <app-test-record-v2 />
    } @else {
      <app-test-records />
    }
  `,
	imports: [TestRecordComponent, TestRecordV2Component],
})
export class TestRecordWrapperComponent {
	store = inject(Store);
	featureToggleService = inject(FeatureToggleService);

	testType = this.store.selectSignal(toEditOrNotToEdit);
	testTypeIdAllowList = [...TEST_TYPES_GROUP9_10_CENTRAL_DOCS];
}
