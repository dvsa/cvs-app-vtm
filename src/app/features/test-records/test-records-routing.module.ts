import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoEditGuard } from '@guards/no-edit.guard';
import { TestResultResolver } from 'src/app/resolvers/test-result/test-result.resolver';
import { AmendedTestRecordComponent } from './views/amended-test-record/amended-test-record.component';
import { TestRecordComponent } from './views/test-record/test-record.component';
import { TestSectionsComponent } from './views/test-sections/test-sections.component';
import { TestComponent } from './views/test/test.component';

const routes: Routes = [
  {
    path: ':systemId/test-result/:testResultId/:testTypeId',
    component: TestRecordComponent,
    data: { title: 'Test Result' },
    resolve: { load: TestResultResolver }
    // children: [
    //   {
    //     path: 'test/:testTypeId',
    //     component: TestComponent,
    //     children: [
    //       {
    //         path: '',
    //         pathMatch: 'full',
    //         redirectTo: 'vehicle'
    //       },
    //       {
    //         path: ':testSection',
    //         component: TestSectionsComponent
    //       }
    //     ]
    //   }
    // ]
  },
  {
    path: ':systemId/test-result/:testResultId/amended/:createdAt',
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
