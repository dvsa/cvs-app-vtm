import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { TestRecordsModule } from '../test-records.module';
import { AmendTestRecordsRoutingModule } from './amend-test-records-routing.module';
import { TestAmendmentHistoryComponent } from './components/test-amendment-history/test-amendment-history.component';
import { AmendTestComponent } from './views/amend-test/amend-test.component';
import { AmendedTestRecordComponent } from './views/amended-test-record/amended-test-record.component';
import { ConfirmCancellationComponent } from './views/confirm-cancellation/confirm-cancellation.component';
import { TestAmendReasonComponent } from './views/test-amend-reason/test-amend-reason.component';
import { TestRecordComponent } from './views/test-record/test-record.component';
import { TestResultSummaryComponent } from './views/test-result-summary/test-result-summary.component';
import { TestRouterOutletComponent } from './views/test-router-outlet/test-router-outlet.component';
import { TestTypeSelectWrapperComponent } from './views/test-type-select-wrapper/test-type-select-wrapper.component';

@NgModule({
	declarations: [
		AmendTestComponent,
		AmendedTestRecordComponent,
		ConfirmCancellationComponent,
		TestAmendmentHistoryComponent,
		TestAmendReasonComponent,
		TestRecordComponent,
		TestResultSummaryComponent,
		TestRouterOutletComponent,
		TestTypeSelectWrapperComponent,
	],
	imports: [
		AmendTestRecordsRoutingModule,
		CommonModule,
		DynamicFormsModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		TestRecordsModule,
	],
})
export class AmendTestRecordsModule {}
