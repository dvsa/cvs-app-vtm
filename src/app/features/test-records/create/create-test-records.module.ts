import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { DynamicFormsModule } from '../../../forms/dynamic-forms.module';
import { TestRecordsModule } from '../test-records.module';
import { CreateTestRecordsRoutingModule } from './create-test-records-routing.module';
import { CreateTestRecordComponent } from './views/create-test-record/create-test-record.component';
import { CreateTestTypeComponent } from './views/create-test-type/create-test-type.component';
import { TestRouterOutletComponent } from './views/test-router-outlet/test-router-outlet.component';

@NgModule({
	declarations: [CreateTestTypeComponent, CreateTestRecordComponent, TestRouterOutletComponent],
	imports: [
		CommonModule,
		CreateTestRecordsRoutingModule,
		DynamicFormsModule,
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
		TestRecordsModule,
	],
})
export class CreateTestRecordsModule {}
