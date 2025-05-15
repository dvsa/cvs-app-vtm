import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CreateTestRecordsRoutingModule } from './create-test-records-routing.module';
import { CreateTestRecordComponent } from './views/create-test-record/create-test-record.component';
import { CreateTestTypeComponent } from './views/create-test-type/create-test-type.component';
import { TestRouterOutletComponent } from './views/test-router-outlet/test-router-outlet.component';

@NgModule({
	imports: [
		CommonModule,
		CreateTestRecordsRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		CreateTestTypeComponent,
		CreateTestRecordComponent,
		TestRouterOutletComponent,
	],
})
export class CreateTestRecordsModule {}
