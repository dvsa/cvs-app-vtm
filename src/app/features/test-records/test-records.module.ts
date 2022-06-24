import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DynamicFormsModule } from '../../forms/dynamic-forms.module';
import { BaseTestRecordComponent } from './components/base-test-record/base-test-record.component';
import { TestAmendmentHistoryComponent } from './components/test-amendment-history/test-amendment-history.component';
import { TestRecordsRoutingModule } from './test-records-routing.module';
import { AmendedTestRecordComponent } from './views/amended-test-record/amended-test-record.component';
import { TestRecordComponent } from './views/test-record/test-record.component';

@NgModule({
  declarations: [TestRecordComponent, AmendedTestRecordComponent, TestAmendmentHistoryComponent, BaseTestRecordComponent],
  imports: [CommonModule, TestRecordsRoutingModule, DynamicFormsModule, SharedModule]
})
export class TestRecordsModule {}
