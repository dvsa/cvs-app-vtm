import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SharedModule } from '../../shared/shared.module';
import { NgrxFormsModule } from 'ngrx-forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MaterialModule } from '@app/material.module';
import {InspectionDetailsComponent} from '@app/technical-record/inspection-details/inspection-details.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatFormFieldModule,
    FormsModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgrxFormsModule,
    NgxJsonViewerModule
  ],
  declarations: [
    InspectionDetailsComponent
  ],
  exports: [
    InspectionDetailsComponent
  ],
  entryComponents: [InspectionDetailsComponent],
})
export class InspectionDetailsModule {
}
