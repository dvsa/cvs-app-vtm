import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TechRecordViewResolver } from 'src/app/resolvers/tech-record-view/tech-record-view.resolver';
import { TechRecordComponent } from './tech-record.component';

const routes: Routes = [
  {
    path: '',
    component: TechRecordComponent,
    canActivateChild: [MsalGuard],
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: ':techCreatedAt',
    component: TechRecordComponent,
    data: { title: 'Historic Tech Record' },
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: 'test-records/:systemNumber/test-result/:testResultId/:testNumber',
    data: { title: 'Test Result' },
    canActivate: [MsalGuard],
    loadChildren: () => import('../test-records/test-records.module').then(m => m.TestRecordsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechRecordsRoutingModule {}
