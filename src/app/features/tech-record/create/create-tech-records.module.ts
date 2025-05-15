import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TechRecordsModule } from '../tech-record.module';
import { HydrateNewVehicleRecordComponent } from './components/hydrate-new-vehicle-record/hydrate-new-vehicle-record.component';
import { CreateTechRecordComponent } from './create-tech-record.component';
import { CreateTechRecordsRoutingModule } from './create-tech-records-routing.module';

@NgModule({
	imports: [
		CommonModule,
		CreateTechRecordsRoutingModule,
		ReactiveFormsModule,
		RouterModule,
		TechRecordsModule,
		CreateTechRecordComponent,
		HydrateNewVehicleRecordComponent,
	],
})
export class CreateTechRecordsModule {}
