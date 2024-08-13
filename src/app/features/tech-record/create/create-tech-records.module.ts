import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { SharedTechRecordsModule } from '../shared-tech-record.module';
import { TechRecordsModule } from '../tech-record.module';
import { HydrateNewVehicleRecordComponent } from './components/hydrate-new-vehicle-record/hydrate-new-vehicle-record.component';
import { CreateTechRecordComponent } from './create-tech-record.component';
import { CreateTechRecordsRoutingModule } from './create-tech-records-routing.module';

@NgModule({
	declarations: [CreateTechRecordComponent, HydrateNewVehicleRecordComponent],
	imports: [
		CommonModule,
		CreateTechRecordsRoutingModule,
		ReactiveFormsModule,
		DynamicFormsModule,
		RouterModule,
		SharedModule,
		TechRecordsModule,
		SharedTechRecordsModule,
	],
})
export class CreateTechRecordsModule {}
