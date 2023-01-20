import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';
import { ReasonForEditing } from '@models/vehicle-tech-record.model';
import { TechRecordViewResolver } from 'src/app/resolvers/tech-record-view/tech-record-view.resolver';
import { ChangeVehicleTypeComponent } from './components/tech-record-change-type/tech-record-change-type.component';
import { TechRecordAmendReasonComponent } from './components/tech-record-amend-reason/tech-record-amend-reason.component';
import { TechRecordChangeStatusComponent } from './components/tech-record-change-status/tech-record-change-status.component';
import { TechRecordChangeVisibilityComponent } from './components/tech-record-change-visibility/tech-record-change-visibility.component';
import { TechRouterOutletComponent } from './components/tech-router-outlet/tech-router-outlet.component';
import { TechRecordSearchTyresComponent } from './components/tech-record-search-tyres/tech-record-search-tyres.component';
import { TechRecordComponent } from './tech-record.component';
import { AmendVrmComponent } from './components/tech-record-amend-vrm/tech-record-amend-vrm.component';

const routes: Routes = [
  {
    path: '',
    component: TechRecordComponent,
    data: { roles: Roles.TechRecordView, isCustomLayout: true },
    canActivateChild: [MsalGuard, RoleGuard],
    resolve: { load: TechRecordViewResolver }
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
    path: 'historic/:techCreatedAt',
    component: TechRecordComponent,
    data: { title: 'Historic tech record', isCustomLayout: true },
    canActivate: [MsalGuard],
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: 'change-vrm',
    component: AmendVrmComponent,
    data: { title: 'Change vrm', roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard]
  },
  {
    path: 'provisional',
    component: TechRouterOutletComponent,
    children: [
      {
        path: '',
        component: TechRecordComponent,
        data: { title: 'Provisional tech record', isCustomLayout: true },
        canActivate: [MsalGuard],
        resolve: { load: TechRecordViewResolver }
      },
      {
        path: 'notifiable-alteration-needed',
        component: TechRecordComponent,
        canActivate: [MsalGuard],
        data: { roles: Roles.TechRecordAmend, isEditing: true, reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED, isCustomLayout: true },
        resolve: { load: TechRecordViewResolver }
      },
      {
        path: 'change-vta-visibility',
        component: TechRecordChangeVisibilityComponent,
        data: { roles: Roles.TechRecordAmend },
        canActivate: [MsalGuard, RoleGuard],
        resolve: { techRecord: TechRecordViewResolver }
      },
      {
        path: 'change-status',
        component: TechRecordChangeStatusComponent,
        data: { title: 'Promote or Archive Tech Record', roles: Roles.TechRecordArchive },
        canActivate: [MsalGuard, RoleGuard],
        resolve: { load: TechRecordViewResolver }
      },
      {
        path: 'change-vehicle-type',
        component: ChangeVehicleTypeComponent,
        data: { title: 'Change vehicle type', roles: Roles.TechRecordAmend },
        canActivate: [MsalGuard, RoleGuard]
      },
      {
        path: 'change-vrm',
        component: AmendVrmComponent,
        data: { title: 'Change vrm', roles: Roles.TechRecordAmend },
        canActivate: [MsalGuard, RoleGuard]
      },
      {
        path: 'notifiable-alteration-needed/tyre-search/:axleNumber',
        component: TechRecordSearchTyresComponent,
        data: { title: 'Tyre search', roles: Roles.TechRecordAmend, isEditing: true, reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED },
        canActivate: [MsalGuard, RoleGuard],
        resolve: { techRecord: TechRecordViewResolver }
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
      }
    ]
  },
  {
    path: 'amend-reason',
    component: TechRecordAmendReasonComponent,
    data: { roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard]
  },
  {
    path: 'change-status',
    component: TechRecordChangeStatusComponent,
    data: { title: 'Promote or Archive Tech Record', roles: Roles.TechRecordArchive },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: 'change-vehicle-type',
    component: ChangeVehicleTypeComponent,
    data: { title: 'Change vehicle type', roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver }
  },
  {
    path: 'change-vta-visibility',
    component: TechRecordChangeVisibilityComponent,
    data: { roles: Roles.TechRecordAmend },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver }
  },
  {
    path: 'correcting-an-error/tyre-search/:axleNumber',
    component: TechRecordSearchTyresComponent,
    data: { title: 'Tyre search', roles: Roles.TechRecordAmend, isEditing: true, reason: ReasonForEditing.CORRECTING_AN_ERROR },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver }
  },
  {
    path: 'notifiable-alteration-needed/tyre-search/:axleNumber',
    component: TechRecordSearchTyresComponent,
    data: { title: 'Tyre search', roles: Roles.TechRecordAmend, isEditing: true, reason: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED },
    canActivate: [MsalGuard, RoleGuard],
    resolve: { techRecord: TechRecordViewResolver }
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechRecordsRoutingModule {}
