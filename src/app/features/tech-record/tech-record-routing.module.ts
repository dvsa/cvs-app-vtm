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
    data: { title: 'Historic Tech Record' },
    canActivate: [MsalGuard],
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: 'test-records/:systemNumber/test-result/:testResultId/:testNumber',
    data: { title: 'Test Result', roles: Roles.TestResultView },
    canActivate: [MsalGuard, RoleGuard],
    loadChildren: () => import('../test-records/test-records.module').then(m => m.TestRecordsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechRecordsRoutingModule {}
