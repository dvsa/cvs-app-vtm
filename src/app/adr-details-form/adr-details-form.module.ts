import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgrxFormsModule } from 'ngrx-forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MaterialModule } from '@app/material.module';
import { AdrDetailsFormComponent } from './adr-details-form.component';
import { SharedModule } from '@app/shared/shared.module';
import { InspectionDetailsModule } from '@app/inspection-details/inspection-details.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { adrDetailsReducer } from '@app/adr-details-form/store/adrDetails.reducer';
import { DownloadDocumentsEffects } from '@app/adr-details-form/store/download-documents.effects';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatFormFieldModule,
    HttpClientModule,
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
    AdrDetailsFormComponent
  ],
  exports: [
    AdrDetailsFormComponent
  ],
  entryComponents: [AdrDetailsFormComponent],
})
export class AdrDetailsFormModule {
}
