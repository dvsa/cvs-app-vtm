import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { BatchCreateRoutingModule } from './batch-create-routing.module';
import { BatchCreateComponent } from './batch-create.component';

@NgModule({
  declarations: [BatchCreateComponent],
  imports: [CommonModule, BatchCreateRoutingModule, SharedModule, DynamicFormsModule, FormsModule, ReactiveFormsModule]
})
export class BatchCreateModule {}
