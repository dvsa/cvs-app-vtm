import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DynamicFormsModule } from '../../forms/dynamic-forms.module';
import { TestRecordsRoutingModule } from './test-records-routing.module';
import { TestRecordsComponent } from './test-records.component';
import { TestRecordComponent } from './views/test-result/test-records-summary.component';

@NgModule({
  declarations: [TestRecordsComponent, TestRecordComponent],
  imports: [CommonModule, TestRecordsRoutingModule, DynamicFormsModule, SharedModule]
})
export class TestRecordsModule {}
