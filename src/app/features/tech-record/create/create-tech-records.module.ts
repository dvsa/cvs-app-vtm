import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTechRecordsRoutingModule } from './create-tech-records-routing.module';
import { RouterModule } from '@angular/router';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { CreateTechRecordComponent } from './create-tech-record.component';
import { HydrateNewVehicleRecordComponent } from './components/hydrate-new-vehicle-record/hydrate-new-vehicle-record.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TechRecordsModule } from '../tech-record.module';

@NgModule({
  declarations: [CreateTechRecordComponent, HydrateNewVehicleRecordComponent],
  imports: [CommonModule, CreateTechRecordsRoutingModule, ReactiveFormsModule, DynamicFormsModule, RouterModule, SharedModule, TechRecordsModule]
})
export class CreateTechRecordsModule {}
