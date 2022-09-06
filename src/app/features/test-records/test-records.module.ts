import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { DynamicFormsModule } from '../../forms/dynamic-forms.module';
import { BaseTestRecordComponent } from './components/base-test-record/base-test-record.component';
import { ResultOfTestComponent } from './components/result-of-test/result-of-test.component';
import { TestAmendmentHistoryComponent } from './components/test-amendment-history/test-amendment-history.component';
import { TestTypeSelectComponent } from './components/test-type-select/test-type-select.component';
import { VehicleHeaderComponent } from './components/vehicle-header/vehicle-header.component';
import { TestRecordsRoutingModule } from './test-records-routing.module';
import { AmendedTestRecordComponent } from './views/amended-test-record/amended-test-record.component';
import { CreateTestRecordComponent } from './views/create-test-record/create-test-record.component';
import { CreateTestTypeComponent } from './views/create-test-type/create-test-type.component';
import { IncorrectTestTypeComponent } from './views/incorrect-test-type/incorrect-test-type.component';
import { TestAmendReasonComponent } from './views/test-amend-reason/test-amend-reason.component';
import { TestRecordComponent } from './views/test-record/test-record.component';
import { TestResultSummaryComponent } from './views/test-result-summary/test-result-summary.component';
import { TestRouterOutletComponent } from './views/test-router-outlet/test-router-outlet.component';
import { TestTypeSelectWrapperComponent } from './views/test-type-select-wrapper/test-type-select-wrapper.component';

@NgModule({
  declarations: [
    TestRecordComponent,
    AmendedTestRecordComponent,
    TestAmendmentHistoryComponent,
    BaseTestRecordComponent,
    ResultOfTestComponent,
    TestResultSummaryComponent,
    IncorrectTestTypeComponent,
    TestRouterOutletComponent,
    TestAmendReasonComponent,
    TestTypeSelectComponent,
    VehicleHeaderComponent,
    TestTypeSelectWrapperComponent,
    CreateTestTypeComponent,
    CreateTestRecordComponent
  ],
  imports: [CommonModule, TestRecordsRoutingModule, DynamicFormsModule, SharedModule, FormsModule, ReactiveFormsModule]
})
export class TestRecordsModule {}
