import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { Component, inject } from '@angular/core';
import { TestRecordComponent } from '@features/test-records/amend/views/test-record-wrapper/test-record/test-record.component';
import { TestRecordV2Component } from '@features/test-records/create/views/create-test-record-wrapper/create-test-record-v2/test-record-v2.component';
import { Modes } from '@models/modes.enum';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-test-record-wrapper',
	template: `
    @if (useV2) {
      <app-test-record-v2 [initialMode]="Modes.AMEND" />
    } @else {
      <app-test-records />
    }
  `,
	imports: [TestRecordComponent, TestRecordV2Component],
})
export class TestRecordWrapperComponent {
	store = inject(Store);
	featureToggleService = inject(FeatureToggleService);

	testResult = this.store.selectSignal(toEditOrNotToEdit);
	useV2 = this.featureToggleService.shouldUseV2TestResults(this.testResult()?.testTypes?.[0]?.testTypeId || '');

	protected readonly Modes = Modes;
}
