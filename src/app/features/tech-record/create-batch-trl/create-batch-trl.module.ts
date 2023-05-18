import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { CreateTechRecordsModule } from '../create/create-tech-records.module';
import { SharedTechRecordsModule } from '../shared-tech-record.module';
import { BatchTrlTemplateComponent } from './components/batch-trl-template/batch-trl-template.component';
import { CreateBatchTrlRoutingModule } from './create-batch-trl-routing.module';
import { BatchTrlDetailsComponent } from './components/batch-trl-details/batch-trl-details.component';
import { BatchTrlResultsComponent } from './components/batch-trl-results/batch-trl-results.component';

@NgModule({
  declarations: [BatchTrlTemplateComponent, BatchTrlDetailsComponent, BatchTrlResultsComponent],
  imports: [
    CommonModule,
    CreateBatchTrlRoutingModule,
    SharedTechRecordsModule,
    ReactiveFormsModule,
    DynamicFormsModule,
    RouterModule,
    SharedModule,
    CreateTechRecordsModule
  ]
})
export class CreateBatchTrlModule {}
