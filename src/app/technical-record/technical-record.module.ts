import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material.module';
import { PendingChangesGuard } from '@app/shared/pending-changes-guard/pending-changes.guard';
import { TechnicalRecordComponent } from '@app/technical-record/technical-record.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub, faMedium, faStackOverflow } from '@fortawesome/free-brands-svg-icons';
import { faCheckSquare as farCheckSquare, faSquare as farSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheckSquare, faCoffee, faMinus, faPlus, faSquare } from '@fortawesome/free-solid-svg-icons';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthenticationGuard } from 'microsoft-adal-angular6';
import { NgrxFormsModule } from 'ngrx-forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { SharedModule } from '../shared/shared.module';
import { AdrDetailsViewComponent } from './adr-details/adr-details-view/adr-details-view.component';
import { AdrDetailsComponent } from './adr-details/adr-details.component';
import { BodyComponent } from './body/body.component';
import { DimensionsComponent } from './dimensions/dimensions.component';
import { NotesComponent } from './notes/notes.component';
import { TechRecHistoryComponent } from './tech-rec-history/tech-rec-history.component';
import { TestHistoryComponent } from './test-history/test-history.component';
import { TyresComponent } from './tyres/tyres.component';
import { VehicleSummaryComponent } from './vehicle-summary/vehicle-summary.component';
import { WeightsComponent } from './weights/weights.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatFormFieldModule,
    RouterModule.forChild([
      { path: '', component: TechnicalRecordComponent, canActivate: [AuthenticationGuard], runGuardsAndResolvers: "always", canDeactivate: [PendingChangesGuard] }
    ]),
    FormsModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgrxFormsModule,
    NgxJsonViewerModule,
  ],
  declarations: [
    TechnicalRecordComponent,
    VehicleSummaryComponent,
    BodyComponent,
    WeightsComponent,
    TyresComponent,
    DimensionsComponent,
    NotesComponent,
    TestHistoryComponent,
    TechRecHistoryComponent,
    AdrDetailsViewComponent,
    AdrDetailsComponent
  ],
  exports: [
    TechnicalRecordComponent
  ]
})
export class TechnicalRecordModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(faCoffee, faSquare, faCheckSquare, farSquare, farCheckSquare, faStackOverflow, faGithub, faMedium, faPlus, faMinus);
  }
}
