import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CreateTechRecordsModule } from '../create/create-tech-records.module';

import { BatchVehicleDetailsComponent } from './components/batch-vehicle-details/batch-vehicle-details.component';
import { BatchVehicleResultsComponent } from './components/batch-vehicle-results/batch-vehicle-results.component';
import { BatchVehicleTemplateComponent } from './components/batch-vehicle-template/batch-vehicle-template.component';
import { SelectVehicleTypeComponent } from './components/select-vehicle-type/select-vehicle-type.component';
import { CreateBatchRoutingModule } from './create-batch-routing.module';

@NgModule({
	imports: [
		CommonModule,
		CreateBatchRoutingModule,
		ReactiveFormsModule,
		RouterModule,
		CreateTechRecordsModule,
		BatchVehicleTemplateComponent,
		BatchVehicleDetailsComponent,
		BatchVehicleResultsComponent,
		SelectVehicleTypeComponent,
	],
})
export class CreateBatchModule {}
