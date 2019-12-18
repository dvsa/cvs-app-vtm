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
import { StoreModule } from '@ngrx/store';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MaterialModule } from '@app/material.module';
import {RouterModule} from '@angular/router';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {TechnicalRecordComponent} from '@app/technical-record/technical-record.component';
import {InspectionDetailsModule} from '@app/inspection-details/inspection-details.module';
import { EffectsModule } from '@ngrx/effects';
import { adrDetailsReducer } from './store/technical-record.reducer';
import { DownloadDocumentsEffects } from './store/download-documents.effects';
import { VehicleTechRecordModelEffects } from '../store/effects/VehicleTechRecordModel.effects';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatFormFieldModule,
    HttpClientModule,
    RouterModule.forChild([
      {path: '', component: TechnicalRecordComponent,  canActivate: [AuthenticationGuard]}
    ]),
    StoreModule.forFeature('adrDetails', adrDetailsReducer),
    EffectsModule.forFeature([DownloadDocumentsEffects]),
    FormsModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgrxFormsModule,
    NgxJsonViewerModule,
    InspectionDetailsModule
  ],
  declarations: [
    TechnicalRecordComponent
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
