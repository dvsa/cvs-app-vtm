import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestResultResolver } from 'src/app/resolvers/test-result/test-result.resolver';
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
    path: ':systemId/test-result/:testResultId/amended/:createdAt',
    component: AmendedTestRecordComponent,
    data: { title: 'Amend Test Result' },
    resolve: { load: TestResultResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRecordsRoutingModule {}
