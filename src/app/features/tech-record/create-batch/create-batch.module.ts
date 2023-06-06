import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { CreateTechRecordsModule } from '../create/create-tech-records.module';
import { SharedTechRecordsModule } from '../shared-tech-record.module';
import { BatchTrlTemplateComponent } from './components/batch-trl-template/batch-trl-template.component';
import { CreateBatchRoutingModule } from './create-batch-routing.module';
import { BatchTrlDetailsComponent } from './components/batch-trl-details/batch-trl-details.component';
import { BatchTrlResultsComponent } from './components/batch-trl-results/batch-trl-results.component';
import { SelectVehicleTypeComponent } from './components/select-vehicle-type/select-vehicle-type.component';

@NgModule({
  declarations: [BatchTrlTemplateComponent, BatchTrlDetailsComponent, BatchTrlResultsComponent, SelectVehicleTypeComponent],
  imports: [
    CommonModule,
    CreateBatchRoutingModule,
    SharedTechRecordsModule,
    ReactiveFormsModule,
    DynamicFormsModule,
    RouterModule,
    SharedModule,
    CreateTechRecordsModule
  ]
})
export class CreateBatchModule {}
