import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { TestService } from '@/src/app/services/test/test.service';
import { selectQueryParam } from '@/src/app/store/router/router.selectors';
import { Component, OnInit, Signal, inject } from '@angular/core';
import { TestRecordV2Component } from '@features/test-records/create/views/create-test-record-wrapper/create-test-record-v2/test-record-v2.component';
import { CreateTestRecordComponent } from '@features/test-records/create/views/create-test-record-wrapper/create-test-record/create-test-record.component';
import { Modes } from '@models/modes.enum';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-create-test-record-wrapper',
	template: `
    @if (useV2) {
      <app-test-record-v2 />
    } @else {
      <app-create-test-record />
    }
  `,
	imports: [CreateTestRecordComponent, TestRecordV2Component],
})
export class CreateTestRecordWrapperComponent implements OnInit {
	readonly store = inject(Store);
	readonly testService = inject(TestService);
	readonly featureToggleService = inject(FeatureToggleService);

	readonly testTypeId = this.store.selectSignal(selectQueryParam('testType')) as Signal<string>;
	readonly useV2 = this.featureToggleService.shouldUseV2TestResults(this.testTypeId());

	readonly Modes = Modes;

	ngOnInit(): void {
		this.testService.mode.set(Modes.EDIT);
		this.testService.initialMode.set(Modes.EDIT);
	}
}
