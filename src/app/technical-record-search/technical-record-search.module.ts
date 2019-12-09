import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatFormFieldModule} from '@angular/material/form-field';
import {SharedModule} from '../shared/shared.module';
import {NgrxFormsModule} from 'ngrx-forms';
import {StoreModule} from '@ngrx/store';
import {adrDetailsReducer} from '@app/store/reducers/adrDetailsForm.reducer';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MaterialModule} from '@app/material.module';
import {TechnicalRecordSearchComponent} from './technical-record-search.component';
import {RouterModule} from '@angular/router';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {TechnicalRecordService} from './technical-record.service';
import {TestResultService} from './test-result.service';
import {AdrReasonModalComponent} from '@app/shared/adr-reason-modal/adr-reason-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatFormFieldModule,
    HttpClientModule,
    StoreModule.forFeature('adrDetails', adrDetailsReducer),
    RouterModule.forChild([
      {path: '', component: TechnicalRecordSearchComponent, canActivate: [AuthenticationGuard]},
      {
        path: 'technical-record',
        loadChildren: '../technical-record/technical-record.module#TechnicalRecordModule',
        canActivate: [AuthenticationGuard]
      }
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
    TechnicalRecordSearchComponent,
  ],
  providers: [TechnicalRecordService, TestResultService],
  entryComponents: [AdrReasonModalComponent],
})
export class TechnicalRecordSearchModule {
}
