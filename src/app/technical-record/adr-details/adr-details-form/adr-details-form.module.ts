import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgrxFormsModule } from 'ngrx-forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MaterialModule } from '@app/material.module';
import { AdrDetailsFormComponent } from './adr-details-form.component';
import { SharedModule } from '@app/shared/shared.module';
import { InspectionDetailsModule } from '@app/technical-record/inspection-details/inspection-details.module';
import { StoreModule } from '@ngrx/store';
import { adrDetailsReducer } from '@app/technical-record/adr-details/adr-details-form/store/adrDetails.reducer';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatFormFieldModule,
    StoreModule.forFeature('adrDetails', adrDetailsReducer),
    FormsModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgrxFormsModule,
    NgxJsonViewerModule,
    InspectionDetailsModule
  ],
  declarations: [AdrDetailsFormComponent],
  exports: [AdrDetailsFormComponent],
  entryComponents: [AdrDetailsFormComponent]
})
export class AdrDetailsFormModule {}
