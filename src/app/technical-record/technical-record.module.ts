import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCheckSquare, faCoffee, faPlus, faMinus, faSquare} from '@fortawesome/free-solid-svg-icons';
import {faCheckSquare as farCheckSquare, faSquare as farSquare} from '@fortawesome/free-regular-svg-icons';
import {faGithub, faMedium, faStackOverflow} from '@fortawesome/free-brands-svg-icons';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SharedModule } from '../shared/shared.module';
import { NgrxFormsModule } from 'ngrx-forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MaterialModule } from '@app/material.module';
import {RouterModule} from '@angular/router';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {TechnicalRecordComponent} from '@app/technical-record/technical-record.component';
import { EffectsModule } from '@ngrx/effects';
import { AdrDetailsFormModule } from '@app/technical-record/adr-details/adr-details-form/adr-details-form.module';
import { AdrDetailsSubmitEffects } from '@app/technical-record/store/adr-details-submit-effects';
import { StoreModule } from '@ngrx/store';
import { AdrDetailsSubmitReducer } from './store/adrDetailsSubmit.reducer';
import { VehicleSummaryComponent } from './vehicle-summary/vehicle-summary.component';
import { BodyComponent } from './body/body.component';
import { WeightsComponent } from './weights/weights.component';
import { TyresComponent } from './tyres/tyres.component';
import { DimensionsComponent } from './dimensions/dimensions.component';
import { NotesComponent } from './notes/notes.component';
import { TestHistoryComponent } from './test-history/test-history.component';
import { TechRecHistoryComponent } from './tech-rec-history/tech-rec-history.component';
import { AdrDetailsViewComponent } from './adr-details/adr-details-view/adr-details-view.component';
import { AdrDetailsComponent } from './adr-details/adr-details.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatFormFieldModule,
    HttpClientModule,
    RouterModule.forChild([
      {path: '', component: TechnicalRecordComponent,  canActivate: [AuthenticationGuard], runGuardsAndResolvers: "always"}
    ]),
    StoreModule.forFeature('adrDetailsSubmit', AdrDetailsSubmitReducer),
    EffectsModule.forFeature([AdrDetailsSubmitEffects]),
    FormsModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgrxFormsModule,
    NgxJsonViewerModule,
    AdrDetailsFormModule
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
