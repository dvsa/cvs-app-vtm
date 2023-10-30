import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { CancelEditTechGuard } from '@guards/cancel-edit-tech/cancel-edit-tech.guard';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { ReasonForEditing } from '@models/vehicle-tech-record.model';
import { techRecordReviewResolver } from 'src/app/resolvers/tech-record-review/tech-record-review.resolver';
import { techRecordViewResolver } from 'src/app/resolvers/tech-record-view/tech-record-view.resolver';
import { TechRecordAmendReasonComponent } from './components/tech-record-amend-reason/tech-record-amend-reason.component';
import { AmendVinComponent } from './components/tech-record-amend-vin/tech-record-amend-vin.component';
import { AmendVrmReasonComponent } from './components/tech-record-amend-vrm-reason/tech-record-amend-vrm-reason.component';
import { AmendVrmComponent } from './components/tech-record-amend-vrm/tech-record-amend-vrm.component';
import { TechRecordChangeStatusComponent } from './components/tech-record-change-status/tech-record-change-status.component';
import { ChangeVehicleTypeComponent } from './components/tech-record-change-type/tech-record-change-type.component';
import { TechRecordChangeVisibilityComponent } from './components/tech-record-change-visibility/tech-record-change-visibility.component';
import { GenerateLetterComponent } from './components/tech-record-generate-letter/tech-record-generate-letter.component';
import { GeneratePlateComponent } from './components/tech-record-generate-plate/tech-record-generate-plate.component';
import { TechRecordSearchTyresComponent } from './components/tech-record-search-tyres/tech-record-search-tyres.component';
import { TechRecordSummaryChangesComponent } from './components/tech-record-summary-changes/tech-record-summary-changes.component';
import { TechRecordUnarchiveComponent } from './components/tech-record-unarchive/tech-record-unarchive-component';
import { TechRecordComponent } from './tech-record.component';

const routes: Routes = [
  {
    path: '',
    component: TechRecordComponent,
    data: { roles: Roles.TechRecordView, isCustomLayout: true },
    canActivateChild: [MsalGuard, RoleGuard],
    canActivate: [CancelEditTechGuard],
    resolve: { load: techRecordViewResolver },
  },
  {
    path: 'correcting-an-error',
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
      load: techRecordReviewResolver,
    },
  },
  {
    path: 'notifiable-alteration-needed',
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
      load: techRecordReviewResolver,
    },
  },

  {
    path: 'change-vin',
    component: AmendVinComponent,
    data: { title: 'Change VIN', roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
  },
  {
    path: 'change-vrm',
    component: AmendVrmReasonComponent,
    data: { title: 'Change VRM', roles: Roles.TechRecordAmend, isEditing: true },
    canActivate: [MsalGuard, RoleGuard],
  },
  {
    path: 'change-vrm/:reason',
    component: AmendVrmComponent,
    data: { title: 'Change VRM', roles: Roles.TechRecordAmend, isEditing: true },
    canActivate: [MsalGuard, RoleGuard],
  },
  {
    path: 'generate-plate',
    component: GeneratePlateComponent,
    data: { title: 'Generate plate', roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { load: techRecordViewResolver },
  },
  {
    path: 'generate-letter',
    component: GenerateLetterComponent,
    data: { title: 'Generate letter', roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { load: techRecordViewResolver },
  },
  {
    path: 'amend-reason',
    component: TechRecordAmendReasonComponent,
    data: { roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
  },
  {
    path: 'change-status',
    component: TechRecordChangeStatusComponent,
    data: { title: 'Promote or Archive Tech Record', roles: Roles.TechRecordArchive },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { load: techRecordViewResolver },
  },
  {
    path: 'unarchive-record',
    component: TechRecordUnarchiveComponent,
    data: { title: 'Unarchive Record', roles: Roles.TechRecordUnarchive },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { load: techRecordViewResolver },
  },
  {
    path: 'change-vehicle-type',
    component: ChangeVehicleTypeComponent,
    data: { title: 'Change vehicle type', roles: Roles.TechRecordAmend, isEditing: true },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: techRecordViewResolver },
  },
  {
    path: 'change-vta-visibility',
    component: TechRecordChangeVisibilityComponent,
    data: { roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: techRecordViewResolver },
  },
  {
    path: 'correcting-an-error/tyre-search/:axleNumber',
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
    path: 'correcting-an-error/change-summary',
    component: TechRecordSummaryChangesComponent,
    data: { roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
  },
  {
    path: 'notifiable-alteration-needed/change-summary',
    component: TechRecordSummaryChangesComponent,
    data: { roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
  },
  {
    path: 'notifiable-alteration-needed/tyre-search/:axleNumber',
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
    path: 'test-records/test-result/:testResultId/:testNumber',
    data: { title: 'Test record', roles: Roles.TestResultView },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: techRecordViewResolver },
    loadChildren: () => import('../test-records/amend/amend-test-records.module').then((m) => m.AmendTestRecordsModule),
  },
  {
    path: 'test-records/create-test',
    data: { title: 'Create Contingency test', roles: Roles.TestResultCreateContingency },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: techRecordViewResolver },
    loadChildren: () => import('../test-records/create/create-test-records.module').then((m) => m.CreateTestRecordsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechRecordsRoutingModule { }
