import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SharedModule } from '../shared/shared.module';
import { NgrxFormsModule } from 'ngrx-forms';
import { StoreModule } from '@ngrx/store';
import { adrDetailsReducer } from '@app/store/reducers/adrDetailsForm.reducer';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MaterialModule } from '@app/material.module';
import { TechnicalRecordSearchComponent } from './technical-record-search.component';
import { RouterModule } from '@angular/router';
import { AuthenticationGuard } from 'microsoft-adal-angular6';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatFormFieldModule,
    HttpClientModule,
    IonicModule.forRoot(),
    StoreModule.forFeature('adrDetails', adrDetailsReducer),
    RouterModule.forChild([
        {path: 'search', component: TechnicalRecordSearchComponent,  canActivate: [AuthenticationGuard]},
    ]),
    FormsModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgrxFormsModule,
    NgxJsonViewerModule, 
  ],
  declarations: [
    TechnicalRecordSearchComponent, 
  ],
  exports: [
     TechnicalRecordSearchComponent
  ],
})
export class TechnicalRecordSearchModule {
  constructor() {
  }
}
