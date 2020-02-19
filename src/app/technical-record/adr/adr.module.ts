import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedModule } from '@app/shared';
import { AdrComponent } from './adr.component';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';
import { ApplicantDetailsEditComponent } from './applicant-details/edit/applicant-details-edit.component';
import { AdrDetailsComponent } from './adr-details/adr-details.component';
import { AdrDetailsEditComponent } from './adr-details/edit/adr-details-edit.component';
import { TankDetailsComponent } from './tank-details/tank-details.component';
import { TankDetailsEditComponent } from './tank-details/edit/tank-details-edit.component';
import { TankInpectionsComponent } from './tank-inpections/tank-inpections.component';
import { TankInspectionsEditComponent } from './tank-inpections/edit/tank-inspections-edit.component';
import { MemoComponent } from './memo/memo.component';
import { MemoEditComponent } from './memo/edit/memo-edit.component';
import { TankDocumentsComponent } from './tank-documents/tank-documents.component';
import { BatteryListApplicableComponent } from './battery-list-applicable/battery-list-applicable.component';
import { BatteryListApplicableEditComponent } from './battery-list-applicable/edit/battery-list-applicable-edit.component';
import { DeclarationSeenComponent } from './declaration-seen/declaration-seen.component';
import { DeclarationSeenEditComponent } from './declaration-seen/edit/declaration-seen-edit.component';
import { CertificateComponent } from './certificate/certificate.component';
import { CertificateEditComponent } from './certificate/edit/certificate-edit.component';
import { AdditionalAdrDetailsComponent } from './additional-adr-details/additional-adr-details.component';
import { AdditionalAdrDetailEditComponent } from './additional-adr-details/edit/additional-adr-detail-edit.component';

const COMPOSABLE = [
  AdrComponent,
  ApplicantDetailsComponent,
  ApplicantDetailsEditComponent,
  AdrDetailsComponent,
  AdrDetailsEditComponent,
  TankDetailsComponent,
  TankDetailsEditComponent,
  TankInpectionsComponent,
  TankInspectionsEditComponent,
  MemoComponent,
  MemoEditComponent,
  TankDocumentsComponent,
  BatteryListApplicableComponent,
  BatteryListApplicableEditComponent,
  DeclarationSeenComponent,
  DeclarationSeenEditComponent,
  CertificateComponent,
  CertificateEditComponent,
  AdditionalAdrDetailsComponent,
  AdditionalAdrDetailEditComponent
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  declarations: COMPOSABLE,
  exports: COMPOSABLE
})
export class AdrModule {}
