import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { TestService } from '@/src/app/services/test/test.service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { Component, OnInit, inject } from '@angular/core';
import { TestRecordComponent } from '@features/test-records/amend/views/test-record-wrapper/test-record/test-record.component';
import { TestRecordV2Component } from '@features/test-records/create/views/create-test-record-wrapper/create-test-record-v2/test-record-v2.component';
import { Modes } from '@models/modes.enum';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-test-record-wrapper',
	template: `
    @if (useV2) {
      <app-test-record-v2 />
    } @else {
      <app-test-records />
    }
  `,
	imports: [TestRecordComponent, TestRecordV2Component],
})
export class TestRecordWrapperComponent implements OnInit {
	readonly store = inject(Store);
	readonly testService = inject(TestService);
	readonly featureToggleService = inject(FeatureToggleService);

	readonly testResult = this.store.selectSignal(toEditOrNotToEdit);
	readonly useV2 = this.featureToggleService.shouldUseV2TestResults(this.testResult()?.testTypes?.[0]?.testTypeId);

	readonly Modes = Modes;

	ngOnInit(): void {
		this.testService.mode.set(Modes.AMEND);
		this.testService.initialMode.set(Modes.AMEND);
	}
}
