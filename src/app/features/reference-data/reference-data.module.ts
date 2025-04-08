import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ReferenceDataCreateComponent } from './reference-data-add/reference-data-add.component';
import { ReferenceDataAmendHistoryComponent } from './reference-data-amend-history/reference-data-amend-history.component';
import { ReferenceDataAmendComponent } from './reference-data-amend/reference-data-amend.component';
import { ReferenceDataDeleteComponent } from './reference-data-delete/reference-data-delete.component';
import { ReferenceDataDeletedListComponent } from './reference-data-deleted-list/reference-data-deleted-list.component';
import { ReferenceDataListComponent } from './reference-data-list/reference-data-list.component';
import { ReferenceDataRoutingModule } from './reference-data-routing.module';
import { ReferenceDataSelectTypeComponent } from './reference-data-select-type/reference-data-select-type.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		ReferenceDataRoutingModule,
		ReferenceDataSelectTypeComponent,
		ReferenceDataListComponent,
		ReferenceDataDeletedListComponent,
		ReferenceDataCreateComponent,
		ReferenceDataAmendComponent,
		ReferenceDataDeleteComponent,
		ReferenceDataAmendHistoryComponent,
	],
})
export class ReferenceDataModule {}
