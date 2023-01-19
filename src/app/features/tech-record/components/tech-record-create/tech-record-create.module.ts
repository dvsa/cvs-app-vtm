import { TechRecordCreateComponent } from './tech-record-create.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { TechRecordsRoutingModule } from '../../tech-record-routing.module';

@NgModule({
  declarations: [TechRecordCreateComponent],
  imports: [CommonModule, DynamicFormsModule, ReactiveFormsModule, SharedModule, TechRecordsRoutingModule]
})
export class TechRecordCreateModule {}
