import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';
import { ReasonForEditing } from '@models/vehicle-tech-record.model';
import { TechRecordViewResolver } from 'src/app/resolvers/tech-record-view/tech-record-view.resolver';
import { TechAmendReasonComponent } from './components/tech-amend-reason/tech-amend-reason.component';
import { TyresSearchComponent } from './components/tyres-search/tyres-search.component';
import { TechRecordChangeStatusComponent } from './components/tech-record-change-status/tech-record-change-status.component';
import { TechRecordComponent } from './tech-record.component';
import { TechRecordChangeVisibilityComponent } from './components/tech-record-change-visibility/tech-record-change-visibility.component';

const routes: Routes = [
  {
    path: '',
    component: TechRecordComponent,
    data: { roles: Roles.TechRecordView, isCustomLayout: true },
    canActivateChild: [MsalGuard, RoleGuard],
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: 'amend-reason',
    component: TechAmendReasonComponent,
    data: { roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard]
  },
  {
    path: 'correcting-an-error',
    component: TechRecordComponent,
    data: { roles: Roles.TechRecordAmend, isEditing: true, reason: ReasonForEditing.CORRECTING_AN_ERROR, isCustomLayout: true },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver }
  },
  {
    path: 'notifiable-alteration-needed',
    component: TechRecordComponent,
    data: { roles: Roles.TechRecordAmend, isEditing: true, reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED, isCustomLayout: true },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver }
  },
  {
    path: 'hide-in-vta',
    component: TechRecordChangeVisibilityComponent,
    data: { roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver }
  },
  {
    path: 'show-in-vta',
    component: TechRecordChangeVisibilityComponent,
    data: { roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver }
  },
  {
    path: 'archive',
    component: TechRecordChangeStatusComponent,
    data: { title: 'Archive Tech Record', roles: Roles.TechRecordArchive },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: 'provisional/archive',
    component: TechRecordChangeStatusComponent,
    data: { title: 'Archive Provisional Tech Record', roles: Roles.TechRecordArchive },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: 'correcting-an-error/tyre-search/:axleNumber',
    component: TyresSearchComponent,
    data: { title: 'Tyre search', roles: Roles.TechRecordAmend, isEditing: true, reason: ReasonForEditing.CORRECTING_AN_ERROR },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver }
  },
  {
    path: 'notifiable-alteration-needed/tyre-search/:axleNumber',
    component: TyresSearchComponent,
    data: { title: 'Tyre search', roles: Roles.TechRecordAmend, isEditing: true, reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver }
  },
  {
    path: 'provisional',
    component: TechRecordComponent,
    data: { title: 'Provisional tech record', isCustomLayout: true },
    canActivate: [MsalGuard],
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: 'provisional/notifiable-alteration-needed',
    component: TechRecordComponent,
    canActivate: [MsalGuard],
    data: { roles: Roles.TechRecordAmend, isEditing: true, reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED, isCustomLayout: true },
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: 'provisional/notifiable-alteration-needed/tyre-search/:axleNumber',
    component: TyresSearchComponent,
    data: { title: 'Tyre search', roles: Roles.TechRecordAmend, isEditing: true, reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver }
  },
  {
    path: 'provisional/promote',
    component: TechRecordChangeStatusComponent,
    canActivate: [MsalGuard],
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: 'historic/:techCreatedAt',
    component: TechRecordComponent,
    data: { title: 'Historic tech record', isCustomLayout: true },
    canActivate: [MsalGuard],
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: 'test-records/test-result/:testResultId/:testNumber',
    data: { title: 'Test record', roles: Roles.TestResultView },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver },
    loadChildren: () => import('../test-records/amend/amend-test-records.module').then(m => m.AmendTestRecordsModule)
  },
  {
    path: 'test-records/create-test',
    data: { roles: Roles.TestResultCreateContingency },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver },
    loadChildren: () => import('../test-records/create/create-test-records.module').then(m => m.CreateTestRecordsModule)
  },
  {
    path: 'provisional/test-records/create-test',
    data: { roles: Roles.TestResultCreateContingency },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver },
    loadChildren: () => import('../test-records/create/create-test-records.module').then(m => m.CreateTestRecordsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechRecordsRoutingModule {}
