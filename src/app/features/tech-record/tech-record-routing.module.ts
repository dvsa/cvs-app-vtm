import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TechRecordComponent } from './tech-record.component';

const routes: Routes = [
  {
    path: '',
    component: TechRecordComponent,
    canActivateChild: [MsalGuard]
  },
  {
    path: ':techCreatedAt',
    component: TechRecordComponent,
    data: { title: 'Historic Tech Record' }
  },
  {
    path: 'test-records/:systemNumber/test-result/:testResultId/:testTypeId',
    data: { title: 'Test Result' },
    canActivate: [MsalGuard],
    loadChildren: () => import('../test-records/test-records.module').then((m) => m.TestRecordsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechRecordsRoutingModule {}
