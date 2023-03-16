import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { TechRecordsModule } from '../tech-record.module';
import { HydrateNewVehicleRecordComponent } from './components/hydrate-new-vehicle-record/hydrate-new-vehicle-record.component';
import { CreateTechRecordComponent } from './create-tech-record.component';
import { CreateTechRecordsRoutingModule } from './create-tech-records-routing.module';
import { BatchCreateResultsComponent } from './components/batch-create-results/batch-create-results.component';
import { GenerateBatchNumbersComponent } from './components/generate-batch-numbers/generate-batch-numbers.component';

@NgModule({
  declarations: [CreateTechRecordComponent, HydrateNewVehicleRecordComponent, BatchCreateResultsComponent, GenerateBatchNumbersComponent],
  imports: [CommonModule, CreateTechRecordsRoutingModule, ReactiveFormsModule, DynamicFormsModule, RouterModule, SharedModule, TechRecordsModule]
})
export class CreateTechRecordsModule {}
