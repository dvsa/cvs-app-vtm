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
import { EditTechRecordButtonComponent } from './components/edit-tech-record-button/edit-tech-record-button.component';
import { TechAmendReasonComponent } from './components/tech-amend-reason/tech-amend-reason.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TechPromoteComponent } from './components/tech-promote/tech-promote.component';
import { TechRecordTitleComponent } from './components/tech-record-title/tech-record-title.component';

@NgModule({
  declarations: [
    EditTechRecordButtonComponent,
    TechRecordComponent,
    TechRecordHistoryComponent,
    TechRecordSummaryComponent,
    TestRecordSummaryComponent,
    VehicleTechnicalRecordComponent,
    TechAmendReasonComponent,
    TechPromoteComponent,
    TechRecordTitleComponent
  ],
  imports: [
    CommonModule,
    DynamicFormsModule,
    ReactiveFormsModule,
    SharedModule,
    TechRecordsRoutingModule],
  exports: [EditTechRecordButtonComponent]
})
export class TechRecordsModule {}
