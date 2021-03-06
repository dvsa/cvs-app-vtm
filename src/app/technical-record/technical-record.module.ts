import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material.module';
import { TechnicalRecordComponent } from '@app/technical-record/technical-record.component';
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
import { AuthenticationGuard } from 'microsoft-adal-angular6';
import { NgrxFormsModule } from 'ngrx-forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { SharedModule } from '../shared/shared.module';
import { BodyComponent } from './body/body.component';
import { DimensionsComponent } from './dimensions/dimensions.component';
import { NotesComponent } from './notes/notes.component';
import { TechRecHistoryComponent } from './tech-rec-history/tech-rec-history.component';
import { TestHistoryComponent } from './test-history/test-history.component';
import { TyresComponent } from './tyres/tyres.component';
import { VehicleSummaryComponent } from './vehicle-summary/vehicle-summary.component';
import { WeightsComponent } from './weights/weights.component';
import { ApplicantComponent } from './applicant/applicant.component';
import { DocumentsComponent } from './documents/documents.component';
import { PlatesComponent } from './plates/plates.component';
import { BrakesComponent } from './brakes/brakes.component';
import { PurchaserComponent } from './purchaser/purchaser.component';
import { ManufacturerComponent } from './manufacturer/manufacturer.component';
import { AuthorisationIntoServiceComponent } from './authorisation-into-service/authorisation-into-service.component';
import { LettersOfAuthorisationComponent } from './letters-of-authorisation/letters-of-authorisation.component';
import { AxleBrakesComponent } from './brakes/axle-brakes/axle-brakes.component';

import { AdrModule } from './adr/adr.module';
import { TechnicalRecordsContainer } from './technical-record.container';
import { DdaComponent } from './dda/dda.component';
import { BrakesPsvComponent } from './brakes/brakes-psv/brakes-psv.component';
import { BodyPsvComponent } from './body/body-psv/body-psv.component';
import { WeightsPsvComponent } from './weights/weights-psv/weights-psv.component';
import { VehicleSummaryPsvComponent } from './vehicle-summary/vehicle-summary-psv/vehicle-summary-psv.component';
import { VehicleSummaryHgvComponent } from './vehicle-summary/vehicle-summary-hgv/vehicle-summary-hgv.component';
import { VehicleSummaryTrlComponent } from './vehicle-summary/vehicle-summary-trl/vehicle-summary-trl.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatFormFieldModule,
    RouterModule.forChild([
      {
        path: '',
        component: TechnicalRecordsContainer,
        canActivate: [AuthenticationGuard],
        runGuardsAndResolvers: 'always'
      }
    ]),
    FormsModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgrxFormsModule,
    NgxJsonViewerModule,
    AdrModule
  ],
  declarations: [
    TechnicalRecordsContainer,
    TechnicalRecordComponent,
    VehicleSummaryComponent,
    BodyComponent,
    WeightsComponent,
    TyresComponent,
    DimensionsComponent,
    NotesComponent,
    TestHistoryComponent,
    TechRecHistoryComponent,
    ApplicantComponent,
    DocumentsComponent,
    PlatesComponent,
    BrakesComponent,
    PurchaserComponent,
    ManufacturerComponent,
    AuthorisationIntoServiceComponent,
    LettersOfAuthorisationComponent,
    AxleBrakesComponent,
    DdaComponent,
    BrakesPsvComponent,
    BodyPsvComponent,
    WeightsPsvComponent,
    VehicleSummaryPsvComponent,
    VehicleSummaryHgvComponent,
    VehicleSummaryTrlComponent
  ],
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
