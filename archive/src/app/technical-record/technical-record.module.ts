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
import { RecordStatusComponent } from './record-status/record-status.component';
import { RecordStatusEditComponent } from './record-status/edit/record-status-edit.component';
import { RecordIdentificationComponent } from './record-identification/record-identification.component';
import { RecordIdentificationEditComponent } from './record-identification/edit/record-identification-edit.component';
import { VehicleSummaryComponent } from './vehicle-summary/vehicle-summary.component';
import { VehicleSummaryPsvComponent } from './vehicle-summary/vehicle-summary-psv/vehicle-summary-psv.component';
import { VehicleSummaryHgvComponent } from './vehicle-summary/vehicle-summary-hgv/vehicle-summary-hgv.component';
import { VehicleSummaryTrlComponent } from './vehicle-summary/vehicle-summary-trl/vehicle-summary-trl.component';
import { VehicleSummaryEditComponent } from './vehicle-summary/edit/vehicle-summary-edit.component';
import { TypeApprovalComponent } from './vehicle-summary/edit/type-approval/type-approval.component';
import { NotesEditComponent } from './notes/edit/notes-edit.component';
import { BodyComponent } from './body/body.component';
import { BodyEditComponent } from './body/edit/body-edit.component';
import { BodyPsvComponent } from './body/body-psv/body-psv.component';
import { NotesComponent } from './notes/notes.component';
import { TechRecHistoryComponent } from './tech-rec-history/tech-rec-history.component';
import { TestHistoryComponent } from './test-history/test-history.component';
import { WeightsComponent } from './weights/weights.component';
import { WeightsPsvComponent } from './weights/weights-psv/weights-psv.component';
import { WeightsEditComponent } from './weights/edit/weights-edit.component';
import { TyresComponent } from './tyres/tyres.component';
import { TyresEditComponent } from './tyres/edit/tyres-edit.component';
import { DimensionsComponent } from './dimensions/dimensions.component';
import { DimensionsEditComponent } from './dimensions/edit/dimensions-edit.component';
import { ApplicantComponent } from './applicant/applicant.component';
import { ApplicantEditComponent } from './applicant/edit/applicant-edit.component';
import { DocumentsComponent } from './documents/documents.component';
import { DocumentsEditComponent } from './documents/edit/documents-edit.component';
import { PlatesComponent } from './plates/plates.component';
import { BrakesComponent } from './brakes/brakes.component';
import { BrakesPsvComponent } from './brakes/brakes-psv/brakes-psv.component';
import { PurchaserComponent } from './purchaser/purchaser.component';
import { ManufacturerComponent } from './manufacturer/manufacturer.component';
import { AuthorisationIntoServiceComponent } from './authorisation-into-service/authorisation-into-service.component';
import { LettersOfAuthorisationComponent } from './letters-of-authorisation/letters-of-authorisation.component';
import { AxleBrakesComponent } from './brakes/axle-brakes/axle-brakes.component';
import { DdaComponent } from './dda/dda.component';
import { AdrModule } from './adr/adr.module';

const routes: Routes = [
  {
    path: '',
    component: TechnicalRecordsContainer
  }
];

const COMPONENTS = [
  TechnicalRecordsContainer,
  TechnicalRecordComponent,
  RecordStatusComponent,
  RecordStatusEditComponent,
  RecordIdentificationComponent,
  RecordIdentificationEditComponent,
  VehicleSummaryComponent,
  VehicleSummaryPsvComponent,
  VehicleSummaryHgvComponent,
  VehicleSummaryTrlComponent,
  VehicleSummaryEditComponent,
  TypeApprovalComponent,
  NotesEditComponent,
  BodyEditComponent,
  BodyComponent,
  BodyPsvComponent,
  WeightsComponent,
  WeightsPsvComponent,
  WeightsEditComponent,
  TyresComponent,
  TyresEditComponent,
  DimensionsComponent,
  DimensionsEditComponent,
  NotesComponent,
  TestHistoryComponent,
  TechRecHistoryComponent,
  ApplicantComponent,
  ApplicantEditComponent,
  DocumentsComponent,
  DocumentsEditComponent,
  PlatesComponent,
  BrakesComponent,
  BrakesPsvComponent,
  PurchaserComponent,
  ManufacturerComponent,
  AuthorisationIntoServiceComponent,
  LettersOfAuthorisationComponent,
  AxleBrakesComponent,
  DdaComponent
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
