import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DynamicFormsModule } from '../../forms/dynamic-forms.module';
import { TestRecordSummaryComponent } from './components/test-record-summary/test-record-summary.component';
import { TechRecordsRoutingModule } from './tech-record-routing.module';
import { TechRecordComponent } from './tech-record.component';
import { TechRecordHistoryComponent } from './components/tech-record-history/tech-record-history.component';
import { TechRecordSummaryComponent } from './components/tech-record-summary/tech-record-summary.component';
import { VehicleTechnicalRecordComponent } from './components/vehicle-technical-record/vehicle-technical-record.component';

@NgModule({
  declarations: [TechRecordComponent, TechRecordSummaryComponent, VehicleTechnicalRecordComponent, TestRecordSummaryComponent, TechRecordHistoryComponent],
  imports: [CommonModule, DynamicFormsModule, TechRecordsRoutingModule, SharedModule]
})
export class TechRecordsModule {}
