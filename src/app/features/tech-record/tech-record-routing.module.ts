import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';
import { ReasonForEditing } from '@models/vehicle-tech-record.model';
import { TechRecordViewResolver } from 'src/app/resolvers/tech-record-view/tech-record-view.resolver';
import { TechAmendReasonComponent } from './components/tech-amend-reason/tech-amend-reason.component';
import { TechRecordComponent } from './tech-record.component';

const routes: Routes = [
  {
    path: '',
    component: TechRecordComponent,
    data: { roles: Roles.TechRecordView },
    canActivateChild: [MsalGuard, RoleGuard],
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: 'amend-reason',
    component: TechAmendReasonComponent,
    data: { roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
  },
  {
    path: 'correcting-an-error',
    component: TechRecordComponent,
    data: { roles: Roles.TechRecordAmend, isEditing: true, reason: ReasonForEditing.CORRECTING_AN_ERROR },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver }
  },
  {
    path: 'notifiable-alteration-needed',
    component: TechRecordComponent,
    data: { roles: Roles.TechRecordAmend, isEditing: true, reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver }
  },
  {
    path: 'provisional',
    component: TechRecordComponent,
    data: { title: 'Provisional tech record' },
    canActivate: [MsalGuard],
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: 'provisional/notifiable-alteration-needed',
    component: TechRecordComponent,
    canActivate: [MsalGuard],
    data: { roles: Roles.TechRecordAmend, isEditing: true, reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED },
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: 'historic/:techCreatedAt',
    component: TechRecordComponent,
    data: { title: 'Historic tech record' },
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
    data: { roles: Roles.TestResultAmend },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver },
    loadChildren: () => import('../test-records/create/create-test-records.module').then(m => m.CreateTestRecordsModule)
  },
  {
    path: 'provisional/test-records/create-test',
    data: { roles: Roles.TestResultAmend },
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
