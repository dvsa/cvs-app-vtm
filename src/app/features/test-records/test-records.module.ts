import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DynamicFormsModule } from '../../forms/dynamic-forms.module';
import { TestRecordsRoutingModule } from './test-records-routing.module';
import { TestRecordsComponent } from './test-records.component';
import { TestRecordComponent } from './views/test-record/test-record.component';
import { ArchivedTestRecordComponent } from './views/archived-test-record/archived-test-record.component';

@NgModule({
  declarations: [TestRecordsComponent, TestRecordComponent, ArchivedTestRecordComponent],
  imports: [CommonModule, TestRecordsRoutingModule, DynamicFormsModule, SharedModule]
})
export class TestRecordsModule {}
