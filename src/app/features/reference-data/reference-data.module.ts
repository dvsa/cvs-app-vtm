import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { AddReferenceDataComponent } from './reference-data-add/reference-data-add.component';
import { ReferenceDataListComponent } from './reference-data-list/reference-data-list.component';
import { ReferenceDataRoutingModule } from './reference-data-routing.module';
import { ReferenceDataSelectTypeComponent } from './reference-data-select-type/reference-data-select-type.component';
import { ReferenceDataAmendComponent } from './reference-data-amend/reference-data-amend/reference-data-amend.component';

@NgModule({
  declarations: [ReferenceDataSelectTypeComponent, ReferenceDataListComponent, AddReferenceDataComponent, ReferenceDataAmendComponent],
  imports: [CommonModule, DynamicFormsModule, RouterModule, ReactiveFormsModule, ReferenceDataRoutingModule, SharedModule]
})
export class ReferenceDataModule {}
