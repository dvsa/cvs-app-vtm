import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { BaseTestRecordComponent } from './components/base-test-record/base-test-record.component';
import { TestTypeSelectComponent } from './components/test-type-select/test-type-select.component';
import { VehicleHeaderComponent } from './components/vehicle-header/vehicle-header.component';

@NgModule({
  declarations: [BaseTestRecordComponent, TestTypeSelectComponent, VehicleHeaderComponent],
  imports: [CommonModule, SharedModule, DynamicFormsModule, RouterModule],
  exports: [BaseTestRecordComponent, TestTypeSelectComponent, VehicleHeaderComponent],
})
export class TestRecordsModule {}
