import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { ReferenceDataRoutingModule } from './reference-data-routing.module';
import { ReferenceDataComponent } from './reference-data.component';
import { DataTypeListComponent } from './data-type-list/data-type-list.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ReferenceDataComponent, DataTypeListComponent],
  imports: [CommonModule, DynamicFormsModule, RouterModule, ReactiveFormsModule, ReferenceDataRoutingModule, SharedModule]
})
export class ReferenceDataModule {}
