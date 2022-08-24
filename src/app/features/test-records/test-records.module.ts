import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DynamicFormsModule } from '../../forms/dynamic-forms.module';
import { BaseTestRecordComponent } from './components/base-test-record/base-test-record.component';
import { TestAmendmentHistoryComponent } from './components/test-amendment-history/test-amendment-history.component';
import { TestRecordsRoutingModule } from './test-records-routing.module';
import { AmendedTestRecordComponent } from './views/amended-test-record/amended-test-record.component';
import { TestRecordComponent } from './views/test-record/test-record.component';
import { ResultOfTestComponent } from './components/result-of-test/result-of-test.component';
import { TestResultSummaryComponent } from './views/test-result-summary/test-result-summary.component';
import { IncorrectTestTypeComponent } from './views/incorrect-test-type/incorrect-test-type.component';
import { AmendTestComponent } from './views/amend-test/amend-test.component';
import { TestAmendReasonComponent } from './views/test-amend-reason/test-amend-reason.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestTypeSelectComponent } from './components/test-type-select/test-type-select.component';
import { VehicleHeaderComponent } from './components/vehicle-header/vehicle-header.component';

@NgModule({
  declarations: [
    TestRecordComponent,
    AmendedTestRecordComponent,
    TestAmendmentHistoryComponent,
    BaseTestRecordComponent,
    ResultOfTestComponent,
    TestResultSummaryComponent,
    IncorrectTestTypeComponent,
    AmendTestComponent,
    TestAmendReasonComponent,
    TestTypeSelectComponent,
    VehicleHeaderComponent
  ],
  imports: [CommonModule, TestRecordsRoutingModule, DynamicFormsModule, SharedModule, FormsModule, ReactiveFormsModule]
})
export class TestRecordsModule {}
