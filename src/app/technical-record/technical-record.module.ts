import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@app/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub, faMedium, faStackOverflow } from '@fortawesome/free-brands-svg-icons';
import {
  faCheckSquare as farCheckSquare,
  faSquare as farSquare
} from '@fortawesome/free-regular-svg-icons';
import {
  faCheckSquare,
  faCoffee,
  faMinus,
  faPlus,
  faSquare
} from '@fortawesome/free-solid-svg-icons';

import { SharedModule } from '../shared/shared.module';
import { TechnicalRecordsContainer } from './technical-record.container';
import { TechnicalRecordComponent } from '@app/technical-record/technical-record.component';
import { RecordIdentificationComponent } from './record-identification/record-identification.component';
import { RecordIdentificationEditComponent } from './record-identification/edit/record-identification-edit.component';
import { BodyComponent } from './body/body.component';
import { DimensionsComponent } from './dimensions/dimensions.component';
import { NotesComponent } from './notes/notes.component';
import { TechRecHistoryComponent } from './tech-rec-history/tech-rec-history.component';
import { TestHistoryComponent } from './test-history/test-history.component';
import { TyresComponent } from './tyres/tyres.component';
import { VehicleSummaryComponent } from './vehicle-summary/vehicle-summary.component';
import { WeightsComponent } from './weights/weights.component';
import { AdrModule } from './adr/adr.module';

import { TechnicalRecordFieldsComponent } from './technical-record-fields/technical-record-fields.component';
import { VehicleSummaryFieldsComponent } from './technical-record-fields/vehicle-summary/vehicle-summary.component';
import { BodyFieldsComponent } from './technical-record-fields/body-fields/body-fields.component';
import { WeightsFieldsComponent } from './technical-record-fields/weights-fields/weights-fields.component';
import { TyresFieldsComponent } from './technical-record-fields/tyres-fields/tyres-fields.component';
import { DimensionsFieldsComponent } from './technical-record-fields/dimensions-fields/dimensions-fields.component';
import { ApplicantFieldsComponent } from './technical-record-fields/applicant-fields/applicant-fields.component';
import { DocumentsFieldsComponent } from './technical-record-fields/documents-fields/documents-fields.component';
import { NotesFieldsComponent } from './technical-record-fields/notes-fields/notes-fields.component';

const routes: Routes = [
  {
    path: '',
    component: TechnicalRecordsContainer
  },
  {
    path: 'create',
    // component: TechnicalRecordsContainer
    component: TechnicalRecordFieldsComponent
  }
];

const COMPONENTS = [
  TechnicalRecordsContainer,
  TechnicalRecordComponent,
  RecordIdentificationComponent,
  RecordIdentificationEditComponent,
  VehicleSummaryComponent,
  BodyComponent,
  WeightsComponent,
  TyresComponent,
  DimensionsComponent,
  NotesComponent,
  TestHistoryComponent,
  TechRecHistoryComponent,

  // CLEAN UP FROM HERE
  TechnicalRecordFieldsComponent,
  VehicleSummaryFieldsComponent,
  BodyFieldsComponent,
  WeightsFieldsComponent,
  TyresFieldsComponent,
  DimensionsFieldsComponent,
  ApplicantFieldsComponent,
  DocumentsFieldsComponent,
  NotesFieldsComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(routes),
    AdrModule
  ],
  declarations: COMPONENTS,
  exports: [TechnicalRecordsContainer, TechnicalRecordComponent]
})
export class TechnicalRecordModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(
      faCoffee,
      faSquare,
      faCheckSquare,
      farSquare,
      farCheckSquare,
      faStackOverflow,
      faGithub,
      faMedium,
      faPlus,
      faMinus
    );
  }
}
