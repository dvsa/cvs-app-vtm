import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoEditGuard } from '@guards/no-edit/no-edit.guard';
import { TestResultResolver } from 'src/app/resolvers/test-result/test-result.resolver';
import { AmendedTestRecordComponent } from './views/amended-test-record/amended-test-record.component';
import { TestRecordComponent } from './views/test-record/test-record.component';

const routes: Routes = [
  {
    path: ':systemNumber/test-result/:testResultId/:testTypeId',
    component: TestRecordComponent,
    data: { title: 'Test Result' },
    resolve: { load: TestResultResolver }
  },
  {
    path: ':systemNumber/test-result/:testResultId/:testTypeId/amended/:createdAt',
    component: AmendedTestRecordComponent,
    data: { title: 'Amend Test Result' },
    resolve: { load: TestResultResolver },
    canActivate: [NoEditGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRecordsRoutingModule {}
