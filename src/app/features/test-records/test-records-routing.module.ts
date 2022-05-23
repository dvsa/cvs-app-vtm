import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TestRecordsComponent } from './test-records.component';
import { ArchivedTestRecordComponent } from './views/archived-test-record/archived-test-record.component';
import { TestRecordComponent } from './views/test-record/test-record.component';

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
      },
      {
        path: 'test-result/:testResultId/archived/:archivedTestResultId',
        component: ArchivedTestRecordComponent,
        data: { title: 'Archived Test Result' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRecordsRoutingModule {}
