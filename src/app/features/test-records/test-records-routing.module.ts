import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TestResultResolver } from 'src/app/resolvers/test-result/test-result.resolver';
import { TestRecordsComponent } from './test-records.component';
import { AmendedTestRecordComponent } from './views/amended-test-record/amended-test-record.component';
import { TestRecordComponent } from './views/test-record/test-record.component';

const routes: Routes = [
  {
    path: ':systemId/test-result/:testResultId',
    component: TestRecordComponent,
    data: { title: 'Test Result' },
    resolve: { load: TestResultResolver }
  },
  {
    path: ':systemId/test-result/:testResultId/amended/:amendedTestResultId',
    component: AmendedTestRecordComponent,
    data: { title: 'Amend Test Result' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRecordsRoutingModule {}
