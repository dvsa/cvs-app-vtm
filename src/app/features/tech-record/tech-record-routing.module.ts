import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TechRecordViewResolver } from 'src/app/resolvers/tech-record-view/tech-record-view.resolver';
import { TechRecordComponent } from './tech-record.component';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';

const routes: Routes = [
  {
    path: '',
    data: { roles: Roles.TechRecordView },
    component: TechRecordComponent,
    canActivateChild: [MsalGuard, RoleGuard],
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: ':techCreatedAt',
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
    resolve: { techRecord: TechRecordViewResolver },
    data: { roles: Roles.TestResultAmend },
    canActivate: [MsalGuard, RoleGuard],
    loadChildren: () => import('../test-records/create/create-test-records.module').then(m => m.CreateTestRecordsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechRecordsRoutingModule {}
