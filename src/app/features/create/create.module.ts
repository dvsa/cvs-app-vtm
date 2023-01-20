import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRoutingModule } from './create-routing.module';
import { RouterModule } from '@angular/router';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { CreateComponent } from './create.component';
import { HydrateNewVehicleRecordComponent } from './components/hydrate-new-vehicle-record/hydrate-new-vehicle-record.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateComponent, HydrateNewVehicleRecordComponent],
  imports: [CommonModule, CreateRoutingModule, ReactiveFormsModule, DynamicFormsModule, RouterModule, SharedModule]
})
export class CreateModule {}
