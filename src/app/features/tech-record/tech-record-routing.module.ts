import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { CancelEditTechActivateGuard } from '@guards/cancel-edit-tech/cancel-edit-tech.guard';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { TechRecordRoutes } from '@models/routes.enum';
import { ReasonForEditing } from '@models/vehicle-tech-record.model';
import { techRecordCleanResolver } from 'src/app/resolvers/tech-record-clean/tech-record-clean.resolver';
import { techRecordDataResolver } from 'src/app/resolvers/tech-record-data/tech-record-data.resolver';
import { techRecordValidateResolver } from 'src/app/resolvers/tech-record-validate/tech-record-validate.resolver';
import { techRecordViewResolver } from 'src/app/resolvers/tech-record-view/tech-record-view.resolver';
import {
  AdrGenerateCertificateComponent,
} from './components/adr-generate-certificate/adr-generate-certificate.component';
import {
  TechRecordAmendReasonComponent,
} from './components/tech-record-amend-reason/tech-record-amend-reason.component';
import { AmendVinComponent } from './components/tech-record-amend-vin/tech-record-amend-vin.component';
import {
  AmendVrmReasonComponent,
} from './components/tech-record-amend-vrm-reason/tech-record-amend-vrm-reason.component';
import { AmendVrmComponent } from './components/tech-record-amend-vrm/tech-record-amend-vrm.component';
import {
  TechRecordChangeStatusComponent,
} from './components/tech-record-change-status/tech-record-change-status.component';
import { ChangeVehicleTypeComponent } from './components/tech-record-change-type/tech-record-change-type.component';
import {
  TechRecordChangeVisibilityComponent,
} from './components/tech-record-change-visibility/tech-record-change-visibility.component';
import {
  TechRecordEditAdditionalExaminerNoteComponent,
} from './components/tech-record-edit-additional-examiner-note/tech-record-edit-additional-examiner-note.component';
import {
  GenerateLetterComponent,
} from './components/tech-record-generate-letter/tech-record-generate-letter.component';
import { GeneratePlateComponent } from './components/tech-record-generate-plate/tech-record-generate-plate.component';
import {
  TechRecordSearchTyresComponent,
} from './components/tech-record-search-tyres/tech-record-search-tyres.component';
import {
  TechRecordSummaryChangesComponent,
} from './components/tech-record-summary-changes/tech-record-summary-changes.component';
import { TechRecordUnarchiveComponent } from './components/tech-record-unarchive/tech-record-unarchive-component';
import { TechRecordComponent } from './tech-record.component';

