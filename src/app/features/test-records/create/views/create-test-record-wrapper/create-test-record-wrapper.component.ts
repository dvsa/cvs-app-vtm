import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { selectQueryParam } from '@/src/app/store/router/router.selectors';
import { Component, Signal, inject } from '@angular/core';
import { CreateTestRecordV2Component } from '@features/test-records/create/views/create-test-record-wrapper/create-test-record-v2/create-test-record-v2.component';
import { CreateTestRecordComponent } from '@features/test-records/create/views/create-test-record-wrapper/create-test-record/create-test-record.component';
import { Modes } from '@models/modes.enum';
import { TEST_TYPES_GROUP9_10_CENTRAL_DOCS } from '@models/testTypeId.enum';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-create-test-record-wrapper',
	template: `
    @if (useV2) {
      <app-create-test-record-v2 [mode]="Modes.EDIT"></app-create-test-record-v2>
    } @else {
      <app-create-test-record></app-create-test-record>
    }
  `,
	imports: [CreateTestRecordComponent, CreateTestRecordV2Component],
})
export class CreateTestRecordWrapperComponent {
	store = inject(Store);
	featureToggleService = inject(FeatureToggleService);

	testTypeId = this.store.selectSignal(selectQueryParam('testType')) as Signal<string>;
	testTypeIdAllowList = [...TEST_TYPES_GROUP9_10_CENTRAL_DOCS];

	useV2 =
		this.featureToggleService.isFeatureEnabled('testresultcreate') &&
		this.testTypeIdAllowList.includes(this.testTypeId());
	protected readonly Modes = Modes;
}
