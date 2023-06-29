import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { ReferenceDataCreateComponent } from './reference-data-add/reference-data-add.component';
import { ReferenceDataListComponent } from './reference-data-list/reference-data-list.component';
import { ReferenceDataRoutingModule } from './reference-data-routing.module';
import { ReferenceDataSelectTypeComponent } from './reference-data-select-type/reference-data-select-type.component';
import { ReferenceDataDeleteComponent } from './reference-data-delete/reference-data-delete.component';
import { ReferenceDataAmendComponent } from './reference-data-amend/reference-data-amend.component';
import { ReferenceDataAmendHistoryComponent } from './reference-data-amend-history/reference-data-amend-history.component';
import { ReferenceDataDeletedListComponent } from './reference-data-deleted-list/reference-data-deleted-listcomponent';

@NgModule({
  declarations: [
    ReferenceDataSelectTypeComponent,
    ReferenceDataListComponent,
    ReferenceDataDeletedListComponent,
    ReferenceDataCreateComponent,
    ReferenceDataAmendComponent,
    ReferenceDataDeleteComponent,
    ReferenceDataAmendHistoryComponent
  ],
  imports: [CommonModule, DynamicFormsModule, RouterModule, ReactiveFormsModule, ReferenceDataRoutingModule, SharedModule]
})
export class ReferenceDataModule {}
