import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TestRecordsComponent } from './test-records.component';
import { TestRecordSummaryComponent } from './views/test-result/test-records-summary.component';

const routes: Routes = [
  {
    path: ':systemId',
    component: TestRecordsComponent,
    canActivateChild: [MsalGuard],
    children: [
      {
        path: 'test-result/:testResultId',
        component: TestRecordSummaryComponent,
        data: { title: 'Test Result' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRecordsRoutingModule {}
