import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TestRecordsComponent } from './test-records.component';
import { TestRecordComponent } from './views/test-result/test-records.component';

const routes: Routes = [
  {
    path: ':systemId',
    component: TestRecordsComponent,
    canActivateChild: [MsalGuard],
    children: [
      {
        path: 'test-result/:testResultId',
        component: TestRecordComponent,
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