const routes: Routes = [
  {
    path: '',
    component: TechRecordComponent,
    data: { roles: Roles.TechRecordView, isCustomLayout: true },
    canActivateChild: [MsalGuard, RoleGuard],
    canActivate: [CancelEditTechActivateGuard],
    resolve: {
      load: techRecordViewResolver,
      data: techRecordDataResolver,
    },
  },
  {
    path: TechRecordRoutes.CORRECT_ERROR,
    component: TechRecordComponent,
    data: {
      roles: Roles.TechRecordAmend,
      isEditing: true,
      reason: ReasonForEditing.CORRECTING_AN_ERROR,
      isCustomLayout: true,
    },
    canActivate: [MsalGuard, RoleGuard],
    resolve: {
      techRecord: techRecordViewResolver,
      load: techRecordValidateResolver,
      clean: techRecordCleanResolver,
    },
  },
  {
    path: TechRecordRoutes.NOTIFIABLE_ALTERATION_NEEDED,
    component: TechRecordComponent,
    data: {
      roles: Roles.TechRecordAmend,
      isEditing: true,
      reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED,
      isCustomLayout: true,
    },
    canActivate: [MsalGuard, RoleGuard],
    resolve: {
      techRecord: techRecordViewResolver,
      load: techRecordValidateResolver,
      clean: techRecordCleanResolver,
    },
  },

  {
    path: TechRecordRoutes.CHANGE_VIN,
    component: AmendVinComponent,
    data: { title: 'Change VIN', roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
  },
  {
    path: TechRecordRoutes.CHANGE_VRM,
    component: AmendVrmReasonComponent,
    data: { title: 'Change VRM', roles: Roles.TechRecordAmend, isEditing: true },
    canActivate: [MsalGuard, RoleGuard],
  },
  {
    path: TechRecordRoutes.REASON_TO_CHANGE_VRM,
    component: AmendVrmComponent,
    data: { title: 'Change VRM', roles: Roles.TechRecordAmend, isEditing: true },
    canActivate: [MsalGuard, RoleGuard],
  },
  {
    path: TechRecordRoutes.GENERATE_PLATE,
    component: GeneratePlateComponent,
    data: { title: 'Generate plate', roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { load: techRecordViewResolver },
  },
  {
    path: TechRecordRoutes.GENERATE_LETTER,
    component: GenerateLetterComponent,
    data: { title: 'Generate letter', roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { load: techRecordViewResolver },
  },
  {
    path: TechRecordRoutes.AMEND_REASON,
    component: TechRecordAmendReasonComponent,
    data: { roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
  },
  {
    path: TechRecordRoutes.CHANGE_STATUS,
    component: TechRecordChangeStatusComponent,
    data: { title: 'Promote or Archive Tech Record', roles: Roles.TechRecordArchive },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { load: techRecordViewResolver },
  },
  {
    path: TechRecordRoutes.UNARCHIVE_RECORD,
    component: TechRecordUnarchiveComponent,
    data: { title: 'Unarchive Record', roles: Roles.TechRecordUnarchive },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { load: techRecordViewResolver },
  },
  {
    path: TechRecordRoutes.CHANGE_VEHICLE_TYPE,
    component: ChangeVehicleTypeComponent,
    data: { title: 'Change vehicle type', roles: Roles.TechRecordAmend, isEditing: true },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: techRecordViewResolver },
  },
  {
    path: TechRecordRoutes.CHANGE_VTA_VISIBILITY,
    component: TechRecordChangeVisibilityComponent,
    data: { roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: techRecordViewResolver },
  },
  {
    path: TechRecordRoutes.CORRECT_ERROR_TYRE_SEARCH,
    component: TechRecordSearchTyresComponent,
    data: {
      title: 'Tyre search',
      roles: Roles.TechRecordAmend,
      isEditing: true,
      reason: ReasonForEditing.CORRECTING_AN_ERROR,
    },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: techRecordViewResolver },
  },
  {
    path: TechRecordRoutes.CORRECT_ERROR_CHANGE_SUMMARY,
    component: TechRecordSummaryChangesComponent,
    data: {
      roles: Roles.TechRecordAmend,
      isEditing: true,
    },
    canActivate: [MsalGuard, RoleGuard],
  },
  {
    path: TechRecordRoutes.CORRECT_ERROR_EDIT_ADDITIONAL_EXAMINER_NOTE,
    component: TechRecordEditAdditionalExaminerNoteComponent,
    data: {
      title: 'Edit Additional Examiner Note',
      roles: Roles.TechRecordAmend,
      isEditing: true,
      reason: ReasonForEditing.CORRECTING_AN_ERROR,
    },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: techRecordViewResolver },
  },
  {
    path: TechRecordRoutes.NOTIFIABLE_ALTERATION_NEEDED_CHANGE_SUMMARY,
    component: TechRecordSummaryChangesComponent,
    data: {
      roles: Roles.TechRecordAmend,
      isEditing: true,
    },
    canActivate: [MsalGuard, RoleGuard],
  },
  {
    path: TechRecordRoutes.NOTIFIABLE_ALTERATION_NEEDED_TYRE_SEARCH,
    component: TechRecordSearchTyresComponent,
    data: {
      title: 'Tyre search',
      roles: Roles.TechRecordAmend,
      isEditing: true,
      reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED,
    },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: techRecordViewResolver },
  },
  {
    path: TechRecordRoutes.NOTIFIABLE_ALTERNATION_NEEDED_EDIT_ADDITIONAL_EXAMINER_NOTE,
    component: TechRecordEditAdditionalExaminerNoteComponent,
    data: {
      title: 'Edit Additional Examiner Note',
      roles: Roles.TechRecordAmend,
      isEditing: true,
      reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED,
    },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: techRecordViewResolver },
  },
  {
    path: TechRecordRoutes.TEST_RECORDS,
    data: { title: 'Test record', roles: Roles.TestResultView },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: techRecordViewResolver },
    loadChildren: () => import('../test-records/amend/amend-test-records.module').then((m) => m.AmendTestRecordsModule),
  },
  {
    path: TechRecordRoutes.CREATE_TEST,
    data: { title: 'Create Contingency test', roles: Roles.TestResultCreateContingency },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: techRecordViewResolver },
    loadChildren: () => import('../test-records/create/create-test-records.module').then((m) => m.CreateTestRecordsModule),
  },
  {
    path: TechRecordRoutes.ADR_CERTIFICATE,
    component: AdrGenerateCertificateComponent,
    data: { title: 'Generate ADR Certificate', roles: Roles.TestResultCreateDeskAssessment },
    canActivate: [MsalGuard, RoleGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechRecordsRoutingModule { }
